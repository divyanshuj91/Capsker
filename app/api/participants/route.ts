import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
    eventId: z.string().min(1),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);

        const { eventId } = querySchema.parse({
            eventId: searchParams.get("eventId"),
        });

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

        // Verify that the event belongs to this organizer.
        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                userId: user.id,
            },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        const participants =
            await prisma.participant.findMany({
                where: {
                    team: {
                        eventId: event.id,
                    },
                },
                include: {
                    team: true,
                },
                orderBy: [
                    {
                        team: {
                            teamNumber: "asc",
                        },
                    },
                    {
                        role: "asc",
                    },
                    {
                        name: "asc",
                    },
                ],
            });

        const normalizedParticipants =
            participants.map((participant) => ({
                id: participant.id,
                name: participant.name,
                email: participant.email,
                phone: participant.phone ?? "",
                githubUrl: participant.githubUrl ?? "",
                linkedinUrl:
                    participant.linkedinUrl ?? "",
                institution:
                    participant.institution ?? "",
                role: participant.role,
                teamName: participant.team.name,
                teamNumber:
                    participant.team.teamNumber ?? undefined,
            }));

        return NextResponse.json({
            success: true,
            eventId: event.id,
            participants: normalizedParticipants,
        });
    } catch (error) {
        console.error(
            "Failed to fetch participants:",
            error
        );

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid event ID",
                    details: error.flatten(),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch participants" },
            { status: 500 }
        );
    }
}