import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

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

        const events = await prisma.event.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        teams: true,
                        templates: true,
                        emailLogs: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            events,
        });
    } catch (error) {
        console.error(
            "Failed to fetch events:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}