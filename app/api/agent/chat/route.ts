import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SAMPLE_PARTICIPANTS } from "@/lib/data/sample";
import { queryGemmaChat } from "@/lib/ai/gemma";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const ChatRequestSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  participants: z.array(z.record(z.any())).optional(),
  teamStatuses: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { message, history, participants = SAMPLE_PARTICIPANTS } = parsed.data;

    const gemmaResponse = await queryGemmaChat(message, history, participants);

    return NextResponse.json(gemmaResponse);
  } catch (error) {
    console.error("Gemma Chat Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error during Gemma query execution" },
      { status: 500 }
    );
  }
}
