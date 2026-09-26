"use client";

import React, { useState, useRef } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardTitle, Button, Input, Badge } from "@/components/brutal";
import { TemplatePlaceholder } from "@/types";
import { useParticipants } from "@/lib/context/ParticipantsContext";
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
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Type,
  Sliders,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Crop,
} from "lucide-react";

interface TemplateSizePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

const TEMPLATE_PRESETS: TemplateSizePreset[] = [
  { id: "classic-badge", name: "Classic Badge", width: 460, height: 300, description: "Standard conference landscape badge" },
  { id: "lanyard-vertical", name: "Lanyard Pass", width: 320, height: 480, description: "Vertical lanyard attendee pass" },
  { id: "ticket-stub", name: "Ticket Stub", width: 520, height: 220, description: "Perforated event ticket style" },
  { id: "square-pass", name: "Square Pass", width: 380, height: 380, description: "1:1 modern square attendee pass" },
  { id: "award-cert", name: "Award / Cert", width: 540, height: 340, description: "Wide landscape certificate format" },
];

interface FontOption {
  id: string;
  name: string;
  family: string;
  category: string;
}

const AVAILABLE_FONTS: FontOption[] = [
  { id: "Inter", name: "Inter", family: "'Inter', sans-serif", category: "Clean Sans" },
  { id: "Space Grotesk", name: "Space Grotesk", family: "'Space Grotesk', sans-serif", category: "Brutalist / Tech" },
  { id: "JetBrains Mono", name: "JetBrains Mono", family: "'JetBrains Mono', monospace", category: "Developer Code" },
  { id: "Montserrat", name: "Montserrat", family: "'Montserrat', sans-serif", category: "Modern Bold" },
  { id: "Syne", name: "Syne", family: "'Syne', sans-serif", category: "Geometric Display" },
  { id: "Playfair Display", name: "Playfair Display", family: "'Playfair Display', serif", category: "Editorial Serif" },
];

