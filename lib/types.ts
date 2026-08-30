export type PraharId =
  | "dawn"           // 03:00 - 06:00 (Brahma Muhurta / Pre-dawn / उषाकाल)
  | "morning"        // 06:00 - 09:00 (Pratham Prahar Din / प्रातःकाल)
  | "late-morning"   // 09:00 - 12:00 (Dwitiya Prahar Din / मध्याह्न पूर्व)
  | "afternoon"      // 12:00 - 15:00 (Tritiya Prahar Din / मध्याह्न)
  | "late-afternoon" // 15:00 - 18:00 (Chaturtha Prahar Din / अपराह्न)
  | "evening"        // 18:00 - 21:00 (Pratham Prahar Raatri / सांध्यकाल / आरती)
  | "night"          // 21:00 - 00:00 (Dwitiya Prahar Raatri / रात्रि)
  | "late-night"     // 00:00 - 03:00 (Tritiya Prahar Raatri / मध्यरात्रि)
  | "anytime";       // Sarva-kalin (सर्वकालीन - Bhairavi, Pahadi, etc.)

export type PraharInfo = {
  id: PraharId;
  name: string;          // e.g. "सांध्य प्रहर"
  nameEnglish: string;   // e.g. "Evening Twilight (Sandhya)"
  startHour: number;     // 0-23
  endHour: number;       // 0-23
  timeRange: string;     // e.g. "18:00 - 21:00"
  icon: string;          // e.g. "🌆", "🌅", "☀️", "🌙"
  mood: string;          // e.g. "भक्ति, शांति एवं आरती भाव"
  description: string;
  representativeRaags: string[];
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  /** seconds */
  duration: number;
  /** YouTube video id — must be an upload you have the right to use */
  videoId: string;

  // Indian Classical Raag & Prahar Time Metadata
  raag?: string;           // e.g. "Yaman", "Bhairav", "Bhairavi", "Bhupali"
  raagHindi?: string;      // e.g. "यमन", "भैरव", "भैरवी", "भूपाली"
  thaat?: string;          // e.g. "Kalyan", "Bhairav", "Bilawal", "Kafi"
  prahar?: PraharId;       // e.g. "evening", "morning", "anytime"
  timeSlot?: string;       // e.g. "18:00 - 21:00 (Sandhya / Evening Aarti)"
  mood?: string;           // e.g. "Bhakti (भक्ति / Devotion)", "Shanta (शांत / Peace)"
  deity?: string;          // e.g. "Krishna", "Shiva", "Hanuman", "Devi", "Rama", "Universal"
  description?: string;    // Brief classical/spiritual context for listener lore
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};
