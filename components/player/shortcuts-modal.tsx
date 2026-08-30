"use client";

import { useEffect, useState } from "react";
import { usePlayerEngine } from "./player-engine";

export function ShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggle, next, prev, seek, currentTime, track, setRaagModalTrack, raagModalTrack } =
    usePlayerEngine();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        if (isOpen) setIsOpen(false);
        if (raagModalTrack) setRaagModalTrack(null);
        return;
      }

      if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        toggle();
        return;
      }

      if (e.key === "ArrowRight" || e.key === "l" || e.key === "L" || e.key === "n" || e.key === "N") {
        e.preventDefault();
        next();
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J" || e.key === "p" || e.key === "P") {
        e.preventDefault();
        prev();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        seek(currentTime + 5);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
        return;
      }

      if (e.key === "r" || e.key === "R" || e.key === "i" || e.key === "I") {
        e.preventDefault();
        setRaagModalTrack(track);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, next, prev, seek, currentTime, track, setRaagModalTrack, isOpen, raagModalTrack]);

  return (
    <>
      {/* Shortcuts Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-20 hidden md:flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs text-cream/70 hover:text-amber transition-all hover:scale-105 border border-white/10"
        title="Keyboard Shortcuts (?)"
      >
        <span className="font-utility text-[11px]">⌨️ Shortcuts</span>
        <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] font-utility font-semibold">?</kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="glass rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-5 border border-amber/30 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber text-lg">⌨️</span>
                <h3 className="font-display text-lg font-semibold text-cream">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-cream/50 hover:text-cream p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 font-utility text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cream/80">Play / Pause</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">Space</kbd>
                  <span className="text-cream/40">or</span>
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">K</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cream/80">Next Track</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">→</kbd>
                  <span className="text-cream/40">or</span>
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">L / N</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cream/80">Previous Track</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">←</kbd>
                  <span className="text-cream/40">or</span>
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">J / P</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cream/80">Seek Forward / Back 5s</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">↑</kbd>
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">↓</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cream/80">View Raag Lore / Info</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">R</kbd>
                  <span className="text-cream/40">or</span>
                  <kbd className="px-2 py-1 rounded bg-white/15 text-amber font-semibold">I</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cream/80">Close Window</span>
                <kbd className="px-2 py-1 rounded bg-white/15 text-cream/70 font-semibold">Esc</kbd>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-white/10 text-[11px] text-cream/40">
              Press <kbd className="text-amber">?</kbd> anywhere to open or close this helper.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
