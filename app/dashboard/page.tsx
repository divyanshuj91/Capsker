"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CsvUploader } from "@/components/uploader/CsvUploader";
import { OperationsBoard } from "@/components/board/OperationsBoard";
import { Card, Button, Badge } from "@/components/brutal";
import { SAMPLE_PARTICIPANTS } from "@/lib/data/sample";
import { CSVParseResult, NormalizedParticipant } from "@/types";
import { Users, ShieldCheck, UserCheck, Clock, Sparkles, Layers } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [participants, setParticipants] = useState<NormalizedParticipant[]>(SAMPLE_PARTICIPANTS);

  const handleDataLoaded = (result: CSVParseResult) => {
    if (result.validRows.length > 0) {
      setParticipants(result.validRows);
    }
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
                <span className="font-mono text-xs font-bold">Fall Hackathon 2026</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight uppercase">
                Operations & Registration Command Center
              </h1>
              <p className="text-sm font-bold text-neutral-800 mt-1">
                Automated CSV ingestion, phone normalization (+91/E.164), canvas badge studio, and agentic RAG retrieval.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/studio">
                <Button variant="secondary" size="md" className="whitespace-nowrap">
                  <Layers className="w-4 h-4 mr-1.5" />
                  Badge Studio
                </Button>
              </Link>
              <Link href="/intel">
                <Button variant="purple" size="md" className="whitespace-nowrap">
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
              <span className="text-xs font-black uppercase text-neutral-800">Total Teams</span>
              <Users className="w-4 h-4 text-black" />
            </div>
            <p className="text-3xl font-black text-black mt-2">{totalTeams}</p>
          </Card>

          <Card variant="green">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-neutral-800">Participants</span>
              <UserCheck className="w-4 h-4 text-black" />
            </div>
            <p className="text-3xl font-black text-black mt-2">{participants.length}</p>
          </Card>

          <Card variant="blue">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-neutral-800">Team Leads</span>
              <ShieldCheck className="w-4 h-4 text-black" />
            </div>
            <p className="text-3xl font-black text-black mt-2">{totalLeaders}</p>
          </Card>

          <Card variant="pink">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-neutral-800">Status Sync</span>
              <Clock className="w-4 h-4 text-black" />
            </div>
            <p className="text-xl font-black text-black mt-2">Active Live</p>
          </Card>
        </div>

        {/* Ingestion Area */}
        <CsvUploader onDataLoaded={handleDataLoaded} />

        {/* Operations Matrix */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Teams & Participants Matrix
              </h2>
              <p className="text-xs font-bold text-neutral-600">
                Real-time multi-status board with one-click communication triggers and Kanban drag-and-drop
              </p>
            </div>
          </div>

          <OperationsBoard participants={participants} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