export default function StudioPage() {
  const [selectedParticipantIdx, setSelectedParticipantIdx] = useState(0);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [activePlaceholderId, setActivePlaceholderId] = useState<string | null>("ph-1");

  // Template Size Presets State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("classic-badge");
  const [canvasWidth, setCanvasWidth] = useState<number>(460);
  const [canvasHeight, setCanvasHeight] = useState<number>(300);
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);

  // Typography state
  const [globalFont, setGlobalFont] = useState<string>("Inter");

  // Background Repositioning and Scaling State
  const [bgPosX, setBgPosX] = useState<number>(0);
  const [bgPosY, setBgPosY] = useState<number>(0);
  const [bgScale, setBgScale] = useState<number>(100);
  const [bgFit, setBgFit] = useState<"cover" | "contain" | "stretch">("cover");
  const [bgOpacity, setBgOpacity] = useState<number>(100);
  const [showBgControls, setShowBgControls] = useState<boolean>(false);
  const [dragModeActive, setDragModeActive] = useState<boolean>(false);
  const [isDraggingBg, setIsDraggingBg] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number } | null>(null);

  const { participants } = useParticipants();
  const currentParticipant = participants[selectedParticipantIdx] || participants[0] || SAMPLE_PARTICIPANTS[0];

  const [placeholders, setPlaceholders] = useState<TemplatePlaceholder[]>([
    {
      id: "ph-1",
      field: "participantName",
      x: 36,
      y: 95,
      fontSize: 24,
      fontFamily: "Space Grotesk",
      fontWeight: "800",
      color: "#000000",
      textAlign: "left",
      textTransform: "uppercase",
    },
    {
      id: "ph-2",
      field: "teamName",
      x: 36,
      y: 135,
      fontSize: 15,
      fontFamily: "Inter",
      fontWeight: "bold",
      color: "#4B5563",
      textAlign: "left",
      textTransform: "none",
    },
    {
      id: "ph-3",
      field: "role",
      x: 36,
      y: 175,
      fontSize: 12,
      fontFamily: "JetBrains Mono",
      fontWeight: "800",
      color: "#000000",
      textAlign: "left",
      textTransform: "uppercase",
    },
    {
      id: "ph-4",
      field: "institution",
      x: 36,
      y: 215,
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
      x: 310,
      y: 95,
      width: 110,
      height: 110,
      fontSize: 10,
      fontFamily: "JetBrains Mono",
      fontWeight: "bold",
      color: "#000000",
      textAlign: "center",
    },
  ]);

  const handlePresetSelect = (preset: TemplateSizePreset) => {
    setSelectedPresetId(preset.id);
    setIsCustomSize(false);
    setCanvasWidth(preset.width);
    setCanvasHeight(preset.height);
  };

  const handleCustomSizeSelect = () => {
    setSelectedPresetId("custom");
    setIsCustomSize(true);
  };

  const applyGlobalFontToAll = (fontId: string) => {
    setGlobalFont(fontId);
    setPlaceholders((prev) =>
      prev.map((p) => ({
        ...p,
        fontFamily: fontId,
      }))
    );
  };

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
      x: 40,
      y: 40,
      fontSize: 16,
      fontFamily: globalFont,
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
        setShowBgControls(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBgTransform = () => {
    setBgPosX(0);
    setBgPosY(0);
    setBgScale(100);
    setBgFit("cover");
    setBgOpacity(100);
  };

  const nudgeBg = (deltaX: number, deltaY: number) => {
    setBgPosX((prev) => prev + deltaX);
    setBgPosY((prev) => prev + deltaY);
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (!bgImage || !dragModeActive) return;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: bgPosX,
      initialPosY: bgPosY,
    };
    setIsDraggingBg(true);
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!isDraggingBg || !dragStartRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    setBgPosX(Math.round(dragStartRef.current.initialPosX + deltaX));
    setBgPosY(Math.round(dragStartRef.current.initialPosY + deltaY));
  };

  const handleMouseUpCanvas = () => {
    setIsDraggingBg(false);
    dragStartRef.current = null;
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
        return currentParticipant.institution || "Independent Hacker";
      case "teamNumber":
        return "TABLE #42";
      case "qrCode":
        return "QR_PAYLOAD";
      default:
        return "";
    }
  };

  const activePlaceholder = placeholders.find((p) => p.id === activePlaceholderId);

  return (
    <ProtectedRoute featureTitle="Visual Ticket & Badge Studio">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <Layers className="w-8 h-8 text-black" />
              Visual Ticket &amp; Badge Studio
            </h1>
            <p className="text-xs font-bold text-neutral-600 mt-1">
              Customize ticket formats, typography, background artwork positioning, and dynamic coordinate layers
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
              {bgImage ? "Replace Background" : "Upload Base Image"}
            </Button>

            {bgImage && (
              <Button
                variant={showBgControls ? "primary" : "secondary"}
                size="sm"
                onClick={() => setShowBgControls(!showBgControls)}
              >
                <Sliders className="w-3.5 h-3.5 mr-1" />
                {showBgControls ? "Hide Controls" : "Reposition Background"}
              </Button>
            )}

            <div className="flex items-center gap-1.5 bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-xs font-black px-1.5 text-neutral-600 uppercase">Preview:</span>
              <select
                value={selectedParticipantIdx}
                onChange={(e) => setSelectedParticipantIdx(Number(e.target.value))}
                aria-label="Preview badge for participant"
                className="text-xs font-bold bg-[#FFE800] border border-black px-2 py-0.5 outline-none"
              >
                {participants.map((p, idx) => (
                  <option key={idx} value={idx}>
                    {p.name} ({p.teamName})
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => alert(`Batch export queued for ${participants.length} participants at ${canvasWidth}x${canvasHeight}px.`)}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Export (.zip)
            </Button>
          </div>
        </div>

        {/* Unified Studio Control Toolbar */}
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-wrap items-center justify-between gap-4">
          {/* Format Selection Group */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
              <Crop className="w-4 h-4 text-black" />
              <span>Format:</span>
            </div>

            <div className="relative">
              <select
                value={isCustomSize ? "custom" : selectedPresetId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "custom") {
                    handleCustomSizeSelect();
                  } else {
                    const preset = TEMPLATE_PRESETS.find((p) => p.id === val);
                    if (preset) handlePresetSelect(preset);
                  }
                }}
                aria-label="Select badge format preset"
                className="text-xs font-black bg-[#FFE800] border-2 border-black pl-3 pr-8 py-1.5 shadow-[2px_2px_0px_0px_#000] outline-none cursor-pointer appearance-none uppercase"
              >
                {TEMPLATE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-black font-bold">
                    {p.name} ({p.width} × {p.height})
                  </option>
                ))}
                <option value="custom" className="bg-white text-black font-bold">
                  Custom Dimensions...
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black stroke-[3]" />
            </div>

            {/* Quick-switch preset buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-[#FFFDF5] border border-black p-0.5">
              {TEMPLATE_PRESETS.map((p) => {
                const isActive = !isCustomSize && selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePresetSelect(p)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-all ${
                      isActive
                        ? "bg-black text-[#FFE800]"
                        : "bg-transparent text-black hover:bg-black/5"
                    }`}
                  >
                    {p.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>

            {/* Custom dimension inputs when active */}
            {isCustomSize && (
              <div className="flex items-center gap-1.5 bg-[#FFFDF5] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000]">
                <span className="text-[10px] font-black uppercase text-neutral-600">W:</span>
                <input
                  type="number"
                  min={200}
                  max={1000}
                  value={canvasWidth}
                  onChange={(e) => setCanvasWidth(Math.max(100, Number(e.target.value)))}
                  className="w-14 text-xs font-mono font-bold px-1 py-0.5 border border-black outline-none bg-white"
                  aria-label="Custom width"
                />
                <span className="text-xs font-black">×</span>
                <span className="text-[10px] font-black uppercase text-neutral-600">H:</span>
                <input
                  type="number"
                  min={150}
                  max={1000}
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(Math.max(100, Number(e.target.value)))}
                  className="w-14 text-xs font-mono font-bold px-1 py-0.5 border border-black outline-none bg-white"
                  aria-label="Custom height"
                />
                <span className="text-[10px] font-mono font-bold text-neutral-500">px</span>
              </div>
            )}
          </div>

          {/* Typography & Dimensions Group */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
              <Type className="w-4 h-4 text-black" />
              <span>Font:</span>
            </div>

            <div className="relative">
              <select
                value={globalFont}
                onChange={(e) => setGlobalFont(e.target.value)}
                aria-label="Choose font family"
                className="text-xs font-bold bg-white border-2 border-black pl-3 pr-8 py-1.5 shadow-[2px_2px_0px_0px_#000] outline-none cursor-pointer appearance-none"
              >
                {AVAILABLE_FONTS.map((font) => (
                  <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
                    {font.name} — {font.category}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black stroke-[3]" />
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => applyGlobalFontToAll(globalFont)}
              title="Apply this font family across all dynamic badge layers"
              className="text-xs whitespace-nowrap"
            >
              Apply All
            </Button>

            <span className="text-[11px] font-mono font-black bg-[#00F084] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
              {canvasWidth} × {canvasHeight} PX
            </span>
          </div>
        </div>

        {/* Background Repositioning Panel (expandable) */}
        {bgImage && showBgControls && (
          <div className="bg-[#FFFDF5] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-[#FFE800] border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000]">
                  <Sliders className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    Background Artwork Repositioning &amp; Scaling
                  </h3>
                  <p className="text-[11px] font-bold text-neutral-600">
                    Nudge offsets, scale/zoom, fit mode, and fine-tune background layer opacity
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={dragModeActive ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setDragModeActive(!dragModeActive)}
                  title="Click and drag on the canvas to reposition background"
                >
                  <Move className="w-3.5 h-3.5 mr-1" />
                  {dragModeActive ? "Canvas Drag: Active" : "Enable Canvas Drag"}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetBgTransform}
                  title="Reset offset and zoom to initial state"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset Artwork
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nudge D-Pad Controls */}
              <div className="border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col items-center justify-center">
                <span className="text-[10px] font-black uppercase text-neutral-600 mb-2">
                  Tactile Nudge (±10px)
                </span>
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => nudgeBg(0, -10)}
                    className="p-1.5 bg-[#FFFDF5] hover:bg-[#FFE800] border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
                    title="Nudge Up"
                    aria-label="Nudge background up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => nudgeBg(-10, 0)}
                      className="p-1.5 bg-[#FFFDF5] hover:bg-[#FFE800] border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5"
                      title="Nudge Left"
                      aria-label="Nudge background left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-7 h-7 bg-black text-[#FFE800] flex items-center justify-center font-mono text-[9px] font-bold">
                      POS
                    </div>
                    <button
                      onClick={() => nudgeBg(10, 0)}
                      className="p-1.5 bg-[#FFFDF5] hover:bg-[#FFE800] border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5"
                      title="Nudge Right"
                      aria-label="Nudge background right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => nudgeBg(0, 10)}
                    className="p-1.5 bg-[#FFFDF5] hover:bg-[#FFE800] border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
                    title="Nudge Down"
                    aria-label="Nudge background down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Offset Position Sliders */}
              <div className="border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-neutral-600">
                    Horizontal Offset (X)
                  </label>
                  <span className="font-mono text-xs font-bold">{bgPosX}px</span>
                </div>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="2"
                  value={bgPosX}
                  onChange={(e) => setBgPosX(Number(e.target.value))}
                  aria-label="Background horizontal offset"
                  className="w-full accent-black cursor-pointer"
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="text-[10px] font-black uppercase text-neutral-600">
                    Vertical Offset (Y)
                  </label>
                  <span className="font-mono text-xs font-bold">{bgPosY}px</span>
                </div>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="2"
                  value={bgPosY}
                  onChange={(e) => setBgPosY(Number(e.target.value))}
                  aria-label="Background vertical offset"
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Scale / Zoom and Opacity */}
              <div className="border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-neutral-600 flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" /> Zoom Scale
                  </label>
                  <span className="font-mono text-xs font-bold">{bgScale}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="250"
                  step="5"
                  value={bgScale}
                  onChange={(e) => setBgScale(Number(e.target.value))}
                  aria-label="Background zoom scale"
                  className="w-full accent-black cursor-pointer"
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="text-[10px] font-black uppercase text-neutral-600">
                    Opacity
                  </label>
                  <span className="font-mono text-xs font-bold">{bgOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(Number(e.target.value))}
                  aria-label="Background opacity"
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Fit Mode */}
              <div className="border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-600 block mb-2">
                    Artwork Fit Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["cover", "contain", "stretch"] as const).map((fit) => (
                      <button
                        key={fit}
                        onClick={() => setBgFit(fit)}
                        className={`text-[11px] font-black uppercase py-1.5 border-2 border-black transition-all ${
                          bgFit === fit
                            ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5"
                            : "bg-[#FFFDF5] hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000]"
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono text-neutral-500 block">
                    Mode: {bgFit} | Center: ({bgPosX}, {bgPosY})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Work Area: Canvas Preview & Layer Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Badge Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 border-2 border-black bg-neutral-100 shadow-[6px_6px_0px_0px_#000] overflow-x-auto">
            <div
              className="mb-3 text-xs font-black uppercase flex items-center justify-between w-full"
              style={{ maxWidth: `${Math.max(canvasWidth, 380)}px` }}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> Live Rendered Pass ({canvasWidth} × {canvasHeight} PX)
              </span>
              <div className="flex items-center gap-3">
                {bgImage && (
                  <button
                    onClick={() => setShowBgControls(!showBgControls)}
                    className="text-[10px] text-black underline font-bold"
                  >
                    {showBgControls ? "Hide Controls" : "Adjust Artwork"}
                  </button>
                )}
                {bgImage && (
                  <button
                    onClick={() => {
                      setBgImage(null);
                      setShowBgControls(false);
                      setDragModeActive(false);
                      resetBgTransform();
                    }}
                    className="text-[10px] text-[#FF66C4] underline font-bold"
                  >
                    Clear Background
                  </button>
                )}
              </div>
            </div>

            {/* Canvas Outer Wrapper */}
            <div
              ref={canvasRef}
              id="badge-canvas"
              onMouseDown={handleMouseDownCanvas}
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpCanvas}
              onMouseLeave={handleMouseUpCanvas}
              style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                cursor: dragModeActive && bgImage ? (isDraggingBg ? "grabbing" : "grab") : "default",
              }}
              className="relative border-4 border-black bg-[#FFFDF5] shadow-[8px_8px_0px_0px_#000] overflow-hidden select-none flex-shrink-0 transition-[width,height] duration-200"
            >
              {/* Background Image Layer with Fine Repositioning & Scaling */}
              {bgImage && (
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{
                    opacity: bgOpacity / 100,
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundPosition: `calc(50% + ${bgPosX}px) calc(50% + ${bgPosY}px)`,
                      backgroundSize: bgFit === "stretch" ? "100% 100%" : bgFit,
                      backgroundRepeat: "no-repeat",
                      transform: `scale(${bgScale / 100})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              )}

              {/* Default Graphic header if no custom background */}
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

              {/* Ticket Stub perforation divider line when template is ticket-stub and no bg */}
              {!bgImage && selectedPresetId === "ticket-stub" && (
                <div className="absolute right-[130px] top-0 bottom-0 border-r-2 border-dashed border-black flex flex-col justify-between py-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-100 border-2 border-black -mr-1.5" />
                  <div className="w-3 h-3 rounded-full bg-neutral-100 border-2 border-black -mr-1.5" />
                </div>
              )}

              {/* Dynamic Placeholders rendered with custom font families and coordinates */}
              {placeholders.map((ph) => {
                const isSelected = activePlaceholderId === ph.id;
                const fontOption = AVAILABLE_FONTS.find((f) => f.id === ph.fontFamily);
                const fontFamilyCss = fontOption ? fontOption.family : `'${ph.fontFamily}', sans-serif`;

                if (ph.field === "qrCode") {
                  return (
                    <div
                      key={ph.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePlaceholderId(ph.id);
                      }}
                      style={{
                        left: `${ph.x}px`,
                        top: `${ph.y}px`,
                        fontFamily: fontFamilyCss,
                      }}
                      className={`absolute border-2 border-black bg-white p-2 flex flex-col items-center justify-center cursor-pointer transition-shadow z-10 ${
                        isSelected
                          ? "ring-2 ring-[#FFE800] shadow-[4px_4px_0px_0px_#000]"
                          : "shadow-[2px_2px_0px_0px_#000]"
                      }`}
                    >
                      <div className="w-16 h-16 bg-black flex items-center justify-center text-white text-[8px] font-mono text-center p-1 font-bold">
                        [QR VERIFY]
                        <br />
                        {currentParticipant.name.split(" ")[0]}
                      </div>
                      <span className="text-[7px] font-black uppercase mt-1 tracking-tight">SCAN ON SITE</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={ph.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePlaceholderId(ph.id);
                    }}
                    style={{
                      left: `${ph.x}px`,
                      top: `${ph.y}px`,
                      fontSize: `${ph.fontSize}px`,
                      color: ph.color,
                      fontFamily: fontFamilyCss,
                      fontWeight: ph.fontWeight === "800" ? 800 : ph.fontWeight === "bold" ? 700 : 400,
                      textTransform: ph.textTransform,
                      textAlign: ph.textAlign,
                    }}
                    className={`absolute cursor-pointer p-0.5 transition-all z-10 ${
                      isSelected
                        ? "outline outline-2 outline-black bg-[#FFE800]/30 shadow-[1px_1px_0px_0px_#000]"
                        : "hover:outline-dashed hover:outline-1 hover:outline-black"
                    }`}
                  >
                    {getFieldValue(ph.field)}
                  </div>
                );
              })}

              {/* Bottom accent bar if no custom background */}
              {!bgImage && (
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#00F084] border-t-2 border-black" />
              )}

              {/* Drag indicator badge if drag mode is active */}
              {dragModeActive && bgImage && (
                <div className="absolute top-2 right-2 bg-black text-[#FFE800] border border-black text-[10px] font-mono px-2 py-0.5 pointer-events-none z-20">
                  DRAG CANVAS TO NUDGE ARTWORK
                </div>
              )}
            </div>
          </div>

          {/* Placeholders Coordinate & Typography Inspector */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="bg-white">
              <CardTitle className="text-lg flex items-center justify-between mb-4">
                <span className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-black" />
                  Coordinate &amp; Font Layers
                </span>
                <Button size="sm" variant="primary" onClick={addPlaceholder}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Layer
                </Button>
              </CardTitle>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {placeholders.map((ph) => {
                  const isSelected = activePlaceholderId === ph.id;

                  return (
                    <div
                      key={ph.id}
                      onClick={() => setActivePlaceholderId(ph.id)}
                      className={`border-2 border-black p-3 space-y-3 transition-all ${
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

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-neutral-500 font-bold">
                            #{ph.id}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlaceholder(ph.id);
                            }}
                            className="p-1 text-black hover:text-[#FF66C4]"
                            title="Delete Layer"
                            aria-label={`Delete layer ${ph.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Font Family selector for this layer */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-neutral-600 block mb-1">
                          Font Family
                        </label>
                        <select
                          value={ph.fontFamily}
                          onChange={(e) => updatePlaceholder(ph.id, { fontFamily: e.target.value })}
                          aria-label={`Font family for layer ${ph.id}`}
                          className="w-full text-xs font-bold bg-white border border-black px-2 py-1 outline-none"
                        >
                          {AVAILABLE_FONTS.map((f) => (
                            <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                              {f.name} ({f.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Coordinates & Size Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-black uppercase text-neutral-600">X (px)</label>
                          <Input
                            type="number"
                            className="h-8 text-xs font-mono font-bold"
                            value={ph.x}
                            onChange={(e) => updatePlaceholder(ph.id, { x: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-neutral-600">Y (px)</label>
                          <Input
                            type="number"
                            className="h-8 text-xs font-mono font-bold"
                            value={ph.y}
                            onChange={(e) => updatePlaceholder(ph.id, { y: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-neutral-600">Size (px)</label>
                          <Input
                            type="number"
                            className="h-8 text-xs font-mono font-bold"
                            value={ph.fontSize}
                            onChange={(e) => updatePlaceholder(ph.id, { fontSize: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      {/* Styling: Weight, Color, Transform */}
                      {ph.field !== "qrCode" && (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div>
                            <label className="text-[10px] font-black uppercase text-neutral-600 block mb-0.5">
                              Weight
                            </label>
                            <select
                              value={ph.fontWeight}
                              onChange={(e) =>
                                updatePlaceholder(ph.id, {
                                  fontWeight: e.target.value as "normal" | "bold" | "800",
                                })
                              }
                              aria-label={`Font weight for layer ${ph.id}`}
                              className="w-full text-xs font-bold bg-white border border-black px-1.5 py-1 outline-none"
                            >
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                              <option value="800">Black (800)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-neutral-600 block mb-0.5">
                              Case
                            </label>
                            <select
                              value={ph.textTransform || "none"}
                              onChange={(e) =>
                                updatePlaceholder(ph.id, {
                                  textTransform: e.target.value as "none" | "uppercase" | "capitalize",
                                })
                              }
                              aria-label={`Text casing for layer ${ph.id}`}
                              className="w-full text-xs font-bold bg-white border border-black px-1.5 py-1 outline-none"
                            >
                              <option value="none">Normal</option>
                              <option value="uppercase">UPPER</option>
                              <option value="capitalize">Capitalize</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-neutral-600 block mb-0.5">
                              Color
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="color"
                                value={ph.color.startsWith("#") ? ph.color : "#000000"}
                                onChange={(e) => updatePlaceholder(ph.id, { color: e.target.value })}
                                aria-label={`Color picker for layer ${ph.id}`}
                                className="w-7 h-7 p-0 border border-black cursor-pointer bg-white"
                              />
                              <input
                                type="text"
                                value={ph.color}
                                onChange={(e) => updatePlaceholder(ph.id, { color: e.target.value })}
                                aria-label={`Hex color for layer ${ph.id}`}
                                className="w-full text-[11px] font-mono font-bold border border-black px-1 py-1 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
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
