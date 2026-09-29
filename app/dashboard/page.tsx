"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CsvUploader } from "@/components/uploader/CsvUploader";
import { Card, Button } from "@/components/brutal";
import { useParticipants } from "@/lib/context/ParticipantsContext";
import { CSVParseResult } from "@/types";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  const { participants, csvFileName, eventId, setParticipantsData } =
    useParticipants();

  const handleDataLoaded = (result: CSVParseResult, fileName?: string) => {
    setParticipantsData(result, fileName);
  };

  const totalTeams = new Set(participants.map((p) => p.teamName)).size;

  const totalLeaders = participants.filter((p) => p.role === "LEADER").length;

  return (
    <ProtectedRoute featureTitle="Hackathon Operations Board">
      <div className="space-y-8">
        {/* Top Banner / Hero */}
        <div className="border-2 border-black bg-[#FFE800] p-6 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-black text-[#FFE800] font-black text-xs px-2 py-0.5 uppercase tracking-wider">
                  Hackathon Ops Engine
                </span>

                <span className="font-mono text-xs font-bold">
                  Fall Hackathon 2026
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight uppercase">
                Operations &amp; Registration Command Center
              </h1>

              <p className="text-sm font-bold text-neutral-800 mt-1">
                Automated CSV ingestion, phone normalization (+91/E.164), canvas
                badge studio, and agentic RAG retrieval.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/matrix">
                <Button
                  variant="secondary"
                  size="md"
                  className="whitespace-nowrap"
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  Teams Matrix
                </Button>
              </Link>

              <Link href="/studio">
                <Button
                  variant="secondary"
                  size="md"
                  className="whitespace-nowrap"
                >
                  <Layers className="w-4 h-4 mr-1.5" />
                  Badge Studio
                </Button>
              </Link>

              <Link href="/intel">
                <Button
                  variant="purple"
                  size="md"
                  className="whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Ask Intel RAG
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="yellow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-neutral-800">
                Total Teams
              </span>

              <Users className="w-4 h-4 text-black" />
            </div>

            <p className="text-3xl font-black text-black mt-2">{totalTeams}</p>
          </Card>

          <Card variant="green">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-neutral-800">
                Participants
              </span>

              <UserCheck className="w-4 h-4 text-black" />
            </div>

            <p className="text-3xl font-black text-black mt-2">
              {participants.length}
            </p>
          </Card>

          <Card variant="blue">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-neutral-800">
                Team Leads
              </span>

              <ShieldCheck className="w-4 h-4 text-black" />
            </div>

            <p className="text-3xl font-black text-black mt-2">
              {totalLeaders}
            </p>
          </Card>

          <Card variant="pink">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-neutral-800">
                Status Sync
              </span>

              <Clock className="w-4 h-4 text-black" />
            </div>

            <p className="text-xl font-black text-black mt-2">Active Live</p>
          </Card>
        </div>

        {/* Ingestion Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-black" />
                Participant CSV Ingestion
              </h2>

              <p className="text-xs font-bold text-neutral-600">
                Upload your attendee spreadsheet to sanitize phone numbers and
                auto-map team columns
              </p>
            </div>

            <Link href="/matrix">
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5"
              >
                <span>View Teams Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          {eventId ? (
            <CsvUploader
              eventId={eventId}
              onDataLoaded={handleDataLoaded}
              onProceedToMatrix={() => router.push("/matrix")}
            />
          ) : (
            <div className="border-2 border-black bg-yellow-100 p-6 font-bold">
              Loading event...
            </div>
          )}
        </div>

        {/* Existing Data Callout / Jump to Matrix */}
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide">
              Active Hackathon Dataset
            </h3>

            <p className="text-xs font-bold text-neutral-600 mt-0.5">
              Currently loaded:{" "}
              <span className="font-mono text-black underline font-bold">
                {csvFileName || "PostgreSQL participant dataset"}
              </span>{" "}
              ({participants.length} attendees across {totalTeams} teams)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/matrix">
              <Button
                variant="primary"
                size="md"
                className="flex items-center gap-1.5"
              >
                <span>Open Teams &amp; Participants Matrix</span>

                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
