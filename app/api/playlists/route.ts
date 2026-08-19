import { NextResponse } from "next/server";
import { getPlaylists } from "@/lib/get-playlists";
import { connectToDatabase } from "@/lib/mongodb";
import { PlaylistModel } from "@/models/Playlist";

export async function GET() {
  const playlists = await getPlaylists();
  return NextResponse.json(playlists);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, tracks } = body;

    if (!id || !name || !Array.isArray(tracks)) {
      return NextResponse.json({ error: "Missing required fields: id, name, tracks array" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "MongoDB is not configured or connected." }, { status: 503 });
    }

    const updated = await PlaylistModel.findOneAndUpdate(
      { id },
      { name, tracks, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, playlist: updated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
