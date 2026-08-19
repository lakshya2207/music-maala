import { NextResponse } from "next/server";
import type { Playlist, Track } from "@/lib/types";
import { connectToDatabase } from "@/lib/mongodb";
import { PlaylistModel } from "@/models/Playlist";

const PLAYLIST_ID = "PLTxRrsk4y7tk";

/** Convert ISO 8601 duration (e.g. "PT4M33S") to seconds. */
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (
    parseInt(m[1] ?? "0") * 3600 +
    parseInt(m[2] ?? "0") * 60 +
    parseInt(m[3] ?? "0")
  );
}

function parseTitle(raw: string): Pick<Track, "title" | "artist" | "film" | "year"> {
  const yearMatch = raw.match(/\b(19[0-9]{2}|20[0-2][0-9])\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : 0;

  let clean = raw
    .replace(/\(?(19[0-9]{2}|20[0-2][0-9])\)?/g, "")
    .replace(/\b(full song|full video|hd|4k|official|audio only|lyrical|lyrics|video|jukebox|audio)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const parts = clean
    .split(/\s*[|–]\s*|\s+-\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const title = parts[0] ?? raw.trim();
  const artist = parts[1] ?? "Unknown";
  const film = parts[2] ?? "Unknown";

  return { title, artist, film, year };
}

export async function POST() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY is not set. Add it to environment variables." },
      { status: 500 }
    );
  }

  try {
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

      const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
      const data = await res.json();

      if (data.error) {
        return NextResponse.json({ error: data.error.message }, { status: 500 });
      }

      for (const item of data.items ?? []) {
        const videoId = item.snippet?.resourceId?.videoId;
        const title = item.snippet?.title;
        if (videoId && title && title !== "Deleted video" && title !== "Private video") {
          rawItems.push({ videoId, title });
        }
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    if (rawItems.length === 0) {
      return NextResponse.json({ error: "Playlist is empty or contains no public videos." }, { status: 422 });
    }

    const durations: Record<string, number> = {};
    for (let i = 0; i < rawItems.length; i += 50) {
      const ids = rawItems.slice(i, i + 50).map((v) => v.videoId).join(",");
      const params = new URLSearchParams({ part: "contentDetails", id: ids, key: apiKey });
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
      const data = await res.json();
      for (const v of data.items ?? []) {
        durations[v.id] = parseDuration(v.contentDetails?.duration ?? "PT0S");
      }
    }

    const tracks: Track[] = rawItems.map((item, i) => ({
      id: `yt-${i + 1}`,
      ...parseTitle(item.title),
      duration: durations[item.videoId] ?? 240,
      videoId: item.videoId,
    }));

    const playlistObj: Playlist = {
      id: "youtube-playlist",
      name: "म्यूज़िक माला",
      tracks,
    };

    // Save directly to MongoDB
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "MONGODB_URI environment variable is missing or connection failed." },
        { status: 500 }
      );
    }

    await PlaylistModel.findOneAndUpdate(
      { id: playlistObj.id },
      { name: playlistObj.name, tracks: playlistObj.tracks, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      ok: true,
      count: tracks.length,
      syncedAt: new Date().toISOString(),
      dbSynced: true,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
