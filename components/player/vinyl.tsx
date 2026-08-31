"use client";

import { useState, useEffect } from "react";
import { usePlayerEngine } from "./player-engine";

export function Vinyl({ size }: { which?: "desktop" | "mobile"; size: number }) {
  const { playing, track } = usePlayerEngine();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [track?.videoId]);

  // Use hqdefault as primary because it is guaranteed to exist for all YouTube videos
  const artworkUrl = track?.videoId
    ? `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`
    : "";

  return (
    <div
      className="group relative shrink-0 overflow-hidden rounded-full ring-2 ring-white/25 shadow-2xl"
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
        <div className="relative h-[68%] w-[68%] overflow-hidden rounded-full border border-amber/50 shadow-inner bg-dusk flex items-center justify-center">
          {artworkUrl && !imgError ? (
            <img
              key={track?.videoId}
              src={artworkUrl}
              alt={track?.title || "Track thumbnail"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-900/60 via-amber/30 to-black">
              <span className="text-amber text-lg select-none">🪔</span>
            </div>
          )}
          {/* Center vinyl spindle hole */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-2 ring-white/70 shadow-md" />
        </div>
      </div>
    </div>
  );
}

