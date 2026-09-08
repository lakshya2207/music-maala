import type { PaharId, PaharInfo, Track } from "./types";

export const PRAHARS: Record<PaharId, PaharInfo> = {
  dawn: {
    id: "dawn",
    name: "उषाकाल (ब्रह्म मुहूर्त)",
    nameEnglish: "Pre-Dawn / Brahma Muhurta",
    startHour: 3,
    endHour: 6,
    timeRange: "03:00 - 06:00",
    icon: "🌌",
    mood: "आत्म-चिंतन, ध्यान एवं दिव्य समर्पण (Meditation & Surrender)",
    description:
      "रात्रि के अंतिम पहर में प्रकृति शांत एवं पावन होती है। यह समय ब्रह्म मुहूर्त का है, जब कोमल रे और धैवत वाले गंभीर राग मन को आत्म-साक्षात्कार और प्रभु स्मरण की ओर ले जाते हैं।",
    representativeRaags: ["Lalit", "Bhatiyar", "Vibhas", "Jogia", "Ramkali"],
  },
  morning: {
    id: "morning",
    name: "प्रातः पहर",
    nameEnglish: "Early Morning (Pratham Pahar)",
    startHour: 6,
    endHour: 9,
    timeRange: "06:00 - 09:00",
    icon: "🌅",
    mood: "भक्ति भाव, शांति एवं नव-जागरण (Devotion & Serenity)",
    description:
      "सूर्योदय का पावन समय। राग भैरव और तोड़ी के दिव्य स्वर मन में शांति, भक्ति और नई ऊर्जा का संचार करते हैं। प्रभाती भजन और ईश्वर वंदना के लिए यह सर्वश्रेष्ठ काल है।",
    representativeRaags: ["Bhairav", "Ahir Bhairav", "Todi", "Bilawal", "Nat Bhairav", "Gunkali"],
  },
  "late-morning": {
    id: "late-morning",
    name: "मध्याह्न पूर्व पहर",
    nameEnglish: "Late Morning (Dwitiya Pahar)",
    startHour: 9,
    endHour: 12,
    timeRange: "09:00 - 12:00",
    icon: "☀️",
    mood: "उल्लास, उत्साह एवं एकाग्रता (Joy, Energy & Focus)",
    description:
      "दिन के दूसरे पहर में सूर्य का तेज बढ़ता है। राग जौनपुरी, आसावरी और अल्हैया बिलावल मन में उमंग, कर्मठता और प्रसन्नता का भाव जगाते हैं।",
    representativeRaags: ["Jaunpuri", "Asavari", "Alhaiya Bilawal", "Deshkar", "Devgandhar"],
  },
  afternoon: {
    id: "afternoon",
    name: "मध्याह्न पहर",
    nameEnglish: "Afternoon (Tritiya Pahar)",
    startHour: 12,
    endHour: 15,
    timeRange: "12:00 - 15:00",
    icon: "🌤️",
    mood: "गंभीरता, शांति एवं शीतलता (Tranquility & Peace)",
    description:
      "दोपहर की धूप में सारंग अंग के राग मन को शीतल और शांत करते हैं। यह पहर स्थिरता, आत्म-शांति और प्रभु के मधुर स्वरूप के ध्यान का है।",
    representativeRaags: ["Shuddha Sarang", "Brindavani Sarang", "Madhmad Sarang", "Gaud Sarang"],
  },
  "late-afternoon": {
    id: "late-afternoon",
    name: "अपराह्न पहर",
    nameEnglish: "Late Afternoon (Chaturtha Pahar)",
    startHour: 15,
    endHour: 18,
    timeRange: "15:00 - 18:00",
    icon: "🌇",
    mood: "करुणा, विरह एवं समर्पण (Deep Emotion & Yearning)",
    description:
      "दिन ढलने का समय। राग भीमपलासी, मुल्तानी और पटदीप के मधुर-करुण स्वर मन में भक्ति की गहरी तड़प और ईश्वर के प्रति अगाध प्रेम उत्पन्न करते हैं।",
    representativeRaags: ["Bhimpalasi", "Multani", "Patdeep", "Dhanashree", "Pilu"],
  },
  evening: {
    id: "evening",
    name: "सांध्य पहर (आरती काल)",
    nameEnglish: "Evening Twilight (Sandhivrakash / Aarti)",
    startHour: 18,
    endHour: 21,
    timeRange: "18:00 - 21:00",
    icon: "🪔",
    mood: "आरती, स्तुति, उल्लास एवं सात्विक शांति (Aarti, Praise & Reverence)",
    description:
      "दिन और रात का संधिकाल। दीप प्रज्वलन और संध्या आरती का समय। राग यमन, भूपाली और पूरिया धनाश्री के स्वर वातावरण को दिव्य और भक्तिमय बना देते हैं।",
    representativeRaags: ["Yaman", "Bhupali", "Puriya Dhanashree", "Marwa", "Hameer", "Shuddha Kalyan"],
  },
  night: {
    id: "night",
    name: "रात्रि पहर",
    nameEnglish: "Prime Night (Dwitiya Pahar Raatri)",
    startHour: 21,
    endHour: 24,
    timeRange: "21:00 - 00:00",
    icon: "🌙",
    mood: "माधुर्य, प्रेम एवं आत्मिक विश्राम (Sweetness & Soulful Rest)",
    description:
      "रात्रि के समय राग काफी, बागेश्री और जयजयवंती का गायन-वादन अत्यंत मनोहारी होता है। यह पहर मधुर रस, कृष्ण लीला और शांत विश्राम का है।",
    representativeRaags: ["Kafi", "Bageshri", "Jaijaiwanti", "Khamaj", "Rageshri", "Desh", "Chandrakauns"],
  },
  "late-night": {
    id: "late-night",
    name: "मध्य रात्रि पहर",
    nameEnglish: "Midnight (Tritiya Pahar Raatri)",
    startHour: 0,
    endHour: 3,
    timeRange: "00:00 - 03:00",
    icon: "✨",
    mood: "गूढ़ रहस्य, मौन एवं ध्यान (Mysticism & Deep Contemplation)",
    description:
      "गहन रात्रि का सन्नाटा। राग मालकौंस, दरबारी कानड़ा और बिहाग के गंभीर स्वर आत्मा को संसार से विरक्त कर अंतर्मुखी और ध्यानस्थ कर देते हैं।",
    representativeRaags: ["Malkauns", "Darbari Kanada", "Bihag", "Jog", "Adana", "Kedar"],
  },
  anytime: {
    id: "anytime",
    name: "सर्वकालीन राग",
    nameEnglish: "Universal (Sarva-Kalin / Anytime)",
    startHour: 0,
    endHour: 24,
    timeRange: "24 Hours (सर्वदा)",
    icon: "🌺",
    mood: "सर्व-रस, भक्ति एवं आत्मीयता (Universal Devotion & Sweetness)",
    description:
      "भारतीय संगीत में राग भैरवी, पहाड़ी और शिवरंजनी जैसे राग सर्वकालीन माने गए हैं। इन्हें किसी भी समय आनंद और भक्ति के साथ सुना जा सकता है।",
    representativeRaags: ["Bhairavi", "Pahadi", "Shivranjani", "Mishra Pilu", "Charukeshi", "Dhani"],
  },
};

