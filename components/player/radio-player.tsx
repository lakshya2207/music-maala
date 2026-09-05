"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { usePlayerEngine } from "./player-engine";
import type { PraharId } from "@/lib/types";

// Radio channels mapped to sacred Prahars
export interface RadioStation {
  id: "auto" | "all" | PraharId;
  frequency: number; // in MHz
  label: string;
  hindiName: string;
  shortHindi: string;
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
    shortHindi: "लाइव प्रहर",
    timeSlot: "IST Live Sync",
    raagHints: "समय चक्र अनुसार स्वतः ट्यूनिंग",
    icon: "📡",
  },
  {
    id: "dawn",
    frequency: 88.5,
    label: "88.5 FM",
    hindiName: "उषाकाल (ब्रह्म मुहूर्त)",
    shortHindi: "उषाकाल",
    timeSlot: "03:00 - 06:00",
    raagHints: "ललित, प्रभाती, भैरवी",
    icon: "🌌",
  },
  {
    id: "morning",
    frequency: 91.0,
    label: "91.0 FM",
    hindiName: "प्रातः प्रहर",
    shortHindi: "प्रातः",
    timeSlot: "06:00 - 09:00",
    raagHints: "भैरव, तोड़ी, बिलावल",
    icon: "🌅",
  },
  {
    id: "late-morning",
    frequency: 94.0,
    label: "94.0 FM",
    hindiName: "मध्याह्न पूर्व",
    shortHindi: "मध्याह्न पूर्व",
    timeSlot: "09:00 - 12:00",
    raagHints: "जौनपुरी, आसावरी",
    icon: "☀️",
  },
  {
    id: "afternoon",
    frequency: 97.0,
    label: "97.0 FM",
    hindiName: "मध्याह्न प्रहर",
    shortHindi: "मध्याह्न",
    timeSlot: "12:00 - 15:00",
    raagHints: "सारंग अंग, शुद्ध सारंग",
    icon: "🌤️",
  },
  {
    id: "late-afternoon",
    frequency: 100.0,
    label: "100.0 FM",
    hindiName: "अपराह्न प्रहर",
    shortHindi: "अपराह्न",
    timeSlot: "15:00 - 18:00",
    raagHints: "भीमपलासी, मुल्तानी",
    icon: "🌇",
  },
  {
    id: "evening",
    frequency: 103.5,
    label: "103.5 FM",
    hindiName: "सांध्य प्रहर (संध्या)",
    shortHindi: "सांध्य",
    timeSlot: "18:00 - 21:00",
    raagHints: "यमन, भूपाली, पूरिया",
    icon: "🪔",
  },
  {
    id: "night",
    frequency: 106.0,
    label: "106.0 FM",
    hindiName: "रात्रि प्रहर",
    shortHindi: "रात्रि",
    timeSlot: "21:00 - 00:00",
    raagHints: "काफी, बागेश्री, खमाज",
    icon: "🌙",
  },
  {
    id: "late-night",
    frequency: 108.0,
    label: "108.0 FM",
    hindiName: "मध्य रात्रि",
    shortHindi: "मध्य रात्रि",
    timeSlot: "00:00 - 03:00",
    raagHints: "मालकौंस, दरबारी",
    icon: "✨",
  },
  {
    id: "all",
    frequency: 108.8,
    label: "108.8 FM",
    hindiName: "सर्वकालिक संगीत",
    shortHindi: "सर्वकालिक",
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
    currentTime,
    duration,
    seek,
    selectedPrahar,
    setSelectedPrahar,
    currentPrahar,
    activeTracks,
    setRaagModalTrack,
  } = usePlayerEngine();

  // Active station calculation
  const activeStationIndex = useMemo(() => {
    const idx = RADIO_STATIONS.findIndex((s) => s.id === selectedPrahar);
    return idx !== -1 ? idx : 0;
  }, [selectedPrahar]);

  const activeStation = RADIO_STATIONS[activeStationIndex] || RADIO_STATIONS[0];

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

  // Handle direct station selection from FM scale glass window
  const handleSelectStation = useCallback(
    (station: RadioStation) => {
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
    <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto px-1 sm:px-3 py-1 sm:py-3">
      {/* ── Outer Retro Temple Radio Cabinet ── */}
      <div className="relative w-full flex flex-col items-center">
        {/* Vintage Top Handle */}
        <div className="w-32 xs:w-44 sm:w-56 h-3 sm:h-4 rounded-t-xl bg-gradient-to-b from-[#4a2e1b] via-[#2d1a0e] to-[#1a0e07] border-t-2 border-x-2 border-amber-700/60 shadow-md flex items-center justify-between px-3 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600/80 border border-amber-400/40" />
          <span className="h-[2px] w-16 sm:w-32 bg-amber-600/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600/80 border border-amber-400/40" />
        </div>

        {/* Main Solid Wooden / Bakelite Radio Body (Spacious & Compact for Mobile) */}
        <div
          className="w-full rounded-[24px] sm:rounded-[32px] p-3 sm:p-5 border-2 sm:border-4 border-[#7a4823] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.98),inset_0_2px_4px_rgba(255,215,0,0.25)] relative overflow-hidden"
          style={{
            background:
              "linear-gradient(150deg, #2c180e 0%, #1c0e07 35%, #130a05 70%, #0d0603 100%)",
          }}
        >
          {/* Woodgrain texture */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          {/* Inner bezel rim */}
          <div className="absolute inset-1.5 sm:inset-2.5 rounded-[20px] sm:rounded-[26px] border border-amber-500/25 pointer-events-none" />

          {/* ── Header: Stereo Status & Brand Badge ── */}
          <div className="relative z-10 flex items-center justify-between border-b border-amber-900/40 pb-2 mb-2.5 px-1">
            {/* Stereo Indicator */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  playing
                    ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"
                    : "bg-red-950 opacity-40"
                }`}
              />
              <span className="font-utility text-[9.5px] sm:text-[11px] font-bold tracking-wider text-amber-200/90 uppercase">
                {playing ? "STEREO • ON AIR" : "FM RECEIVER"}
              </span>
            </div>

            {/* Vintage Brass Nameplate */}
            <div className="px-2.5 sm:px-3.5 py-0.5 rounded bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 text-neutral-950 font-utility font-black text-[9.5px] sm:text-[11px] tracking-widest shadow-md uppercase select-none">
              MUSIC MAALA
            </div>

            {/* Live Frequency Badge */}
            <div className="font-mono text-amber-400 font-bold text-xs sm:text-sm tabular tracking-wide drop-shadow-[0_0_6px_rgba(245,176,65,0.7)]">
              {activeFreqString}
            </div>
          </div>

          {/* ── Analog Backlit Glass Window & Integrated Prahar FM Scale ── */}
          <div className="relative z-10 mb-3 sm:mb-4">
            <div
              className="relative w-full h-16 sm:h-20 rounded-xl border-2 border-amber-600/50 p-1.5 sm:p-2 overflow-hidden flex flex-col justify-between shadow-[inset_0_0_15px_rgba(0,0,0,0.9),0_0_12px_rgba(245,176,65,0.15)]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(254, 240, 138, 0.22) 0%, rgba(217, 119, 6, 0.15) 50%, rgba(10, 5, 2, 0.85) 100%)",
              }}
            >
              {/* Glowing Red Frequency Needle */}
              <div
                className="absolute top-0 bottom-0 w-[3px] bg-red-600 shadow-[0_0_10px_rgba(239,68,68,1)] rounded-full transition-all duration-500 ease-out z-20 pointer-events-none"
                style={{ left: `${needlePercent}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 absolute -top-0.5 -left-[2px]" />
              </div>

              {/* FM Scale Numbers */}
              <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10.5px] font-utility font-black text-amber-200/90 select-none tracking-tight">
                <span className="text-amber-400 font-bold">FM</span>
                <span>88</span>
                <span>91</span>
                <span>94</span>
                <span>97</span>
                <span>100</span>
                <span>103</span>
                <span>106</span>
                <span>108</span>
                <span className="text-amber-400 font-bold">MHz</span>
              </div>

              {/* Dial Tick Marks */}
              <div className="relative z-10 w-full flex items-center justify-between px-1 opacity-60 pointer-events-none">
                {Array.from({ length: 33 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[1px] bg-amber-300 ${
                      i % 4 === 0
                        ? "h-3.5 opacity-100"
                        : i % 2 === 0
                        ? "h-2 opacity-70"
                        : "h-1 opacity-40"
                    }`}
                  />
                ))}
              </div>

              {/* Clickable Prahar Stations Bar across FM Glass Window */}
              <div className="relative z-10 flex items-center justify-between gap-0.5 text-[8px] sm:text-[9.5px] font-utility font-bold text-amber-300/90 select-none truncate">
                {RADIO_STATIONS.map((st) => {
                  const isCur = selectedPrahar === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectStation(st)}
                      className={`px-1 py-0.5 rounded transition-all cursor-pointer truncate ${
                        isCur
                          ? "bg-amber text-neutral-950 font-black shadow-sm"
                          : "hover:text-cream hover:bg-white/10"
                      }`}
                      title={`${st.hindiName} (${st.label})`}
                    >
                      {st.shortHindi}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Middle Section: Illuminated Track Display ── */}
          <div
            className="relative z-10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-amber-500/30 shadow-xl mb-3 sm:mb-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(20, 14, 8, 0.96) 0%, rgba(32, 20, 10, 0.98) 100%)",
            }}
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-1.5 mb-2 text-xs font-utility">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider ${
                    playing
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {playing ? "प्रसारण जारी • ON AIR" : "रेдио तैयार • STANDBY"}
                </span>
                <span className="text-amber-300 font-semibold text-[10px] sm:text-xs">
                  {selectedPrahar === "auto"
                    ? `लाइव प्रहर: ${currentPrahar.name}`
                    : activeStation.hindiName}
                </span>
              </div>

              {/* Raag Badge */}
              {track.raag && (
                <button
                  type="button"
                  onClick={() => setRaagModalTrack(track)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[9.5px] sm:text-[10.5px] font-utility font-semibold transition-all active:scale-95 shadow-sm"
                  title="Click to view Raag details"
                >
                  <span>✦</span>
                  <span>{track.raagHindi ? `राग ${track.raagHindi}` : track.raag}</span>
                  <span className="text-[8px] opacity-75">ⓘ</span>
                </button>
              )}
            </div>

            {/* Track Info */}
            <div className="space-y-1">
              <h2 className="font-display text-sm sm:text-base md:text-lg font-bold text-cream truncate drop-shadow-sm my-0">
                {track.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-cream/75 truncate font-medium my-0">
                {track.artist}
                {track.film && track.film !== "Unknown" ? ` · ${track.film}` : ""}
                {track.year ? ` (${track.year})` : ""}
              </p>

              {/* Progress Seek Bar */}
              <div className="pt-1.5">
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
                  className="group relative flex h-4 w-full touch-none items-center cursor-pointer"
                >
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15 border border-white/10">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_8px_rgba(245,176,65,0.8)]"
                      style={{ width: `${progressRatio * 100}%` }}
                    />
                  </div>
                  {/* Thumb */}
                  <div
                    className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-cream border-2 border-amber-500 shadow transition-transform group-hover:scale-125"
                    style={{ left: `${progressRatio * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-utility tabular text-cream/70 font-medium px-0.5">
                  <span>{formatTime(displayTime)}</span>
                  <span className="text-[9.5px] text-amber-400/90 uppercase tracking-wider font-semibold">
                    {activeTracks.length} भजन (प्रहर + सर्वकालीन)
                  </span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Lower Section: Cassette Deck + Transport Keys ── */}
          <div className="relative z-10 flex items-center justify-center pt-2 border-t border-amber-900/40">
            {/* Center: Cassette Deck + Transport Piano Buttons */}
            <div className="flex flex-col items-center gap-1.5">
              {/* Cassette Viewing Window */}
              <div className="w-32 xs:w-40 sm:w-48 h-6 sm:h-7 rounded-md bg-[#0a0502] border border-amber-700/50 shadow-inner flex items-center justify-between px-4 sm:px-6 relative overflow-hidden">
                {/* Left Spool */}
                <div
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-amber-400/50 flex items-center justify-center ${
                    playing ? "reel-spinning" : ""
                  }`}
                >
                  <div className="w-1 h-1 rounded-full bg-cream/80" />
                  <div className="absolute w-full h-[1px] bg-amber-400/30" />
                  <div className="absolute h-full w-[1px] bg-amber-400/30" />
                </div>

                {/* Magnetic Tape Line */}
                <div className="h-[2px] w-12 sm:w-16 bg-amber-900/60" />

                {/* Right Spool */}
                <div
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-amber-400/50 flex items-center justify-center ${
                    playing ? "reel-spinning" : ""
                  }`}
                >
                  <div className="w-1 h-1 rounded-full bg-cream/80" />
                  <div className="absolute w-full h-[1px] bg-amber-400/30" />
                  <div className="absolute h-full w-[1px] bg-amber-400/30" />
                </div>
              </div>

              {/* Tactile Piano Transport Buttons */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous Track"
                  title="Previous Track (P)"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#3a2012] to-[#1a0e07] hover:from-[#4a2e1b] border border-amber-600/40 text-cream flex items-center justify-center transition-all active:scale-90 shadow-md cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
                    <path d="M6 5a1 1 0 0 1 1 1v5.2l9.4-6.1A1 1 0 0 1 18 6v12a1 1 0 0 1-1.6.8L7 12.8V18a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Z" />
                  </svg>
                </button>

                {/* Primary Play / Pause Button */}
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  title={playing ? "Pause (Space/K)" : "Play (Space/K)"}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-b from-amber-300 via-amber to-amber-600 text-dusk flex items-center justify-center shadow-[0_4px_20px_rgba(245,176,65,0.7)] ring-2 sm:ring-4 ring-amber-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6">
                      <path d="M8 5a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Zm8 0a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 sm:size-6 translate-x-[1px]"
                    >
                      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7l-10.4-6.5A1 1 0 0 0 8 5.5Z" />
                    </svg>
                  )}
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next Track"
                  title="Next Track (N)"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#3a2012] to-[#1a0e07] hover:from-[#4a2e1b] border border-amber-600/40 text-cream flex items-center justify-center transition-all active:scale-90 shadow-md cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
                    <path d="M18 5a1 1 0 0 0-1 1v5.2L7.6 5.1A1 1 0 0 0 6 6v12a1 1 0 0 0 1.6.8L17 12.8V18a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
