"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePlayerEngine } from "./player-engine";

export function ShortcutsModal() {
  const {
    toggle,
    toggleMute,
    next,
    prev,
    seek,
    currentTime,
    duration,
    track,
    setRaagModalTrack,
    raagModalTrack,
    shortcutsModalOpen,
    setShortcutsModalOpen,
  } = usePlayerEngine();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  const durationRef = useRef(duration);
  durationRef.current = duration;

  const trackRef = useRef(track);
  trackRef.current = track;

  const raagModalTrackRef = useRef(raagModalTrack);
  raagModalTrackRef.current = raagModalTrack;

  const shortcutsModalOpenRef = useRef(shortcutsModalOpen);
  shortcutsModalOpenRef.current = shortcutsModalOpen;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 1. NEVER collide with OS or Browser shortcuts (e.g. Ctrl+R, Cmd+R, Ctrl+W, Ctrl+T, Ctrl+N, Ctrl+L, Ctrl+P, Alt+Left/Right)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // 2. Ignore if typing in form controls or editable elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      // 3. YouTube-aligned keyboard shortcuts
      // ? or / or Shift + / or H or F1 -> Toggle Shortcuts Modal
      if (
        e.key === "?" ||
        e.key === "/" ||
        e.code === "Slash" ||
        e.key === "h" ||
        e.key === "H" ||
        e.key === "Help" ||
        e.key === "F1"
      ) {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
        return;
      }

      // Escape -> Close modal / lore window
      if (e.key === "Escape") {
        if (shortcutsModalOpenRef.current) setShortcutsModalOpen(false);
        if (raagModalTrackRef.current) setRaagModalTrack(null);
        return;
      }

      // Space or K / k -> Toggle Play/Pause (YouTube standard)
      if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        toggle();
        return;
      }

      // J / j -> Seek backward 10s (YouTube standard)
      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        seek(Math.max(0, currentTimeRef.current - 10));
        return;
      }

      // L / l -> Seek forward 10s (YouTube standard)
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        seek(currentTimeRef.current + 10);
        return;
      }

      // ArrowLeft -> Seek backward 5s (YouTube standard)
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        seek(Math.max(0, currentTimeRef.current - 5));
        return;
      }

      // ArrowRight -> Seek forward 5s (YouTube standard)
      if (e.key === "ArrowRight") {
        e.preventDefault();
        seek(currentTimeRef.current + 5);
        return;
      }

      // ArrowUp -> Seek forward 5s
      if (e.key === "ArrowUp") {
        e.preventDefault();
        seek(currentTimeRef.current + 5);
        return;
      }

      // ArrowDown -> Seek backward 5s
      if (e.key === "ArrowDown") {
        e.preventDefault();
        seek(Math.max(0, currentTimeRef.current - 5));
        return;
      }

      // N / n -> Next Track (YouTube standard)
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        next();
        return;
      }

      // P / p -> Previous Track (YouTube standard)
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        prev();
        return;
      }

      // M / m -> Mute / Unmute (YouTube standard)
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
        return;
      }

      // 0..9 -> Jump to 0% .. 90% of track (YouTube standard)
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        const percent = parseInt(e.key, 10) * 0.1;
        const targetTime = (durationRef.current || 0) * percent;
        seek(targetTime);
        return;
      }

      // R / r or I / i -> View Raag Lore / Info
      if (e.key === "r" || e.key === "R" || e.key === "i" || e.key === "I") {
        e.preventDefault();
        if (trackRef.current) {
          setRaagModalTrack(trackRef.current);
        }
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, toggleMute, next, prev, seek, setRaagModalTrack, setShortcutsModalOpen]);

  return (
    <>
      {/* Shortcuts Trigger Button */}
      <button
        type="button"
        onClick={() => setShortcutsModalOpen(true)}
        className="fixed bottom-4 left-4 z-30 hidden md:flex items-center gap-1.5 glass rounded-full px-3.5 py-1.5 text-xs text-cream hover:text-amber transition-all hover:scale-105 border border-white/20 shadow-lg cursor-pointer"
        title="Keyboard Shortcuts (? or /)"
        aria-label="Open Keyboard Shortcuts"
      >
        <span className="font-utility text-[11.5px] font-semibold">⌨️ Shortcuts</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-amber text-[10px] font-utility font-bold shadow-sm">
          ?
        </kbd>
      </button>

      {/* Modal rendered into document.body portal */}
      {mounted &&
        shortcutsModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setShortcutsModalOpen(false)}
          >
            <div
              className="glass rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-5 border border-amber/35 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber text-lg">⌨️</span>
                  <h3 className="font-display text-lg font-bold text-cream">
                    YouTube Keyboard Shortcuts
                  </h3>
                </div>
                <button
                  onClick={() => setShortcutsModalOpen(false)}
                  className="text-cream/70 hover:text-cream p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close Shortcuts Modal"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 font-utility text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">Play / Pause</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      Space
                    </kbd>
                    <span className="text-cream/50">or</span>
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      K
                    </kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">Seek Forward / Back 10s</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      J
                    </kbd>
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      L
                    </kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">Seek Forward / Back 5s</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      ←
                    </kbd>
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      →
                    </kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">Next / Prev Track</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      N
                    </kbd>
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      P
                    </kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">Mute / Unmute Audio</span>
                  <kbd className="px-2.5 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                    M
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">Jump to 0% .. 90%</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      0
                    </kbd>
                    <span className="text-cream/50">..</span>
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      9
                    </kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">View Raag Lore / Info</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      R
                    </kbd>
                    <span className="text-cream/50">or</span>
                    <kbd className="px-2 py-1 rounded bg-white/20 text-amber font-bold shadow-sm">
                      I
                    </kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm">
                  <span className="text-cream font-medium">Close Window</span>
                  <kbd className="px-2 py-1 rounded bg-white/20 text-cream font-bold shadow-sm">
                    Esc
                  </kbd>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-white/10 text-[11.5px] text-cream/70 font-medium">
                Press <kbd className="text-amber font-bold">?</kbd> anywhere to open or close this helper.
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}


