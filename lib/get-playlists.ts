import fs from "fs";
import path from "path";
import type { Playlist } from "./types";
import { connectToDatabase } from "./mongodb";
import { PlaylistModel } from "@/models/Playlist";

const CACHE_PATH = path.join(process.cwd(), "data", "playlist-cache.json");

export const DEFAULT_TRACKS = [
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

export const FALLBACK_PLAYLISTS: Playlist[] = [
  {
    id: "youtube-playlist",
    name: "म्यूज़िक माला",
    tracks: DEFAULT_TRACKS,
  },
];

export async function getPlaylists(): Promise<Playlist[]> {
  // 1. Try MongoDB first if configured
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await PlaylistModel.find({}).lean();
      if (docs && docs.length > 0) {
        return docs.map((doc) => ({
          id: doc.id,
          name: doc.name,
          tracks: doc.tracks.map((t) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            film: t.film,
            year: t.year,
            duration: t.duration,
            videoId: t.videoId,
          })),
        }));
      }

      // If database connected but empty, seed initial playlist
      const seeded = await PlaylistModel.create(FALLBACK_PLAYLISTS[0]);
      return [
        {
          id: seeded.id,
          name: seeded.name,
          tracks: seeded.tracks.map((t) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            film: t.film,
            year: t.year,
            duration: t.duration,
            videoId: t.videoId,
          })),
        },
      ];
    }
  } catch (err) {
    console.warn("MongoDB fetch/connect error, falling back to cache/defaults:", err);
  }

  // 2. Fallback to local JSON cache file if present
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const raw = fs.readFileSync(CACHE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as Playlist[];
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.some((p) => Array.isArray(p.tracks) && p.tracks.length > 0)
      ) {
        return parsed;
      }
    }
  } catch {
    // Cache file read error
  }

  // 3. Absolute fallback
  return FALLBACK_PLAYLISTS;
}
