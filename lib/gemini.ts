import type { Track, PraharId } from "./types";
import { enrichTrackRaag, RAAG_MASTER } from "./raags";

export interface EnrichmentResult {
  tracks: Track[];
  usedAI: boolean;
  model?: string;
  error?: string;
}

export async function enrichTracksWithAI(tracks: Track[]): Promise<EnrichmentResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    const enriched = tracks.map((t) => enrichTrackRaag(t));
    return {
      tracks: enriched,
      usedAI: false,
      model: "Curated Classical Knowledge Base",
    };
  }

  try {
    const prompt = `
You are an expert in Indian Classical Music (Hindustani & Carnatic Sangeet), Raag-Samay Chakra (8 Prahars of the day), and Bhakti Sangeet.
Analyze the following list of devotional songs / bhajans and determine their Indian Classical Raag, Thaat, optimal Prahar (time of day), Mood/Rasa, Deity, and brief spiritual significance.

Songs to analyze:
${JSON.stringify(
  tracks.map((t, idx) => ({
    index: idx,
    id: t.id,
    title: t.title,
    artist: t.artist,
    film: t.film,
  })),
  null,
  2
)}

Valid Prahar values:
- "dawn" (03:00 - 06:00, Brahma Muhurta)
- "morning" (06:00 - 09:00, Pratham Prahar)
- "late-morning" (09:00 - 12:00, Dwitiya Prahar)
- "afternoon" (12:00 - 15:00, Tritiya Prahar)
- "late-afternoon" (15:00 - 18:00, Chaturtha Prahar)
- "evening" (18:00 - 21:00, Sandhya Prahar / Aarti)
- "night" (21:00 - 00:00, Dwitiya Prahar Raatri)
- "late-night" (00:00 - 03:00, Tritiya Prahar Raatri)
- "anytime" (Sarva-kalin / Universal, e.g. Bhairavi, Pahadi, Shivranjani)

Return ONLY a valid JSON array of objects with the exact structure:
[
  {
    "index": number,
    "raag": "string",
    "raagHindi": "string (राग का देवनागरी नाम)",
    "thaat": "string",
    "prahar": "dawn" | "morning" | "late-morning" | "afternoon" | "late-afternoon" | "evening" | "night" | "late-night" | "anytime",
    "timeSlot": "string",
    "mood": "string",
    "deity": "string",
    "description": "string"
  }
]
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Gemini API call failed, falling back to curated heuristics:", errText);
      const enriched = tracks.map((t) => enrichTrackRaag(t));
      return {
        tracks: enriched,
        usedAI: false,
        model: "Curated Classical Knowledge Base (Fallback)",
        error: `Gemini API response: ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      const enriched = tracks.map((t) => enrichTrackRaag(t));
      return {
        tracks: enriched,
        usedAI: false,
        model: "Curated Classical Knowledge Base (Fallback)",
      };
    }

    const parsedResults: Array<{
      index: number;
      raag: string;
      raagHindi?: string;
      thaat?: string;
      prahar: PraharId;
      timeSlot?: string;
      mood?: string;
      deity?: string;
      description?: string;
    }> = JSON.parse(rawContent);

    const enrichedTracks: Track[] = tracks.map((track, idx) => {
      const aiResult = parsedResults.find((r) => r.index === idx);
      if (!aiResult) return enrichTrackRaag(track);

      const master = RAAG_MASTER[aiResult.raag];

      return {
        ...track,
        raag: aiResult.raag || track.raag || (master ? master.name : "Bhairavi"),
        raagHindi:
          aiResult.raagHindi ||
          track.raagHindi ||
          (master ? master.nameHindi : aiResult.raag || "भैरवी"),
        thaat: aiResult.thaat || track.thaat || (master ? master.thaat : "Bilawal"),
        prahar: aiResult.prahar || track.prahar || (master ? master.prahar : "anytime"),
        timeSlot:
          aiResult.timeSlot ||
          track.timeSlot ||
          (master ? master.timeSlot : "सर्वकालीन"),
        mood: aiResult.mood || track.mood || (master ? master.mood : "भक्ति भाव"),
        deity: aiResult.deity || track.deity || "Universal",
        description:
          aiResult.description ||
          track.description ||
          (master ? master.spiritualSignificance : ""),
      };
    });

    return {
      tracks: enrichedTracks,
      usedAI: true,
      model: "Gemini 1.5 Flash",
    };
  } catch (err) {
    console.error("Error during AI Raag enrichment:", err);
    const enriched = tracks.map((t) => enrichTrackRaag(t));
    return {
      tracks: enriched,
      usedAI: false,
      model: "Curated Classical Knowledge Base (Fallback)",
      error: String(err),
    };
  }
}
