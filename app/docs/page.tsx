"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardTitle, Badge, Button } from "@/components/brutal";
import {
  BookOpen,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Send,
  Database,
  ShieldCheck,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

type DocSection = "overview" | "ingestion" | "studio" | "rag" | "mailer" | "schema" | "design";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<DocSection>("overview");

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-[3px] border-black bg-[#38BDF8] p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-black text-[#38BDF8] font-black text-xs px-2 py-0.5 uppercase tracking-wider">
                Public Documentation
              </span>
              <span className="font-mono text-xs font-bold text-black">v1.0 Specifications</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight uppercase">
              Capsker Developer & Architecture Docs
            </h1>
            <p className="text-sm font-bold text-neutral-900 mt-1">
              Comprehensive reference for CSV normalization heuristics, badge coordinate overlays, RAG tool calling, and database schemas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/divyanshuj91/Capsker"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary" size="md">
                <Code2 className="w-4 h-4 mr-1.5" />
                GitHub Repository
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000]">
            <span className="text-xs font-black uppercase text-neutral-600 block mb-2 px-1">
              Documentation Index
            </span>
            <div className="space-y-1">
              {[
                { id: "overview", label: "System Architecture", icon: Terminal, color: "bg-[#FFE800]" },
                { id: "ingestion", label: "CSV Ingestion Engine", icon: FileSpreadsheet, color: "bg-[#00F084]" },
                { id: "studio", label: "Badge Studio Spec", icon: Layers, color: "bg-[#38BDF8]" },
                { id: "rag", label: "Agentic RAG Intel", icon: Sparkles, color: "bg-[#A78BFA]" },
                { id: "mailer", label: "SMTP Mail Dispatcher", icon: Send, color: "bg-[#FF66C4]" },
                { id: "schema", label: "Database Schema", icon: Database, color: "bg-[#FB923C]" },
                { id: "design", label: "Neobrutalism Specs", icon: BookOpen, color: "bg-[#FFE800]" },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as DocSection)}
                    className={`w-full text-left text-xs font-black uppercase p-2 border-2 border-black transition-all flex items-center justify-between ${
                      isActive
                        ? `${item.color} shadow-[2px_2px_0px_0px_#000] translate-x-1`
                        : "bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-black" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-black" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-9 space-y-6">
          {activeSection === "overview" && (
            <Card className="bg-white space-y-6">
              <div className="border-b-2 border-black pb-3">
                <Badge variant="yellow">Architecture Overview</Badge>
                <h2 className="text-2xl font-black uppercase text-black mt-2">
                  System Design & Subsystems
                </h2>
              </div>

              <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                <strong>Capsker</strong> is an event-driven hackathon operations platform built on Next.js 14 App Router, combining asynchronous background workers with a high-contrast Neobrutalist frontend.
              </p>

              <div className="border-2 border-black p-4 bg-[#FFFDF5] shadow-[3px_3px_0px_0px_#000] space-y-3 font-mono text-xs">
                <h3 className="font-black text-sm uppercase font-sans">Subsystems Layout</h3>
                <ul className="space-y-2 list-disc list-inside text-neutral-800">
                  <li><strong>app/</strong>: Next.js 14 App Router featuring public Landing and Docs alongside gated Dashboard, Studio, Intel, and Dispatcher.</li>
                  <li><strong>components/brutal/</strong>: Strict Neobrutalism primitives with hard shadows and active tactile press feedback.</li>
                  <li><strong>lib/normalizer/</strong>: Heuristic CSV mapping, phone cleansing (+91/E.164), and profile canonicalization.</li>
                  <li><strong>prisma/</strong>: PostgreSQL schema with models for Events, Teams, Participants, Templates, and Logs.</li>
                  <li><strong>lib/auth/</strong>: Multi-provider authentication supporting Email, Google, GitHub, and Discord.</li>
                </ul>
              </div>
            </Card>
          )}

          {activeSection === "ingestion" && (
            <Card className="bg-white space-y-6">
              <div className="border-b-2 border-black pb-3">
                <Badge variant="confirmed">Data Pipeline</Badge>
                <h2 className="text-2xl font-black uppercase text-black mt-2">
                  Intelligent CSV Normalizer Spec
                </h2>
              </div>

              <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                The ingestion pipeline uses lowercase substring matching and Levenshtein distance metrics to automatically detect arbitrary spreadsheet headers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {[
                  { field: "teamName", aliases: "team, team name, team_name, group, squad" },
                  { field: "name", aliases: "name, full name, member, participant, lead name" },
                  { field: "email", aliases: "email, e-mail, mail address, lead email" },
                  { field: "phone", aliases: "phone, mobile, contact, whatsapp, phone number, ph_no" },
                  { field: "github", aliases: "github, github profile, gh, repo, github handle" },
                  { field: "linkedin", aliases: "linkedin, linkedin url, li" },
                  { field: "institution", aliases: "college, university, school, institution, org" },
                ].map((item) => (
                  <div key={item.field} className="p-3 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-black text-black bg-[#FFE800] px-1.5 py-0.5 border border-black uppercase">
                      {item.field}
                    </span>
                    <p className="text-neutral-600 mt-2">Aliases: {item.aliases}</p>
                  </div>
                ))}
              </div>

              <div className="border-2 border-black p-4 bg-[#00F084]/15 shadow-[3px_3px_0px_0px_#000] space-y-2">
                <h4 className="font-black text-sm uppercase">Sanitization Guarantees</h4>
                <ul className="text-xs font-mono space-y-1 text-neutral-800">
                  <li>• <strong>Phone</strong>: Standardizes 10-digit mobile numbers to E.164 (+91 standard) and strips brackets/dashes.</li>
                  <li>• <strong>GitHub</strong>: Bare usernames (e.g. <code>octocat</code>) are transformed into canonical <code>https://github.com/octocat</code>.</li>
                  <li>• <strong>Formulas</strong>: Strips dangerous formula injection prefixes (<code>=</code>, <code>+</code>, <code>-</code>, <code>@</code>).</li>
                </ul>
              </div>
            </Card>
          )}

          {activeSection === "studio" && (
            <Card className="bg-white space-y-6">
              <div className="border-b-2 border-black pb-3">
                <Badge variant="contacted">Graphic Engine</Badge>
                <h2 className="text-2xl font-black uppercase text-black mt-2">
                  Canvas Dynamic Placeholder Spec
                </h2>
              </div>

              <p className="text-sm font-medium text-neutral-700">
                Coordinate configuration objects follow this strict TypeScript interface defined in <code className="font-bold">types/index.ts</code>:
              </p>

              <pre className="p-4 bg-neutral-900 text-[#00F084] font-mono text-xs overflow-x-auto border-2 border-black shadow-[4px_4px_0px_0px_#000]">
{`export interface TemplatePlaceholder {
  id: string;
  field: 'teamName' | 'participantName' | 'role' | 'teamNumber' | 'institution' | 'qrCode';
  x: number;          // Pixels from left
  y: number;          // Pixels from top
  width?: number;
  height?: number;
  fontFamily: string; // e.g., 'Space Grotesk', 'Inter'
  fontSize: number;   // In pt/px
  fontWeight: 'normal' | 'bold' | '800';
  color: string;      // Hex string '#000000'
  textAlign: 'left' | 'center' | 'right';
  textTransform?: 'uppercase' | 'capitalize' | 'none';
}`}
              </pre>
            </Card>
          )}

          {activeSection === "rag" && (
            <Card className="bg-white space-y-6">
              <div className="border-b-2 border-black pb-3">
                <Badge variant="purple">AI Intel</Badge>
                <h2 className="text-2xl font-black uppercase text-black mt-2">
                  Agentic RAG & Tool Calling Architecture
                </h2>
              </div>

              <p className="text-sm font-medium text-neutral-700">
                Capsker Intel runs on a hybrid retrieval architecture combining deterministic relational queries with semantic vector lookups:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000]">
                  <span className="font-black text-black">1. queryParticipantTable(filters: FilterInput)</span>
                  <p className="text-neutral-600 mt-1">Converts natural prompts into deterministic SQL or ORM expressions for team status and college filtering.</p>
                </div>

                <div className="p-3 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000]">
                  <span className="font-black text-black">2. mutateTeamStatus(teamIds: string[], status: TeamStatus)</span>
                  <p className="text-neutral-600 mt-1">Executes batch status promotions (e.g. promoting waitlisted teams to Confirmed).</p>
                </div>

                <div className="p-3 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000]">
                  <span className="font-black text-black">3. draftBatchEmail(teamIds: string[], templateId: string)</span>
                  <p className="text-neutral-600 mt-1">Connects AI retrieval directly to the outbound mail queue with personalized variable interpolation.</p>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "mailer" && (
            <Card className="bg-white space-y-6">
              <div className="border-b-2 border-black pb-3">
                <Badge variant="disqualified">Email Engine</Badge>
                <h2 className="text-2xl font-black uppercase text-black mt-2">
                  Mailing Infrastructure & Throttling
                </h2>
              </div>

              <p className="text-sm font-medium text-neutral-700">
                The mailing subsystem ensures high deliverability and protects SMTP accounts from rate bans during blitzes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000] space-y-2">
                  <span className="font-black text-black uppercase">AES-256-GCM Isolation</span>
                  <p className="text-neutral-600">
                    All outbound organizer SMTP credentials and private tokens are encrypted with AES-256-GCM at rest in the database.
                  </p>
                </div>

                <div className="p-4 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000] space-y-2">
                  <span className="font-black text-black uppercase">Leaky Bucket Throttler</span>
                  <p className="text-neutral-600">
                    Rate limits dispatch to max 30 emails/minute for standard Gmail/GSuite relays to guarantee zero domain blacklisting.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "schema" && (
            <Card className="bg-white space-y-6">
              <div className="border-b-2 border-black pb-3">
                <Badge variant="unconfirmed">Database</Badge>
                <h2 className="text-2xl font-black uppercase text-black mt-2">
                  Prisma Relational Models
                </h2>
              </div>

              <p className="text-sm font-medium text-neutral-700">
                PostgreSQL schema definition located at <code className="font-bold">prisma/schema.prisma</code>:
              </p>

              <pre className="p-4 bg-neutral-900 text-white font-mono text-xs overflow-x-auto border-2 border-black shadow-[4px_4px_0px_0px_#000]">
{`enum TeamStatus {
  UNCONFIRMED
  CONTACTED
  CONFIRMED
  CHECKED_IN
  WAITLISTED
  DISQUALIFIED
}

model Team {
  id           String        @id @default(cuid())
  teamNumber   Int?
  name         String
  status       TeamStatus    @default(UNCONFIRMED)
  members      Participant[]
  eventId      String
  event        Event         @relation(fields: [eventId], references: [id])
}

model Participant {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String?
  githubUrl   String?
  linkedinUrl String?
  institution String?
  role        ParticipantRole @default(MEMBER)
  teamId      String
  team        Team     @relation(fields: [teamId], references: [id])
}`}
              </pre>
            </Card>
          )}

          {activeSection === "design" && (
            <Card className="bg-white space-y-6">
              <div className="border-b-2 border-black pb-3">
                <Badge variant="yellow">Design System</Badge>
                <h2 className="text-2xl font-black uppercase text-black mt-2">
                  Neobrutalism Design System Tokens
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                {[
                  { name: "Primary Yellow", hex: "#FFE800", bg: "bg-[#FFE800]" },
                  { name: "Success Green", hex: "#00F084", bg: "bg-[#00F084]" },
                  { name: "Alert Pink", hex: "#FF66C4", bg: "bg-[#FF66C4]" },
                  { name: "Sky Blue", hex: "#38BDF8", bg: "bg-[#38BDF8]" },
                  { name: "Agent Purple", hex: "#A78BFA", bg: "bg-[#A78BFA]" },
                  { name: "Waitlist Orange", hex: "#FB923C", bg: "bg-[#FB923C]" },
                ].map((c) => (
                  <div key={c.hex} className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] flex items-center gap-3">
                    <div className={`w-8 h-8 border-2 border-black ${c.bg} flex-shrink-0 shadow-[1px_1px_0px_0px_#000]`} />
                    <div>
                      <span className="font-bold text-black block">{c.name}</span>
                      <span className="text-neutral-500">{c.hex}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000] space-y-2">
                <span className="font-black text-sm uppercase">Strict Aesthetic Tenets:</span>
                <p className="text-xs text-neutral-700">
                  • Solid <code className="bg-neutral-100 px-1 border border-black font-bold">2px</code> or <code className="bg-neutral-100 px-1 border border-black font-bold">3px</code> black borders.<br />
                  • Hard un-blurred drop shadows: <code className="bg-neutral-100 px-1 border border-black font-bold">shadow-[4px_4px_0px_0px_#000]</code>.<br />
                  • Tactile physical press translation on click: <code className="bg-neutral-100 px-1 border border-black font-bold">active:translate-x-[2px] active:translate-y-[2px]</code>.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