export const PAHARS = PRAHARS;

export interface RaagDetails {
  name: string;
  nameHindi: string;
  thaat: string;
  pahar: PaharId;
  timeSlot: string;
  mood: string;
  vadiSamvadi?: string;
  swaraNotes?: string;
  spiritualSignificance: string;
}

export const RAAG_MASTER: Record<string, RaagDetails> = {
  // --- DAWN (03:00 - 06:00, उषाकाल / ब्रह्म मुहूर्त) ---
  Lalit: {
    name: "Lalit",
    nameHindi: "ललित",
    thaat: "Purvi",
    pahar: "dawn",
    timeSlot: "03:00 - 06:00 (उषाकाल / ब्रह्म मुहूर्त)",
    mood: "शांत, ध्यान एवं आत्म-समर्पण (Spiritual Dhyan & Awakening)",
    vadiSamvadi: "वादी: शुद्ध मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "दोनों मध्यमों का प्रयोग, कोमल रे व धैवत",
    spiritualSignificance:
      "ब्रह्म मुहूर्त का अत्यंत पावन व गंभीर राग। अंतर्मुखी होकर परमात्मा के ध्यान और आत्म-जागरण के लिए श्रेष्ठ।",
  },
  Bhatiyar: {
    name: "Bhatiyar",
    nameHindi: "भटियार",
    thaat: "Marwa",
    pahar: "dawn",
    timeSlot: "03:00 - 06:00 (उषाकाल)",
    mood: "प्रभाती वैराग्य एवं शांति (Morning Transcendence)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "शुद्ध व तीव्र मध्यम, कोमल रे",
    spiritualSignificance:
      "उषाकाल के समय निद्रा त्यागकर ईश्वर आराधना में लीन करने वाला दुर्लभ व पावन राग।",
  },
  Vibhas: {
    name: "Vibhas",
    nameHindi: "विभास",
    thaat: "Bhairav",
    pahar: "dawn",
    timeSlot: "03:00 - 06:00 (उषाकाल)",
    mood: "दिव्य तेज एवं स्तुति (Divine Morning Splendor)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "औडव जाति, कोमल रे और कोमल धैवत",
    spiritualSignificance:
      "भगवान सूर्य के प्रथम प्रकाश और प्रातःकालीन वंदना का ओजस्वी राग।",
  },
  Jogia: {
    name: "Jogia",
    nameHindi: "जोगिया",
    thaat: "Bhairav",
    pahar: "dawn",
    timeSlot: "03:00 - 06:00 (उषाकाल)",
    mood: "करुणा, विरह एवं वैराग्य (Deep Devout Longing)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल रे और कोमल धैवत",
    spiritualSignificance:
      "संत कबीर और मीराबाई के प्रभाती पदों के गायन हेतु अत्यंत भावपूर्ण राग।",
  },
  Ramkali: {
    name: "Ramkali",
    nameHindi: "रामकली",
    thaat: "Bhairav",
    pahar: "dawn",
    timeSlot: "04:00 - 07:00 (उषाकाल / प्रातः)",
    mood: "गंभीर भक्ति एवं स्तुति (Solemn Devotion)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: ऋषभ (Re)",
    swaraNotes: "दोनों मध्यम और दोनों निषाद का विशिष्ट प्रयोग",
    spiritualSignificance:
      "श्री राम और शिव की प्रातःकालीन स्तुतियों में अति-प्रभावकारी राग।",
  },

  // --- MORNING (06:00 - 09:00, प्रातः पहर) ---
  Bhairav: {
    name: "Bhairav",
    nameHindi: "भैरव",
    thaat: "Bhairav",
    pahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातःकाल)",
    mood: "भक्ति (Devotion), शांत (Peace), गंभीरता (Solemnity)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: ऋषभ (Re)",
    swaraNotes: "कोमल रे और कोमल धैवत (r, d)",
    spiritualSignificance:
      "भगवान शिव का साक्षात स्वरूप माना गया है। प्रातःकालीन साधना और प्रभु वंदना के लिए सर्वोपरि राग।",
  },
  "Ahir Bhairav": {
    name: "Ahir Bhairav",
    nameHindi: "अहीर भैरव",
    thaat: "Bhairav",
    pahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातःकाल)",
    mood: "करुणा (Compassion), सात्विक भक्ति (Pure Devotion)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल रे और कोमल निषाद (r, n)",
    spiritualSignificance:
      "प्रातःकाल में असीम शांति और हृदयस्पर्शी भक्ति का भाव जगाता है। कई प्रसिद्ध प्रभाती भजन इस राग पर आधारित हैं।",
  },
  Todi: {
    name: "Todi",
    nameHindi: "तोड़ी (मियाँ की तोड़ी)",
    thaat: "Todi",
    pahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातःकाल)",
    mood: "करुण प्रार्थना एवं असीम समर्पण (Pathos & Devotion)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "कोमल रे, ग, ध और तीव्र मध्यम (r, g, M', d)",
    spiritualSignificance:
      "प्रभु के सम्मुख पूर्ण शरणागति और आत्म-निवेदन का सर्वोत्कृष्ट शास्त्रीय राग।",
  },
  Bilawal: {
    name: "Bilawal",
    nameHindi: "बिलावल",
    thaat: "Bilawal",
    pahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातः पहर)",
    mood: "उमंग, उत्साह एवं स्तुति (Celebration & Praise)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "सभी शुद्ध स्वर",
    spiritualSignificance:
      "प्रातःकालीन स्तुति, हनुमान चालीसा और मंगल वंदना के लिए ऊर्जावान राग।",
  },
  Gunkali: {
    name: "Gunkali",
    nameHindi: "गुणकली",
    thaat: "Bhairav",
    pahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातःकाल)",
    mood: "विनम्र भक्ति एवं प्रार्थना (Humble Reverence)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: ऋषभ (Re)",
    swaraNotes: "औडव जाति, गंधार व निषाद वर्जित",
    spiritualSignificance:
      "प्रातः काल में ईश्वर के श्रीचरणों में विनम्र प्रार्थना का पावन राग।",
  },
  "Nat Bhairav": {
    name: "Nat Bhairav",
    nameHindi: "नट भैरव",
    thaat: "Bhairav",
    pahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातःकाल)",
    mood: "आनंद एवं मंगल वंदना (Joyful Morning Blessing)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "नट अंग और भैरव अंग का सुंदर समन्वय",
    spiritualSignificance:
      "सूर्योदय के समय नई चेतना और आध्यात्मिक मंगलकारी ऊर्जा प्रदान करता है।",
  },

  // --- LATE-MORNING (09:00 - 12:00, मध्याह्न पूर्व पहर) ---
  Jaunpuri: {
    name: "Jaunpuri",
    nameHindi: "जौनपुरी",
    thaat: "Asavari",
    pahar: "late-morning",
    timeSlot: "09:00 - 12:00 (मध्याह्न पूर्व)",
    mood: "उल्लास, भक्ति एवं स्तुति (Uplifting Devotion)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "कोमल ग, ध, नि (g, d, n)",
    spiritualSignificance:
      "दिन के दूसरे पहर में मन में नव-स्फूर्ति और नारायण स्तुति का भाव जगाता है।",
  },
  Asavari: {
    name: "Asavari",
    nameHindi: "आसावरी",
    thaat: "Asavari",
    pahar: "late-morning",
    timeSlot: "09:00 - 12:00 (मध्याह्न पूर्व)",
    mood: "त्याग, शांति एवं समर्पण (Renunciation & Peace)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "कोमल ग, ध, नि",
    spiritualSignificance:
      "सांसारिक मोह से मुक्ति और प्रभु चरणों में अगाध शांति का अनुभव कराने वाला राग।",
  },
  "Alhaiya Bilawal": {
    name: "Alhaiya Bilawal",
    nameHindi: "अल्हैया बिलावल",
    thaat: "Bilawal",
    pahar: "late-morning",
    timeSlot: "09:00 - 12:00 (मध्याह्न पूर्व)",
    mood: "आनंद, उत्साह एवं जय-जयकार (Exuberance & Glory)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "दोनों निषाद (शुद्ध व कोमल) का सुंदर प्रयोग",
    spiritualSignificance:
      "ईश्वर की महिमा और विजय गान के लिए अत्यंत लोकप्रिय और पावन राग।",
  },
  Deshkar: {
    name: "Deshkar",
    nameHindi: "देशकार",
    thaat: "Bilawal",
    pahar: "late-morning",
    timeSlot: "09:00 - 12:00 (मध्याह्न पूर्व)",
    mood: "ऊर्जा, तेज एवं उल्लास (Radiance & Joy)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "औडव जाति, मध्यम व निषाद वर्जित",
    spiritualSignificance:
      "सूर्य के बढ़ते तेज के साथ मन में कर्मठता और भक्ति भाव भरता है।",
  },

  // --- AFTERNOON (12:00 - 15:00, मध्याह्न पहर) ---
  "Shuddha Sarang": {
    name: "Shuddha Sarang",
    nameHindi: "शुद्ध सारंग",
    thaat: "Kafi",
    pahar: "afternoon",
    timeSlot: "12:00 - 15:00 (मध्याह्न)",
    mood: "शीतलता एवं शांति (Midday Serenity)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "दोनों मध्यम (शुद्ध व तीव्र M')",
    spiritualSignificance:
      "दोपहर की तपन में मन को अमृतमयी शीतलता और प्रभु चिंतन प्रदान करने वाला राग।",
  },
  "Brindavani Sarang": {
    name: "Brindavani Sarang",
    nameHindi: "वृंदावनी सारंग",
    thaat: "Kafi",
    pahar: "afternoon",
    timeSlot: "12:00 - 15:00 (मध्याह्न)",
    mood: "मधुरता, शीतलता एवं कृष्ण प्रेम (Krishna Devotion)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "दोनों निषाद (शुद्ध व कोमल), गंधार व धैवत वर्जित",
    spiritualSignificance:
      "वृंदावन के कदंब वृक्ष की छांव में श्री कृष्ण की मधुर बांसुरी का स्मरण कराता है।",
  },

  // --- LATE-AFTERNOON (15:00 - 18:00, अपराह्न पहर) ---
  Bhimpalasi: {
    name: "Bhimpalasi",
    nameHindi: "भीमपलासी",
    thaat: "Kafi",
    pahar: "late-afternoon",
    timeSlot: "15:00 - 18:00 (अपराह्न)",
    mood: "शांत, शृंगार एवं भक्ति (Peace & Yearning)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल गंधार और कोमल निषाद (g, n)",
    spiritualSignificance:
      "अपराह्न के समय मन को एकाग्र कर ईश्वर चिंतन में लीन करने वाला अत्यंत मधुर राग।",
  },
  Multani: {
    name: "Multani",
    nameHindi: "मुल्तानी",
    thaat: "Todi",
    pahar: "late-afternoon",
    timeSlot: "15:00 - 18:00 (अपराह्न)",
    mood: "करुणा, विरह एवं समर्पण (Deep Surrender)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल रे, ग, ध और तीव्र मध्यम (r, g, M', d)",
    spiritualSignificance:
      "दिन ढलने पर सांसारिक थकान दूर कर आत्मा को परमात्मा के ध्यान में डुबोने वाला राग।",
  },
  Patdeep: {
    name: "Patdeep",
    nameHindi: "पटदीप",
    thaat: "Kafi",
    pahar: "late-afternoon",
    timeSlot: "15:00 - 18:00 (अपराह्न)",
    mood: "माधुर्य, भक्ति एवं आत्म-निवेदन (Sweet Yearning)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल गंधार, शेष शुद्ध स्वर",
    spiritualSignificance:
      "भक्त के हृदय की अगाध तड़प और श्री कृष्ण के चरणों में प्रार्थना का प्रिय राग।",
  },

  // --- EVENING (18:00 - 21:00, सांध्य पहर / आरती काल) ---
  Yaman: {
    name: "Yaman",
    nameHindi: "यमन (कल्याण)",
    thaat: "Kalyan",
    pahar: "evening",
    timeSlot: "18:00 - 21:00 (सांध्य आरती)",
    mood: "आनंद (Bliss), भक्ति (Devotion), शांति (Peace)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: निषाद (Ni)",
    swaraNotes: "तीव्र मध्यम (M') और सभी शुद्ध स्वर",
    spiritualSignificance:
      "संध्या आरती और दीप प्रज्वलन का प्रधान राग। वातावरण में सात्विक उल्लास और मंगलकारी ऊर्जा भरता है।",
  },
  Bhupali: {
    name: "Bhupali",
    nameHindi: "भूपाली",
    thaat: "Kalyan",
    pahar: "evening",
    timeSlot: "18:00 - 21:00 (सांध्यकाल)",
    mood: "भक्ति रस, सरलता एवं प्रसन्नता (Pure Joy & Reverence)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: धैवत (Dha)",
    swaraNotes: "औडव जाति (सा रे ग प ध)",
    spiritualSignificance:
      "पाँच शुद्ध स्वरों का दिव्य सम्मिश्रण। प्रभु श्री राम और कृष्ण के बाल स्वरूप के भजनों के लिए आदर्श।",
  },
  "Puriya Dhanashree": {
    name: "Puriya Dhanashree",
    nameHindi: "पूरिया धनाश्री",
    thaat: "Purvi",
    pahar: "evening",
    timeSlot: "18:00 - 21:00 (सांध्य पहर)",
    mood: "गंभीर भक्ति, वैराग्य एवं प्रकाश (Solemn Devotion)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: ऋषभ (Re)",
    swaraNotes: "कोमल रे, तीव्र म, कोमल ध (r, M', d)",
    spiritualSignificance:
      "संध्या काल में सूर्यास्त के समय मन में वैराग्य और ईश्वर के प्रति अगाध श्रद्धा उत्पन्न करता है।",
  },
  Marwa: {
    name: "Marwa",
    nameHindi: "मारवा",
    thaat: "Marwa",
    pahar: "evening",
    timeSlot: "18:00 - 20:00 (संधिकाल)",
    mood: "गंभीरता, वैराग्य एवं व्याकुलता (Twilight Transcendence)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: ऋषभ (Re)",
    swaraNotes: "कोमल रे, तीव्र मध्यम, पंचम वर्जित",
    spiritualSignificance:
      "दिन और रात्रि के मिलन काल में संसार की नश्वरता और प्रभु की शाश्वत सत्ता का बोध कराता है।",
  },
  Hameer: {
    name: "Hameer",
    nameHindi: "हमीर",
    thaat: "Kalyan",
    pahar: "evening",
    timeSlot: "18:00 - 21:00 (सांध्यकाल)",
    mood: "उल्लास, शौर्य एवं स्तुति (Triumph & Praise)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "दोनों मध्यम और शुद्ध स्वर",
    spiritualSignificance:
      "भगवान शिव और देवी दुर्गा की विजय स्तुतियों के लिए अत्यंत ओजस्वी राग।",
  },
  "Shuddha Kalyan": {
    name: "Shuddha Kalyan",
    nameHindi: "शुद्ध कल्याण",
    thaat: "Kalyan",
    pahar: "evening",
    timeSlot: "18:00 - 21:00 (सांध्यकाल)",
    mood: "परम शांति एवं मंगल भाव (Divine Serenity)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: धैवत (Dha)",
    swaraNotes: "आरोह में भूपाली, अवरोह में यमन अंग",
    spiritualSignificance:
      "संध्या काल में घर-मंदिर में मंगलकारी प्रकाश और कल्याण का वातावरण रचता है।",
  },

  // --- NIGHT (21:00 - 00:00, रात्रि पहर) ---
  Kafi: {
    name: "Kafi",
    nameHindi: "काफी",
    thaat: "Kafi",
    pahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि पहर)",
    mood: "होली, रसिया एवं प्रेम भक्ति (Festive & Loving Devotion)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल गंधार और कोमल निषाद (g, n)",
    spiritualSignificance:
      "ब्रज की होली, कृष्ण प्रेम और चैती-कजरी भजनों का मूल आधार।",
  },
  Bageshri: {
    name: "Bageshri",
    nameHindi: "बागेश्री",
    thaat: "Kafi",
    pahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि पहर)",
    mood: "शृंगार, विरह एवं मधुर समर्पण (Sweet Longing)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल ग और कोमल नि, पंचम अल्प",
    spiritualSignificance:
      "भगवान कृष्ण के विरह में लीन राधा रानी के भावों की मधुर शास्त्रीय अभिव्यक्ति।",
  },
  Jaijaiwanti: {
    name: "Jaijaiwanti",
    nameHindi: "जयजयवंती",
    thaat: "Khamaj",
    pahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि)",
    mood: "शृंगार, भक्ति एवं मंगलगान (Auspicious Devotion)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "दोनों गंधार और दोनों निषाद का मधुर संगम",
    spiritualSignificance:
      "गुरु ग्रंथ साहिब में भी इसका विशेष स्थान है। प्रभु वंदना और जयकार का अत्यंत मनोहारी राग।",
  },
  Khamaj: {
    name: "Khamaj",
    nameHindi: "खमाज",
    thaat: "Khamaj",
    pahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि)",
    mood: "माधुर्य, शृंगार एवं समर्पण (Sweetness & Devotion)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: निषाद (Ni)",
    swaraNotes: "शुद्ध व कोमल निषाद (N, n)",
    spiritualSignificance:
      "भजन, ठुमरी और सुदामा-कृष्ण मिलन जैसे मार्मिक प्रसंगों का अत्यंत प्रभावशाली राग।",
  },
  Desh: {
    name: "Desh",
    nameHindi: "देश",
    thaat: "Khamaj",
    pahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि पहर)",
    mood: "देशभक्ति, माधुर्य एवं भक्ति (Patriotism & Sweet Devotion)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "दोनों निषाद (शुद्ध व कोमल)",
    spiritualSignificance:
      "'वंदे मातरम्' का राग। देश-प्रेम और राम-कृष्ण के मधुर भजनों में अत्यंत लोकप्रिय।",
  },
  Chandrakauns: {
    name: "Chandrakauns",
    nameHindi: "चंद्रकौंस",
    thaat: "Kafi",
    pahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि)",
    mood: "गंभीर भक्ति एवं चंद्र शीतलता (Moonlit Serenity)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल ग, कोमल ध, शुद्ध निषाद",
    spiritualSignificance:
      "रात्रि के समय शिव आराधना और आत्मिक शांति का गंभीर और मधुर राग।",
  },

  // --- LATE-NIGHT (00:00 - 03:00, मध्य रात्रि पहर) ---
  Malkauns: {
    name: "Malkauns",
    nameHindi: "मालकौंस",
    thaat: "Bhairavi",
    pahar: "late-night",
    timeSlot: "00:00 - 03:00 (मध्य रात्रि)",
    mood: "वीर रस, शिव तांडव एवं ध्यान (Mystic Energy & Dhyan)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल ग, ध, नि (ऋषभ-पंचम वर्जित)",
    spiritualSignificance:
      "भगवान शिव के तांडव और ध्यान की ऊर्जा से उत्पन्न राग। गंभीर रात्रि साधना के लिए सर्वश्रेष्ठ।",
  },
  Darbari: {
    name: "Darbari Kanada",
    nameHindi: "दरबारी कानड़ा",
    thaat: "Asavari",
    pahar: "late-night",
    timeSlot: "00:00 - 03:00 (मध्य रात्रि)",
    mood: "गंभीरता, ऐश्वर्य एवं मौन (Majesty & Deep Introspection)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "कोमल ग, ध, नि का मंद आंदोलन",
    spiritualSignificance:
      "मिया तानसेन द्वारा रचित। रात्रि के सन्नाटे में प्रभु की विराट महिमा का स्मरण कराता है।",
  },
  "Darbari Kanada": {
    name: "Darbari Kanada",
    nameHindi: "दरबारी कानड़ा",
    thaat: "Asavari",
    pahar: "late-night",
    timeSlot: "00:00 - 03:00 (मध्य रात्रि)",
    mood: "गंभीरता, ऐश्वर्य एवं मौन (Majesty & Deep Introspection)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "कोमल ग, ध, नि का मंद आंदोलन",
    spiritualSignificance:
      "मिया तानसेन द्वारा रचित। रात्रि के सन्नाटे में प्रभु की विराट महिमा का स्मरण कराता है।",
  },
  Bihag: {
    name: "Bihag",
    nameHindi: "बिहाग",
    thaat: "Bilawal",
    pahar: "late-night",
    timeSlot: "00:00 - 03:00 (मध्य रात्रि)",
    mood: "शांत विश्राम एवं माधुर्य (Peaceful Rest & Grace)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: निषाद (Ni)",
    swaraNotes: "दोनों मध्यम (शुद्ध व तीव्र) का सुंदर प्रयोग",
    spiritualSignificance:
      "गहरी रात्रि में प्रभु के मधुर शयन और आत्मिक विश्राम का श्रेष्ठ राग।",
  },
  Jog: {
    name: "Jog",
    nameHindi: "जोग",
    thaat: "Kafi",
    pahar: "late-night",
    timeSlot: "00:00 - 03:00 (मध्य रात्रि)",
    mood: "वैराग्य, शिव आराधना एवं ध्यान (Mystic Trance)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "दोनों गंधार (शुद्ध व कोमल), ऋषभ वर्जित",
    spiritualSignificance:
      "मध्य रात्रि में योगेश्वर शिव के ध्यान और एकाग्रता के लिए अत्यंत प्रभावशाली।",
  },
  Kedar: {
    name: "Kedar",
    nameHindi: "केदार",
    thaat: "Kalyan",
    pahar: "late-night",
    timeSlot: "00:00 - 03:00 (मध्य रात्रि)",
    mood: "गंभीर भक्ति, शिव स्तुति एवं शांति (Shiva Devotion)",
    vadiSamvadi: "वादी: शुद्ध मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "दोनों मध्यम, ऋषभ-गंधार का वक्र प्रयोग",
    spiritualSignificance:
      "भगवान केदारनाथ (शिव) के चरणों में समर्पित पावन और गंभीर राग।",
  },

  // --- ANYTIME / SARVA-KALIN (सर्वकालीन राग) ---
  Bhairavi: {
    name: "Bhairavi",
    nameHindi: "भैरवी",
    thaat: "Bhairavi",
    pahar: "anytime",
    timeSlot: "सर्वकालीन / प्रातःकाल (Anytime / Morning)",
    mood: "शृंगार, करुणा एवं पूर्ण समर्पण (Surrender & Supreme Devotion)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "चारों कोमल स्वर (r, g, d, n)",
    spiritualSignificance:
      "रागों की रानी। शास्त्रीय गायन का समापन इसी राग से होता है। देवी स्तुति और भक्ति पदों के लिए अत्यंत प्रिय।",
  },
  Pahadi: {
    name: "Pahadi",
    nameHindi: "पहाड़ी",
    thaat: "Bilawal",
    pahar: "anytime",
    timeSlot: "सर्वकालीन / सांध्यकाल (Anytime / Evening)",
    mood: "माधुर्य (Sweetness), प्रेम (Love), लोक-भक्ति (Folk Devotion)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: षड्ज (Sa)",
    swaraNotes: "लोकधुनों से युक्त चंचल व मधुर स्वर",
    spiritualSignificance:
      "हिमालय की पावन घाटियों का राग। कृष्ण की बंसी और वृंदावन की लीलाओं के भजनों में अत्यंत लोकप्रिय।",
  },
  Shivranjani: {
    name: "Shivranjani",
    nameHindi: "शिवरंजनी",
    thaat: "Kafi",
    pahar: "anytime",
    timeSlot: "सर्वकालीन / रात्रि (Anytime / Night)",
    mood: "करुण रस (Pathos), विरह एवं गहन भक्ति (Deep Yearning)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल गंधार (g) के साथ औडव जाति",
    spiritualSignificance:
      "भगवान शिव और कृष्ण के विरह-भक्ति पदों में अत्यंत भावुक प्रभाव उत्पन्न करता है।",
  },
  Pilu: {
    name: "Mishra Pilu",
    nameHindi: "मिश्र पीलू",
    thaat: "Kafi",
    pahar: "anytime",
    timeSlot: "सर्वकालीन / अपराह्न (Anytime / Late Afternoon)",
    mood: "आत्मीयता, भावुकता एवं समर्पण (Soulful Longing)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: निषाद (Ni)",
    swaraNotes: "विविध कोमल व शुद्ध स्वरों का सुंदर प्रयोग",
    spiritualSignificance:
      "मीराबाई और सूरदास के पदों के गायन में पीलू का विशेष स्थान है।",
  },
  "Mishra Pilu": {
    name: "Mishra Pilu",
    nameHindi: "मिश्र पीलू",
    thaat: "Kafi",
    pahar: "anytime",
    timeSlot: "सर्वकालीन / अपराह्न (Anytime / Late Afternoon)",
    mood: "आत्मीयता, भावुकता एवं समर्पण (Soulful Longing)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: निषाद (Ni)",
    swaraNotes: "विविध कोमल व शुद्ध स्वरों का सुंदर प्रयोग",
    spiritualSignificance:
      "मीराबाई और सूरदास के पदों के गायन में पीलू का विशेष स्थान है।",
  },
  Charukeshi: {
    name: "Charukeshi",
    nameHindi: "चारुकेशी",
    thaat: "Charukeshi",
    pahar: "anytime",
    timeSlot: "सर्वकालीन (Universal)",
    mood: "करुणा, भक्ति एवं समर्पण (Compassion & Grace)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल ध और कोमल नि, शेष शुद्ध स्वर",
    spiritualSignificance:
      "कर्नाटक व हिंदुस्तानी दोनों शैलियों में प्रिय। मन को तत्काल भक्ति और करुणा से भर देने वाला राग।",
  },
};

