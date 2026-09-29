"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, Button, Badge } from "@/components/brutal";
import {
  FileSpreadsheet,
  Layers,
  Sparkles,
  Send,
  CheckCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Lock,
  Phone,
  Terminal,
  Columns3,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  const { user, openAuthModal } = useAuth();

  const [templateName, setTemplateName] = useState(
    "Hackathon Participant Pass"
  );
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  // Assuming bgImage, canvasWidth, canvasHeight, placeholders are defined in your component state or props
  const [bgImage, setBgImage] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [placeholders, setPlaceholders] = useState([]);

  const handleSaveTemplate = async () => {
    if (!bgImage) {
      alert("Please upload a base image before saving the template.");
      return;
    }

    const name = window.prompt(
      "Template name:",
      templateName
    );

    if (!name?.trim()) {
      return;
    }

    setTemplateName(name.trim());
    setIsSavingTemplate(true);

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          type: "TICKET",
          baseImageUrl: bgImage,
          width: canvasWidth,
          height: canvasHeight,
          fieldConfig: placeholders,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save template"
        );
      }

      alert(
        `Template "${name.trim()}" saved successfully.`
      );
    } catch (error) {
      console.error("Save template failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save template"
      );
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 border-2 border-black bg-[#FFE800] px-3 py-1 shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
          <Zap className="w-4 h-4 text-black fill-black" />
          <span className="font-black text-xs uppercase tracking-wider text-black">
            The Hackathon Operations Copilot
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-[1.05]">
          Run 500+ Hacker Events Without{" "}
          <span className="bg-[#FF66C4] px-2 py-0.5 border-2 border-black shadow-[4px_4px_0px_0px_#000] inline-block mt-1">
            Spreadsheet Chaos.
          </span>
        </h1>

        <p className="text-base sm:text-xl font-bold text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          Automate messy CSV ingestion, dynamic QR badge generation, hybrid Agentic RAG lookups, and rate-limited mass email dispatch — wrapped in a high-contrast Neobrutalist console.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {user ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
                Go to Operations Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={openAuthModal}
              className="w-full sm:w-auto text-base shadow-[5px_5px_0px_0px_#000]"
            >
              <Zap className="w-5 h-5 mr-2" />
              Launch Workspace — Free
            </Button>
          )}

          <Link href="/docs" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Documentation
            </Button>
          </Link>
        </div>

        {/* Auth providers pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-neutral-600">
          <span className="font-bold">Instant Sign-In with:</span>
          <span className="bg-white border border-black px-2 py-0.5 font-bold">Google</span>
          <span className="bg-white border border-black px-2 py-0.5 font-bold">GitHub</span>
          <span className="bg-white border border-black px-2 py-0.5 font-bold">Discord</span>
          <span className="bg-white border border-black px-2 py-0.5 font-bold">Email</span>
        </div>
      </section>

      {/* HERO INTERACTIVE PREVIEW CARD */}
      <section className="max-w-5xl mx-auto">
        <div className="border-[3px] border-black bg-white shadow-[10px_10px_0px_0px_#000] p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border border-black bg-[#FF66C4]" />
              <div className="w-3.5 h-3.5 rounded-full border border-black bg-[#FFE800]" />
              <div className="w-3.5 h-3.5 rounded-full border border-black bg-[#00F084]" />
              <span className="ml-2 font-mono text-xs font-bold text-neutral-600">
                capsker-ops-console: ~/active-event
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="confirmed">500+ INGESTED</Badge>
              <Badge variant="purple">AGENT RAG LIVE</Badge>

              {/* Added Button Here */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveTemplate}
                disabled={isSavingTemplate}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                {isSavingTemplate ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-black p-4 bg-[#FFFDF5] shadow-[3px_3px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase">CSV Normalizer</span>
                <span className="text-[10px] font-mono bg-[#00F084] px-1 border border-black font-bold">E.164</span>
              </div>
              <p className="text-xs font-mono text-neutral-600">
                &gt; Sanitized 184 phone numbers<br />
                &gt; Matched &quot;lead_gh&quot; to GitHub URLs<br />
                &gt; Zero CSV injection threats
              </p>
            </div>

            <div className="border-2 border-black p-4 bg-[#FFFDF5] shadow-[3px_3px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase">Kanban Matrix</span>
                <span className="text-[10px] font-mono bg-[#FFE800] px-1 border border-black font-bold">6 Stages</span>
              </div>
              <p className="text-xs font-mono text-neutral-600">
                &gt; UNCONFIRMED $\to$ CHECKED_IN<br />
                &gt; 1-click WhatsApp web dispatch<br />
                &gt; Drag-and-drop live sync
              </p>
            </div>

            <div className="border-2 border-black p-4 bg-[#FFFDF5] shadow-[3px_3px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase">Badge Canvas</span>
                <span className="text-[10px] font-mono bg-[#38BDF8] px-1 border border-black font-bold">High DPI</span>
              </div>
              <p className="text-xs font-mono text-neutral-600">
                &gt; Dynamic placeholder overlays<br />
                &gt; Embedded offline QR codes<br />
                &gt; Instant batch .zip generation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="space-y-12 max-w-5xl mx-auto pt-12 scroll-mt-24">
        <div className="text-center space-y-3">
          <span className="bg-[#FFE800] border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
            Lifecycle Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            How Capsker Works in 5 Steps
          </h2>
          <p className="text-sm font-bold text-neutral-600 max-w-xl mx-auto">
            From raw spreadsheet registration dumps to physical on-site badge scanning and automated mail merges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Drop CSV Dump",
              desc: "Upload spreadsheets from Google Forms, Devpost, or Typeform. Fuzzy matcher maps arbitrary column names.",
              badge: "PapaParse",
              color: "bg-[#FFE800]",
            },
            {
              step: "02",
              title: "Cleanse & Group",
              desc: "Automated profile extraction normalizes phone numbers to E.164 and creates canonical GitHub/LinkedIn links.",
              badge: "E.164 Ready",
              color: "bg-[#00F084]",
            },
            {
              step: "03",
              title: "Triage Kanban",
              desc: "Drag teams across 6 Neobrutalist status columns with 1-click WhatsApp, call, or email previews.",
              badge: "Kanban UI",
              color: "bg-[#38BDF8]",
            },
            {
              step: "04",
              title: "Studio Badges",
              desc: "Overlay dynamic placeholders and QR codes over any base template artwork with live attendee cycling.",
              badge: "Canvas / SVG",
              color: "bg-[#A78BFA]",
            },
            {
              step: "05",
              title: "Rate-Limit Dispatch",
              desc: "Send personalized passes and event announcements using encrypted custom SMTP or transactional relays.",
              badge: "BullMQ Queue",
              color: "bg-[#FF66C4]",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between space-y-3 hover:translate-y-[-2px] transition-transform"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-black">{item.step}</span>
                  <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 border border-black ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-black text-base uppercase text-black leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION GRID */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Built Exclusively for Hackathon Ops
          </h2>
          <p className="text-sm font-bold text-neutral-600">
            Engineered to eliminate friction before, during, and after your hackathon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white space-y-3">
            <div className="p-3 bg-[#FFE800] border-2 border-black inline-block shadow-[2px_2px_0px_0px_#000]">
              <FileSpreadsheet className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black uppercase text-black">
              Fault-Tolerant CSV Ingestion
            </h3>
            <p className="text-sm font-medium text-neutral-700">
              Never fail an entire import because of 2 malformed rows. Capsker isolates bad records into an interactive drawer while auto-detecting fuzzy headers like <code className="bg-neutral-100 px-1 border border-black font-bold">ph_no</code> or <code className="bg-neutral-100 px-1 border border-black font-bold">lead-gh</code>.
            </p>
          </Card>

          <Card className="bg-white space-y-3">
            <div className="p-3 bg-[#00F084] border-2 border-black inline-block shadow-[2px_2px_0px_0px_#000]">
              <Columns3 className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black uppercase text-black">
              Neobrutalist Operations Board
            </h3>
            <p className="text-sm font-medium text-neutral-700">
              High-contrast, zero-blur Kanban board designed for noisy, fast-paced event check-in desks. Instant WhatsApp Web integration lets you nudge ghosting leads in a single click.
            </p>
          </Card>

          <Card className="bg-white space-y-3">
            <div className="p-3 bg-[#A78BFA] border-2 border-black inline-block shadow-[2px_2px_0px_0px_#000]">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black uppercase text-black">
              Agentic RAG Intel Copilot
            </h3>
            <p className="text-sm font-medium text-neutral-700">
              Ask natural queries like <em>&quot;Which teams from MIT haven&apos;t confirmed phone numbers?&quot;</em> and execute multi-step actions directly with tool calling (e.g. promoting teams or preparing mail batches).
            </p>
          </Card>

          <Card className="bg-white space-y-3">
            <div className="p-3 bg-[#38BDF8] border-2 border-black inline-block shadow-[2px_2px_0px_0px_#000]">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black uppercase text-black">
              Visual Ticket & Badge Studio
            </h3>
            <p className="text-sm font-medium text-neutral-700">
              Upload any background graphic. Position participant names, team IDs, and dynamic QR verification codes on an interactive canvas with instant attendee live-preview and zip export.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. CALL TO ACTION & GATING BANNER */}
      <section className="max-w-4xl mx-auto">
        <div className="border-[3px] border-black bg-[#FFE800] p-8 sm:p-12 shadow-[8px_8px_0px_0px_#000] text-center space-y-6">
          <div className="inline-flex p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <Lock className="w-8 h-8 text-black" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            Ready to Supercharge Your Hackathon Ops?
          </h2>

          <p className="text-sm sm:text-base font-bold text-neutral-800 max-w-xl mx-auto">
            Join hundreds of hackathon organizers. Authenticate in seconds with your preferred account to unlock the full operations suite.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-black font-black">
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                onClick={openAuthModal}
                className="w-full sm:w-auto bg-white text-black font-black shadow-[4px_4px_0px_0px_#000]"
              >
                Sign In / Sign Up
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            <Link href="/docs" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-2 border-black">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}