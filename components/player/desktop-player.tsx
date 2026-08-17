"use client";

import { usePlayerEngine } from "./player-engine";
import { Vinyl } from "./vinyl";
import { SeekBar, TimeDisplay } from "./seek-bar";
import { Transport } from "./transport";
import { PlaylistSwitcher } from "./playlist-switcher";

export function DesktopPlayer() {
  const { track } = usePlayerEngine();

  return (
    <div className="hidden w-full max-w-xl sm:flex sm:flex-col sm:items-center sm:gap-2">
      <PlaylistSwitcher />
      <div className="glass flex w-full items-center gap-4 rounded-full p-3 pr-5">
        <Vinyl which="desktop" size={80} />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-semibold leading-tight text-cream">
              {track.title}
            </p>
            <p className="truncate text-[12.5px] text-cream/70">
              {track.artist} &middot; {track.film} ({track.year})
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
