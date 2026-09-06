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
import { track as trackAnalyticsEvent } from "@vercel/analytics";
import { loadYouTubeAPI } from "@/lib/load-youtube-api";
import type { Playlist, Track, PaharId, PaharInfo } from "@/lib/types";
import { getCurrentPahar, getFilteredTracks, PRAHARS } from "@/lib/raags";

const EMBED_ELEMENT_ID = "yt-embed-target";

type PlayerEngineValue = {
  playlists: Playlist[];
  playlistIndex: number;
  trackIndex: number;
  track: Track;
  activeTracks: Track[];
  playing: boolean;
  ready: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  selectedPahar: "auto" | "all" | PaharId;
  currentPahar: PaharInfo;
  setSelectedPahar: (pahar: "auto" | "all" | PaharId) => void;
  setPlaylistIndex: (index: number) => void;
  selectTrack: (trackId: string) => void;
  toggle: () => void;
  toggleMute: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  raagModalTrack: Track | null;
  setRaagModalTrack: (track: Track | null) => void;
  raagLibraryOpen: boolean;
  setRaagLibraryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shortcutsModalOpen: boolean;
  setShortcutsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlayerEngineContext = createContext<PlayerEngineValue | null>(null);

export function usePlayerEngine() {
  const ctx = useContext(PlayerEngineContext);
  if (!ctx) throw new Error("usePlayerEngine must be used within PlayerEngineProvider");
  return ctx;
}

export function usePlayerEngineOptional() {
  return useContext(PlayerEngineContext);
}

const DEFAULT_FALLBACK_TRACK: Track = {
  id: "default-track-1",
  title: "Gayatri Mantra",
  artist: "Anuradha Paudwal",
  film: "Bhakti Bhaav",
  year: 2020,
  duration: 300,
  videoId: "NW9vT3Y_-c4",
  raag: "Bhairav",
  raagHindi: "भैरव",
  thaat: "Bhairav",
  pahar: "morning",
  timeSlot: "06:00 - 09:00 (प्रातःकाल)",
  mood: "शांति एवं नव-जागरण (Devotion & Serenity)",
  deity: "Devi",
  description: "प्रातःकालीन पावन गायत्री महामंत्र, जो बुद्धि और चेतना को जागृत करता है।",
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
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Pahar & Raag state
  const [selectedPahar, setSelectedPaharState] = useState<"auto" | "all" | PaharId>("auto");
  const [currentPahar, setCurrentPahar] = useState<PaharInfo>(PRAHARS.evening);
  const [raagModalTrack, setRaagModalTrack] = useState<Track | null>(null);
  const [raagLibraryOpen, setRaagLibraryOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  const playerRef = useRef<YT.Player | null>(null);
  const rafRef = useRef<number | null>(null);

  // Guard against infinite auto-skipping on mobile errors
  const consecutiveErrorsRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = playing;

  // Live IST Pahar updater
  useEffect(() => {
    setCurrentPahar(getCurrentPahar());
    const timer = setInterval(() => {
      setCurrentPahar(getCurrentPahar());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const [playlistsState, setPlaylistsState] = useState<Playlist[]>(initialPlaylists);

  // Synchronize state if initialPlaylists prop changes
  useEffect(() => {
    if (Array.isArray(initialPlaylists) && initialPlaylists.length > 0) {
      setPlaylistsState(initialPlaylists);
    }
  }, [initialPlaylists]);

  // Live client-side playlist update fetcher
  useEffect(() => {
    let isMounted = true;
    async function fetchLatestPlaylists() {
      try {
        const res = await fetch("/api/playlists", { cache: "no-store" });
        if (res.ok) {
          const fresh: Playlist[] = await res.json();
          if (isMounted && Array.isArray(fresh) && fresh.length > 0 && fresh[0]?.tracks) {
            setPlaylistsState(fresh);
          }
        }
      } catch (err) {
        console.warn("[Player Engine] Auto-sync playlist fetch error:", err);
      }
    }

    fetchLatestPlaylists();
    window.addEventListener("focus", fetchLatestPlaylists);
    const intervalId = setInterval(fetchLatestPlaylists, 15000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", fetchLatestPlaylists);
      clearInterval(intervalId);
    };
  }, []);

  const safePlaylists = useMemo(() => {
    if (Array.isArray(playlistsState) && playlistsState.length > 0) {
      const valid = playlistsState.filter(
        (p) => p && Array.isArray(p.tracks) && p.tracks.length > 0
      );
      if (valid.length > 0) return valid;
    }
    return [DEFAULT_FALLBACK_PLAYLIST];
  }, [playlistsState]);

  const playlistIndexClamped = Math.min(
    Math.max(0, playlistIndex),
    safePlaylists.length - 1
  );
  const playlist =
    safePlaylists[playlistIndexClamped] ??
    safePlaylists[0] ??
    DEFAULT_FALLBACK_PLAYLIST;

  const rawTracks =
    Array.isArray(playlist?.tracks) && playlist.tracks.length > 0
      ? playlist.tracks
      : [DEFAULT_FALLBACK_TRACK];

  // Filtered queue based on selected Pahar
  const activeTracks = useMemo(() => {
    return getFilteredTracks(rawTracks, selectedPahar, currentPahar);
  }, [rawTracks, selectedPahar, currentPahar]);

  const trackIndexClamped = Math.min(
    Math.max(0, trackIndex),
    activeTracks.length - 1
  );
  const track =
    activeTracks[trackIndexClamped] ?? activeTracks[0] ?? DEFAULT_FALLBACK_TRACK;

  const goToOffset = useCallback(
    (offset: 1 | -1) => {
      if (activeTracks.length === 0) return;
      setTrackIndex((current) => {
        const total = activeTracks.length;
        return (current + offset + total) % total;
      });
      setCurrentTime(0);
    },
    [activeTracks.length]
  );

  // Create the YT player exactly once on a stable static DOM element.
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
          controls: 0,
          disablekb: 1,
        },
        events: {
          onReady: () => {
            setReady(true);
            consecutiveErrorsRef.current = 0;
          },
          onStateChange: (event) => {
            if (event.data === YTApi.PlayerState.PLAYING) {
              setPlaying(true);
              consecutiveErrorsRef.current = 0;
            } else if (event.data === YTApi.PlayerState.PAUSED) {
              setPlaying(false);
            } else if (event.data === YTApi.PlayerState.ENDED) {
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
            // Protect against infinite auto-skipping loops
            consecutiveErrorsRef.current += 1;
            if (consecutiveErrorsRef.current < 3) {
              setTimeout(() => {
                goToOffset(1);
              }, 600);
            } else {
              setPlaying(false);
              consecutiveErrorsRef.current = 0;
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch (e) {
        console.warn("Error destroying YT player:", e);
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SINGLE, UNIFIED effect to load or cue video when track changes
  const prevVideoIdRef = useRef<string>(track?.videoId);
  useEffect(() => {
    if (!ready || !playerRef.current || !track?.videoId) return;

    if (prevVideoIdRef.current !== track.videoId) {
      prevVideoIdRef.current = track.videoId;
      setCurrentTime(0);
      setDuration(track.duration || 0);

      try {
        if (isPlayingRef.current) {
          playerRef.current.loadVideoById(track.videoId);
        } else {
          playerRef.current.cueVideoById(track.videoId);
        }
      } catch (err) {
        console.warn("Failed to load/cue video:", err);
      }
    }
  }, [track?.videoId, ready]);

  // Progress loop, driven by rAF only while actually playing.
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === "function") {
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

  const setSelectedPahar = useCallback(
    (pahar: "auto" | "all" | PaharId) => {
      setSelectedPaharState(pahar);
      setTrackIndex(0);
      setCurrentTime(0);
    },
    []
  );

  const selectTrack = useCallback(
    (trackId: string) => {
      const idx = activeTracks.findIndex((t) => t.id === trackId);
      if (idx !== -1) {
        setTrackIndex(idx);
        setPlaying(true);
        setCurrentTime(0);
        if (playerRef.current && activeTracks[idx]?.videoId) {
          playerRef.current.loadVideoById(activeTracks[idx].videoId);
        }
      }
    },
    [activeTracks]
  );

  const setPlaylistIndex = useCallback((index: number) => {
    setPlaylistIndexState(index);
    setTrackIndex(0);
    setPlaying(true);
    setCurrentTime(0);
  }, []);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [playing]);

  const next = useCallback(() => {
    setPlaying(true);
    goToOffset(1);
  }, [goToOffset]);

  const prev = useCallback(() => {
    setPlaying(true);
    goToOffset(-1);
  }, [goToOffset]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }, [muted]);

  const value = useMemo<PlayerEngineValue>(
    () => ({
      playlists: safePlaylists,
      playlistIndex: playlistIndexClamped,
      trackIndex: trackIndexClamped,
      track,
      activeTracks,
      playing,
      ready,
      muted,
      currentTime,
      duration,
      selectedPahar,
      currentPahar,
      setSelectedPahar,
      selectTrack,
      setPlaylistIndex,
      toggle,
      toggleMute,
      next,
      prev,
      seek,
      raagModalTrack,
      setRaagModalTrack,
      raagLibraryOpen,
      setRaagLibraryOpen,
      shortcutsModalOpen,
      setShortcutsModalOpen,
    }),
    [
      safePlaylists,
      playlistIndexClamped,
      trackIndexClamped,
      track,
      activeTracks,
      playing,
      ready,
      muted,
      currentTime,
      duration,
      selectedPahar,
      currentPahar,
      setSelectedPahar,
      selectTrack,
      setPlaylistIndex,
      toggle,
      toggleMute,
      next,
      prev,
      seek,
      raagModalTrack,
      raagLibraryOpen,
      shortcutsModalOpen,
    ],
  );

  return (
    <PlayerEngineContext.Provider value={value}>
      {children}
      {/* Stable off-screen YouTube container that isolates YouTube IFrame API DOM replacements from React reconciliation */}
      <div
        className="fixed -left-[9999px] top-0 h-1 w-1 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div id={EMBED_ELEMENT_ID} />
      </div>
    </PlayerEngineContext.Provider>
  );
}
