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

export function PlayerEngineProvider({
  children,
  initialPlaylists,
}: {
  children: React.ReactNode;
  initialPlaylists: Playlist[];
}) {
  const playlists = initialPlaylists;
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

  const playlist = playlists[playlistIndex];
  const track = playlist.tracks[trackIndex];

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
            trackAnalyticsEvent("youtube_playback_error", {
              code: event.data,
              videoId: track.videoId,
            });
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
    if (!ready) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    playerRef.current?.loadVideoById(track.videoId);
    setCurrentTime(0);
    setDuration(track.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.videoId, ready]);

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
        setDuration(player.getDuration() || track.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, track.duration]);

  function goToOffset(offset: 1 | -1) {
    setTrackIndex((current) => {
      const total = playlists[playlistIndex].tracks.length;
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

  const next = useCallback(() => goToOffset(1), [playlistIndex]);
  const prev = useCallback(() => goToOffset(-1), [playlistIndex]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  // Whenever the track changes because of a next/prev/ended advance (not the
  // very first load), push the new video into the existing player.
  useEffect(() => {
    if (!ready || isFirstLoad.current) return;
    playerRef.current?.loadVideoById(track.videoId);
  }, [trackIndex, playlistIndex, ready, track.videoId]);

  const value = useMemo<PlayerEngineValue>(
    () => ({
      playlists,
      playlistIndex,
      trackIndex,
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
      playlistIndex,
      trackIndex,
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
