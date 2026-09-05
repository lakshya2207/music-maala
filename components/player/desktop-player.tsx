"use client";

import { usePlayerEngine } from "./player-engine";
import { Vinyl } from "./vinyl";
import { SeekBar, TimeDisplay } from "./seek-bar";
import { Transport } from "./transport";
import { PaharBar } from "./pahar-bar";

export function DesktopPlayer() {
  const { track, setRaagModalTrack } = usePlayerEngine();

  return (
    <div className="hidden w-full max-w-xl sm:flex sm:flex-col sm:items-center sm:gap-2.5">
      <PaharBar />
      <div className="glass flex w-full items-center gap-4 rounded-full p-3 pr-5 border border-white/15 shadow-2xl backdrop-blur-xl">
        <Vinyl which="desktop" size={80} />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-display text-[15.5px] font-bold leading-tight text-white drop-shadow-sm">
                {track.title}
              </p>
              {track.raag && (
                <button
                  onClick={() => setRaagModalTrack(track)}
                  className="shrink-0 px-2 py-0.5 rounded-full bg-amber/20 border border-amber/40 text-amber text-[10px] font-utility font-semibold hover:bg-amber/30 transition-colors shadow-sm"
                  title="View Raag Lore (Press R)"
                >
                  ✦ {track.raagHindi ? `राग ${track.raagHindi}` : track.raag}
                </button>
              )}
            </div>
            <p className="truncate text-[12.5px] text-cream/90 font-medium mt-0.5">
              {track.artist} {track.film && track.film !== "Unknown" ? `· ${track.film}` : ""}{" "}
              {track.year ? `(${track.year})` : ""}
            </p>
          </div>
          <SeekBar />
          <TimeDisplay />
        </div>

        <Transport playSize={48} />
      </div>
    </div>
  );
}
