"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardTitle, Button, Input, Badge } from "@/components/brutal";
import { Send, Mail, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DispatcherPage() {
  const [subject, setSubject] = useState("Your Hackathon Pass & Check-In Details for {{team_name}}");
  const [template, setTemplate] = useState(
    `Hi {{member_name}},\n\nCongratulations! Your team {{team_name}} has been confirmed for Capsker Fall 2026.\n\nPlease find your official badge and QR pass attached. Show this pass at the registration desk for instant check-in.\n\nBest,\nHackathon Operations Team`
  );
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState([
    {
      id: "log-1",
      recipient: "alex.rivera@mit.edu",
      team: "Team NeuralForge",
      status: "SENT",
      time: "2 mins ago",
    },
    {
      id: "log-2",
      recipient: "s.chen@stanford.edu",
      team: "Team NeuralForge",
      status: "SENT",
      time: "2 mins ago",
    },
    {
      id: "log-3",
      recipient: "devon.vance@berkeley.edu",
      team: "Quantum Builders",
      status: "QUEUED",
      time: "Just now",
    },
  ]);

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          recipient: "marcus@cyberpulse.io",
          team: "CyberPulse",
          status: "SENT",
          time: "Just now",
        },
        ...prev,
      ]);
    }, 800);
  };

  return (
    <ProtectedRoute featureTitle="Bulk Email Dispatcher">
      <div className="space-y-6">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
          <Send className="w-8 h-8 text-black" />
          Bulk Email Dispatcher & SMTP Engine
        </h1>
        <p className="text-xs font-bold text-neutral-600 mt-1">
          Dynamic variable interpolation, AES-256-GCM encrypted credentials, automated badge attachment, and rate-limited dispatch
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-white space-y-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-black" />
              Template Composer
            </CardTitle>

            <div>
              <label className="text-xs font-black uppercase text-neutral-700 block mb-1">
                Subject Line
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black uppercase text-neutral-700 block">
                  Body (Markdown & Variables)
                </label>
                <div className="flex gap-1">
                  {["{{member_name}}", "{{team_name}}", "{{role}}"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTemplate((prev) => prev + " " + tag)}
                      className="text-[10px] font-mono bg-[#FFE800] border border-black px-1.5 py-0.5 font-bold hover:bg-[#ffd900]"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={8}
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full border-2 border-black bg-white p-3 font-mono text-sm shadow-[2px_2px_0px_0px_#000] outline-none focus:ring-2 focus:ring-[#FFE800]"
              />
            </div>

            <div className="p-3 bg-[#00F084]/20 border-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-black" />
                <span className="text-xs font-bold text-black">
                  Auto-attach generated Pass / Badge from Studio
                </span>
              </div>
              <Badge variant="confirmed">Active</Badge>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-neutral-600">
                Rate Limit: Max 30 emails / min (Leaky Bucket)
              </span>
              <Button
                variant="primary"
                size="md"
                disabled={isSending}
                onClick={handleDispatch}
              >
                <Send className="w-4 h-4 mr-1.5" />
                {isSending ? "Dispatching..." : "Trigger Batch Dispatch"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-white">
            <CardTitle className="text-sm font-black uppercase mb-3 flex items-center justify-between">
              <span>Live Dispatch Log</span>
              <span className="text-xs font-mono font-normal text-neutral-500">Real-time</span>
            </CardTitle>

            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000] flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-black text-black truncate">{log.recipient}</p>
                    <p className="text-[11px] text-neutral-600 font-medium truncate">{log.team}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant={log.status === "SENT" ? "confirmed" : "unconfirmed"}>
                      {log.status}
                    </Badge>
                    <span className="text-[10px] font-mono text-neutral-500">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);
}
