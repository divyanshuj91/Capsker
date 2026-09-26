"use client";

import React, { useState, useRef } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardTitle, Button, Input, Badge } from "@/components/brutal";
import { TemplatePlaceholder } from "@/types";
import { SAMPLE_PARTICIPANTS } from "@/lib/data/sample";
import {
  Layers,
  Download,
  Eye,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";

export default function StudioPage() {
  const [selectedParticipantIdx, setSelectedParticipantIdx] = useState(0);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [activePlaceholderId, setActivePlaceholderId] = useState<string | null>("ph-1");
  const canvasRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const currentParticipant = SAMPLE_PARTICIPANTS[selectedParticipantIdx] || SAMPLE_PARTICIPANTS[0];

  const [placeholders, setPlaceholders] = useState<TemplatePlaceholder[]>([
    {
      id: "ph-1",
      field: "participantName",
      x: 40,
      y: 110,
      fontSize: 26,
      fontFamily: "Inter",
      fontWeight: "800",
      color: "#000000",
      textAlign: "left",
      textTransform: "uppercase",
    },
    {
      id: "ph-2",
      field: "teamName",
      x: 40,
      y: 155,
      fontSize: 16,
      fontFamily: "Inter",
      fontWeight: "bold",
      color: "#4B5563",
      textAlign: "left",
      textTransform: "none",
    },
    {
      id: "ph-3",
      field: "role",
      x: 40,
      y: 195,
      fontSize: 12,
      fontFamily: "Inter",
      fontWeight: "800",
      color: "#000000",
      textAlign: "left",
      textTransform: "uppercase",
    },
    {
      id: "ph-4",
      field: "institution",
      x: 40,
      y: 235,
      fontSize: 13,
      fontFamily: "Inter",
      fontWeight: "normal",
      color: "#000000",
      textAlign: "left",
      textTransform: "none",
    },
    {
      id: "ph-5",
      field: "qrCode",
      x: 320,
      y: 130,
      width: 100,
      height: 100,
      fontSize: 10,
      fontFamily: "Inter",
      fontWeight: "normal",
      color: "#000000",
      textAlign: "center",
    },
  ]);

  const updatePlaceholder = (id: string, updates: Partial<TemplatePlaceholder>) => {
    setPlaceholders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removePlaceholder = (id: string) => {
    setPlaceholders((prev) => prev.filter((p) => p.id !== id));
    if (activePlaceholderId === id) {
      setActivePlaceholderId(null);
    }
  };

  const addPlaceholder = () => {
    const newId = `ph-${Date.now()}`;
    const newPh: TemplatePlaceholder = {
      id: newId,
      field: "teamNumber",
      x: 50,
      y: 50,
      fontSize: 16,
      fontFamily: "Inter",
      fontWeight: "bold",
      color: "#000000",
      textAlign: "left",
    };
    setPlaceholders((prev) => [...prev, newPh]);
    setActivePlaceholderId(newId);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBgImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFieldValue = (field: TemplatePlaceholder["field"]) => {
    switch (field) {
      case "participantName":
        return currentParticipant.name;
      case "teamName":
        return currentParticipant.teamName;
      case "role":
        return currentParticipant.role;
      case "institution":
        return currentParticipant.institution || "Independent";
      case "teamNumber":
        return "TEAM #42";
      case "qrCode":
        return "QR_PAYLOAD";
      default:
        return "";
    }
  };

  return (
    <ProtectedRoute featureTitle="Visual Ticket & Badge Studio">
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <Layers className="w-8 h-8 text-black" />
            Visual Ticket & Badge Studio
          </h1>
          <p className="text-xs font-bold text-neutral-600 mt-1">
            Dynamic SVG/Canvas placeholder mapping with real-time attendee cycling and export engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBgUpload}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => bgInputRef.current?.click()}
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Upload Base Image
          </Button>

          <div className="flex items-center gap-1.5 bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000]">
            <span className="text-xs font-black px-1.5 text-neutral-600 uppercase">Preview:</span>
            <select
              value={selectedParticipantIdx}
              onChange={(e) => setSelectedParticipantIdx(Number(e.target.value))}
              aria-label="Preview badge for participant"
              className="text-xs font-bold bg-[#FFE800] border border-black px-2 py-0.5 outline-none"
            >
              {SAMPLE_PARTICIPANTS.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name} ({p.teamName})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => alert(`Batch export queued for ${SAMPLE_PARTICIPANTS.length} participants.`)}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export (.zip)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Badge Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 border-2 border-black bg-neutral-100 shadow-[6px_6px_0px_0px_#000]">
          <div className="mb-3 text-xs font-black uppercase flex items-center justify-between w-full max-w-[460px]">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> Live Rendered Badge (460 x 300)
            </span>
            {bgImage && (
              <button
                onClick={() => setBgImage(null)}
                className="text-[10px] text-[#FF66C4] underline font-bold"
              >
                Clear Background
              </button>
            )}
          </div>

          <div
            ref={canvasRef}
            id="badge-canvas"
            style={{
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="relative w-[460px] h-[300px] border-4 border-black bg-[#FFFDF5] shadow-[8px_8px_0px_0px_#000] overflow-hidden select-none"
          >
            {/* Default Header Graphic if no custom background */}
            {!bgImage && (
              <div className="bg-[#FFE800] border-b-2 border-black p-3 flex items-center justify-between">
                <div className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <span className="bg-black text-[#FFE800] px-1.5 py-0.5 text-[10px]">PASS</span>
                  CAPSKER 2026
                </div>
                <span className="font-mono text-xs font-bold border border-black px-1.5 bg-white">
                  ID-9821
                </span>
              </div>
            )}

            {/* Dynamic Placeholders rendered at exact coordinates */}
            {placeholders.map((ph) => {
              const isSelected = activePlaceholderId === ph.id;

              if (ph.field === "qrCode") {
                return (
                  <div
                    key={ph.id}
                    onClick={() => setActivePlaceholderId(ph.id)}
                    style={{ left: `${ph.x}px`, top: `${ph.y}px` }}
                    className={`absolute border-2 border-black bg-white p-2 flex flex-col items-center justify-center cursor-pointer transition-shadow ${
                      isSelected
                        ? "ring-2 ring-[#FFE800] shadow-[4px_4px_0px_0px_#000]"
                        : "shadow-[2px_2px_0px_0px_#000]"
                    }`}
                  >
                    <div className="w-20 h-20 bg-black flex items-center justify-center text-white text-[9px] font-mono text-center p-1 font-bold">
                      [QR VERIFY]
                      <br />
                      {currentParticipant.name.split(" ")[0]}
                    </div>
                    <span className="text-[8px] font-black uppercase mt-1 tracking-tight">SCAN ON SITE</span>
                  </div>
                );
              }

              return (
                <div
                  key={ph.id}
                  onClick={() => setActivePlaceholderId(ph.id)}
                  style={{
                    left: `${ph.x}px`,
                    top: `${ph.y}px`,
                    fontSize: `${ph.fontSize}px`,
                    color: ph.color,
                    fontWeight: ph.fontWeight === "800" ? 800 : ph.fontWeight === "bold" ? 700 : 400,
                    textTransform: ph.textTransform,
                  }}
                  className={`absolute cursor-pointer p-0.5 transition-all ${
                    isSelected
                      ? "outline outline-2 outline-black bg-[#FFE800]/30"
                      : "hover:outline-dashed hover:outline-1 hover:outline-black"
                  }`}
                >
                  {getFieldValue(ph.field)}
                </div>
              );
            })}

            {/* Bottom accent bar */}
            {!bgImage && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#00F084] border-t-2 border-black" />
            )}
          </div>
        </div>

        {/* Placeholders Coordinate Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-white">
            <CardTitle className="text-lg flex items-center justify-between mb-4">
              <span>Coordinate Layers</span>
              <Button size="sm" variant="primary" onClick={addPlaceholder}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Field
              </Button>
            </CardTitle>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {placeholders.map((ph) => {
                const isSelected = activePlaceholderId === ph.id;

                return (
                  <div
                    key={ph.id}
                    onClick={() => setActivePlaceholderId(ph.id)}
                    className={`border-2 border-black p-3 space-y-2 transition-all ${
                      isSelected
                        ? "bg-[#FFE800]/25 shadow-[4px_4px_0px_0px_#000]"
                        : "bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <select
                        value={ph.field}
                        onChange={(e) =>
                          updatePlaceholder(ph.id, {
                            field: e.target.value as TemplatePlaceholder["field"],
                          })
                        }
                        aria-label={`Field type for layer ${ph.id}`}
                        className="font-mono text-xs font-black uppercase bg-[#FFE800] px-2 py-0.5 border border-black outline-none"
                      >
                        <option value="participantName">participantName</option>
                        <option value="teamName">teamName</option>
                        <option value="role">role</option>
                        <option value="institution">institution</option>
                        <option value="teamNumber">teamNumber</option>
                        <option value="qrCode">qrCode</option>
                      </select>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePlaceholder(ph.id);
                        }}
                        className="p-1 text-black hover:text-[#FF66C4]"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-neutral-600">X (px)</label>
                        <Input
                          type="number"
                          className="h-8 text-xs"
                          value={ph.x}
                          onChange={(e) => updatePlaceholder(ph.id, { x: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-neutral-600">Y (px)</label>
                        <Input
                          type="number"
                          className="h-8 text-xs"
                          value={ph.y}
                          onChange={(e) => updatePlaceholder(ph.id, { y: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-neutral-600">Font Size</label>
                        <Input
                          type="number"
                          className="h-8 text-xs"
                          value={ph.fontSize}
                          onChange={(e) => updatePlaceholder(ph.id, { fontSize: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);
}
