"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { usePlayerEngine } from "./player-engine";
import type { PraharId } from "@/lib/types";

// Radio channels mapped to sacred Prahars
export interface RadioStation {
  id: "auto" | "all" | PraharId;
  frequency: number; // in MHz
  label: string;
  hindiName: string;
  timeSlot: string;
  raagHints: string;
  icon: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "auto",
    frequency: 87.5,
    label: "LIVE AUTO",
    hindiName: "🔴 वर्तमान प्रहर",
    timeSlot: "IST Live Sync",
    raagHints: "समय चक्र अनुसार स्वतः ट्यूनिंग",
    icon: "📡",
  },
  {
    id: "dawn",
    frequency: 88.5,
    label: "88.5 FM",
    hindiName: "उषाकाल (ब्रह्म मुहूर्त)",
    timeSlot: "03:00 - 06:00",
    raagHints: "ललित, प्रभाती, भैरवी",
    icon: "🌌",
  },
  {
    id: "morning",
    frequency: 91.0,
    label: "91.0 FM",
    hindiName: "प्रातः प्रहर",
    timeSlot: "06:00 - 09:00",
    raagHints: "भैरव, तोड़ी, बिलावल",
    icon: "🌅",
  },
  {
    id: "late-morning",
    frequency: 94.0,
    label: "94.0 FM",
    hindiName: "मध्याह्न पूर्व",
    timeSlot: "09:00 - 12:00",
    raagHints: "जौनपुरी, आसावरी",
    icon: "☀️",
  },
  {
    id: "afternoon",
    frequency: 97.0,
    label: "97.0 FM",
    hindiName: "मध्याह्न प्रहर",
    timeSlot: "12:00 - 15:00",
    raagHints: "सारंग अंग, शुद्ध सारंग",
    icon: "🌤️",
  },
  {
    id: "late-afternoon",
    frequency: 100.0,
    label: "100.0 FM",
    hindiName: "अपराह्न प्रहर",
    timeSlot: "15:00 - 18:00",
    raagHints: "भीमपलासी, मुल्तानी",
    icon: "🌇",
  },
  {
    id: "evening",
    frequency: 103.5,
    label: "103.5 FM",
    hindiName: "सांध्य प्रहर (संध्या)",
    timeSlot: "18:00 - 21:00",
    raagHints: "यमन, भूपाली, पूरिया",
    icon: "🪔",
  },
  {
    id: "night",
    frequency: 106.0,
    label: "106.0 FM",
    hindiName: "रात्रि प्रहर",
    timeSlot: "21:00 - 00:00",
    raagHints: "काफी, बागेश्री, खमाज",
    icon: "🌙",
  },
  {
    id: "late-night",
    frequency: 108.0,
    label: "108.0 FM",
    hindiName: "मध्य रात्रि",
    timeSlot: "00:00 - 03:00",
    raagHints: "मालकौंस, दरबारी",
    icon: "✨",
  },
  {
    id: "all",
    frequency: 108.8,
    label: "108.8 FM",
    hindiName: "सर्वकालिक संगीत",
    timeSlot: "All Day",
    raagHints: "सभी राग एवं भजन",
    icon: "📜",
  },
];

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function RadioPlayer() {
  const {
    track,
    playing,
    toggle,
    next,
    prev,
    muted,
    toggleMute,
    currentTime,
    duration,
    seek,
    selectedPrahar,
    setSelectedPrahar,
    currentPrahar,
    activeTracks,
    setRaagModalTrack,
  } = usePlayerEngine();

  const tunerScrollRef = useRef<HTMLDivElement>(null);
  const [knobRotation, setKnobRotation] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Monitor scroll boundaries
  const checkScroll = useCallback(() => {
    const el = tunerScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = tunerScrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollByAmount = useCallback((amount: number) => {
    if (tunerScrollRef.current) {
      tunerScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  }, []);

  // Mouse drag-to-scroll support
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tunerScrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - tunerScrollRef.current.offsetLeft;
    startScrollLeftRef.current = tunerScrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !tunerScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - tunerScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    tunerScrollRef.current.scrollLeft = startScrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!tunerScrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      tunerScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Active station calculation
  const activeStation = useMemo(() => {
    return RADIO_STATIONS.find((s) => s.id === selectedPrahar) || RADIO_STATIONS[0];
  }, [selectedPrahar]);

  // Current dial needle percentage across FM 87.0 - 109.0 MHz scale
  const needlePercent = useMemo(() => {
    const minFreq = 87.0;
    const maxFreq = 109.0;
    const currentFreq =
      selectedPrahar === "auto"
        ? (RADIO_STATIONS.find((s) => s.id === currentPrahar.id)?.frequency ?? 103.5)
        : activeStation.frequency;
    const clamped = Math.min(maxFreq, Math.max(minFreq, currentFreq));
    return ((clamped - minFreq) / (maxFreq - minFreq)) * 100;
  }, [selectedPrahar, currentPrahar.id, activeStation]);

  // Handle station selection
  const handleSelectStation = useCallback(
    (station: RadioStation) => {
      setKnobRotation((prev) => prev + 45);
      setSelectedPrahar(station.id);
    },
    [setSelectedPrahar]
  );

  // Track seek bar interaction
  const trackSeekRef = useRef<HTMLDivElement | null>(null);
  const [dragTime, setDragTime] = useState<number | null>(null);

  const calculateSeekTime = useCallback(
    (clientX: number) => {
      const el = trackSeekRef.current;
      if (!el || duration <= 0) return 0;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragTime(calculateSeekTime(e.clientX));
    },
    [calculateSeekTime]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragTime === null) return;
      setDragTime(calculateSeekTime(e.clientX));
    },
    [dragTime, calculateSeekTime]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragTime === null) return;
      seek(dragTime);
      setDragTime(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    [dragTime, seek]
  );

  const displayTime = dragTime ?? currentTime;
  const progressRatio = duration > 0 ? Math.min(1, displayTime / duration) : 0;

  // Active frequency string
  const activeFreqString = useMemo(() => {
    if (selectedPrahar === "auto") {
      const freq = RADIO_STATIONS.find((s) => s.id === currentPrahar.id)?.frequency ?? 103.5;
      return `${freq.toFixed(1)} MHz`;
    }
    return `${activeStation.frequency.toFixed(1)} MHz`;
  }, [selectedPrahar, currentPrahar.id, activeStation]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      {/* ── Outer Retro Radio Cabinet (Pure CSS) ── */}
      <div className="relative w-full flex flex-col items-center">
        {/* Vintage Top Handle */}
        <div className="w-36 xs:w-48 sm:w-56 h-3.5 sm:h-4.5 rounded-t-xl bg-gradient-to-b from-[#4a2e1b] via-[#2d1a0e] to-[#1a0e07] border-t-2 border-x-2 border-amber-700/60 shadow-md flex items-center justify-between px-3 relative z-10">
          <span className="w-2 h-2 rounded-full bg-amber-600/80 border border-amber-400/40" />
          <span className="h-[2px] w-20 sm:w-32 bg-amber-600/30" />
          <span className="w-2 h-2 rounded-full bg-amber-600/80 border border-amber-400/40" />
        </div>

        {/* Main Solid Wooden / Bakelite Radio Body */}
        <div
          className="w-full rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 border-2 sm:border-4 border-[#7a4823] shadow-[0_25px_65px_-12px_rgba(0,0,0,0.98),inset_0_2px_4px_rgba(255,215,0,0.25)] relative overflow-hidden"
          style={{
            background:
              "linear-gradient(150deg, #2c180e 0%, #1c0e07 35%, #130a05 70%, #0d0603 100%)",
          }}
        >
          {/* Subtle woodgrain / chassis texture lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Golden metallic inner bezel rim */}
          <div className="absolute inset-2 sm:inset-3 rounded-[24px] sm:rounded-[30px] border border-amber-500/25 pointer-events-none" />

          {/* ── Header: Radio Brand Badge & Stereo Status ── */}
          <div className="relative z-10 flex items-center justify-between border-b border-amber-900/40 pb-2.5 mb-3 px-1 sm:px-2">
            {/* Stereo Tuned Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  playing
                    ? "bg-red-500 radio-led-active shadow-[0_0_10px_rgba(239,68,68,1)]"
                    : "bg-red-950 opacity-40"
                }`}
              />
              <span className="font-utility text-[10px] sm:text-[11px] font-bold tracking-wider text-amber-200/90 uppercase">
                {playing ? "STEREO • ON AIR" : "FM RECEIVER"}
              </span>
            </div>

            {/* Vintage Center Brass Nameplate */}
            <div className="px-3 sm:px-4 py-0.5 rounded-md bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 text-neutral-950 font-utility font-black text-[10px] sm:text-[11px] tracking-widest shadow-md uppercase select-none">
              MUSIC MAALA RADIO
            </div>

            {/* Live Frequency Badge */}
            <div className="font-mono text-amber-400 font-bold text-xs sm:text-sm tabular tracking-wide drop-shadow-[0_0_6px_rgba(245,176,65,0.7)]">
              {activeFreqString}
            </div>
          </div>

          {/* ── Upper Section: Speaker Grilles & Glowing Frequency Dial ── */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center mb-4">
            {/* Left Circular Speaker Grille (Hidden on tiny screens, prominent on md) */}
            <div className="hidden md:flex md:col-span-3 items-center justify-center">
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full border-4 border-amber-700/60 bg-[#120804] shadow-inner flex items-center justify-center overflow-hidden">
                {/* Speaker Mesh Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#b45309_1.5px,transparent_1.5px)] [background-size:6px_6px] opacity-60" />
                {/* Pulsing Speaker Core */}
                <div
                  className={`w-12 h-12 rounded-full border-2 border-amber-600/40 bg-gradient-to-br from-amber-950 to-black transition-transform duration-300 ${
                    playing ? "scale-105 shadow-[0_0_15px_rgba(245,176,65,0.4)]" : "scale-100"
                  }`}
                />
              </div>
            </div>

            {/* Center: Analog Backlit Frequency Dial Glass Window */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <div
                className="relative w-full h-16 sm:h-20 rounded-xl border-2 border-amber-600/50 p-2 overflow-hidden flex flex-col justify-between shadow-[inset_0_0_15px_rgba(0,0,0,0.9),0_0_15px_rgba(245,176,65,0.2)]"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(254, 240, 138, 0.22) 0%, rgba(217, 119, 6, 0.15) 50%, rgba(10, 5, 2, 0.85) 100%)",
                }}
              >
                {/* Frequency Dial Needle (Glowing Red) */}
                <div
                  className="absolute top-0 bottom-0 w-[3px] bg-red-600 shadow-[0_0_10px_rgba(239,68,68,1)] rounded-full transition-all duration-500 ease-out z-20 pointer-events-none"
                  style={{ left: `${needlePercent}%` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 absolute -top-0.5 -left-[2px]" />
                </div>

                {/* Top Ruler: FM Scale */}
                <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[11px] font-utility font-black text-amber-200/90 select-none tracking-tight">
                  <span className="text-amber-400">FM</span>
                  <span>88</span>
                  <span>92</span>
                  <span>96</span>
                  <span>100</span>
                  <span>104</span>
                  <span>108</span>
                  <span className="text-amber-400">MHz</span>
                </div>

                {/* Dial Tick Marks */}
                <div className="relative z-10 w-full flex items-center justify-between px-1 opacity-60 pointer-events-none">
                  {Array.from({ length: 33 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[1px] bg-amber-300 ${
                        i % 4 === 0
                          ? "h-4 opacity-100"
                          : i % 2 === 0
                          ? "h-2.5 opacity-70"
                          : "h-1.5 opacity-40"
                      }`}
                    />
                  ))}
                </div>

                {/* Bottom Ruler: Prahars / Channels */}
                <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[9.5px] font-utility font-bold text-amber-300/80 select-none tracking-tighter truncate">
                  <span>उषाकाल</span>
                  <span>प्रातः</span>
                  <span>मध्याह्न</span>
                  <span>सांध्य</span>
                  <span>रात्रि</span>
                  <span>मध्यरात्रि</span>
                </div>
              </div>
            </div>

            {/* Right Circular Speaker Grille (Hidden on tiny screens, prominent on md) */}
            <div className="hidden md:flex md:col-span-3 items-center justify-center">
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full border-4 border-amber-700/60 bg-[#120804] shadow-inner flex items-center justify-center overflow-hidden">
                {/* Speaker Mesh Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#b45309_1.5px,transparent_1.5px)] [background-size:6px_6px] opacity-60" />
                {/* Pulsing Speaker Core */}
                <div
                  className={`w-12 h-12 rounded-full border-2 border-amber-600/40 bg-gradient-to-br from-amber-950 to-black transition-transform duration-300 ${
                    playing ? "scale-105 shadow-[0_0_15px_rgba(245,176,65,0.4)]" : "scale-100"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ── Middle Section: Illuminated Amber Station LCD & Track Display ── */}
          <div
            className="relative z-10 rounded-2xl p-3 sm:p-4 border border-amber-500/30 shadow-2xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(20, 14, 8, 0.96) 0%, rgba(32, 20, 10, 0.98) 100%)",
            }}
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2 mb-2 text-xs font-utility">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                    playing
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {playing ? "प्रसारण जारी • ON AIR" : "रेडियो तैयार • STANDBY"}
                </span>
                <span className="text-amber-200/75 hidden xs:inline">•</span>
                <span className="text-amber-300 font-semibold hidden xs:inline">
                  {selectedPrahar === "auto"
                    ? `समय चक्र: ${currentPrahar.name}`
                    : activeStation.hindiName}
                </span>
              </div>

              {/* Raag Badge */}
              {track.raag && (
                <button
                  type="button"
                  onClick={() => setRaagModalTrack(track)}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[10px] sm:text-[11px] font-utility font-semibold transition-all active:scale-95 shadow-sm"
                  title="Click to view Raag Lore"
                >
                  <span>✦</span>
                  <span>{track.raagHindi ? `राग ${track.raagHindi}` : track.raag}</span>
                  <span className="text-[9px] opacity-75">ⓘ</span>
                </button>
              )}
            </div>

            {/* Track Info Row */}
            <div className="space-y-1">
              <h2 className="font-display text-base sm:text-lg font-bold text-cream truncate drop-shadow-sm">
                {track.title}
              </h2>
              <p className="text-xs sm:text-[13px] text-cream/75 truncate font-medium">
                {track.artist}
                {track.film && track.film !== "Unknown" ? ` · ${track.film}` : ""}
                {track.year ? ` (${track.year})` : ""}
              </p>

              {/* Progress Seek Bar */}
              <div className="pt-2">
                <div
                  ref={trackSeekRef}
                  role="slider"
                  aria-label="Seek Track"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration)}
                  aria-valuenow={Math.round(displayTime)}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  className="group relative flex h-5 w-full touch-none items-center cursor-pointer"
                >
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15 border border-white/10">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_10px_rgba(245,176,65,0.8)]"
                      style={{ width: `${progressRatio * 100}%` }}
                    />
                  </div>
                  {/* Brass Thumb */}
                  <div
                    className="absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-cream border-2 border-amber-500 shadow-md transition-transform group-hover:scale-125"
                    style={{ left: `${progressRatio * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-utility tabular text-cream/70 font-medium px-0.5">
                  <span>{formatTime(displayTime)}</span>
                  <span className="text-[10px] text-amber-400/90 uppercase tracking-widest font-semibold">
                    {activeTracks.length} स्वर-रचनाएं
                  </span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Lower Section: Cassette Reels, Knobs & Metallic Transport Buttons ── */}
          <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-4 items-center pt-1 border-t border-amber-900/40">
            {/* Left: Volume / Mute Knob */}
            <div className="col-span-3 sm:col-span-2 flex flex-col items-center">
              <button
                type="button"
                onClick={toggleMute}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#4a2e1b] to-[#1a0e07] border-2 border-amber-600/60 shadow-lg flex items-center justify-center text-amber-200 transition-all hover:border-amber-400 active:scale-95"
                title={muted ? "Unmute Audio (M)" : "Mute Audio (M)"}
                aria-label={muted ? "Unmute Audio" : "Mute Audio"}
              >
                <span className="text-sm sm:text-base">{muted ? "🔇" : "🔊"}</span>
              </button>
              <span className="text-[9px] font-utility font-bold text-amber-300/80 uppercase mt-1">
                {muted ? "MUTED" : "VOLUME"}
              </span>
            </div>

            {/* Center: Cassette Deck + Heavy Tactile Transport Buttons */}
            <div className="col-span-6 sm:col-span-8 flex flex-col items-center gap-2">
              {/* Cassette Viewing Window */}
              <div className="w-32 xs:w-40 sm:w-48 h-7 sm:h-8 rounded-md bg-[#0a0502] border border-amber-700/50 shadow-inner flex items-center justify-between px-4 sm:px-6 relative overflow-hidden">
                {/* Left Spool */}
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-amber-400/50 flex items-center justify-center ${
                    playing ? "reel-spinning" : ""
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cream/80" />
                  <div className="absolute w-full h-[1px] bg-amber-400/30" />
                  <div className="absolute h-full w-[1px] bg-amber-400/30" />
                </div>

                {/* Magnetic Tape Line */}
                <div className="h-[2px] w-12 sm:w-16 bg-amber-900/60" />

                {/* Right Spool */}
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-amber-400/50 flex items-center justify-center ${
                    playing ? "reel-spinning" : ""
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cream/80" />
                  <div className="absolute w-full h-[1px] bg-amber-400/30" />
                  <div className="absolute h-full w-[1px] bg-amber-400/30" />
                </div>
              </div>

              {/* Tactile Piano Keys / Transport Buttons */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous Track (P)"
                  title="Previous Track (P)"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#3a2012] to-[#1a0e07] hover:from-[#4a2e1b] border border-amber-600/40 text-cream flex items-center justify-center transition-all active:scale-90 shadow-md"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M6 5a1 1 0 0 1 1 1v5.2l9.4-6.1A1 1 0 0 1 18 6v12a1 1 0 0 1-1.6.8L7 12.8V18a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Z" />
                  </svg>
                </button>

                {/* Primary Play / Pause Button */}
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause (Space/K)" : "Play (Space/K)"}
                  title={playing ? "Pause (Space/K)" : "Play (Space/K)"}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-amber-300 via-amber to-amber-600 text-dusk flex items-center justify-center shadow-[0_4px_25px_rgba(245,176,65,0.7)] ring-2 sm:ring-4 ring-amber-400/40 hover:scale-105 active:scale-95 transition-all"
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 sm:size-7">
                      <path d="M8 5a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Zm8 0a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 sm:size-7 translate-x-[2px]"
                    >
                      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7l-10.4-6.5A1 1 0 0 0 8 5.5Z" />
                    </svg>
                  )}
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next Track (N)"
                  title="Next Track (N)"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#3a2012] to-[#1a0e07] hover:from-[#4a2e1b] border border-amber-600/40 text-cream flex items-center justify-center transition-all active:scale-90 shadow-md"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M18 5a1 1 0 0 0-1 1v5.2L7.6 5.1A1 1 0 0 0 6 6v12a1 1 0 0 0 1.6.8L17 12.8V18a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Rotary Tuning Knob */}
            <div className="col-span-3 sm:col-span-2 flex flex-col items-center">
              <div
                style={{ transform: `rotate(${knobRotation}deg)` }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#4a2e1b] to-[#1a0e07] border-2 border-amber-600/60 shadow-lg flex items-center justify-center transition-transform duration-300 relative cursor-pointer"
                title="Radio Tuning Dial"
              >
                {/* Notch */}
                <div className="w-1 h-3 bg-amber-400 rounded-full absolute top-1" />
                <div className="w-4 h-4 rounded-full bg-[#120804] border border-amber-600/50" />
              </div>
              <span className="text-[9px] font-utility font-bold text-amber-300/80 uppercase mt-1">
                TUNING
              </span>
            </div>
          </div>
        </div>

        {/* ── 4. Stylized Peher / Prahar Radio Frequency Scroll Tuner ── */}
        <div className="w-full mt-4 sm:mt-6 px-1">
          <div className="glass rounded-2xl p-3.5 sm:p-4.5 border border-amber-500/25 shadow-2xl space-y-3 relative overflow-hidden bg-gradient-to-b from-[#1c0f08]/90 via-[#140b05]/95 to-[#0b0502]/95">
            {/* Tuner Bar Header */}
            <div className="flex items-center justify-between text-xs border-b border-amber-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm select-none">📻</span>
                <span className="font-utility uppercase tracking-wider text-amber-200/90 font-bold text-[11px] sm:text-xs">
                  प्रहर चैनल ट्यूनर • PRAHAR FREQUENCY CHANNELS
                </span>
              </div>

              {/* Scroll Controls (Left / Right Brass Buttons) */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-utility text-amber-300/70 hidden sm:inline mr-1">
                  डायल स्क्रॉल
                </span>
                <button
                  type="button"
                  onClick={() => scrollByAmount(-220)}
                  disabled={!canScrollLeft}
                  className={`w-7 h-7 rounded-full border border-amber-500/40 bg-gradient-to-b from-[#3a2012] to-[#1a0e07] text-amber-300 flex items-center justify-center text-base font-bold transition-all ${
                    canScrollLeft
                      ? "opacity-100 hover:border-amber-300 hover:text-amber-200 active:scale-90 shadow-md cursor-pointer"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                  title="Scroll Left"
                  aria-label="Scroll Stations Left"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scrollByAmount(220)}
                  disabled={!canScrollRight}
                  className={`w-7 h-7 rounded-full border border-amber-500/40 bg-gradient-to-b from-[#3a2012] to-[#1a0e07] text-amber-300 flex items-center justify-center text-base font-bold transition-all ${
                    canScrollRight
                      ? "opacity-100 hover:border-amber-300 hover:text-amber-200 active:scale-90 shadow-md cursor-pointer"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                  title="Scroll Right"
                  aria-label="Scroll Stations Right"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Scroll Container with Edge Fades & Stylized Custom Scrollbar */}
            <div className="relative w-full">
              {/* Left Edge Mask */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-[#140b05] to-transparent ${
                  canScrollLeft ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Right Edge Mask */}
              <div
                className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-l from-[#140b05] to-transparent ${
                  canScrollRight ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Horizontal Scrollable Channel Strip */}
              <div
                ref={tunerScrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onWheel={handleWheel}
                className="peher-scroll-track flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 cursor-grab active:cursor-grabbing scroll-smooth select-none"
              >
                {RADIO_STATIONS.map((station) => {
                  const isSelected = selectedPrahar === station.id;
                  const isLiveNow = currentPrahar.id === station.id;

                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => handleSelectStation(station)}
                      className={`shrink-0 flex flex-col items-start px-3.5 py-2 rounded-xl border transition-all duration-200 active:scale-95 text-left select-none relative ${
                        isSelected
                          ? "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-bold border-amber-200 shadow-[0_4px_16px_rgba(245,176,65,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]"
                          : "bg-gradient-to-b from-[#2a170d] to-[#150a04] hover:from-[#351e11] text-cream/85 border-amber-900/40 hover:border-amber-500/40 hover:text-cream shadow-md"
                      }`}
                    >
                      {/* Live indicator dot / LED */}
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs select-none">{station.icon}</span>
                          <span
                            className={`text-[10.5px] font-utility font-black tracking-tight tabular ${
                              isSelected ? "text-neutral-950" : "text-amber-300"
                            }`}
                          >
                            {station.label}
                          </span>
                        </div>

                        {isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-red-600 ring-2 ring-red-400 shadow-[0_0_6px_rgba(239,68,68,1)] animate-pulse" />
                        ) : isLiveNow ? (
                          <span className="text-[8px] px-1.5 py-0.2 rounded font-utility font-black bg-red-500/30 text-red-300 border border-red-500/40">
                            LIVE
                          </span>
                        ) : null}
                      </div>

                      <span className="text-[12px] font-semibold leading-tight mt-1 whitespace-nowrap">
                        {station.hindiName}
                      </span>
                      <span
                        className={`text-[10px] font-utility tabular mt-0.5 ${
                          isSelected ? "text-neutral-900 font-bold" : "text-amber-200/60"
                        }`}
                      >
                        {station.timeSlot}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
