"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardTitle, Button, Input, Badge } from "@/components/brutal";
import { Sparkles, Send, Bot, Terminal, CheckCircle2, ArrowRight } from "lucide-react";
import { SAMPLE_PARTICIPANTS } from "@/lib/data/sample";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolCall?: {
    name: string;
    args: Record<string, unknown>;
    result: string;
  };
}

export default function IntelCopilotPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Organizer! I am Capsker Intel Copilot. I have hybrid RAG indexing over all registered teams, contact profiles, GitHub/LinkedIn URLs, and check-in statuses. How can I help with your hackathon operations today?",
    },
  ]);

  const handleSend = () => {
    if (!query.trim()) return;

    const userText = query;
    setQuery("");

    // Simulate Agentic RAG tool invocation based on query keywords
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];

    let assistantResponse = "";
    let toolCall: Message["toolCall"] = undefined;

    const lower = userText.toLowerCase();
    if (lower.includes("heritage") || lower.includes("github")) {
      toolCall = {
        name: "queryParticipantTable",
        args: { institution: "Heritage Institute", missingField: "githubUrl" },
        result: "Found 1 team: 'CyberPulse' (Lead: Marcus Aurel). GitHub URL is registered, phone is verified.",
      };
      assistantResponse =
        "Found 1 participant from Heritage Institute of Technology: Marcus Aurel leading team 'CyberPulse'. Their GitHub profile is active (https://github.com/marcusaurel) and phone is E.164 normalized (+919876543214).";
    } else if (lower.includes("mit") || lower.includes("stanford") || lower.includes("lead")) {
      toolCall = {
        name: "queryParticipantTable",
        args: { filter: "LEADER", institution: "MIT, Stanford" },
        result: "Found Alex Rivera (Team NeuralForge, MIT) and Samantha Chen (Stanford).",
      };
      assistantResponse =
        "Alex Rivera is the Leader of 'Team NeuralForge' from MIT Computer Science (alex.rivera@mit.edu), collaborating with Samantha Chen from Stanford AI Lab.";
    } else if (lower.includes("stats") || lower.includes("summary")) {
      toolCall = {
        name: "summarizeStats",
        args: {},
        result: "Total Teams: 3, Total Members: 5, Check-in Rate: 0%, E.164 Clean Rate: 100%",
      };
      assistantResponse =
        "Current Hackathon Overview:\n• Total Ingested Teams: 3\n• Registered Participants: 5\n• All 5 participants have verified E.164 phone numbers and canonical profiles.";
    } else {
      assistantResponse = `I've cross-referenced our relational participant database and unstructured notes for "${userText}". All team leads have verified contact channels ready for broadcast.`;
    }

    newMessages.push({
      role: "assistant",
      content: assistantResponse,
      toolCall,
    });

    setMessages(newMessages);
  };

  return (
    <ProtectedRoute featureTitle="Agentic RAG Intel Copilot">
      <div className="space-y-6">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-[#A78BFA]" />
          Agentic RAG Intel Copilot
        </h1>
        <p className="text-xs font-bold text-neutral-600 mt-1">
          Hybrid relational + vector search copilot with tool execution (status updates, participant queries, broadcast drafting)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-white min-h-[500px] flex flex-col justify-between">
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] border-2 border-black p-3.5 shadow-[3px_3px_0px_0px_#000] text-sm ${
                      msg.role === "user"
                        ? "bg-[#FFE800] text-black font-bold"
                        : "bg-[#FFFDF5] text-black font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs font-black uppercase text-neutral-600">
                      {msg.role === "user" ? (
                        <span>You (Organizer)</span>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5 text-black" />
                          <span>Capsker Intel</span>
                        </>
                      )}
                    </div>
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {msg.toolCall && (
                      <div className="mt-3 p-2 bg-white border border-black text-xs font-mono">
                        <div className="flex items-center gap-1 text-[#00F084] font-black uppercase text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-black" />
                          <span className="text-black">Executed Tool: {msg.toolCall.name}</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 mt-1">
                          Result: {msg.toolCall.result}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-black pt-4 mt-4 flex gap-2">
              <Input
                type="text"
                placeholder="Ask Intel (e.g. 'Show teams from Heritage', 'Give me stats summary')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button variant="purple" onClick={handleSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-[#A78BFA]/20">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-1.5 mb-2">
              <Terminal className="w-4 h-4 text-black" />
              Agent Capability Matrix
            </CardTitle>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-white border border-black">
                <span className="font-bold text-black">queryParticipantTable:</span>
                <p className="text-neutral-600 mt-0.5">Filter by college, status, missing profiles</p>
              </div>
              <div className="p-2 bg-white border border-black">
                <span className="font-bold text-black">mutateTeamStatus:</span>
                <p className="text-neutral-600 mt-0.5">Batch promote teams to Confirmed / Checked-in</p>
              </div>
              <div className="p-2 bg-white border border-black">
                <span className="font-bold text-black">draftBatchEmail:</span>
                <p className="text-neutral-600 mt-0.5">Prepare personalized broadcast passes</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <h4 className="text-xs font-black uppercase text-neutral-600 mb-2">Suggested Queries</h4>
            <div className="space-y-1.5">
              {[
                "Show teams from Heritage Institute",
                "Give me the contact info for team leaders",
                "Summarize registration statistics",
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                  }}
                  className="w-full text-left text-xs font-bold p-2 border border-black bg-[#FFFDF5] hover:bg-[#FFE800] transition-colors flex items-center justify-between shadow-[1px_1px_0px_0px_#000]"
                >
                  <span className="truncate">{q}</span>
                  <ArrowRight className="w-3 h-3 flex-shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);
}
