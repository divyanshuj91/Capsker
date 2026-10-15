import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

const participantSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    githubUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    institution: z.string().optional(),
    role: z
        .enum(["LEADER", "MEMBER", "MENTOR"])
        .optional()
        .default("MEMBER"),
});

const importSchema = z.object({
    eventId: z.string(),
    teamName: z.string().min(1),
    teamNumber: z.number().int().optional(),
    participants: z.array(participantSchema).min(1),
});

const requestSchema = z.object({
    eventId: z.string(),
    teams: z.array(importSchema).min(1),
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

        const body = requestSchema.parse(await req.json());

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

        let importedParticipants = 0;
        let importedTeams = 0;

        for (const teamData of body.teams) {
            const team = await prisma.team.create({
                data: {
                    name: teamData.teamName,
                    teamNumber: teamData.teamNumber,
                    eventId: event.id,
                    members: {
                        create: teamData.participants.map((participant) => ({
                            name: participant.name,
                            email: participant.email,
                            phone: participant.phone || null,
                            githubUrl: participant.githubUrl || null,
                            linkedinUrl: participant.linkedinUrl || null,
                            institution: participant.institution || null,
                            role: participant.role || "MEMBER",
                        })),
                    },
                },
            });

            importedTeams++;
            importedParticipants += teamData.participants.length;
        }

        return NextResponse.json({
            success: true,
            importedTeams,
            importedParticipants,
        });
    } catch (error) {
        console.error("Participant import failed:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid participant data",
                    details: error.flatten(),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to import participants" },
            { status: 500 }
        );
    }
}