export function getRaagDetails(raagName?: string): RaagDetails | undefined {
  if (!raagName || typeof raagName !== "string") return undefined;
  const clean = raagName.trim();
  if (RAAG_MASTER[clean]) return RAAG_MASTER[clean];

  // Case-insensitive lookup
  const lower = clean.toLowerCase();
  for (const [key, details] of Object.entries(RAAG_MASTER)) {
    if (key.toLowerCase() === lower || details.name.toLowerCase() === lower || details.nameHindi === clean) {
      return details;
    }
  }

  // Common aliases
  if (lower.includes("darbari")) return RAAG_MASTER["Darbari"] || RAAG_MASTER["Darbari Kanada"];
  if (lower.includes("pilu")) return RAAG_MASTER["Pilu"];
  if (lower.includes("brindavani") || lower === "sarang") return RAAG_MASTER["Brindavani Sarang"] || RAAG_MASTER["Shuddha Sarang"];
  if (lower.includes("ahir bhairav")) return RAAG_MASTER["Ahir Bhairav"];
  if (lower.includes("bhairavi")) return RAAG_MASTER["Bhairavi"];
  if (lower.includes("bhairav")) return RAAG_MASTER["Bhairav"];
  if (lower.includes("yaman") || lower.includes("kalyan")) return RAAG_MASTER["Yaman"];
  if (lower.includes("alhaiya")) return RAAG_MASTER["Alhaiya Bilawal"];
  if (lower.includes("bilawal")) return RAAG_MASTER["Bilawal"];
  if (lower.includes("bhimpalasi")) return RAAG_MASTER["Bhimpalasi"];
  if (lower.includes("malkauns")) return RAAG_MASTER["Malkauns"];
  if (lower.includes("jaunpuri")) return RAAG_MASTER["Jaunpuri"];
  if (lower.includes("todi")) return RAAG_MASTER["Todi"];
  if (lower.includes("lalit")) return RAAG_MASTER["Lalit"];
  if (lower.includes("kedar")) return RAAG_MASTER["Kedar"];
  if (lower.includes("bihag")) return RAAG_MASTER["Bihag"];
  if (lower.includes("jog")) return RAAG_MASTER["Jog"];
  if (lower.includes("desh")) return RAAG_MASTER["Desh"];
  if (lower.includes("bageshri")) return RAAG_MASTER["Bageshri"];
  if (lower.includes("khamaj")) return RAAG_MASTER["Khamaj"];
  if (lower.includes("kafi")) return RAAG_MASTER["Kafi"];
  if (lower.includes("bhupali")) return RAAG_MASTER["Bhupali"];
  if (lower.includes("charukeshi")) return RAAG_MASTER["Charukeshi"];

  return undefined;
}

