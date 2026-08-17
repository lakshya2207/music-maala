"use client";

import { useCallback, useRef, useState } from "react";
import { usePlayerEngine } from "./player-engine";

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TimeDisplay({ className = "" }: { className?: string }) {
  const { currentTime, duration } = usePlayerEngine();
  return (
    <div className={`flex gap-1 text-[10.5px] tabular font-utility text-cream-dim ${className}`}>
      <span>{formatTime(currentTime)}</span>
      <span>/</span>
      <span>{formatTime(duration)}</span>
    </div>
  );
}

export function SeekBar() {
  const { currentTime, duration, seek } = usePlayerEngine();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const valueFromPointer = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el || duration <= 0) return 0;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * duration;
  }, [duration]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const next = valueFromPointer(event.clientX);
      setDragValue(next);
    },
    [valueFromPointer],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragValue === null) return;
      setDragValue(valueFromPointer(event.clientX));
    },
    [dragValue, valueFromPointer],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragValue === null) return;
      seek(dragValue);
      setDragValue(null);
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    [dragValue, seek],
  );

  const shownTime = dragValue ?? currentTime;
  const progress = duration > 0 ? Math.min(1, shownTime / duration) : 0;

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        ref={trackRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(shownTime)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="group/seek relative flex h-6 w-full touch-none items-center"
      >
        <div className="seek-rail relative h-[3px] w-full overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-amber shadow-[0_0_10px_1px_var(--color-amber-glow)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div
          className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-cream opacity-0 shadow transition-opacity group-hover/seek:opacity-100"
          style={{ left: `${progress * 100}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
