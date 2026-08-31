import { NextResponse } from "next/server";
import { getPlaylists } from "@/lib/get-playlists";

/** Returns the current cached playlist JSON. */
export async function GET() {
  console.log("[Playlist Cache API] Received GET /api/playlist-cache request.");
  const playlists = await getPlaylists();
  console.log(`[Playlist Cache API] Returning ${playlists.length} playlist(s).`);
  return NextResponse.json(playlists);
}

