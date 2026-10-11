import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auditBadgeDesign } from "@/lib/ai/gemma";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const AuditRequestSchema = z.object({
  imageBase64: z.string().min(1),
  templateInfo: z.object({
    name: z.string(),
    width: z.number(),
    height: z.number(),
    placeholders: z.array(
      z.object({
        field: z.string(),
        x: z.number(),
        y: z.number(),
        fontSize: z.number(),
        fontFamily: z.string(),
      })
    ),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AuditRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid audit request payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { imageBase64, templateInfo } = parsed.data;
    const auditResult = await auditBadgeDesign(imageBase64, templateInfo);

    return NextResponse.json(auditResult);
  } catch (error) {
    console.error("Gemma Badge Audit Error:", error);
    return NextResponse.json(
      { error: "Internal error during Gemma multimodal badge analysis" },
      { status: 500 }
    );
  }
}

