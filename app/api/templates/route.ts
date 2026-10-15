import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

const placeholderSchema = z.object({
    id: z.string(),
    field: z.enum([
        "teamName",
        "participantName",
        "role",
        "teamNumber",
        "institution",
        "qrCode",
    ]),
    x: z.number(),
    y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
    fontFamily: z.string(),
    fontSize: z.number(),
    fontWeight: z.enum(["normal", "bold", "800"]),
    color: z.string(),
    textAlign: z.enum(["left", "center", "right"]),
    textTransform: z
        .enum(["uppercase", "capitalize", "none"])
        .optional(),
});

const createTemplateSchema = z.object({
    name: z.string().min(1).max(100),
    type: z.enum(["TICKET", "CERTIFICATE"]),
    baseImageUrl: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fieldConfig: z.array(placeholderSchema),
    eventId: z.string().optional(),
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

        const { searchParams } =
            new URL(req.url);

        const eventId =
            searchParams.get("eventId");

        const type =
            searchParams.get("type");

        if (!eventId) {
            return NextResponse.json(
                { error: "eventId is required" },
                { status: 400 }
            );
        }

        const event =
            await prisma.event.findFirst({
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

        const templates =
            await prisma.assetTemplate.findMany({
                where: {
                    eventId: event.id,
                    ...(type
                        ? { type }
                        : {}),
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        return NextResponse.json({
            success: true,
            templates,
        });
    } catch (error) {
        console.error(
            "Failed to fetch templates:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch templates" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = createTemplateSchema.parse(
            await req.json()
        );

        const user = await prisma.user.upsert({
            where: {
                email: session.user.email,
            },
            update: {
                name: session.user.name || undefined,
            },
            create: {
                email: session.user.email,
                name: session.user.name || "Organizer",
            },
        });

        let event;

        if (body.eventId) {
            event = await prisma.event.findFirst({
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
        } else {
            event = await prisma.event.findFirst({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

            if (!event) {
                const baseSlug = "capsker-event";
                const slug = `${baseSlug}-${Date.now()}`;

                event = await prisma.event.create({
                    data: {
                        title: "Capsker Event",
                        slug,
                        description:
                            "Default event created by Capsker",
                        userId: user.id,
                    },
                });
            }
        }

        const template =
            await prisma.assetTemplate.create({
                data: {
                    name: body.name,
                    type: body.type,
                    baseImageUrl: body.baseImageUrl,
                    width: body.width,
                    height: body.height,
                    fieldConfig: body.fieldConfig,
                    eventId: event.id,
                },
            });

        return NextResponse.json(
            {
                success: true,
                template,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Template creation failed:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid template data",
                    details: error.flatten(),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create template" },
            { status: 500 }
        );
    }
}