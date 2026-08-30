"use client";

import { usePlayerEngine } from "./player-engine";
import { Vinyl } from "./vinyl";
import { SeekBar } from "./seek-bar";
import { Transport } from "./transport";
import { PraharBar } from "./prahar-bar";

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
      {/* Prahar Bar on mobile */}
      <PraharBar />

      {/* Main Glass Player Card */}
      <div className="glass flex w-full flex-col gap-3 rounded-[24px] p-4 border border-white/15 shadow-2xl backdrop-blur-2xl">
        {/* Track Info Header Row */}
        <div className="flex items-center gap-3">
          <Vinyl which="mobile" size={52} />

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-1">
              <p className="truncate font-display text-[14.5px] font-semibold leading-snug text-cream">
                {track.title}
              </p>
            </div>

            <p className="truncate text-[11.5px] text-cream/70">
              {track.artist} {track.film && track.film !== "Unknown" ? `· ${track.film}` : ""}{" "}
              {track.year ? `(${track.year})` : ""}
            </p>

            {/* Clickable Raag Pill */}
            {track.raag && (
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setRaagModalTrack(track)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/15 border border-amber/30 text-amber text-[10px] font-utility font-medium hover:bg-amber/25 active:scale-95 transition-all"
                  title="View Raag Lore"
                >
                  <span>✦</span>
                  <span>{track.raagHindi ? `राग ${track.raagHindi}` : track.raag}</span>
                  <span className="text-[9px] opacity-60">ⓘ</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seek Bar & Progress */}
        <div className="space-y-1 pt-1">
          <SeekBar />
          <div className="flex items-center justify-between text-[10.5px] font-utility tabular text-cream/50 px-0.5">
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
