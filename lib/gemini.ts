import type { Track, PaharId } from "./types";
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
    console.log("[Gemini AI] GEMINI_API_KEY not set. Using curated Classical Knowledge Base heuristics...");
    const enriched = tracks.map((t) => enrichTrackRaag(t));
    console.log(`[Gemini AI] Enriched ${enriched.length} track(s) using local classical heuristics.`);
    return {
      tracks: enriched,
      usedAI: false,
      model: "Curated Classical Knowledge Base",
    };
  }

  try {
    console.log(`[Gemini AI] Step 1/3: Preparing 8-Pahar prompt for ${tracks.length} track(s) for Indian Classical Sangeet analysis...`);
    const prompt = `
You are an expert scholar and musicologist in Indian Classical Music (Hindustani & Carnatic Sangeet), the Raag-Samay Chakra (Time Theory of 8 Pahars), and Bhakti Sangeet.

Your task is to analyze the following list of devotional songs/bhajans and classify each song into its classical Indian Raag, parent Thaat, one of the 8 DISTINCT PRAHARS of the day, Mood/Rasa, Deity, and spiritual significance.

CRITICAL REQUIREMENT - 8 PRAHAR DISTRIBUTION:
You MUST distribute the playlist tracks across the 8 DISTINCT PRAHARS of the 24-hour cycle.
DO NOT group all songs into generic 'morning' or 'evening'. Avoid 'anytime' unless strictly necessary. Ensure songs are distributed meaningfully among:

1. "dawn" (03:00 - 06:00, ब्रह्म मुहूर्त / उषाकाल / Sandhivrakash Purva):
   - Awakening of consciousness, soul surrender, morning invocation, Suprabhatam, deep dhyana.
   - Raags: Lalit, Bhatiyar, Vibhas, Jogia, Ramkali, Bairagi, Ahir Lalit.

2. "morning" (06:00 - 09:00, प्रातः पहर / प्रथम पहर):
   - Sunrise, fresh devotion, invigorating spiritual energy, Hanuman Chalisa, Gayatri Mantra, Prabhati.
   - Raags: Bhairav, Ahir Bhairav, Bilawal, Todi, Nat Bhairav, Gunakali, Gurjari Todi.

3. "late-morning" (09:00 - 12:00, मध्याह्न पूर्व / द्वितीय पहर):
   - Bright daytime sunshine, uplifting worship, Vishnu Sahasranama, dynamic stutis.
   - Raags: Jaunpuri, Asavari, Alhaiya Bilawal, Deshkar, Devgandhar.

4. "afternoon" (12:00 - 15:00, मध्याह्न पहर / तृतीय पहर):
   - Peak midday calmness, serene cooling contemplative devotion, Madhurashtakam.
   - Raags: Shuddha Sarang, Brindavani Sarang, Madhmad Sarang, Gaud Sarang.

5. "late-afternoon" (15:00 - 18:00, अपराह्न पहर / चतुर्थ पहर):
   - Waning day, emotional yearning, Radha-Krishna viraha bhakti, soulful surrender.
   - Raags: Bhimpalasi, Multani, Patdeep, Dhanashree, Madhuvanti.

6. "evening" (18:00 - 21:00, सांध्य पहर / संध्या आरती काल / Sandhivrakash Uttar):
   - Sunset twilight, lamp offering (Deep Daan), Aarti, festive devotion, joyful celebration.
   - Raags: Yaman, Bhupali, Puriya Dhanashree, Marwa, Shuddha Kalyan, Hameer.

7. "night" (21:00 - 00:00, रात्रि पहर / द्वितीय पहर रात्रि):
   - Sweet divine intimacy, soothing lullaby, divine resting, Achyutam Keshavam, Krishna Leela.
   - Raags: Kafi, Bageshri, Jaijaiwanti, Khamaj, Desh, Chandrakauns, Rageshri, Tilak Kamod.

8. "late-night" (00:00 - 03:00, मध्य रात्रि पहर / तृतीय पहर रात्रि):
   - Midnight silence, profound trance, Shiva Tandav, deep mystical dissolution into the infinite.
   - Raags: Malkauns, Darbari Kanada, Bihag, Jog, Kedar, Shankara, Adana.

(Only use "anytime" for universally non-time-bound raags like Bhairavi, Pahadi, Shivranjani if none of the 8 pahars fit).

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

Return ONLY a valid JSON array of objects with the exact structure:
[
  {
    "id": "string (the exact id from input, e.g. yt-1)",
    "title": "string (the exact song title from input)",
    "index": number,
    "raag": "string (e.g. Bhairav, Yaman, Malkauns, Bhimpalasi, Sarang, Jaunpuri, Kafi, Lalit)",
    "raagHindi": "string (राग का देवनागरी नाम, e.g. भैरव, यमन, मालकौंस, भीमपलासी)",
    "thaat": "string (e.g. Bhairav, Kalyan, Kafi, Bilawal, Asavari, Bhairavi, Todi, Marwa, Poorvi, Khamaj)",
    "pahar": "dawn" | "morning" | "late-morning" | "afternoon" | "late-afternoon" | "evening" | "night" | "late-night" | "anytime",
    "timeSlot": "string (e.g. 06:00 - 09:00 (प्रातःकाल))",
    "mood": "string (e.g. सांध्य आरती एवं समर्पण)",
    "deity": "string (e.g. Shiva, Krishna, Rama, Hanuman, Devi, Universal)",
    "description": "string (2-3 sentences of spiritual and classical lore)"
  }
]
`;

    // Intelligent cascading model list starting with highest intelligence
    const candidateModels: string[] = [
      ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
      "gemini-3.7-flash",
      "gemini-3.7-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.6-flash-lite",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    // Remove duplicates while preserving priority order
    const modelsToTry = Array.from(new Set(candidateModels));

    let successfulContent: string | null = null;
    let usedModelId: string | null = null;
    let lastError: string | undefined;

    console.log(`[Gemini AI] Step 2/3: Attempting model cascade (${modelsToTry.join(" -> ")})...`);

    for (let i = 0; i < modelsToTry.length; i++) {
      const modelId = modelsToTry[i];
      console.log(`[Gemini AI] [Attempt ${i + 1}/${modelsToTry.length}] Trying model "${modelId}"...`);

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
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
          console.warn(`[Gemini AI] "${modelId}" error (${res.status} ${res.statusText}): ${errText.slice(0, 120)}... Quota or model issue, cascading to next model.`);
          lastError = `${modelId}: ${res.status} ${res.statusText}`;
          continue;
        }

        const data = await res.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawContent || rawContent.trim() === "") {
          console.warn(`[Gemini AI] "${modelId}" returned empty content. Cascading to next model.`);
          continue;
        }

        // Successfully got response from this model
        successfulContent = rawContent;
        usedModelId = modelId;
        console.log(`[Gemini AI] Success with model "${modelId}"!`);
        break;
      } catch (fetchErr) {
        console.warn(`[Gemini AI] Network error for "${modelId}":`, fetchErr);
        lastError = `${modelId}: ${String(fetchErr)}`;
        continue;
      }
    }

    if (!successfulContent || !usedModelId) {
      console.warn("[Gemini AI] All models in cascade exhausted/failed. Falling back to Curated Classical Knowledge Base:", lastError);
      const enriched = tracks.map((t) => enrichTrackRaag(t));
      return {
        tracks: enriched,
        usedAI: false,
        model: "Curated Classical Knowledge Base (Fallback)",
        error: lastError || "All Gemini models quota exceeded or unavailable",
      };
    }

    console.log(`[Gemini AI] Step 3/3: Successfully parsed AI Raag classifications from ${usedModelId}. Merging with tracks...`);
    const parsedResults: Array<{
      id?: string;
      title?: string;
      index?: number;
      raag: string;
      raagHindi?: string;
      thaat?: string;
      pahar: PaharId;
      timeSlot?: string;
      mood?: string;
      deity?: string;
      description?: string;
    }> = JSON.parse(successfulContent);

    const enrichedTracks: Track[] = tracks.map((track, idx) => {
      // Triple-redundancy 100% accurate track matching:
      // 1. By exact track ID (e.g. yt-1)
      // 2. By exact song title matching
      // 3. By original array index
      const aiResult =
        parsedResults.find((r) => r.id && r.id === track.id) ||
        parsedResults.find(
          (r) =>
            r.title &&
            r.title.toLowerCase().trim() === track.title.toLowerCase().trim()
        ) ||
        parsedResults.find((r) => r.index === idx);

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
        pahar: aiResult.pahar || track.pahar || (master ? master.pahar : "anytime"),
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

    const formattedModelName = usedModelId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    console.log(`[Gemini AI] Successfully enriched ${enrichedTracks.length} tracks using ${formattedModelName}.`);
    return {
      tracks: enrichedTracks,
      usedAI: true,
      model: formattedModelName,
    };
  } catch (err) {
    console.error("[Gemini AI] Error during AI Raag enrichment:", err);
    const enriched = tracks.map((t) => enrichTrackRaag(t));
    return {
      tracks: enriched,
      usedAI: false,
      model: "Curated Classical Knowledge Base (Fallback)",
      error: String(err),
    };
  }
}
