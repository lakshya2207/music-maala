"use client";

import { usePlayerEngine } from "./player-engine";

export function RaagLibraryLink() {
  const { setRaagLibraryOpen } = usePlayerEngine();

  return (
    <div className="flex flex-col items-center justify-center pt-2">
      <button
        type="button"
        onClick={() => setRaagLibraryOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-500/25 via-amber/35 to-amber-500/25 hover:from-amber-500/40 hover:to-amber-500/40 border border-amber-400/50 text-cream text-xs sm:text-sm font-utility font-bold shadow-lg shadow-amber/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Open Pahars and Songs Repertoire Library"
      >
        <span className="text-amber text-sm sm:text-base animate-pulse">📻</span>
        <span>पहर एवं शास्त्रीय भजन संग्रह (8 Pahars Songs Library)</span>
        <span className="text-amber text-xs sm:text-sm font-bold">→</span>
      </button>
    </div>
  );
}
