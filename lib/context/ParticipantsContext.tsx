"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NormalizedParticipant, CSVParseResult } from "@/types";
import { SAMPLE_PARTICIPANTS } from "@/lib/data/sample";

interface ParticipantsContextType {
  participants: NormalizedParticipant[];
  csvFileName: string | null;
  uploadStats: { validCount: number; errorCount: number; headersCount: number } | null;
  setParticipantsData: (result: CSVParseResult, fileName?: string) => void;
  resetToSampleData: () => void;
}

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(undefined);

const STORAGE_KEY = "capsker_participants_data_v1";
const FILE_STORAGE_KEY = "capsker_participants_filename_v1";

export function ParticipantsProvider({ children }: { children: React.ReactNode }) {
  const [participants, setParticipants] = useState<NormalizedParticipant[]>(SAMPLE_PARTICIPANTS);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    validCount: number;
    errorCount: number;
    headersCount: number;
  } | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedFileName = localStorage.getItem(FILE_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setParticipants(parsed);
          setUploadStats({
            validCount: parsed.length,
            errorCount: 0,
            headersCount: 0,
          });
        }
      }
      if (savedFileName) {
        setCsvFileName(savedFileName);
      }
    } catch (e) {
      console.error("Failed to load saved participants:", e);
    }
  }, []);

  const setParticipantsData = (result: CSVParseResult, fileName?: string) => {
    if (result.validRows.length > 0) {
      setParticipants(result.validRows);
      setUploadStats({
        validCount: result.validRows.length,
        errorCount: result.invalidRows.length,
        headersCount: result.headers.length,
      });
      if (fileName) {
        setCsvFileName(fileName);
        try {
          localStorage.setItem(FILE_STORAGE_KEY, fileName);
        } catch {}
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.validRows));
      } catch (e) {
        console.error("Failed to persist participants to localStorage:", e);
      }
    }
  };

  const resetToSampleData = () => {
    setParticipants(SAMPLE_PARTICIPANTS);
    setCsvFileName(null);
    setUploadStats(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FILE_STORAGE_KEY);
    } catch {}
  };

  return (
    <ParticipantsContext.Provider
      value={{
        participants,
        csvFileName,
        uploadStats,
        setParticipantsData,
        resetToSampleData,
      }}
    >
      {children}
    </ParticipantsContext.Provider>
  );
}

export function useParticipants() {
  const context = useContext(ParticipantsContext);
  if (!context) {
    throw new Error("useParticipants must be used within a ParticipantsProvider");
  }
  return context;
}
