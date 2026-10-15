import Papa from "papaparse";
import {
  ColumnMapping,
  CSVParseResult,
  CsvParticipant,
  NormalizedParticipantSchema,
} from "@/types";
import { detectColumnMapping } from "./headers";
import {
  normalizeGitHubUrl,
  normalizeLinkedInUrl,
  normalizePhoneNumber,
  sanitizeCsvField,
} from "./cleaners";

export function parseAndNormalizeCsv(
  csvContent: string,
  userMappingOverride?: Partial<ColumnMapping>
): CSVParseResult {
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const headers = parsed.meta.fields || [];
  const detectedMapping: ColumnMapping = {
    ...detectColumnMapping(headers),
    ...userMappingOverride,
  };

  const validRows: CsvParticipant[] = [];
  const invalidRows: { row: number; data: Record<string, string>; error: string }[] = [];

  const teamKey = detectedMapping.teamName || "Team";
  const nameKey = detectedMapping.name || "Name";
  const emailKey = detectedMapping.email || "Email";
  const phoneKey = detectedMapping.phone;
  const githubKey = detectedMapping.github;
  const linkedinKey = detectedMapping.linkedin;
  const institutionKey = detectedMapping.institution;

  parsed.data.forEach((row, index) => {
    const rawTeam = row[teamKey]?.trim();
    const rawName = row[nameKey]?.trim();
    const rawEmail = row[emailKey]?.trim();
    const rawPhone = phoneKey ? row[phoneKey] : undefined;
    const rawGithub = githubKey ? row[githubKey] : undefined;
    const rawLinkedin = linkedinKey ? row[linkedinKey] : undefined;
    const rawInstitution = institutionKey ? row[institutionKey] : undefined;

    const candidate = {
      teamName: sanitizeCsvField(rawTeam || "Individual"),
      name: sanitizeCsvField(rawName),
      email: rawEmail?.toLowerCase() || "",
      phone: normalizePhoneNumber(rawPhone),
      githubUrl: normalizeGitHubUrl(rawGithub),
      linkedinUrl: normalizeLinkedInUrl(rawLinkedin),
      institution: rawInstitution ? sanitizeCsvField(rawInstitution) : null,
      role: "MEMBER" as const,
    };

    const validation = NormalizedParticipantSchema.safeParse(candidate);
    if (validation.success) {
      validRows.push(validation.data);
    } else {
      const errorMsg = validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      invalidRows.push({
        row: index + 1,
        data: row,
        error: errorMsg,
      });
    }
  });

  return {
    validRows,
    invalidRows,
    headers,
    detectedMapping,
  };
}
