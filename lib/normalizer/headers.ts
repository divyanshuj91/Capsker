import { ColumnMapping } from "@/types";

const HEADER_ALIASES: Record<keyof ColumnMapping, string[]> = {
  teamName: ["team", "team name", "team_name", "group", "squad", "team_title"],
  name: ["name", "full name", "member", "participant", "lead name", "student name"],
  email: ["email", "e-mail", "mail address", "lead email", "email address"],
  phone: ["phone", "mobile", "contact", "whatsapp", "phone number", "ph_no", "contact number"],
  github: ["github", "github profile", "gh", "repo", "github handle", "github url"],
  linkedin: ["linkedin", "linkedin url", "li", "linkedin profile"],
  institution: ["college", "university", "school", "institution", "org", "institute"],
};

function normalizeHeaderString(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, " ").trim();
}

export function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const normalizedHeaders = headers.map((h) => ({
    original: h,
    cleaned: normalizeHeaderString(h),
  }));

  for (const [field, aliases] of Object.entries(HEADER_ALIASES) as [keyof ColumnMapping, string[]][]) {
    // 1. Check for exact match
    const exactMatch = normalizedHeaders.find((h) => aliases.includes(h.cleaned));
    if (exactMatch) {
      mapping[field] = exactMatch.original;
      continue;
    }

    // 2. Check for substring match
    const substringMatch = normalizedHeaders.find((h) =>
      aliases.some((alias) => h.cleaned.includes(alias) || alias.includes(h.cleaned))
    );
    if (substringMatch) {
      mapping[field] = substringMatch.original;
    }
  }

  return mapping;
}
