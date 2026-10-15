import { z } from "zod";

export type TeamStatus =
  | "UNCONFIRMED"
  | "CONTACTED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "WAITLISTED"
  | "DISQUALIFIED";

export type ParticipantRole = "LEADER" | "MEMBER" | "MENTOR";

export interface TemplatePlaceholder {
  id: string;
  field: "teamName" | "participantName" | "role" | "teamNumber" | "institution" | "qrCode";
  x: number;          // Pixels from left
  y: number;          // Pixels from top
  width?: number;
  height?: number;
  fontFamily: string; // e.g., 'Space Grotesk', 'Inter'
  fontSize: number;   // In pt/px
  fontWeight: "normal" | "bold" | "800";
  color: string;      // Hex string '#000000'
  textAlign: "left" | "center" | "right";
  textTransform?: "uppercase" | "capitalize" | "none";
}

// Zod schemas for runtime validation
export const TemplatePlaceholderSchema = z.object({
  id: z.string(),
  field: z.enum(["teamName", "participantName", "role", "teamNumber", "institution", "qrCode"]),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  fontFamily: z.string().default("Inter"),
  fontSize: z.number().positive(),
  fontWeight: z.enum(["normal", "bold", "800"]).default("bold"),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
  textTransform: z.enum(["uppercase", "capitalize", "none"]).default("none"),
});

export const NormalizedParticipantSchema = z.object({
  teamName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  institution: z.string().optional().nullable(),
  role: z.enum(["LEADER", "MEMBER", "MENTOR"]).default("MEMBER"),
});

export type CsvParticipant = z.infer<typeof NormalizedParticipantSchema>;

export interface NormalizedParticipant extends CsvParticipant {
  id: string;
}

export interface ColumnMapping {
  teamName?: string;
  name?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  institution?: string;
}

export interface CSVParseResult {
  validRows: CsvParticipant[];
  invalidRows: { row: number; data: Record<string, string>; error: string }[];
  headers: string[];
  detectedMapping: ColumnMapping;
}
