"use client";

import { usePlayerEngine } from "./player-engine";
import { Vinyl } from "./vinyl";
import { SeekBar } from "./seek-bar";
import { Transport } from "./transport";
import { PaharBar } from "./pahar-bar";

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function MobilePlayer() {
  const { track, currentTime, duration, setRaagModalTrack } = usePlayerEngine();

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 sm:hidden px-2 pb-1">
      {/* Pahar Bar on mobile */}
      <PaharBar />

      {/* Main Glass Player Card */}
      <div className="glass flex w-full flex-col gap-3 rounded-[24px] p-4 border border-white/15 shadow-2xl backdrop-blur-2xl">
        {/* Track Info Header Row */}
        <div className="flex items-center gap-3">
          <Vinyl which="mobile" size={52} />

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-1">
              <p className="truncate font-display text-[15px] font-bold leading-snug text-white drop-shadow-sm">
                {track.title}
              </p>
            </div>

            <p className="truncate text-[12px] text-cream/90 font-medium">
              {track.artist} {track.film && track.film !== "Unknown" ? `· ${track.film}` : ""}{" "}
              {track.year ? `(${track.year})` : ""}
            </p>

            {/* Clickable Raag Pill */}
            {track.raag && (
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setRaagModalTrack(track)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber/20 border border-amber/40 text-amber text-[10px] font-utility font-semibold hover:bg-amber/30 active:scale-95 transition-all shadow-sm"
                  title="View Raag Lore"
                >
                  <span>✦</span>
                  <span>{track.raagHindi ? `राग ${track.raagHindi}` : track.raag}</span>
                  <span className="text-[9px] opacity-70">ⓘ</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seek Bar & Progress */}
        <div className="space-y-1 pt-1">
          <SeekBar />
          <div className="flex items-center justify-between text-[11px] font-utility tabular text-cream/80 font-medium px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Transport Playback Controls */}
        <div className="flex items-center justify-center pt-0.5">
          <Transport playSize={50} />
        </div>
      </div>
    </div>
  );
}
