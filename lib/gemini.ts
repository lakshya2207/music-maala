import type { Track, PaharId } from "./types";
import { enrichTrackRaag, getRaagDetails, RAAG_MASTER } from "./raags";

export interface EnrichmentResult {
  tracks: Track[];
  usedAI: boolean;
  model?: string;
  error?: string;
}

export async function enrichTracksWithAI(
  tracks: Track[],
  requestedModel?: string
): Promise<EnrichmentResult> {
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env["GEMINI_API_KEY "] ||
    ""
  ).trim();

  if (!apiKey) {
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
    console.log(`[Gemini AI] Step 1/3: Preparing classical Raag analysis for ${tracks.length} track(s)...`);
    const prompt = `
You are an expert scholar and musicologist in Indian Classical Music (Hindustani Sangeet), the Raag-Samay Siddhant (Time Theory of Raags), and Bhakti Sangeet.

Your task is to analyze each of the following devotional songs/bhajans and classify each song into its TRUE, OBJECTIVE classical Indian Raag based on its musical melody, swaras, and traditional classical composition.

CRITICAL INSTRUCTIONS FOR MUSICOLOGICAL ACCURACY & CONSISTENCY:
1. Identify the authentic Raag of each song based on traditional Indian classical classification and musical lore.
2. DO NOT artificially distort or reassign a song's Raag just to balance time slots. In Indian Classical Music, the Raag deterministically defines its Pahar (Time of Day).
3. Many popular Bhakti songs, bhajans, and aartis are set in traditional Raags such as:
   - Morning (06:00 - 09:00): Bhairav, Ahir Bhairav, Bilawal, Todi, Gunkali, Nat Bhairav
   - Dawn (03:00 - 06:00): Lalit, Bhatiyar, Vibhas, Jogia, Ramkali
   - Late-Morning (09:00 - 12:00): Jaunpuri, Asavari, Alhaiya Bilawal, Deshkar
   - Afternoon (12:00 - 15:00): Shuddha Sarang, Brindavani Sarang, Gaud Sarang
   - Late-Afternoon (15:00 - 18:00): Bhimpalasi, Multani, Patdeep
   - Evening (18:00 - 21:00): Yaman, Bhupali, Puriya Dhanashree, Marwa, Hameer, Shuddha Kalyan
   - Night (21:00 - 00:00): Kafi, Bageshri, Jaijaiwanti, Khamaj, Desh, Chandrakauns
   - Late-Night (00:00 - 03:00): Malkauns, Darbari Kanada, Bihag, Jog, Kedar
   - Anytime / Universal: Bhairavi, Pahadi, Shivranjani, Mishra Pilu, Charukeshi
4. Use standard classical Raag names: Yaman, Bhairav, Ahir Bhairav, Bhupali, Bhimpalasi, Pahadi, Shivranjani, Bilawal, Kafi, Khamaj, Malkauns, Darbari Kanada, Bhairavi, Jaunpuri, Todi, Lalit, Desh, Bageshri, Brindavani Sarang, etc.
5. Canonical Examples for Grounding & Consistency:
   - "Achyutam Keshavam" -> Raag Kafi / Yaman (Deity: Krishna)
   - "Are Dwarpalo" -> Raag Shivranjani (Deity: Krishna)
   - "Shri Krishna Govind Hare Murari" -> Raag Bhimpalasi / Shivranjani (Deity: Krishna)
   - "Hanuman Chalisa" / "Aarti Kije Hanuman Lala Ki" -> Raag Bilawal (Deity: Hanuman)
   - "Om Jai Jagdish Hare" -> Raag Bhairavi / Yaman (Deity: Universal)
   - "Shyam Teri Bansi" / "Radhe Tere Charno Ki" -> Raag Pahadi (Deity: Krishna)
   - "Payoji Maine Ram Ratan Dhan Payo" -> Raag Bilawal / Khamaj (Deity: Rama/Krishna)
   - "Shiv Tandav Stotram" / "Karpur Gauram" -> Raag Malkauns / Bhairav (Deity: Shiva)
   - "Main Tulsi Tere Aangan Ki" -> Raag Bhairavi (Deity: Devi)
   - "Ashutosh Shashank Shekhar" -> Raag Bhairav (Deity: Shiva)

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
    "raag": "string (e.g. Bhairav, Yaman, Malkauns, Bhimpalasi, Pahadi, Shivranjani, Kafi, Lalit)",
    "raagHindi": "string (राग का देवनागरी नाम, e.g. भैरव, यमन, मालकौंस, भीमपलासी, पहाड़ी, शिवरंजनी)",
    "thaat": "string (e.g. Bhairav, Kalyan, Kafi, Bilawal, Asavari, Bhairavi, Todi, Marwa, Purvi, Khamaj)",
    "pahar": "dawn" | "morning" | "late-morning" | "afternoon" | "late-afternoon" | "evening" | "night" | "late-night" | "anytime",
    "timeSlot": "string (e.g. 06:00 - 09:00 (प्रातःकाल))",
    "mood": "string (e.g. सांध्य आरती एवं समर्पण)",
    "deity": "string (e.g. Shiva, Krishna, Rama, Hanuman, Devi, Universal)",
    "description": "string (2-3 sentences of spiritual and classical lore)"
  }
]
`;

    // Prioritize lower-intelligence, fast, deterministic models as requested by user
    const candidateModels: string[] = [
      ...(requestedModel ? [requestedModel] : []),
      ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-3.5-flash-lite",
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
                temperature: 0.0, // 0.0 ensures deterministic, greedy token generation for consistency
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

      // Use getRaagDetails to normalize against canonical dictionary
      const master = getRaagDetails(aiResult.raag);

      const resolvedRaag = master ? master.name : aiResult.raag || track.raag || "Bhairavi";
      const resolvedPahar = master ? master.pahar : aiResult.pahar || track.pahar || "anytime";
      const resolvedThaat = master ? master.thaat : aiResult.thaat || track.thaat || "Bilawal";
      const resolvedTimeSlot = master ? master.timeSlot : aiResult.timeSlot || track.timeSlot || "सर्वकालीन";
      const resolvedHindi = master ? master.nameHindi : aiResult.raagHindi || track.raagHindi || resolvedRaag;

      return {
        ...track,
        raag: resolvedRaag,
        raagHindi: resolvedHindi,
        thaat: resolvedThaat,
        pahar: resolvedPahar,
        timeSlot: resolvedTimeSlot,
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
