"use client";

import React, { useState } from "react";
import { NormalizedParticipant, TeamStatus } from "@/types";
import { Card, CardTitle, Badge, Button, StatusBadge } from "@/components/brutal";
import { Phone, Mail, Github, Linkedin, CheckCircle, GripVertical, AlertTriangle } from "lucide-react";

interface KanbanBoardProps {
  participants: NormalizedParticipant[];
  teamStatuses: Record<string, TeamStatus>;
  onStatusChange: (teamName: string, newStatus: TeamStatus) => void;
}

const COLUMNS: { status: TeamStatus; label: string; color: string; borderVariant: string }[] = [
  { status: "UNCONFIRMED", label: "Unconfirmed", color: "bg-[#FB923C]", borderVariant: "border-[#FB923C]" },
  { status: "CONTACTED", label: "Contacted", color: "bg-[#38BDF8]", borderVariant: "border-[#38BDF8]" },
  { status: "CONFIRMED", label: "Confirmed", color: "bg-[#00F084]", borderVariant: "border-[#00F084]" },
  { status: "CHECKED_IN", label: "Checked In", color: "bg-[#00F084]", borderVariant: "border-black" },
  { status: "WAITLISTED", label: "Waitlisted", color: "bg-[#FB923C]", borderVariant: "border-[#FB923C]" },
  { status: "DISQUALIFIED", label: "Disqualified", color: "bg-[#FF66C4]", borderVariant: "border-[#FF66C4]" },
];

export function KanbanBoard({
  participants,
  teamStatuses,
  onStatusChange,
}: KanbanBoardProps) {
  const [draggedTeam, setDraggedTeam] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TeamStatus | null>(null);

  // Group participants by team
  const teamsMap = participants.reduce<Record<string, NormalizedParticipant[]>>((acc, p) => {
    const key = p.teamName || "Individual";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const teamNames = Object.keys(teamsMap);

  const getTeamStatus = (name: string): TeamStatus => {
    return teamStatuses[name] || "UNCONFIRMED";
  };

  const handleDragStart = (e: React.DragEvent, teamName: string) => {
    e.dataTransfer.setData("text/plain", teamName);
    setDraggedTeam(teamName);
  };

  const handleDragOver = (e: React.DragEvent, columnStatus: TeamStatus) => {
    e.preventDefault();
    setDragOverColumn(columnStatus);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TeamStatus) => {
    e.preventDefault();
    const teamName = e.dataTransfer.getData("text/plain") || draggedTeam;
    if (teamName) {
      onStatusChange(teamName, targetStatus);
    }
    setDraggedTeam(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTeams = teamNames.filter((name) => getTeamStatus(name) === col.status);
        const isHovered = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`border-2 border-black bg-white flex flex-col min-h-[550px] shadow-[4px_4px_0px_0px_#000] transition-colors ${
              isHovered ? "bg-[#FFE800]/25" : ""
            }`}
          >
            {/* Column Header */}
            <div className={`border-b-2 border-black p-3 ${col.color} flex items-center justify-between`}>
              <span className="font-black text-xs uppercase tracking-wider text-black">
                {col.label}
              </span>
              <span className="bg-black text-white text-[11px] font-mono font-bold px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000]">
                {columnTeams.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="p-2 space-y-3 flex-1 overflow-y-auto max-h-[700px]">
              {columnTeams.length === 0 ? (
                <div className="border border-dashed border-neutral-400 p-4 text-center text-xs font-bold text-neutral-400 mt-2">
                  Drop team here
                </div>
              ) : (
                columnTeams.map((teamName) => {
                  const members = teamsMap[teamName];
                  const leader = members.find((m) => m.role === "LEADER") || members[0];

                  return (
                    <div
                      key={teamName}
                      draggable
                      onDragStart={(e) => handleDragStart(e, teamName)}
                      className="border-2 border-black bg-[#FFFDF5] p-3 shadow-[2px_2px_0px_0px_#000] cursor-grab active:cursor-grabbing hover:shadow-[4px_4px_0px_0px_#000] transition-shadow space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-neutral-500" />
                          <h4 className="font-black text-xs text-black truncate max-w-[130px]">
                            {teamName}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-white border border-black px-1">
                          {members.length}m
                        </span>
                      </div>

                      {leader && (
                        <div className="text-[11px] font-medium text-neutral-800">
                          <span className="font-bold">Lead:</span> {leader.name}
                        </div>
                      )}

                      {/* Quick Communication triggers */}
                      <div className="flex items-center justify-between pt-1 border-t border-black/15">
                        <div className="flex items-center gap-1">
                          {leader?.phone && (
                            <a
                              href={`https://wa.me/${leader.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 bg-[#00F084] border border-black shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                              title={`WhatsApp ${leader.phone}`}
                            >
                              <Phone className="w-3 h-3 text-black" />
                            </a>
                          )}
                          {leader?.email && (
                            <a
                              href={`mailto:${leader.email}`}
                              className="p-1 bg-[#FFE800] border border-black shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                              title={`Email ${leader.email}`}
                            >
                              <Mail className="w-3 h-3 text-black" />
                            </a>
                          )}
                          {leader?.githubUrl && (
                            <a
                              href={leader.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 bg-white border border-black shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                              title="GitHub"
                            >
                              <Github className="w-3 h-3 text-black" />
                            </a>
                          )}
                        </div>

                        {col.status !== "CHECKED_IN" && (
                          <button
                            onClick={() => onStatusChange(teamName, "CHECKED_IN")}
                            className="text-[10px] font-black uppercase bg-[#00F084] px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000] hover:bg-[#00d676]"
                            title="Instant Check-in"
                          >
                            Check-In
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
