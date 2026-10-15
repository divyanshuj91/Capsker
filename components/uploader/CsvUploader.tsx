"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import {
  Button,
  Card,
  CardTitle,
  CardContent,
  Badge,
} from "@/components/brutal";

import { parseAndNormalizeCsv } from "@/lib/normalizer/csv-parser";
import {
  CSVParseResult,
  CsvParticipant,
} from "@/types";

interface CsvUploaderProps {
  onDataLoaded: (
    result: CSVParseResult,
    fileName?: string
  ) => void;

  onProceedToMatrix?: () => void;

  eventId: string;
}

export function CsvUploader({
  onDataLoaded,
  onProceedToMatrix,
  eventId,
}: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const [parseResult, setParseResult] =
    useState<CSVParseResult | null>(null);

  const [fileName, setFileName] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /**
   * Send parsed CSV participants to PostgreSQL.
   *
   * CSV rows are grouped by teamName because
   * Participant belongs to Team in Prisma.
   */
  const importToDatabase = async (
    result: CSVParseResult
  ) => {
    if (!eventId) {
      throw new Error(
        "No event selected. Please select an event first."
      );
    }

    if (result.validRows.length === 0) {
      return null;
    }

    const teamMap = new Map<
      string,
      {
        teamName: string;
        participants: CsvParticipant[];
      }
    >();

    for (const participant of result.validRows) {
      const teamName =
        participant.teamName?.trim() ||
        "Unassigned Team";

      if (!teamMap.has(teamName)) {
        teamMap.set(teamName, {
          teamName,
          participants: [],
        });
      }

      teamMap
        .get(teamName)!
        .participants.push(participant);
    }

    const teams = Array.from(teamMap.values()).map(
      (team) => ({
        teamName: team.teamName,

        participants: team.participants.map(
          (participant) => ({
            name: participant.name,
            email: participant.email,

            phone:
              participant.phone || undefined,

            githubUrl:
              participant.githubUrl || undefined,

            linkedinUrl:
              participant.linkedinUrl || undefined,

            institution:
              participant.institution ||
              undefined,

            role:
              participant.role || "MEMBER",
          })
        ),
      })
    );

    const response = await fetch(
      "/api/participants/import",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          eventId,
          teams,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Failed to import participants"
      );
    }

    return data;
  };

  /**
   * Handle uploaded CSV.
   */
  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a valid .csv file");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const content =
        e.target?.result as string;

      if (!content) {
        return;
      }

      const result =
        parseAndNormalizeCsv(content);

      // Keep existing frontend behavior
      setParseResult(result);

      // Also persist participants in PostgreSQL
      importToDatabase(result)
        .then((data) => {
          if (data) {
            onDataLoaded(result, file.name);
            console.log(
              `Imported ${data.importedParticipants} participants across ${data.importedTeams} teams`
            );
          }
        })
        .catch((error) => {
          console.error(
            "Database import failed:",
            error
          );

          alert(
            error instanceof Error
              ? error.message
              : "Failed to import participants"
          );
        });
    };

    reader.readAsText(file);
  };

  /**
   * Handle drag & drop.
   */
  const onDrop = (
    e: React.DragEvent
  ) => {
    e.preventDefault();

    setIsDragging(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0]
    ) {
      handleFile(
        e.dataTransfer.files[0]
      );
    }
  };

  return (
    <Card className="bg-white">
      <CardTitle className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-black" />

          Intelligent CSV Ingestion
        </span>

        {parseResult && (
          <Badge variant="confirmed">
            {parseResult.validRows.length}{" "}
            Valid Rows Ingested
          </Badge>
        )}
      </CardTitle>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() =>
          setIsDragging(false)
        }
        onDrop={onDrop}
        onClick={() =>
          fileInputRef.current?.click()
        }
        className={`border-2 border-dashed border-black p-8 text-center cursor-pointer transition-colors ${isDragging
            ? "bg-[#FFE800]/30"
            : "bg-[#FFFDF5] hover:bg-neutral-50"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (
              e.target.files &&
              e.target.files[0]
            ) {
              handleFile(
                e.target.files[0]
              );
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-[#FFE800] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <UploadCloud className="w-8 h-8 text-black" />
          </div>

          <div>
            <p className="font-black text-base text-black">
              {fileName
                ? fileName
                : "Drag & drop your Hackathon CSV or click to browse"}
            </p>

            <p className="text-xs text-neutral-600 mt-1 font-medium">
              Auto-detects Team Name, Email,
              Phone (+91/E.164), GitHub,
              LinkedIn, and University columns
            </p>
          </div>
        </div>
      </div>

      {parseResult && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-50 border-2 border-black">
              <span className="text-xs font-bold text-neutral-600 uppercase">
                Valid Rows
              </span>

              <p className="text-xl font-black text-black">
                {parseResult.validRows.length}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 border-2 border-black">
              <span className="text-xs font-bold text-neutral-600 uppercase">
                Failed / Warnings
              </span>

              <p className="text-xl font-black text-[#FF66C4]">
                {parseResult.invalidRows.length}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 border-2 border-black">
              <span className="text-xs font-bold text-neutral-600 uppercase">
                Unique Headers
              </span>

              <p className="text-xl font-black text-black">
                {parseResult.headers.length}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 border-2 border-black">
              <span className="text-xs font-bold text-neutral-600 uppercase">
                Phone Cleanse
              </span>

              <p className="text-xl font-black text-[#00F084]">
                E.164 Ready
              </p>
            </div>
          </div>

          <div className="border-2 border-black p-4 bg-[#FFFDF5]">
            <h4 className="font-black text-sm uppercase tracking-wide mb-2">
              Detected Column Mappings:
            </h4>

            <div className="flex flex-wrap gap-2">
              {Object.entries(
                parseResult.detectedMapping
              ).map(
                ([key, mappedCol]) => (
                  <div
                    key={key}
                    className="inline-flex items-center gap-1.5 text-xs font-mono bg-white px-2 py-1 border border-black"
                  >
                    <span className="font-bold text-neutral-600">
                      {key}:
                    </span>

                    <span className="bg-[#FFE800] px-1 border border-black font-black">
                      {mappedCol}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="border-2 border-black bg-[#FFE800] p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-black" />

                <h4 className="font-black text-sm uppercase tracking-wider text-black">
                  Ready for Teams &amp;
                  Participants Matrix
                </h4>
              </div>

              <p className="text-xs font-bold text-neutral-800 mt-1">
                {
                  parseResult.validRows
                    .length
                }{" "}
                attendees mapped &amp;
                cleansed. Move to the next
                page to manage statuses,
                search, and communication
                triggers.
              </p>
            </div>

            {onProceedToMatrix && (
              <Button
                variant="primary"
                size="md"
                onClick={
                  onProceedToMatrix
                }
                className="whitespace-nowrap bg-black text-[#FFE800] hover:bg-neutral-800 shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5"
              >
                <span>
                  Proceed to Teams Matrix
                </span>

                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {parseResult.invalidRows.length >
            0 && (
              <div className="border-2 border-black bg-[#FF66C4]/15 p-4">
                <div className="flex items-center gap-2 mb-2 font-black text-sm text-black">
                  <AlertTriangle className="w-5 h-5 text-[#FF66C4]" />

                  Row Errors (
                  {
                    parseResult
                      .invalidRows
                      .length
                  }
                  ) — non-blocking:
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1 text-xs font-mono">
                  {parseResult.invalidRows.map(
                    (err, i) => (
                      <div
                        key={i}
                        className="bg-white p-1.5 border border-black"
                      >
                        Row {err.row}:{" "}
                        {err.error}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </Card>
  );
}