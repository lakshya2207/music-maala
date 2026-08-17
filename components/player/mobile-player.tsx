"use client";

import { usePlayerEngine } from "./player-engine";
import { Vinyl } from "./vinyl";
import { SeekBar, TimeDisplay } from "./seek-bar";
import { Transport } from "./transport";
import { PlaylistSwitcher } from "./playlist-switcher";

export function MobilePlayer() {
  const { track } = usePlayerEngine();

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-2 sm:hidden">
      <PlaylistSwitcher />
      <div className="glass flex w-full flex-col gap-3 rounded-[26px] p-4">
        <div className="flex items-center gap-3">
          <Vinyl which="mobile" size={64} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[16px] font-semibold leading-tight text-cream">
              {track.title}
            </p>
            <p className="truncate text-[13px] text-cream/70">
              {track.artist} &middot; {track.film} ({track.year})
            </p>
          </div>
        </div>

        <SeekBar />

        <div className="flex items-center justify-between">
          <TimeDisplay />
          <div className="flex-1" />
          <Transport playSize={52} />
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}
