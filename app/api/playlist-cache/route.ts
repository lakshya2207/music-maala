import { NextResponse } from "next/server";
import { getPlaylists } from "@/lib/get-playlists";

/** Returns the current cached playlist JSON (used by the admin preview). */
export function GET() {
  return NextResponse.json(getPlaylists());
}
