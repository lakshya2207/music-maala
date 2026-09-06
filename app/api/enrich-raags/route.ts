import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlaylistModel } from "@/models/Playlist";
import { enrichTracksWithAI } from "@/lib/gemini";
import type { Track } from "@/lib/types";

export async function POST(req: Request) {
  console.log("[Enrich Raags API] Starting Raag & Pahar enrichment request...");

  // Password authentication check for fair use protection
  const configuredPassword = process.env.PASSWORD || process.env.password;
  if (configuredPassword && configuredPassword.trim() !== "") {
    let inputPassword = req.headers.get("x-admin-password");
    if (!inputPassword) {
      try {
        const body = await req.clone().json();
        inputPassword = body?.password;
      } catch {
        // Request body might not be JSON
      }
    }

    if (!inputPassword || inputPassword.trim() !== configuredPassword.trim()) {
      console.warn("[Enrich Raags API] Unauthorized request attempt - invalid or missing password.");
      return NextResponse.json(
        { ok: false, error: "Unauthorized: Invalid or missing authentication password." },
        { status: 401 }
      );
    }
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      console.error("[Enrich Raags API] MongoDB connection failed.");
      return NextResponse.json(
        { error: "MONGODB_URI environment variable is missing or connection failed." },
        { status: 500 }
      );
    }

    console.log("[Enrich Raags API] Step 1/3: Retrieving current playlist tracks from MongoDB...");
    const playlistDoc = await PlaylistModel.findOne({ id: "youtube-playlist" });
    if (!playlistDoc || !playlistDoc.tracks || playlistDoc.tracks.length === 0) {
      console.warn("[Enrich Raags API] No tracks found in MongoDB playlist.");
      return NextResponse.json(
        { error: "No tracks found in playlist. Please sync with YouTube first." },
        { status: 404 }
      );
    }

    console.log(`[Enrich Raags API] Found ${playlistDoc.tracks.length} tracks to enrich.`);
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
      pahar: t.pahar,
      timeSlot: t.timeSlot,
      mood: t.mood,
      deity: t.deity,
      description: t.description,
    }));

    console.log("[Enrich Raags API] Step 2/3: Executing AI / Heuristic Raag analysis...");
    const result = await enrichTracksWithAI(rawTracks);

    console.log(`[Enrich Raags API] Step 3/3: Saving ${result.tracks.length} enriched tracks back to MongoDB (Model: ${result.model})...`);
    playlistDoc.tracks = result.tracks as any;
    playlistDoc.updatedAt = new Date();
    await playlistDoc.save();

    console.log("[Enrich Raags API] Successfully saved enriched tracks to MongoDB.");
    return NextResponse.json({
      ok: true,
      count: result.tracks.length,
      usedAI: result.usedAI,
      model: result.model,
      tracks: result.tracks,
    });
  } catch (err) {
    console.error("[Enrich Raags API] Error in /api/enrich-raags:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
