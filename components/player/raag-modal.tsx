"use client";

import { usePlayerEngine } from "./player-engine";
import { PRAHARS, RAAG_MASTER } from "@/lib/raags";
import type { PraharId } from "@/lib/types";

export function RaagModal() {
  const { raagModalTrack, setRaagModalTrack } = usePlayerEngine();

  if (!raagModalTrack) return null;

  const track = raagModalTrack;
  const master = (track.raag && RAAG_MASTER[track.raag]) || null;
  const praharInfo =
    PRAHARS[(track.prahar as PraharId) || (master?.prahar as PraharId) || "anytime"] ||
    PRAHARS.anytime;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setRaagModalTrack(null)}
    >
      <div
        className="glass rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-6 border border-amber/30 shadow-2xl shadow-amber/10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setRaagModalTrack(null)}
          className="absolute right-5 top-5 text-cream/50 hover:text-cream p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-amber text-xs font-utility tracking-widest uppercase">
              भारतीय शास्त्रीय राग ज्ञान
            </span>
          </div>
          <h2
            lang="hi"
            style={{ fontFamily: "var(--font-yatra)" }}
            className="text-2xl sm:text-3xl text-amber font-normal"
          >
            {track.raagHindi ? `राग ${track.raagHindi}` : track.raag ? `राग ${track.raag}` : "राग भैरवी"}
            {track.raag && track.raag !== track.raagHindi && (
              <span className="text-base sm:text-lg text-cream/90 font-sans font-medium ml-2">
                ({track.raag})
              </span>
            )}
          </h2>
          <p className="text-xs text-cream/85 truncate font-body font-medium">
            भजन: {track.title} {track.artist ? `• ${track.artist}` : ""}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-body">
          {/* Prahar / Time */}
          <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-amber font-utility font-semibold">
              <span>{praharInfo.icon}</span>
              <span>गायन समय (Prahar)</span>
            </div>
            <p className="text-sm font-bold text-cream">
              {praharInfo.name}
            </p>
            <p className="text-[11px] text-cream/70 font-utility tabular font-medium">
              {track.timeSlot || praharInfo.timeRange}
            </p>
          </div>

          {/* Thaat */}
          <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-amber font-utility font-semibold">
              <span>🎼</span>
              <span>ठाठ (Parent Thaat)</span>
            </div>
            <p className="text-sm font-bold text-cream">
              {track.thaat || master?.thaat || "Bilawal"}
            </p>
            <p className="text-[11px] text-cream/70 font-utility font-medium">
              {master?.swaraNotes || "शुद्ध स्वर"}
            </p>
          </div>

          {/* Mood / Rasa */}
          <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-amber font-utility font-semibold">
              <span>✨</span>
              <span>रस एवं भाव (Mood)</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-cream leading-tight">
              {track.mood || master?.mood || "भक्ति भाव एवं शांति"}
            </p>
          </div>

          {/* Deity / Devata */}
          <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-amber font-utility font-semibold">
              <span>🪔</span>
              <span>आराध्य स्वरूप (Deity)</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-cream leading-tight">
              {track.deity || "सर्व देव / Universal"}
            </p>
          </div>
        </div>

        {/* Lore / Description */}
        <div className="rounded-2xl bg-amber/15 border border-amber/35 p-4 space-y-1.5 shadow-md">
          <p className="text-xs font-utility uppercase tracking-wider text-amber font-bold">
            आध्यात्मिक महत्व एवं राग प्रभाव
          </p>
          <p className="text-xs sm:text-sm text-cream leading-relaxed font-medium">
            {track.description ||
              master?.spiritualSignificance ||
              praharInfo.description ||
              "भारतीय शास्त्रीय संगीत में रागों का समय चक्र मन को एकाग्र कर ईश्वर भक्ति में लीन करने का दिव्य माध्यम है।"}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] font-utility text-cream/70 pt-2 border-t border-white/10">
          <span>समय चक्र प्रणाली • 8 Prahars</span>
          <button
            onClick={() => setRaagModalTrack(null)}
            className="text-amber hover:underline font-bold"
          >
            वापस संगीत पर जाएँ
          </button>
        </div>
      </div>
    </div>
  );
}
