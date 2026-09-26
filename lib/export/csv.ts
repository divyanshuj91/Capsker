import Papa from "papaparse";
import { NormalizedParticipant, TeamStatus } from "@/types";

export function exportParticipantsToCsv(
  participants: NormalizedParticipant[],
  teamStatuses: Record<string, TeamStatus>,
  filename = "capsker_participants_export.csv"
) {
  const exportRows = participants.map((p) => ({
    "Team Name": p.teamName,
    "Team Status": teamStatuses[p.teamName] || "UNCONFIRMED",
    "Participant Name": p.name,
    "Email": p.email,
    "Phone (E.164)": p.phone || "",
    "GitHub Profile": p.githubUrl || "",
    "LinkedIn Profile": p.linkedinUrl || "",
    "Institution / University": p.institution || "",
    "Role": p.role,
  }));

  const csvString = Papa.unparse(exportRows);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
