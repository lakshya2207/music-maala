"use client";

import { usePlayerEngine } from "./player-engine";
import { PRAHARS } from "@/lib/raags";
import { useState, useRef, useEffect } from "react";

export function PaharBar() {
  const {
    currentPahar,
    selectedPahar,
    setSelectedPahar,
    activeTracks,
    track,
    setRaagModalTrack,
  } = usePlayerEngine();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activePahar =
    selectedPahar === "auto"
      ? currentPahar
      : selectedPahar === "all"
      ? PRAHARS.anytime
      : PRAHARS[selectedPahar] || currentPahar;

  return (
    <div className="relative z-20 flex flex-col items-center gap-2 w-full max-w-lg px-1">
      {/* Top Pahar Bar Pill */}
      <div className="glass flex items-center justify-between gap-1.5 sm:gap-3 rounded-full px-3 sm:px-4 py-1.5 w-full border border-white/15 shadow-xl text-xs sm:text-sm">
        {/* Left: Current Pahar Badge & Mode Dropdown Toggle */}
        <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 bg-amber/20 hover:bg-amber/30 text-amber border border-amber/45 transition-all active:scale-95 font-utility text-[11px] sm:text-xs font-semibold shadow-sm"
            title="Click to change Pahar or Auto Mode"
          >
            <span>{activePahar.icon}</span>
            <span className="truncate max-w-[140px] xs:max-w-none">
              {selectedPahar === "auto"
                ? `समय चक्र: ${currentPahar.name}`
                : selectedPahar === "all"
                ? "सभी भजन (All)"
                : activePahar.name}
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`size-3 transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Pahar Picker Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 w-[280px] xs:w-80 rounded-2xl glass p-2.5 border border-white/25 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-utility uppercase tracking-wider text-cream/70 font-semibold border-b border-white/10">
                समय चक्र एवं पहर चयन
              </div>

              {/* Auto mode */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPahar("auto");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                  selectedPahar === "auto"
                    ? "bg-amber text-dusk font-bold shadow-md"
                    : "text-cream hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  <div>
                    <p className="leading-tight font-semibold">समय चक्र (Live Auto Clock)</p>
                    <p className={`text-[10px] ${selectedPahar === "auto" ? "text-dusk/80 font-medium" : "text-cream/70"}`}>
                      वर्तमान समय अनुसार: {currentPahar.name}
                    </p>
                  </div>
                </div>
                {selectedPahar === "auto" && <span>✓</span>}
              </button>

              {/* All tracks mode */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPahar("all");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                  selectedPahar === "all"
                    ? "bg-amber text-dusk font-bold shadow-md"
                    : "text-cream hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span>📜</span>
                  <span>सभी भजन (Play All Tracks)</span>
                </div>
                {selectedPahar === "all" && <span>✓</span>}
              </button>

              <div className="h-px bg-white/10 my-1" />

              {/* 8 Pahars list */}
              <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                {Object.values(PRAHARS)
                  .filter((p) => p.id !== "anytime")
                  .map((p) => {
                    const isCurrent = currentPahar.id === p.id;
                    const isSelected = selectedPahar === p.id;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPahar(p.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-amber text-dusk font-bold"
                            : "text-cream hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{p.icon}</span>
                          <span className="truncate font-medium">{p.name}</span>
                          {isCurrent && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-utility font-bold ${isSelected ? "bg-dusk/20 text-dusk" : "bg-amber text-dusk shadow-sm"}`}>
                              NOW
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-utility ml-2 shrink-0 tabular ${isSelected ? "text-dusk/80" : "text-cream/60"}`}>
                          {p.timeRange}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Center: Track's Raag badge */}
        {track?.raag && (
          <button
            type="button"
            onClick={() => setRaagModalTrack(track)}
            className="hidden xs:flex items-center gap-1.5 text-[11.5px] sm:text-xs text-cream hover:text-amber transition-colors px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 hover:border-amber/30 truncate max-w-[120px] sm:max-w-none shadow-sm"
            title="Click to view Raag details and spiritual lore"
          >
            <span className="text-amber">✦</span>
            <span className="font-semibold truncate">
              {track.raagHindi ? `राग ${track.raagHindi}` : `Raag ${track.raag}`}
            </span>
          </button>
        )}

        {/* Right: Available songs counter */}
        <div className="text-[11px] sm:text-xs font-utility text-cream/80 font-medium tabular whitespace-nowrap shrink-0">
          <span>{activeTracks.length} भजन</span>
        </div>
      </div>
    </div>
  );
}
