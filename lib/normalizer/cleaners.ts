/**
 * Normalizes phone numbers to standard international format (E.164-like)
 * Strips whitespace, hyphens, brackets, and dots.
 */
export function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, "").trim();

  // If empty after stripping
  if (!cleaned) return null;

  // Handle leading 00 as +
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // Handle 10-digit standard mobile without country code (default to +91 or prepend +)
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = `+91${cleaned}`;
  } else if (/^\d{11,14}$/.test(cleaned) && !cleaned.startsWith("+")) {
    cleaned = `+${cleaned}`;
  }

  return cleaned;
}

/**
 * Normalizes GitHub handles or URLs to canonical HTTPS URL
 * e.g., 'octocat', '@octocat', 'github.com/octocat' -> 'https://github.com/octocat'
 */
export function normalizeGitHubUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  let cleaned = input.trim().replace(/^@/, "");
  if (!cleaned) return null;

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned.replace(/^http:\/\//, "https://").replace(/\/$/, "");
  }

  cleaned = cleaned.replace(/^github\.com\//, "");
  return `https://github.com/${cleaned}`;
}

/**
 * Normalizes LinkedIn handles or URLs to canonical HTTPS URL
 */
export function normalizeLinkedInUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  let cleaned = input.trim().replace(/^@/, "");
  if (!cleaned) return null;

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned.replace(/^http:\/\//, "https://").replace(/\/$/, "");
  }

  cleaned = cleaned.replace(/^linkedin\.com\/in\//, "");
  return `https://linkedin.com/in/${cleaned}`;
}

/**
 * Strips CSV formula injection triggers (=, +, -, @)
 */
export function sanitizeCsvField(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (["=", "+", "-", "@"].some((prefix) => trimmed.startsWith(prefix))) {
    return `'${trimmed}`;
  }
  return trimmed;
}
