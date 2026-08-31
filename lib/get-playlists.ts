import type { Playlist, Track } from "./types";
import { connectToDatabase } from "./mongodb";
import { PlaylistModel } from "@/models/Playlist";
import { DEFAULT_TRACKS, FALLBACK_PLAYLISTS } from "./default-playlists";

export { DEFAULT_TRACKS, FALLBACK_PLAYLISTS };

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      console.log("[Playlists Engine] Querying MongoDB for playlists...");
      const docs = await PlaylistModel.find({}).lean();
      if (docs && docs.length > 0) {
        console.log(`[Playlists Engine] Found ${docs.length} playlist(s) in MongoDB with ${docs[0]?.tracks?.length || 0} track(s).`);
        return docs.map((doc) => ({
          id: doc.id,
          name: doc.name,
          tracks: doc.tracks.map((t: any) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            film: t.film,
            year: t.year,
            duration: t.duration,
            videoId: t.videoId,
            raag: t.raag || "Bhairavi",
            raagHindi: t.raagHindi || "भैरवी",
            thaat: t.thaat || "Bhairavi",
            prahar: t.prahar || "anytime",
            timeSlot: t.timeSlot || "सर्वकालीन",
            mood: t.mood || "भक्ति भाव",
            deity: t.deity || "Universal",
            description: t.description || "",
          })),
        }));
      }

      console.log("[Playlists Engine] MongoDB collection empty. Seeding initial fallback playlist...");
      const seeded = await PlaylistModel.create(FALLBACK_PLAYLISTS[0]);
      console.log(`[Playlists Engine] Seeded fallback playlist with ${seeded.tracks.length} track(s).`);
      return [
        {
          id: seeded.id,
          name: seeded.name,
          tracks: seeded.tracks.map((t: any) => ({
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
          })),
        },
      ];
    }
  } catch (err) {
    console.warn("[Playlists Engine] MongoDB fetch error, falling back to static presets:", err);
  }

  console.log(`[Playlists Engine] Using fallback playlist with ${FALLBACK_PLAYLISTS[0]?.tracks?.length || 0} track(s).`);
  return FALLBACK_PLAYLISTS;
}
