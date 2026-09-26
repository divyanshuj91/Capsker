"use client";

import React, { useState } from "react";
import { NormalizedParticipant, TeamStatus } from "@/types";
import { Card, CardTitle, Button, Input, StatusBadge, Badge } from "@/components/brutal";
import { KanbanBoard } from "./KanbanBoard";
import { exportParticipantsToCsv } from "@/lib/export/csv";
import {
  Phone,
  Mail,
  Github,
  Linkedin,
  Search,
  CheckCircle,
  LayoutGrid,
  Columns3,
  Download,
} from "lucide-react";

interface OperationsBoardProps {
  participants: NormalizedParticipant[];
}

export function OperationsBoard({ participants }: OperationsBoardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"matrix" | "kanban">("matrix");
  const [statuses, setStatuses] = useState<Record<string, TeamStatus>>({});

  const getTeamStatus = (teamName: string): TeamStatus => {
    return statuses[teamName] || "UNCONFIRMED";
  };

  const handleStatusChange = (teamName: string, status: TeamStatus) => {
    setStatuses((prev) => ({ ...prev, [teamName]: status }));
  };

  // Group participants by team
  const teamsMap = participants.reduce<Record<string, NormalizedParticipant[]>>((acc, p) => {
    const key = p.teamName || "Individual";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const teamNames = Object.keys(teamsMap).filter((name) => {
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teamsMap[name].some((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.institution && m.institution.toLowerCase().includes(searchTerm.toLowerCase()))
      );

    const status = getTeamStatus(name);
    const matchesStatus = selectedStatus === "ALL" || status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const filteredParticipants = participants.filter((p) => teamNames.includes(p.teamName));
    exportParticipantsToCsv(filteredParticipants, statuses, `capsker_${selectedStatus.toLowerCase()}_teams.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & View Controls */}
      <Card className="bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search by team, participant, email, or institution..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {["ALL", "UNCONFIRMED", "CONTACTED", "CONFIRMED", "CHECKED_IN", "WAITLISTED"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`text-xs font-black uppercase px-3 py-1.5 border-2 border-black transition-all ${
                  selectedStatus === status
                    ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
            <div className="flex border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
              <button
                onClick={() => setViewMode("matrix")}
                className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 ${
                  viewMode === "matrix" ? "bg-[#FFE800] font-black" : "hover:bg-neutral-100"
                }`}
                title="Matrix View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Table
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 border-l-2 border-black ${
                  viewMode === "kanban" ? "bg-[#FFE800] font-black" : "hover:bg-neutral-100"
                }`}
                title="Kanban View"
              >
                <Columns3 className="w-3.5 h-3.5" />
                Kanban
              </button>
            </div>

            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="w-3.5 h-3.5 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* View Rendering */}
      {viewMode === "kanban" ? (
        <KanbanBoard
          participants={participants}
          teamStatuses={statuses}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="space-y-4">
          {teamNames.length === 0 ? (
            <Card className="text-center py-12 bg-white">
              <p className="font-bold text-neutral-500">No teams or participants found matching filters.</p>
            </Card>
          ) : (
            teamNames.map((teamName) => {
              const members = teamsMap[teamName];
              const currentStatus = getTeamStatus(teamName);

              return (
                <Card
                  key={teamName}
                  className="bg-white space-y-4 hover:shadow-[6px_6px_0px_0px_#000] transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm bg-neutral-100 px-2 py-0.5 border border-black font-bold">
                        {members.length} {members.length === 1 ? "Member" : "Members"}
                      </span>
                      <h3 className="text-lg font-black text-black">{teamName}</h3>
                      <StatusBadge status={currentStatus} />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(teamName, e.target.value as TeamStatus)}
                        aria-label={`Change status for team ${teamName}`}
                        className="border-2 border-black text-xs font-black bg-white px-2 py-1 shadow-[2px_2px_0px_0px_#000] outline-none"
                      >
                        <option value="UNCONFIRMED">UNCONFIRMED</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CHECKED_IN">CHECKED_IN</option>
                        <option value="WAITLISTED">WAITLISTED</option>
                        <option value="DISQUALIFIED">DISQUALIFIED</option>
                      </select>

                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleStatusChange(teamName, "CHECKED_IN")}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Check-In
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((member, idx) => (
                      <div
                        key={idx}
                        className="border-2 border-black p-3 bg-[#FFFDF5] flex flex-col justify-between space-y-2 shadow-[2px_2px_0px_0px_#000]"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm text-black">{member.name}</span>
                            <span className="text-[10px] font-mono uppercase bg-white px-1 border border-black font-bold">
                              {member.role}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 font-mono truncate">{member.email}</p>
                          {member.institution && (
                            <p className="text-xs font-medium text-neutral-700 mt-1 truncate">
                              🏛️ {member.institution}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-black/20">
                          {member.phone && (
                            <a
                              href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 bg-[#00F084] border border-black shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                              title={`WhatsApp ${member.phone}`}
                            >
                              <Phone className="w-3.5 h-3.5 text-black" />
                            </a>
                          )}
                          <a
                            href={`mailto:${member.email}`}
                            className="p-1 bg-[#FFE800] border border-black shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                            title={`Email ${member.email}`}
                          >
                            <Mail className="w-3.5 h-3.5 text-black" />
                          </a>
                          {member.githubUrl && (
                            <a
                              href={member.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 bg-white border border-black shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                              title="GitHub"
                            >
                              <Github className="w-3.5 h-3.5 text-black" />
                            </a>
                          )}
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 bg-[#38BDF8] border border-black shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                              title="LinkedIn"
                            >
                              <Linkedin className="w-3.5 h-3.5 text-black" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