const KNOWN_TRACK_MAPPINGS: Record<
  string,
  {
    raag: string;
    pahar: PaharId;
    mood: string;
    deity: string;
    description: string;
  }
> = {
  "hanuman chutki": {
    raag: "Bilawal",
    pahar: "morning",
    mood: "उत्साह, भक्ति एवं शक्ति (Energy & Strength)",
    deity: "Hanuman",
    description: "बिलावल अंग की ऊर्जावान धुन, जो वीर हनुमान के पराक्रम और सेवा भाव को उजागर करती है।",
  },
  "shri krishna govind": {
    raag: "Bhimpalasi",
    pahar: "late-afternoon",
    mood: "माधुर्य, शांत रस एवं कृष्ण भक्ति (Sweet Krishna Devotion)",
    deity: "Krishna",
    description: "रवींद्र जैन जी द्वारा रचित राग भीमपलासी आधारित यह भजन कृष्ण शरणागति का अनुपम उदाहरण है।",
  },
  "hanuman tumhara": {
    raag: "Bilawal",
    pahar: "morning",
    mood: "स्तुति एवं मंगल भाव (Praise & Blessing)",
    deity: "Hanuman",
    description: "मंगलवार एवं प्रातःकालीन स्मरण हेतु बिलावल राग आधारित पावन हनुमान स्तुति।",
  },
  "ashutosh shashank": {
    raag: "Bhairav",
    pahar: "morning",
    mood: "सात्विक शांति एवं शिव वंदना (Divine Shiva Praise)",
    deity: "Shiva",
    description: "राग भैरव के पावन स्वरों में भगवान भोलेनाथ की प्रातःकालीन वंदना एवं स्तुति।",
  },
  "jai jagdish hare": {
    raag: "Bhairavi",
    pahar: "evening",
    mood: "आरती भाव एवं पूर्ण शरणागति (Universal Aarti)",
    deity: "Universal",
    description: "सर्वकालीन राग भैरवी आधारित सर्वमान्य सांध्य आरती, जो समस्त संकटों का निवारण करती है।",
  },
  "teri murli": {
    raag: "Pahadi",
    pahar: "evening",
    mood: "राधा-कृष्ण प्रेम एवं माधुर्य (Radha Krishna Love)",
    deity: "Krishna",
    description: "राग पहाड़ी और मिश्र काफी के मधुर स्वरों में बरसाने की राधा रानी का कृष्ण वियोग और प्रेम।",
  },
  "shyam teri bansi": {
    raag: "Pahadi",
    pahar: "evening",
    mood: "भक्ति, शृंगार एवं शांति (Sweet Melody)",
    deity: "Krishna",
    description: "फिल्म 'गीत गाता चल' का यह कालजयी भजन राग पहाड़ी पर आधारित है, जो मन को सम्मोहित करता है।",
  },
  "radhe tere charno": {
    raag: "Pahadi",
    pahar: "anytime",
    mood: "चरण रज की अभिलाषा एवं दास्य भक्ति (Devout Surrender)",
    deity: "Krishna",
    description: "राग पहाड़ी के भावुक स्वरों में श्री राधा रानी के युगल चरणों में विश्राम की प्रार्थना।",
  },
  "main tulsi": {
    raag: "Bhairavi",
    pahar: "morning",
    mood: "पवित्रता एवं मातृत्व भाव (Purity & Devotion)",
    deity: "Devi",
    description: "लता मंगेशकर जी के स्वरों में राग भैरवी पर आधारित तुलसी वंदना एवं आध्यात्मिक समर्पण।",
  },
  "shyam choodi": {
    raag: "Khamaj",
    pahar: "night",
    mood: "लीला रस एवं बाल-सुलभ आनंद (Krishna Leela Joy)",
    deity: "Krishna",
    description: "राग खमाज और लोक संगीत का अद्भुत संगम, जो भगवान कृष्ण की मनोहारी मनिहारी लीला दर्शाता है।",
  },
  "kabhi ram banke": {
    raag: "Bhupali",
    pahar: "morning",
    mood: "समन्वय, भक्ति एवं आनंद (Omnipresent Divinity)",
    deity: "Rama",
    description: "राग भूपाली के पाँच शुद्ध स्वरों में प्रभु के सर्वव्यापी रूपों का मधुर गुणगान।",
  },
  "are dwarpalo": {
    raag: "Shivranjani",
    pahar: "anytime",
    mood: "मित्रता, करुणा एवं अश्रुपूर्ण मिलन (Sudama Krishna Reunion)",
    deity: "Krishna",
    description: "राग शिवरंजनी के करुण स्वरों में भक्त सुदामा और भगवान श्री कृष्ण की अमर मित्रता का प्रसंग।",
  },
};

