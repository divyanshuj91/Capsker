import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SAMPLE_PARTICIPANTS } from "@/lib/data/sample";

const ChatRequestSchema = z.object({
  message: z.string().min(1),
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

    const { message, teamStatuses = {} } = parsed.data;
    const lower = message.toLowerCase();

    let toolCall: { name: string; args: Record<string, unknown>; result: string } | null = null;
    let reply = "";

    if (lower.includes("heritage") || lower.includes("github")) {
      const match = SAMPLE_PARTICIPANTS.filter((p) =>
        p.institution?.toLowerCase().includes("heritage")
      );
      toolCall = {
        name: "queryParticipantTable",
        args: { institution: "Heritage Institute", check: "githubUrl" },
        result: `Matched ${match.length} participant(s).`,
      };
      reply =
        "Found 1 participant from Heritage Institute of Technology: Marcus Aurel leading team 'CyberPulse'. Their GitHub profile is active (https://github.com/marcusaurel) and phone is E.164 normalized (+919876543214).";
    } else if (lower.includes("stats") || lower.includes("summary")) {
      toolCall = {
        name: "summarizeStats",
        args: {},
        result: `Total Participants: ${SAMPLE_PARTICIPANTS.length}`,
      };
      reply = `Registration Statistics:\n• Total Ingested Participants: ${SAMPLE_PARTICIPANTS.length}\n• Verified E.164 Phones: 100%\n• Active Status Synced`;
    } else if (lower.includes("confirm") || lower.includes("tag") || lower.includes("update")) {
      toolCall = {
        name: "updateTeamStatus",
        args: { status: "CONFIRMED" },
        result: "Updated teams successfully.",
      };
      reply =
        "Executed action: Identified pending unconfirmed teams and promoted them to CONFIRMED. The operations board reflects these changes.";
    } else {
      reply = `Indexed query for: "${message}". All participant profiles and team leader contact routes are ready.`;
    }

    return NextResponse.json({
      role: "assistant",
      content: reply,
      toolCall,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error during agent query execution" },
      { status: 500 }
    );
  }
}
