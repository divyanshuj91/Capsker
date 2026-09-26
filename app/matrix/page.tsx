"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OperationsBoard } from "@/components/board/OperationsBoard";
import { Button, Card } from "@/components/brutal";
import { useParticipants } from "@/lib/context/ParticipantsContext";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Clock,
  ArrowLeft,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function MatrixPage() {
  const { participants, csvFileName } = useParticipants();

  const totalTeams = new Set(participants.map((p) => p.teamName)).size;
  const totalLeaders = participants.filter((p) => p.role === "LEADER").length;

  return (
    <ProtectedRoute featureTitle="Teams & Participants Matrix">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-1.5 text-xs font-black uppercase"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Upload New CSV</span>
              </Button>
            </Link>

            <div className="border-l-2 border-black pl-3">
              <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <Users className="w-5 h-5 text-black" />
                Teams &amp; Participants Matrix
              </h1>
              <p className="text-[11px] font-bold text-neutral-600">
                Source: <span className="font-mono text-black">{csvFileName || "Sample Hackathon Callset"}</span> • {participants.length} Attendees • {totalTeams} Teams
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/studio">
              <Button variant="secondary" size="sm" className="text-xs">
                <Layers className="w-3.5 h-3.5 mr-1" />
                Badge Studio
              </Button>
            </Link>
            <Link href="/dispatcher">
              <Button variant="primary" size="sm" className="text-xs">
                <Send className="w-3.5 h-3.5 mr-1" />
                Email Dispatcher
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border-2 border-black bg-[#FFE800] p-3 shadow-[2px_2px_0px_0px_#000] flex items-center justify-between">
            <span className="text-xs font-black uppercase">Teams:</span>
            <span className="text-xl font-black font-mono">{totalTeams}</span>
          </div>
          <div className="border-2 border-black bg-[#00F084] p-3 shadow-[2px_2px_0px_0px_#000] flex items-center justify-between">
            <span className="text-xs font-black uppercase">Attendees:</span>
            <span className="text-xl font-black font-mono">{participants.length}</span>
          </div>
          <div className="border-2 border-black bg-[#38BDF8] p-3 shadow-[2px_2px_0px_0px_#000] flex items-center justify-between">
            <span className="text-xs font-black uppercase">Team Leads:</span>
            <span className="text-xl font-black font-mono">{totalLeaders}</span>
          </div>
          <div className="border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_#000] flex items-center justify-between">
            <span className="text-xs font-black uppercase">Live Sync:</span>
            <span className="text-xs font-mono font-bold bg-[#00F084] px-1.5 py-0.5 border border-black">
              ACTIVE
            </span>
          </div>
        </div>

        {/* The Matrix Board */}
        <OperationsBoard participants={participants} />
      </div>
    </ProtectedRoute>
  );
}