export function getCurrentPahar(date: Date = new Date()): PaharInfo {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });

  const hour = parseInt(formatter.format(date), 10);

  if (hour >= 3 && hour < 6) return PRAHARS.dawn;
  if (hour >= 6 && hour < 9) return PRAHARS.morning;
  if (hour >= 9 && hour < 12) return PRAHARS["late-morning"];
  if (hour >= 12 && hour < 15) return PRAHARS.afternoon;
  if (hour >= 15 && hour < 18) return PRAHARS["late-afternoon"];
  if (hour >= 18 && hour < 21) return PRAHARS.evening;
  if (hour >= 21 && hour < 24) return PRAHARS.night;
  return PRAHARS["late-night"];
}

export function getPaharById(id: PaharId): PaharInfo {
  return PRAHARS[id] ?? PRAHARS.anytime;
}

export function enrichTrackRaag(track: Track): Track {
  // If track already has an assigned/enriched Raag, PRESERVE IT 100%!
  // Do NOT overwrite it with keyword heuristics, even if pahar is "anytime" or raag is "Bhairavi"
  if (track.raag && track.raag.trim() !== "") {
    const master = getRaagDetails(track.raag);
    return {
      ...track,
      raag: master ? master.name : track.raag,
      raagHindi: track.raagHindi || (master ? master.nameHindi : track.raag),
      thaat: track.thaat || (master ? master.thaat : "Bilawal"),
      pahar: track.pahar || (master ? master.pahar : "anytime"),
      timeSlot: track.timeSlot || (master ? master.timeSlot : "सर्वकालीन"),
      mood: track.mood || (master ? master.mood : "भक्ति भाव (Devotion)"),
      description: track.description || (master ? master.spiritualSignificance : ""),
    };
  }

  const textToSearch = `${track.title} ${track.artist} ${track.film}`.toLowerCase();

  for (const [key, mapping] of Object.entries(KNOWN_TRACK_MAPPINGS)) {
    if (textToSearch.includes(key)) {
      const master = RAAG_MASTER[mapping.raag] || RAAG_MASTER.Bhairavi;
      return {
        ...track,
        raag: mapping.raag,
        raagHindi: master.nameHindi,
        thaat: master.thaat,
        pahar: mapping.pahar,
        timeSlot: master.timeSlot,
        mood: mapping.mood,
        deity: mapping.deity,
        description: mapping.description || master.spiritualSignificance,
      };
    }
  }

  // Heuristic rule engine covering all 8 Pahars
  if (textToSearch.includes("aarti") || textToSearch.includes("आरती") || textToSearch.includes("sandhya") || textToSearch.includes("deep") || textToSearch.includes("दीप")) {
    const master = RAAG_MASTER.Yaman;
    return {
      ...track,
      raag: "Yaman",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "evening",
      timeSlot: master.timeSlot,
      mood: "सांध्य आरती एवं समर्पण (Evening Aarti)",
      deity: "Universal",
      description: "संध्या आरती और दीप वंदना के लिए राग यमन के कल्याणकारी स्वर।",
    };
  }

  if (textToSearch.includes("suprabhatam") || textToSearch.includes("सुप्रभात") || textToSearch.includes("prabhat") || textToSearch.includes("gayatri") || textToSearch.includes("गायत्री") || textToSearch.includes("dhyan")) {
    const master = RAAG_MASTER.Lalit || RAAG_MASTER.Bhairav;
    return {
      ...track,
      raag: master.name,
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "dawn",
      timeSlot: "03:00 - 06:00 (उषाकाल / ब्रह्म मुहूर्त)",
      mood: "चेतना जागरण एवं ब्रह्म मुहूर्त ध्यान (Awakening & Dhyan)",
      deity: "Universal",
      description: "ब्रह्म मुहूर्त में आत्म-जागरण और प्रभु के ध्यान हेतु समर्पित पावन स्वर।",
    };
  }

  if (textToSearch.includes("shiv tandav") || textToSearch.includes("तांडव") || textToSearch.includes("tandav") || textToSearch.includes("mahakaal") || textToSearch.includes("महाकाल")) {
    const master = RAAG_MASTER.Malkauns;
    return {
      ...track,
      raag: "Malkauns",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "late-night",
      timeSlot: master.timeSlot,
      mood: "गंभीर शिव तांडव एवं ध्यान (Midnight Transcendence)",
      deity: "Shiva",
      description: "मध्य रात्रि में भगवान शिव के दिव्य स्वरूप का गंभीर और रहस्यमयी राग।",
    };
  }

  if (textToSearch.includes("achyutam") || textToSearch.includes("अच्युतम") || textToSearch.includes("keshavam") || textToSearch.includes("lullaby") || textToSearch.includes("shayan")) {
    const master = RAAG_MASTER.Kafi;
    return {
      ...track,
      raag: "Kafi",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "night",
      timeSlot: master.timeSlot,
      mood: "माधुर्य एवं शयन भक्ति (Divine Night Serenity)",
      deity: "Krishna",
      description: "रात्रि पहर में प्रभु के मधुर नाम संकीर्तन और विश्राम का पावन राग।",
    };
  }

  if (textToSearch.includes("madhurashtakam") || textToSearch.includes("मधुराष्टकम्") || textToSearch.includes("sarang") || textToSearch.includes("गोपाल")) {
    const master = RAAG_MASTER["Shuddha Sarang"] || RAAG_MASTER.Kafi;
    return {
      ...track,
      raag: "Shuddha Sarang",
      raagHindi: "शुद्ध सारंग",
      thaat: "Kafi",
      pahar: "afternoon",
      timeSlot: "12:00 - 15:00 (मध्याह्न)",
      mood: "शांत एवं शीतल भक्ति (Midday Serenity)",
      deity: "Krishna",
      description: "दोपहर के समय मन को शीतलता और ईश्वर भक्ति प्रदान करने वाला राग।",
    };
  }

  if (textToSearch.includes("radha") || textToSearch.includes("राधा") || textToSearch.includes("virah") || textToSearch.includes("विरह") || textToSearch.includes("longing")) {
    const master = RAAG_MASTER.Bhimpalasi;
    return {
      ...track,
      raag: "Bhimpalasi",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "late-afternoon",
      timeSlot: master.timeSlot,
      mood: "विरह वेदना एवं उत्कट प्रेम (Soulful Yearning)",
      deity: "Krishna",
      description: "अपराह्न काल में भक्त और भगवान के मिलन की तड़प को अभिव्यक्त करने वाला राग।",
    };
  }

  if (textToSearch.includes("vishnu") || textToSearch.includes("विष्णु") || textToSearch.includes("sahasranama") || textToSearch.includes("सहस्रनाम") || textToSearch.includes("narayan")) {
    const master = RAAG_MASTER.Jaunpuri;
    return {
      ...track,
      raag: "Jaunpuri",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "late-morning",
      timeSlot: master.timeSlot,
      mood: "प्रसन्नता एवं स्तुति (Uplifting Praise)",
      deity: "Vishnu",
      description: "मध्याह्न पूर्व बेला में भगवान नारायण की स्तुति और नव-ऊर्जा का संचार।",
    };
  }

  if (textToSearch.includes("shiv") || textToSearch.includes("शिव") || textToSearch.includes("shankar") || textToSearch.includes("bholenath")) {
    const master = RAAG_MASTER.Bhairav;
    return {
      ...track,
      raag: "Bhairav",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "morning",
      timeSlot: master.timeSlot,
      mood: "शांत एवं गंभीर शिव भक्ति (Shiva Dhyan)",
      deity: "Shiva",
      description: "भगवान शिव के गंभीर और कल्याणकारी स्वरूप का स्मरण कराने वाला राग।",
    };
  }

  if (textToSearch.includes("krishna") || textToSearch.includes("कृष्ण") || textToSearch.includes("bansi") || textToSearch.includes("murli")) {
    const master = RAAG_MASTER.Pahadi;
    return {
      ...track,
      raag: "Pahadi",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "evening",
      timeSlot: master.timeSlot,
      mood: "माधुर्य एवं युगल प्रेम (Krishna Bhakti)",
      deity: "Krishna",
      description: "वृंदावन की दिव्य बंसी और राधा-कृष्ण के मधुर प्रेम का मनभावन राग।",
    };
  }

  if (textToSearch.includes("hanuman") || textToSearch.includes("हनुमान") || textToSearch.includes("bajrang")) {
    const master = RAAG_MASTER.Bilawal;
    return {
      ...track,
      raag: "Bilawal",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "morning",
      timeSlot: master.timeSlot,
      mood: "उत्साह एवं संकट-मोचन भाव (Strength & Protection)",
      deity: "Hanuman",
      description: "हनुमान जी की स्तुति और नव-ऊर्जा संचार हेतु बिलावल अंग का प्रभाव।",
    };
  }

  if (textToSearch.includes("ram") || textToSearch.includes("राम") || textToSearch.includes("raghupati")) {
    const master = RAAG_MASTER.Bhupali;
    return {
      ...track,
      raag: "Bhupali",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      pahar: "morning",
      timeSlot: master.timeSlot,
      mood: "मर्यादा एवं शांत भक्ति (Maryada & Peace)",
      deity: "Rama",
      description: "मर्यादा पुरुषोत्तम श्री राम के पावन चरित्र को समर्पित राग भूपाली।",
    };
  }

  const master = RAAG_MASTER.Bhairavi;
  return {
    ...track,
    raag: "Bhairavi",
    raagHindi: master.nameHindi,
    thaat: master.thaat,
    pahar: "anytime",
    timeSlot: master.timeSlot,
    mood: "सर्वकालीन भक्ति रस (Universal Devotion)",
    deity: "Universal",
    description: "सर्वकालीन राग भैरवी, जो किसी भी समय मन को शांति और भक्ति से परिपूर्ण कर देता है।",
  };
}

