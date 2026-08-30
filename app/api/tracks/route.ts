import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlaylistModel } from "@/models/Playlist";
import type { Track } from "@/lib/types";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updatedTrack: Track = body.track;

    if (!updatedTrack || !updatedTrack.id) {
      return NextResponse.json({ error: "Invalid track data provided" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "MONGODB_URI missing or connection failed." },
        { status: 500 }
      );
    }

    const playlistDoc = await PlaylistModel.findOne({ id: "youtube-playlist" });
    if (!playlistDoc) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const trackIndex = playlistDoc.tracks.findIndex((t: any) => t.id === updatedTrack.id);
    if (trackIndex === -1) {
      return NextResponse.json({ error: "Track not found in playlist" }, { status: 404 });
    }

    const existing = (playlistDoc.tracks[trackIndex] as any).toObject
      ? (playlistDoc.tracks[trackIndex] as any).toObject()
      : playlistDoc.tracks[trackIndex];

    playlistDoc.tracks[trackIndex] = {
      ...existing,
      ...updatedTrack,
    } as any;

    playlistDoc.updatedAt = new Date();
    await playlistDoc.save();

    return NextResponse.json({
      ok: true,
      track: playlistDoc.tracks[trackIndex],
    });
  } catch (err) {
    console.error("Error updating track:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
