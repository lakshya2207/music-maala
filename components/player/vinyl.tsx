"use client";

import { usePlayerEngine } from "./player-engine";

export function Vinyl({ which, size }: { which: "desktop" | "mobile"; size: number }) {
  const { playing, registerVinylSlot } = usePlayerEngine();

  return (
    <div
      className="relative shrink-0 self-start overflow-hidden rounded-full ring-1 ring-white/15"
      style={{ width: size, height: size }}
    >
      <div
        ref={(node) => registerVinylSlot(which, node)}
        className="vinyl-spin h-full w-full bg-dusk-soft"
        style={{ animationPlayState: playing ? "running" : "paused" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40"
        aria-hidden
      />
    </div>
  );
}
