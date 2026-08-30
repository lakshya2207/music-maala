"use client";

import { usePlayerEngine } from "./player-engine";

export function Vinyl({ size }: { which?: "desktop" | "mobile"; size: number }) {
  const { playing, track } = usePlayerEngine();

  const maxResUrl = track?.videoId
    ? `https://img.youtube.com/vi/${track.videoId}/maxresdefault.jpg`
    : "";
  const hqResUrl = track?.videoId
    ? `https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg`
    : "";

  return (
    <div
      className="group relative shrink-0 overflow-hidden rounded-full ring-2 ring-white/20 shadow-xl"
      style={{ width: size, height: size }}
    >
      {/* Vinyl record disc background with groove pattern */}
      <div
        className="vinyl-spin absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-950"
        style={{ animationPlayState: playing ? "running" : "paused" }}
      >
        {/* Vinyl groove lines */}
        <div className="absolute inset-1 rounded-full border border-white/10" />
        <div className="absolute inset-3 rounded-full border border-white/5" />
        <div className="absolute inset-5 rounded-full border border-white/10" />

        {/* Thumbnail artwork in center hub */}
        {track?.videoId && (
          <div className="relative h-[65%] w-[65%] overflow-hidden rounded-full border border-amber/40 shadow-inner">
            <img
              key={track.videoId}
              src={maxResUrl}
              alt={track.title || "Track thumbnail"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== hqResUrl) {
                  target.src = hqResUrl;
                }
              }}
            />
            {/* Center vinyl spindle hole */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-2 ring-white/60 shadow-md" />
          </div>
        )}
      </div>
    </div>
  );
}
