"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { track as trackAnalyticsEvent } from "@vercel/analytics";
import { loadYouTubeAPI } from "@/lib/load-youtube-api";
import type { Playlist, Track } from "@/lib/types";

const EMBED_ELEMENT_ID = "yt-embed-target";

type PlayerEngineValue = {
  playlists: Playlist[];
  playlistIndex: number;
  trackIndex: number;
  track: Track;
  playing: boolean;
  ready: boolean;
  currentTime: number;
  duration: number;
  setPlaylistIndex: (index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  /** Attach the currently-visible artwork slot so the real video element
   *  can be portaled into it. Only one slot should be visible at a time. */
  registerVinylSlot: (which: "desktop" | "mobile", node: HTMLDivElement | null) => void;
};

const PlayerEngineContext = createContext<PlayerEngineValue | null>(null);

export function usePlayerEngine() {
  const ctx = useContext(PlayerEngineContext);
  if (!ctx) throw new Error("usePlayerEngine must be used within PlayerEngineProvider");
  return ctx;
}

const DEFAULT_FALLBACK_TRACK: Track = {
  id: "default-track-1",
  title: "Gayatri Mantra",
  artist: "Anuradha Paudwal",
  film: "Bhakti Bhaav",
  year: 2020,
  duration: 300,
  videoId: "NW9vT3Y_-c4",
};

const DEFAULT_FALLBACK_PLAYLIST: Playlist = {
  id: "default-playlist-1",
  name: "Devotional Bhakti",
  tracks: [DEFAULT_FALLBACK_TRACK],
};

export function PlayerEngineProvider({
  children,
  initialPlaylists,
}: {
  children: React.ReactNode;
  initialPlaylists: Playlist[];
}) {
  const [playlistIndex, setPlaylistIndexState] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSlot, setActiveSlot] = useState<"desktop" | "mobile">("mobile");

  const playerRef = useRef<YT.Player | null>(null);
  const rafRef = useRef<number | null>(null);
  const desktopSlotRef = useRef<HTMLDivElement | null>(null);
  const mobileSlotRef = useRef<HTMLDivElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

  const safePlaylists = useMemo(() => {
    if (Array.isArray(initialPlaylists) && initialPlaylists.length > 0) {
      const valid = initialPlaylists.filter(
        (p) => p && Array.isArray(p.tracks) && p.tracks.length > 0
      );
      if (valid.length > 0) return valid;
    }
    return [DEFAULT_FALLBACK_PLAYLIST];
  }, [initialPlaylists]);

  const playlistIndexClamped = Math.min(
    Math.max(0, playlistIndex),
    safePlaylists.length - 1
  );
  const playlist =
    safePlaylists[playlistIndexClamped] ??
    safePlaylists[0] ??
    DEFAULT_FALLBACK_PLAYLIST;

  const safeTracks =
    Array.isArray(playlist?.tracks) && playlist.tracks.length > 0
      ? playlist.tracks
      : [DEFAULT_FALLBACK_TRACK];

  const trackIndexClamped = Math.min(
    Math.max(0, trackIndex),
    safeTracks.length - 1
  );
  const track =
    safeTracks[trackIndexClamped] ?? safeTracks[0] ?? DEFAULT_FALLBACK_TRACK;

  const registerVinylSlot = useCallback(
    (which: "desktop" | "mobile", node: HTMLDivElement | null) => {
      if (which === "desktop") desktopSlotRef.current = node;
      else mobileSlotRef.current = node;
    },
    [],
  );

  // Track which breakpoint is visually active so we always portal the real
  // <iframe> into the slot the person can actually see (never a hidden one).
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    const update = () => setActiveSlot(mql.matches ? "desktop" : "mobile");
    update();
    mql.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const node = activeSlot === "desktop" ? desktopSlotRef.current : mobileSlotRef.current;
    setPortalTarget(node);
  });

  // Create the YT player exactly once.
  useEffect(() => {
    let cancelled = false;
    if (!track?.videoId) return;

    loadYouTubeAPI().then((YTApi) => {
      if (cancelled) return;
      playerRef.current = new YTApi.Player(EMBED_ELEMENT_ID, {
        videoId: track.videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (event) => {
            if (event.data === YTApi.PlayerState.PLAYING) setPlaying(true);
            else if (event.data === YTApi.PlayerState.PAUSED) setPlaying(false);
            else if (event.data === YTApi.PlayerState.ENDED) {
              setPlaying(false);
              goToOffset(1);
            }
          },
          onError: (event) => {
            if (track?.videoId) {
              trackAnalyticsEvent("youtube_playback_error", {
                code: event.data,
                videoId: track.videoId,
              });
            }
            goToOffset(1);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load a new video whenever the selected track changes (but keep the same
  // player instance so the visible iframe never gets torn down/rebuilt).
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (!ready || !track?.videoId) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    playerRef.current?.loadVideoById(track.videoId);
    setCurrentTime(0);
    setDuration(track.duration || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.videoId, ready]);

  // Progress loop, driven by rAF only while actually playing.
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      const player = playerRef.current;
      if (player) {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || track?.duration || 0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, track?.duration]);

  function goToOffset(offset: 1 | -1) {
    if (safeTracks.length === 0) return;
    setTrackIndex((current) => {
      const total = safeTracks.length;
      return (current + offset + total) % total;
    });
    setPlaying(true);
  }

  const setPlaylistIndex = useCallback((index: number) => {
    setPlaylistIndexState(index);
    setTrackIndex(0);
    setPlaying(true);
    isFirstLoad.current = false;
  }, []);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  }, [playing]);

  const next = useCallback(() => goToOffset(1), [safeTracks.length]);
  const prev = useCallback(() => goToOffset(-1), [safeTracks.length]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  // Whenever the track changes because of a next/prev/ended advance (not the
  // very first load), push the new video into the existing player.
  useEffect(() => {
    if (!ready || isFirstLoad.current || !track?.videoId) return;
    playerRef.current?.loadVideoById(track.videoId);
  }, [trackIndexClamped, playlistIndexClamped, ready, track?.videoId]);

  const value = useMemo<PlayerEngineValue>(
    () => ({
      playlists: safePlaylists,
      playlistIndex: playlistIndexClamped,
      trackIndex: trackIndexClamped,
      track,
      playing,
      ready,
      currentTime,
      duration,
      setPlaylistIndex,
      toggle,
      next,
      prev,
      seek,
      registerVinylSlot,
    }),
    [
      safePlaylists,
      playlistIndexClamped,
      trackIndexClamped,
      track,
      playing,
      ready,
      currentTime,
      duration,
      setPlaylistIndex,
      toggle,
      next,
      prev,
      seek,
      registerVinylSlot,
    ],
  );

  return (
    <PlayerEngineContext.Provider value={value}>
      {children}
      {portalTarget &&
        createPortal(
          <div id={EMBED_ELEMENT_ID} className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />,
          portalTarget,
        )}
    </PlayerEngineContext.Provider>
  );
}
