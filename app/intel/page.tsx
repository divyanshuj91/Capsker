"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardTitle, Button, Input, Badge } from "@/components/brutal";
import { Sparkles, Send, Bot, Terminal, CheckCircle2, ArrowRight, Loader2, Cpu } from "lucide-react";
import { useParticipants } from "@/lib/context/ParticipantsContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
  isLiveApi?: boolean;
  toolCall?: {
    name: string;
    args: Record<string, unknown>;
    result?: string;
  };
}

export default function IntelCopilotPage() {
  const { participants } = useParticipants();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Organizer! I am Capsker Intel Copilot, powered by Google's Gemma 4 open-weights model. I have full hybrid indexing over your ingested participants, contact profiles, GitHub/LinkedIn URLs, and check-in statuses. How can I assist your hackathon operations today?",
      model: "Gemma 4",
      isLiveApi: false,
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || query).trim();
    if (!text || loading) return;

    setQuery("");
    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          participants,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          model: data.model || "Gemma 4",
          isLiveApi: data.isLiveApi,
          toolCall: data.toolCall,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Encountered an operational error contacting the Gemma 4 runtime. Check server logs.",
          model: "Gemma 4",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute featureTitle="Agentic RAG Intel Copilot">
      <div className="space-y-6">
        <div className="border-b-2 border-black pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#A78BFA]" />
              Agentic RAG Intel Copilot
            </h1>
            <p className="text-xs font-bold text-neutral-600 mt-1">
              Hybrid operations engine powered by Google&apos;s Gemma 4 open model for hackathon intelligence and tool dispatch
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="flex items-center gap-1.5 py-1 px-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Gemma 4 Active</span>
            </Badge>
            <Badge variant="default" className="text-xs font-mono">
              {participants.length} Records Loaded
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Card className="bg-white min-h-[520px] flex flex-col justify-between">
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
                      <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-black uppercase text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          {msg.role === "user" ? (
                            <span>You (Organizer)</span>
                          ) : (
                            <>
                              <Bot className="w-3.5 h-3.5 text-black" />
                              <span>{msg.model || "Capsker Intel"}</span>
                            </>
                          )}
                        </div>
                        {msg.role === "assistant" && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 border border-black bg-white">
                            {msg.isLiveApi ? "LIVE API" : "GEMMA RUNTIME"}
                          </span>
                        )}
                      </div>
                      <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                      {msg.toolCall && (
                        <div className="mt-3 p-2.5 bg-white border-2 border-black text-xs font-mono shadow-[2px_2px_0px_0px_#000]">
                          <div className="flex items-center gap-1 text-[#00F084] font-black uppercase text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                            <span className="text-black">Action Executed: {msg.toolCall.name}</span>
                          </div>
                          {msg.toolCall.result && (
                            <div className="text-[11px] text-neutral-700 mt-1 font-semibold">
                              Result: {msg.toolCall.result}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start">
                    <div className="border-2 border-black p-3 shadow-[3px_3px_0px_0px_#000] bg-[#FFFDF5] text-black text-sm flex items-center gap-2 font-bold">
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Gemma 4 is reasoning & indexing operational data...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-black pt-4 mt-4 flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask Gemma 4 (e.g., 'Summarize registration statistics', 'Find teams from MIT')..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                />
                <Button variant="purple" onClick={() => handleSend()} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-[#A78BFA]/20">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-1.5 mb-2">
                <Terminal className="w-4 h-4 text-black" />
                Gemma 4 Capability Matrix
              </CardTitle>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-white border border-black shadow-[1px_1px_0px_0px_#000]">
                  <span className="font-bold text-black">queryParticipantDirectory:</span>
                  <p className="text-neutral-600 mt-0.5">Filter by college, status, missing handles</p>
                </div>
                <div className="p-2 bg-white border border-black shadow-[1px_1px_0px_0px_#000]">
                  <span className="font-bold text-black">mutateTeamStatus:</span>
                  <p className="text-neutral-600 mt-0.5">Promote teams to Confirmed or Checked-in</p>
                </div>
                <div className="p-2 bg-white border border-black shadow-[1px_1px_0px_0px_#000]">
                  <span className="font-bold text-black">summarizeStats:</span>
                  <p className="text-neutral-600 mt-0.5">Live counts, E.164 phone & vector health</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <h4 className="text-xs font-black uppercase text-neutral-600 mb-2">Quick Action Prompts</h4>
              <div className="space-y-2">
                {[
                  "Show teams from Heritage Institute",
                  "Summarize registration statistics",
                  "Promote pending unconfirmed teams to CONFIRMED",
                  "Audit phone numbers for E.164 compliance",
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="w-full text-left text-xs font-bold p-2.5 border-2 border-black bg-[#FFFDF5] hover:bg-[#FFE800] transition-colors flex items-center justify-between shadow-[2px_2px_0px_0px_#000]"
                  >
                    <span className="truncate">{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-[#FFE800]/30 border-2 border-black">
              <div className="text-xs font-black uppercase mb-1">Hackathon Track Target</div>
              <p className="text-xs font-medium text-neutral-800">
                Gemma 4 open-weights model powers natural language comprehension, operational tool selection, and multimodal credential checks in Capsker.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
