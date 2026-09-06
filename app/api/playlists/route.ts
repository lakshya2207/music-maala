import { NextResponse } from "next/server";
import { getPlaylists } from "@/lib/get-playlists";
import { connectToDatabase } from "@/lib/mongodb";
import { PlaylistModel } from "@/models/Playlist";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  console.log("[Playlists API] Received GET /api/playlists request.");
  const playlists = await getPlaylists();
  console.log(`[Playlists API] Responded with ${playlists.length} playlist(s), ${playlists[0]?.tracks?.length || 0} track(s).`);
  return NextResponse.json(playlists);
}

export async function POST(req: Request) {
  console.log("[Playlists API] Received POST /api/playlists request.");
  try {
    const body = await req.json();
    const { id, name, tracks } = body;

    if (!id || !name || !Array.isArray(tracks)) {
      console.warn("[Playlists API] Invalid payload provided to POST /api/playlists.");
      return NextResponse.json({ error: "Missing required fields: id, name, tracks array" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      console.error("[Playlists API] MongoDB connection unavailable.");
      return NextResponse.json({ error: "MongoDB is not configured or connected." }, { status: 503 });
    }

    console.log(`[Playlists API] Updating playlist "${id}" with ${tracks.length} track(s)...`);
    const updated = await PlaylistModel.findOneAndUpdate(
      { id },
      { name, tracks, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`[Playlists API] Playlist "${id}" successfully saved.`);
    return NextResponse.json({ ok: true, playlist: updated });
  } catch (err) {
    console.error("[Playlists API] Error updating playlist:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
