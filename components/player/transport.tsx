"use client";

import { usePlayerEngine } from "./player-engine";

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6 5a1 1 0 0 1 1 1v5.2l9.4-6.1A1 1 0 0 1 18 6v12a1 1 0 0 1-1.6.8L7 12.8V18a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18 5a1 1 0 0 0-1 1v5.2L7.6 5.1A1 1 0 0 0 6 6v12a1 1 0 0 0 1.6.8L17 12.8V18a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 translate-x-[1px]">
      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7l-10.4-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M8 5a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Zm8 0a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

export function Transport({ playSize = 44 }: { playSize?: number }) {
  const { playing, toggle, next, prev } = usePlayerEngine();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={prev}
        aria-label="Previous track"
        className="grid h-11 w-11 place-items-center rounded-full text-cream/80 transition hover:text-cream active:scale-95"
      >
        <PrevIcon />
      </button>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        style={{ width: playSize, height: playSize }}
        className="grid place-items-center rounded-full bg-gradient-to-b from-amber to-amber-deep text-dusk shadow-[0_8px_24px_-6px_var(--color-amber-glow)] ring-1 ring-white/25 transition active:scale-95"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next track"
        className="grid h-11 w-11 place-items-center rounded-full text-cream/80 transition hover:text-cream active:scale-95"
      >
        <NextIcon />
      </button>
    </div>
  );
}
