import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { emailQueue } from "@/lib/queue/email.queue";

const dispatchSchema = z.object({
    eventId: z.string(),
    templateId: z.string(),

    participantIds: z
        .array(z.string())
        .min(1)
        .max(5000),

    recipientMode: z.enum(["LEADERS", "ALL"]),

    subject: z
        .string()
        .min(1)
        .max(200),

    body: z
        .string()
        .min(1)
        .max(20000),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = dispatchSchema.parse(
            await req.json()
        );

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Organizer account not found" },
                { status: 404 }
            );
        }

        const event = await prisma.event.findFirst({
            where: {
                id: body.eventId,
                userId: user.id,
            },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        const template =
            await prisma.assetTemplate.findFirst({
                where: {
                    id: body.templateId,
                    eventId: event.id,
                    type: "TICKET",
                },
            });

        if (!template) {
            return NextResponse.json(
                { error: "Ticket template not found" },
                { status: 404 }
            );
        }

        // First get all selected participants belonging to this event.
        const participants =
            await prisma.participant.findMany({
                where: {
                    id: {
                        in: body.participantIds,
                    },
                    team: {
                        eventId: event.id,
                    },
                },
                include: {
                    team: true,
                },
            });

        if (
            participants.length !==
            body.participantIds.length
        ) {
            return NextResponse.json(
                {
                    error:
                        "Some participants do not belong to this event",
                },
                { status: 400 }
            );
        }

        // Decide who actually receives the email.
        const recipients =
            body.recipientMode === "LEADERS"
                ? participants.filter(
                    (participant) =>
                        participant.role === "LEADER"
                )
                : participants;

        if (recipients.length === 0) {
            return NextResponse.json(
                {
                    error:
                        "No team leaders found among the selected participants",
                },
                { status: 400 }
            );
        }

        // Create one email log for every actual recipient.
        const emailLogs = await Promise.all(
            recipients.map((participant) =>
                prisma.emailLog.create({
                    data: {
                        eventId: event.id,
                        participantId: participant.id,
                        recipient: participant.email,
                        subject: body.subject,
                        body: body.body,
                        status: "QUEUED",
                    },
                })
            )
        );

        // Create one BullMQ job for every actual recipient.
        const jobs = recipients.map(
            (participant, index) => ({
                name: `email-${participant.id}`,
                data: {
                    eventId: event.id,
                    participantId: participant.id,
                    templateId: template.id,
                    emailLogId: emailLogs[index].id,
                },
            })
        );

        await emailQueue.addBulk(jobs);

        return NextResponse.json({
            success: true,
            status: "QUEUED",
            recipientMode: body.recipientMode,
            queued: jobs.length,
        });
    } catch (error) {
        console.error("Dispatch failed:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid dispatch request",
                    details: error.flatten(),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to queue emails" },
            { status: 500 }
        );
    }
}