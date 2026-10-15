"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardTitle, Button, Input, Badge } from "@/components/brutal";
import { Send, Mail, Shield, AlertCircle, RefreshCw } from "lucide-react";

import { useParticipants } from "@/lib/context/ParticipantsContext";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  _count: {
    teams: number;
    templates: number;
    emailLogs: number;
  };
}

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  baseImageUrl: string;
  width: number;
  height: number;
  fieldConfig: unknown;
  eventId: string;
}

interface DispatchLog {
  id: string;
  recipient: string;
  team: string;
  status: string;
  time: string;
}

export default function DispatcherPage() {
  const {
    participants,
    eventId,
    setEventId,
    isLoading: participantsLoading,
    error: participantsError,
    refreshParticipants,
  } = useParticipants();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);

  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [subject, setSubject] = useState(
    "Your Hackathon Pass & Check-In Details for {{team_name}}",
  );

  const [template, setTemplate] = useState(
    `Hi {{participant_name}},

Congratulations! Your team {{team_name}} has been confirmed for Capsker.

Please find your official badge and QR pass attached. Show this pass at the registration desk for instant check-in.

Best,
Hackathon Operations Team`,
  );

  const [recipientMode, setRecipientMode] = useState<"LEADERS" | "ALL">(
    "LEADERS",
  );

  const [isSending, setIsSending] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [logs, setLogs] = useState<DispatchLog[]>([]);

  /*
   * Load organizer's events.
   */
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      setError(null);

      try {
        const response = await fetch("/api/events", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load events");
        }

        const fetchedEvents = Array.isArray(data.events) ? data.events : [];

        setEvents(fetchedEvents);

        /*
         * Automatically select the first event
         * if no event is currently selected.
         */
        if (fetchedEvents.length > 0 && !eventId) {
          setEventId(fetchedEvents[0].id);
        }
      } catch (err) {
        console.error("Failed to load events:", err);

        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setIsLoadingEvents(false);
      }
    };

    void loadEvents();
  }, [eventId, setEventId]);

  /*
   * Load Studio ticket templates for
   * the currently selected event.
   */
  useEffect(() => {
    if (!eventId) {
      setTemplates([]);
      setSelectedTemplateId("");
      return;
    }

    const loadTemplates = async () => {
      setIsLoadingTemplates(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/templates?eventId=${encodeURIComponent(eventId)}&type=TICKET`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load ticket templates");
        }

        const fetchedTemplates = Array.isArray(data.templates)
          ? data.templates
          : [];

        setTemplates(fetchedTemplates);

        if (fetchedTemplates.length > 0) {
          setSelectedTemplateId(fetchedTemplates[0].id);
        } else {
          setSelectedTemplateId("");
        }
      } catch (err) {
        console.error("Failed to load templates:", err);

        setTemplates([]);
        setSelectedTemplateId("");

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load ticket templates",
        );
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    void loadTemplates();
  }, [eventId]);

  const handleEventChange = (nextEventId: string) => {
    setEventId(nextEventId);
    setSelectedTemplateId("");
  };

  const handleDispatch = async () => {
    if (!eventId) {
      alert("Please select an event.");
      return;
    }

    if (!selectedTemplateId) {
      alert("Please select a ticket template from Studio.");
      return;
    }

    if (participants.length === 0) {
      alert("No participants found for this event.");
      return;
    }

    if (!subject.trim()) {
      alert("Please enter an email subject.");
      return;
    }

    if (!template.trim()) {
      alert("Please enter an email body.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/email/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          templateId: selectedTemplateId,
          subject: subject.trim(),
          body: template,
          participantIds: participants.map((participant) => participant.id),
          recipientMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch emails");
      }

      alert(
        `${data.queued} email${
          data.queued === 1 ? "" : "s"
        } queued successfully.`,
      );

      /*
       * Refresh participants/log-related state
       * after dispatch.
       */
      await refreshParticipants();
    } catch (err) {
      console.error("Dispatch failed:", err);

      alert(err instanceof Error ? err.message : "Failed to dispatch emails");
    } finally {
      setIsSending(false);
    }
  };

  const selectedEvent = events.find((event) => event.id === eventId);

  const recipientCount =
    recipientMode === "LEADERS"
      ? participants.filter((participant) => participant.role === "LEADER")
          .length
      : participants.length;

  return (
    <ProtectedRoute featureTitle="Bulk Email Dispatcher">
      <div className="space-y-6">
        <div className="border-b-2 border-black pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <Send className="w-8 h-8 text-black" />
            Bulk Email Dispatcher & SMTP Engine
          </h1>

          <p className="text-xs font-bold text-neutral-600 mt-1">
            Dynamic variable interpolation, encrypted SMTP credentials,
            automated badge attachment, and rate-limited dispatch
          </p>
        </div>

        {error && (
          <div className="border-2 border-black bg-red-100 p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <Card className="bg-white space-y-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-black" />
                Dispatch Configuration
              </CardTitle>

              {/* EVENT */}
              <div>
                <label className="text-xs font-black uppercase text-neutral-700 block mb-1">
                  Event
                </label>

                <select
                  value={eventId || ""}
                  onChange={(e) => handleEventChange(e.target.value)}
                  disabled={isLoadingEvents}
                  className="w-full border-2 border-black bg-white p-2.5 text-sm font-bold shadow-[2px_2px_0px_0px_#000] outline-none focus:ring-2 focus:ring-[#FFE800]"
                >
                  <option value="">
                    {isLoadingEvents ? "Loading events..." : "Select an event"}
                  </option>

                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>

                {selectedEvent && (
                  <p className="text-[11px] text-neutral-500 font-medium mt-1">
                    {selectedEvent._count.teams} teams ·{" "}
                    {selectedEvent._count.templates} templates ·{" "}
                    {participants.length} participants
                  </p>
                )}
              </div>

              {/* STUDIO TEMPLATE */}
              <div>
                <label className="text-xs font-black uppercase text-neutral-700 block mb-1">
                  Ticket Template
                </label>

                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  disabled={!eventId || isLoadingTemplates}
                  className="w-full border-2 border-black bg-white p-2.5 text-sm font-bold shadow-[2px_2px_0px_0px_#000] outline-none focus:ring-2 focus:ring-[#FFE800]"
                >
                  <option value="">
                    {isLoadingTemplates
                      ? "Loading templates..."
                      : templates.length === 0
                        ? "No ticket templates found"
                        : "Select a ticket template"}
                  </option>

                  {templates.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <p className="text-[11px] text-neutral-500 font-medium mt-1">
                  The selected Studio template will be used by the worker to
                  generate each personalized ticket.
                </p>
              </div>

              {/* SUBJECT */}
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

              {/* RECIPIENT MODE */}
              <div>
                <label className="text-xs font-black uppercase text-neutral-700 block mb-1">
                  Send To
                </label>

                <select
                  value={recipientMode}
                  onChange={(e) =>
                    setRecipientMode(e.target.value as "LEADERS" | "ALL")
                  }
                  className="w-full border-2 border-black bg-white p-2.5 text-sm font-bold shadow-[2px_2px_0px_0px_#000] outline-none focus:ring-2 focus:ring-[#FFE800]"
                >
                  <option value="LEADERS">Team Leaders Only</option>

                  <option value="ALL">All Team Members</option>
                </select>

                <p className="text-[11px] text-neutral-500 font-medium mt-1">
                  {recipientMode === "LEADERS"
                    ? "Only the LEADER of each selected team will receive the email."
                    : "Every selected team member will receive the email."}
                </p>
              </div>

              {/* EMAIL BODY */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase text-neutral-700 block">
                    Body (Markdown & Variables)
                  </label>

                  <div className="flex gap-1 flex-wrap justify-end">
                    {[
                      "{{participant_name}}",
                      "{{team_name}}",
                      "{{team_number}}",
                      "{{role}}",
                      "{{institution}}",
                    ].map((tag) => (
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

              {/* ATTACHMENT */}
              <div className="p-3 bg-[#00F084]/20 border-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-black" />

                  <span className="text-xs font-bold text-black">
                    Auto-attach generated Pass / Badge from Studio
                  </span>
                </div>

                <Badge variant="confirmed">Active</Badge>
              </div>

              {/* STATUS */}
              <div className="border-2 border-black bg-[#FFFDF5] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase">
                    Recipients
                  </span>

                  <span className="text-lg font-black">
                    {participantsLoading ? "..." : recipientCount}
                  </span>
                </div>

                {participantsError && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">
                    {participantsError}
                  </p>
                )}
              </div>

              {/* DISPATCH */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-neutral-600">
                  Rate Limit: Max 30 emails / min
                </span>

                <Button
                  variant="primary"
                  size="md"
                  disabled={
                    isSending ||
                    !eventId ||
                    !selectedTemplateId ||
                    recipientCount === 0
                  }
                  onClick={handleDispatch}
                >
                  <Send className="w-4 h-4 mr-1.5" />

                  {isSending ? "Dispatching..." : "Trigger Batch Dispatch"}
                </Button>
              </div>
            </Card>
          </div>

          {/* LOGS */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="bg-white">
              <CardTitle className="text-sm font-black uppercase mb-3 flex items-center justify-between">
                <span>Live Dispatch Log</span>

                <button
                  type="button"
                  onClick={() => void refreshParticipants()}
                  className="p-1 border border-black hover:bg-[#FFE800]"
                  title="Refresh participants"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </CardTitle>

              {logs.length === 0 ? (
                <div className="border-2 border-dashed border-neutral-400 p-6 text-center">
                  <p className="text-xs font-bold text-neutral-500">
                    No dispatch logs loaded yet.
                  </p>

                  <p className="text-[11px] text-neutral-400 mt-1">
                    Email logs will be connected to the database next.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 border-2 border-black bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000] flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-black text-black truncate">
                          {log.recipient}
                        </p>

                        <p className="text-[11px] text-neutral-600 font-medium truncate">
                          {log.team}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge
                          variant={
                            log.status === "SENT" ? "confirmed" : "unconfirmed"
                          }
                        >
                          {log.status}
                        </Badge>

                        <span className="text-[10px] font-mono text-neutral-500">
                          {log.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
