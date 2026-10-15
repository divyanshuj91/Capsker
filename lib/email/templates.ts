export interface EmailParticipantData {
  name: string;
  teamName: string;
  role: string;
  institution?: string | null;
  teamNumber?: number | null;
}

export function interpolateEmail(
  text: string,
  participant: EmailParticipantData
): string {
  return text
    .replaceAll("{{member_name}}", participant.name)
    .replaceAll("{{participant_name}}", participant.name)
    .replaceAll("{{team_name}}", participant.teamName)
    .replaceAll("{{role}}", participant.role)
    .replaceAll(
      "{{institution}}",
      participant.institution || "Independent Hacker"
    )
    .replaceAll(
      "{{team_number}}",
      participant.teamNumber != null
        ? String(participant.teamNumber)
        : ""
    );
}