export function getFilteredTracks(
  tracks: Track[],
  filter: "auto" | "all" | PaharId,
  currentPahar: PaharInfo
): Track[] {
  if (!tracks || tracks.length === 0) return [];

  // 0. Ensure all tracks are passed through heuristic enrichment
  const enrichedTracks = tracks.map((t) => enrichTrackRaag(t));

  if (filter === "all") return enrichedTracks;

  const targetPaharId = filter === "auto" ? currentPahar.id : filter;

  // 1. Primary tracks matching targeted Pahar
  const paharTracks = enrichedTracks.filter((t) => t.pahar === targetPaharId);

  // 2. Secondary Sarvakalin / Anytime tracks (excluding duplicates)
  const anytimeTracks = enrichedTracks.filter(
    (t) => t.pahar === "anytime" && !paharTracks.some((pt) => pt.id === t.id)
  );

  // 3. Remaining tracks belonging to other Pahars (appended at end of queue)
  const otherTracks = enrichedTracks.filter(
    (t) => t.pahar !== targetPaharId && t.pahar !== "anytime"
  );

  // Combine: Target Pahar songs FIRST, then Sarvakalin/Anytime songs SECOND, then other Pahars THIRD
  const combined = [...paharTracks, ...anytimeTracks, ...otherTracks];

  return combined.length > 0 ? combined : enrichedTracks;
}
