import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlaylistModel } from "@/models/Playlist";
import type { Track } from "@/lib/types";

export async function PUT(req: Request) {
  console.log("[Tracks API] Received PUT /api/tracks request.");
  try {
    const body = await req.json();
    const updatedTrack: Track = body.track;

    if (!updatedTrack || !updatedTrack.id) {
      console.warn("[Tracks API] Invalid track data provided.");
      return NextResponse.json({ error: "Invalid track data provided" }, { status: 400 });
    }

    console.log(`[Tracks API] Updating track "${updatedTrack.title}" (${updatedTrack.id})...`);
    const db = await connectToDatabase();
    if (!db) {
      console.error("[Tracks API] MongoDB connection failed.");
      return NextResponse.json(
        { error: "MONGODB_URI missing or connection failed." },
        { status: 500 }
      );
    }

    const playlistDoc = await PlaylistModel.findOne({ id: "youtube-playlist" });
    if (!playlistDoc) {
      console.warn("[Tracks API] Playlist not found in MongoDB.");
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const trackIndex = playlistDoc.tracks.findIndex((t: any) => t.id === updatedTrack.id);
    if (trackIndex === -1) {
      console.warn(`[Tracks API] Track "${updatedTrack.id}" not found in playlist.`);
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

    console.log(`[Tracks API] Track "${updatedTrack.title}" (${updatedTrack.id}) successfully updated in MongoDB.`);
    return NextResponse.json({
      ok: true,
      track: playlistDoc.tracks[trackIndex],
    });
  } catch (err) {
    console.error("[Tracks API] Error updating track:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
