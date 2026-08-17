import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Playlist, Track } from "@/lib/types";

const PLAYLIST_ID = "PLTxRrsk4y7tk";
const CACHE_PATH = path.join(process.cwd(), "data", "playlist-cache.json");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert ISO 8601 duration (e.g. "PT4M33S") to seconds. */
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? "0") * 3600) +
         (parseInt(m[2] ?? "0") * 60) +
          parseInt(m[3] ?? "0");
}

/**
 * Best-effort parser for classic Bollywood YouTube titles.
 *
 * Common formats found in the wild:
 *   "Lag Ja Gale | Woh Kaun Thi | Lata Mangeshkar | 1964"
 *   "Mere Sapno Ki Rani - Aradhana (1969) - Kishore Kumar"
 *   "Title – Artist – Film – 1975 | Full Song HD"
 */
function parseTitle(raw: string): Pick<Track, "title" | "artist" | "film" | "year"> {
  // 1. Extract a 4-digit year
  const yearMatch = raw.match(/\b(19[0-9]{2}|20[0-2][0-9])\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : 0;

  // 2. Strip the year + common noise words
  let clean = raw
    .replace(/\(?(19[0-9]{2}|20[0-2][0-9])\)?/g, "")
    .replace(/\b(full song|full video|hd|4k|official|audio only|lyrical|lyrics|video|jukebox|audio)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  // 3. Split on |, -, – separators
  const parts = clean
    .split(/\s*[|–]\s*|\s+-\s+/)
    .map(p => p.trim())
    .filter(Boolean);

  const title  = parts[0] ?? raw.trim();
  const artist = parts[1] ?? "Unknown";
  const film   = parts[2] ?? "Unknown";

  return { title, artist, film, year };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY is not set. Add it to .env.local and restart the dev server." },
      { status: 500 },
    );
  }

  try {
    // 1. Collect all playlist items (paginated, up to 500 max per playlist)
    const rawItems: { videoId: string; title: string }[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        part: "snippet",
        playlistId: PLAYLIST_ID,
        maxResults: "50",
        key: apiKey,
        ...(pageToken ? { pageToken } : {}),
      });

      const res  = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
      const data = await res.json();

      if (data.error) {
        return NextResponse.json({ error: data.error.message }, { status: 500 });
      }

      for (const item of data.items ?? []) {
        const videoId = item.snippet?.resourceId?.videoId;
        const title   = item.snippet?.title;
        // Skip deleted / private entries
        if (videoId && title && title !== "Deleted video" && title !== "Private video") {
          rawItems.push({ videoId, title });
        }
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    if (rawItems.length === 0) {
      return NextResponse.json({ error: "Playlist is empty or contains no public videos." }, { status: 422 });
    }

    // 2. Fetch durations in batches of 50 (Videos endpoint)
    const durations: Record<string, number> = {};
    for (let i = 0; i < rawItems.length; i += 50) {
      const ids    = rawItems.slice(i, i + 50).map(v => v.videoId).join(",");
      const params = new URLSearchParams({ part: "contentDetails", id: ids, key: apiKey });
      const res    = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
      const data   = await res.json();
      for (const v of data.items ?? []) {
        durations[v.id] = parseDuration(v.contentDetails?.duration ?? "PT0S");
      }
    }

    // 3. Build Track objects
    const tracks: Track[] = rawItems.map((item, i) => ({
      id: `yt-${i + 1}`,
      ...parseTitle(item.title),
      duration: durations[item.videoId] ?? 240,
      videoId: item.videoId,
    }));

    // 4. Write cache
    const playlist: Playlist[] = [
      {
        id: "youtube-playlist",
        name: "My Playlist",
        tracks,
      },
    ];

    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(playlist, null, 2), "utf-8");

    return NextResponse.json({
      ok: true,
      count: tracks.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
