"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { NormalizedParticipant, CSVParseResult } from "@/types";
interface ParticipantsContextType {
  participants: NormalizedParticipant[];
  csvFileName: string | null;
  uploadStats: {
    validCount: number;
    errorCount: number;
    headersCount: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  eventId: string | null;
  setEventId: (eventId: string | null) => void;
  refreshParticipants: () => Promise<void>;
  setParticipantsData: (result: CSVParseResult, fileName?: string) => void;
  clearParticipants: () => void;
}
const ParticipantsContext = createContext<ParticipantsContextType | undefined>(
  undefined,
);
export function ParticipantsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [participants, setParticipants] = useState<NormalizedParticipant[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    validCount: number;
    errorCount: number;
    headersCount: number;
  } | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshParticipants = useCallback(async () => {
    if (!eventId) {
      setParticipants([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/participants?eventId=${encodeURIComponent(eventId)}`,
        { method: "GET", cache: "no-store" },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch participants");
      }
      const fetchedParticipants = Array.isArray(data.participants)
        ? data.participants
        : [];
      setParticipants(fetchedParticipants);
      setUploadStats({
        validCount: fetchedParticipants.length,
        errorCount: 0,
        headersCount: 0,
      });
    } catch (err) {
      console.error("Failed to load participants:", err);
      setParticipants([]);
      setError(
        err instanceof Error ? err.message : "Failed to load participants",
      );
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);
  useEffect(() => {
    const initializeEvent = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        if (data.events?.length > 0) {
          setEventId(data.events[0].id);
        }
      } catch (error) {
        console.error("Failed to initialize event:", error);
      }
    };

    void initializeEvent();
  }, []);
  useEffect(() => {
    void refreshParticipants();
  }, [refreshParticipants]);
  /* * Kept for compatibility with the existing CSV uploader/UI. * The CSV importer should persist the data through * /api/participants/import. */ const setParticipantsData =
    useCallback((result: CSVParseResult, fileName?: string) => {
      if (result.validRows.length === 0) {
        return;
      }
      setUploadStats({
        validCount: result.validRows.length,
        errorCount: result.invalidRows.length,
        headersCount: result.headers.length,
      });
      void refreshParticipants();
      if (fileName) {
        setCsvFileName(fileName);
      }
    }, [refreshParticipants]);
  const clearParticipants = useCallback(() => {
    setParticipants([]);
    setCsvFileName(null);
    setUploadStats(null);
    setError(null);
  }, []);
  const contextValue: ParticipantsContextType = {
    participants,
    csvFileName,
    uploadStats,
    isLoading,
    error,
    eventId,
    setEventId,
    refreshParticipants,
    setParticipantsData,
    clearParticipants,
  };
  return (
    <ParticipantsContext.Provider value={contextValue}>
      {" "}
      {children}{" "}
    </ParticipantsContext.Provider>
  );
}
const defaultContextValue: ParticipantsContextType = {
  participants: [],
  csvFileName: null,
  uploadStats: null,
  isLoading: false,
  error: null,
  eventId: null,
  setEventId: () => {},
  refreshParticipants: async () => {},
  setParticipantsData: () => {},
  clearParticipants: () => {},
};
export function useParticipants() {
  const context = useContext(ParticipantsContext);
  return context || defaultContextValue;
}
