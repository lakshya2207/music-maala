import type { Playlist, Track } from "./types";
import { connectToDatabase } from "./mongodb";
import { PlaylistModel } from "@/models/Playlist";

export const DEFAULT_TRACKS: Track[] = [
  {
    id: "default-1",
    title: "Gayatri Mantra",
    artist: "Anuradha Paudwal",
    film: "Bhakti Bhaav",
    year: 2020,
    duration: 300,
    videoId: "NW9vT3Y_-c4",
    raag: "Bhairav",
    raagHindi: "भैरव",
    thaat: "Bhairav",
    prahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातःकाल)",
    mood: "शांति एवं नव-जागरण (Devotion & Serenity)",
    deity: "Devi",
    description: "प्रातःकालीन पावन गायत्री महामंत्र, जो बुद्धि और चेतना को जागृत करता है।",
  },
  {
    id: "default-2",
    title: "Shree Hanuman Chalisa",
    artist: "Hariharan",
    film: "T-Series Bhakti",
    year: 1992,
    duration: 580,
    videoId: "AETFvQonfV8",
    raag: "Bilawal",
    raagHindi: "बिलावल",
    thaat: "Bilawal",
    prahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातः प्रहर)",
    mood: "उत्साह, शक्ति एवं संरक्षण (Strength & Protection)",
    deity: "Hanuman",
    description: "बिलावल राग आधारित दिव्य हनुमान चालीसा, जो सकल संकटों का नाश करती है।",
  },
  {
    id: "default-3",
    title: "Achyutam Keshavam",
    artist: "Vikram Hazra",
    film: "Art of Living",
    year: 2015,
    duration: 320,
    videoId: "O8FjK_0hD8g",
    raag: "Pahadi",
    raagHindi: "पहाड़ी",
    thaat: "Bilawal",
    prahar: "anytime",
    timeSlot: "सर्वकालीन / सांध्यकाल (Anytime / Evening)",
    mood: "माधुर्य एवं कृष्ण शरणागति (Sweet Devotion)",
    deity: "Krishna",
    description: "राग पहाड़ी के सरल व मधुर स्वरों में भगवान श्री कृष्ण के दिव्य नामों का संकीर्तन।",
  },
];

export const FALLBACK_PLAYLISTS: Playlist[] = [
  {
    id: "youtube-playlist",
    name: "म्यूज़िक माला",
    tracks: DEFAULT_TRACKS,
  },
];

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await PlaylistModel.find({}).lean();
      if (docs && docs.length > 0) {
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

      const seeded = await PlaylistModel.create(FALLBACK_PLAYLISTS[0]);
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
    console.warn("MongoDB fetch error, falling back to default playlists:", err);
  }

  return FALLBACK_PLAYLISTS;
}
