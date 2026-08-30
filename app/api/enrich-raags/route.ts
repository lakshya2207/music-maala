import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlaylistModel } from "@/models/Playlist";
import { enrichTracksWithAI } from "@/lib/gemini";
import type { Track } from "@/lib/types";

export async function POST() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "MONGODB_URI environment variable is missing or connection failed." },
        { status: 500 }
      );
    }

    const playlistDoc = await PlaylistModel.findOne({ id: "youtube-playlist" });
    if (!playlistDoc || !playlistDoc.tracks || playlistDoc.tracks.length === 0) {
      return NextResponse.json(
        { error: "No tracks found in playlist. Please sync with YouTube first." },
        { status: 404 }
      );
    }

    const rawTracks: Track[] = playlistDoc.tracks.map((t: any) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      film: t.film,
      year: t.year,
      duration: t.duration,
      videoId: t.videoId,
      raag: t.raag,
      raagHindi: t.raagHindi,
      thaat: t.thaat,
      prahar: t.prahar,
      timeSlot: t.timeSlot,
      mood: t.mood,
      deity: t.deity,
      description: t.description,
    }));

    const result = await enrichTracksWithAI(rawTracks);

    playlistDoc.tracks = result.tracks as any;
    playlistDoc.updatedAt = new Date();
    await playlistDoc.save();

    return NextResponse.json({
      ok: true,
      count: result.tracks.length,
      usedAI: result.usedAI,
      model: result.model,
      tracks: result.tracks,
    });
  } catch (err) {
    console.error("Error in /api/enrich-raags:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
