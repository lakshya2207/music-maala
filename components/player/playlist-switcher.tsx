"use client";

import { usePlayerEngine } from "./player-engine";

export function PlaylistSwitcher({ className = "" }: { className?: string }) {
  const { playlists, playlistIndex, setPlaylistIndex } = usePlayerEngine();

  return (
    <div className={`flex items-center gap-1 ${className}`} role="tablist" aria-label="Playlists">
      {playlists.map((playlist, index) => (
        <button
          key={playlist.id}
          type="button"
          role="tab"
          aria-selected={index === playlistIndex}
          onClick={() => setPlaylistIndex(index)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-utility uppercase tracking-wide transition ${
            index === playlistIndex
              ? "bg-amber/20 text-amber ring-1 ring-amber/40"
              : "text-cream-dim hover:text-cream"
          }`}
        >
          {playlist.name}
        </button>
      ))}
    </div>
  );
}
