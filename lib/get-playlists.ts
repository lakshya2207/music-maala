/**
 * Server-only helper — uses Node `fs` and must never be imported from a
 * client component.  Call it from Server Components or API routes only.
 */
import fs from "fs";
import path from "path";
import type { Playlist } from "./types";

const CACHE_PATH = path.join(process.cwd(), "data", "playlist-cache.json");

const DEFAULT_TRACKS = [
  {
    id: "default-1",
    title: "Gayatri Mantra",
    artist: "Anuradha Paudwal",
    film: "Bhakti Bhaav",
    year: 2020,
    duration: 300,
    videoId: "NW9vT3Y_-c4",
  },
  {
    id: "default-2",
    title: "Shree Hanuman Chalisa",
    artist: "Hariharan",
    film: "T-Series Bhakti",
    year: 1992,
    duration: 580,
    videoId: "AETFvQonfV8",
  },
  {
    id: "default-3",
    title: "Achyutam Keshavam",
    artist: "Vikram Hazra",
    film: "Art of Living",
    year: 2015,
    duration: 320,
    videoId: "O8FjK_0hD8g",
  },
];

const FALLBACK: Playlist[] = [
  {
    id: "youtube-playlist",
    name: "Devotional Bhakti",
    tracks: DEFAULT_TRACKS,
  },
];

export function getPlaylists(): Playlist[] {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Playlist[];
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.some(p => Array.isArray(p.tracks) && p.tracks.length > 0)) {
      return parsed;
    }
  } catch {
    // Cache not yet created — first sync hasn't run yet.
  }
  return FALLBACK;
}
