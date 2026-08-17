/**
 * Server-only helper — uses Node `fs` and must never be imported from a
 * client component.  Call it from Server Components or API routes only.
 */
import fs from "fs";
import path from "path";
import type { Playlist } from "./types";

const CACHE_PATH = path.join(process.cwd(), "data", "playlist-cache.json");

const FALLBACK: Playlist[] = [
  {
    id: "youtube-playlist",
    name: "My Playlist",
    tracks: [],
  },
];

export function getPlaylists(): Playlist[] {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Playlist[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Cache not yet created — first sync hasn't run yet.
  }
  return FALLBACK;
}
