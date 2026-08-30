import type { PraharId, PraharInfo, Track } from "./types";

export const PRAHARS: Record<PraharId, PraharInfo> = {
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
      "रात्रि के अंतिम प्रहर में प्रकृति शांत एवं पावन होती है। यह समय ब्रह्म मुहूर्त का है, जब कोमल रे और धैवत वाले गंभीर राग मन को आत्म-साक्षात्कार और प्रभु स्मरण की ओर ले जाते हैं।",
    representativeRaags: ["Lalit", "Bhatiyar", "Vibhas", "Jogia", "Ramkali"],
  },
  morning: {
    id: "morning",
    name: "प्रातः प्रहर",
    nameEnglish: "Early Morning (Pratham Prahar)",
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
    name: "मध्याह्न पूर्व प्रहर",
    nameEnglish: "Late Morning (Dwitiya Prahar)",
    startHour: 9,
    endHour: 12,
    timeRange: "09:00 - 12:00",
    icon: "☀️",
    mood: "उल्लास, उत्साह एवं एकाग्रता (Joy, Energy & Focus)",
    description:
      "दिन के दूसरे प्रहर में सूर्य का तेज बढ़ता है। राग जौनपुरी, आसावरी और अल्हैया बिलावल मन में उमंग, कर्मठता और प्रसन्नता का भाव जगाते हैं।",
    representativeRaags: ["Jaunpuri", "Asavari", "Alhaiya Bilawal", "Deshkar", "Devgandhar"],
  },
  afternoon: {
    id: "afternoon",
    name: "मध्याह्न प्रहर",
    nameEnglish: "Afternoon (Tritiya Prahar)",
    startHour: 12,
    endHour: 15,
    timeRange: "12:00 - 15:00",
    icon: "🌤️",
    mood: "गंभीरता, शांति एवं शीतलता (Tranquility & Peace)",
    description:
      "दोपहर की धूप में सारंग अंग के राग मन को शीतल और शांत करते हैं। यह प्रहर स्थिरता, आत्म-शांति और प्रभु के मधुर स्वरूप के ध्यान का है।",
    representativeRaags: ["Shuddha Sarang", "Brindavani Sarang", "Madhmad Sarang", "Gaud Sarang"],
  },
  "late-afternoon": {
    id: "late-afternoon",
    name: "अपराह्न प्रहर",
    nameEnglish: "Late Afternoon (Chaturtha Prahar)",
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
    name: "सांध्य प्रहर (आरती काल)",
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
    name: "रात्रि प्रहर",
    nameEnglish: "Prime Night (Dwitiya Prahar Raatri)",
    startHour: 21,
    endHour: 24,
    timeRange: "21:00 - 00:00",
    icon: "🌙",
    mood: "माधुर्य, प्रेम एवं आत्मिक विश्राम (Sweetness & Soulful Rest)",
    description:
      "रात्रि के समय राग काफी, बागेश्री और जयजयवंती का गायन-वादन अत्यंत मनोहारी होता है। यह प्रहर मधुर रस, कृष्ण लीला और शांत विश्राम का है।",
    representativeRaags: ["Kafi", "Bageshri", "Jaijaiwanti", "Khamaj", "Rageshri", "Desh", "Chandrakauns"],
  },
  "late-night": {
    id: "late-night",
    name: "मध्य रात्रि प्रहर",
    nameEnglish: "Midnight (Tritiya Prahar Raatri)",
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

export interface RaagDetails {
  name: string;
  nameHindi: string;
  thaat: string;
  prahar: PraharId;
  timeSlot: string;
  mood: string;
  vadiSamvadi?: string;
  swaraNotes?: string;
  spiritualSignificance: string;
}

export const RAAG_MASTER: Record<string, RaagDetails> = {
  Bhairav: {
    name: "Bhairav",
    nameHindi: "भैरव",
    thaat: "Bhairav",
    prahar: "morning",
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
    prahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातःकाल)",
    mood: "करुणा (Compassion), सात्विक भक्ति (Pure Devotion)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल रे और कोमल निषाद (r, n)",
    spiritualSignificance:
      "प्रातःकाल में असीम शांति और हृदयस्पर्शी भक्ति का भाव जगाता है। कई प्रसिद्ध प्रभाती भजन इस राग पर आधारित हैं।",
  },
  Bhairavi: {
    name: "Bhairavi",
    nameHindi: "भैरवी",
    thaat: "Bhairavi",
    prahar: "anytime",
    timeSlot: "सर्वकालीन / प्रातःकाल (Anytime / Morning)",
    mood: "शृंगार, करुणा एवं पूर्ण समर्पण (Surrender & Supreme Devotion)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "चारों कोमल स्वर (r, g, d, n)",
    spiritualSignificance:
      "रागों की रानी। शास्त्रीय गायन का समापन इसी राग से होता है। देवी स्तुति और भक्ति पदों के लिए अत्यंत प्रिय।",
  },
  Yaman: {
    name: "Yaman",
    nameHindi: "यमन (कल्याण)",
    thaat: "Kalyan",
    prahar: "evening",
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
    prahar: "evening",
    timeSlot: "18:00 - 21:00 (सांध्यकाल)",
    mood: "भक्ति रस, सरलता एवं प्रसन्नता (Pure Joy & Reverence)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: धैवत (Dha)",
    swaraNotes: "औडव जाति (सा रे ग प ध)",
    spiritualSignificance:
      "पाँच शुद्ध स्वरों का दिव्य सम्मिश्रण। प्रभु श्री राम और कृष्ण के बाल स्वरूप के भजनों के लिए आदर्श।",
  },
  Pahadi: {
    name: "Pahadi",
    nameHindi: "पहाड़ी",
    thaat: "Bilawal",
    prahar: "anytime",
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
    prahar: "anytime",
    timeSlot: "सर्वकालीन / रात्रि (Anytime / Night)",
    mood: "करुण रस (Pathos), विरह एवं गहन भक्ति (Deep Yearning)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल गंधार (g) के साथ औडव जाति",
    spiritualSignificance:
      "भगवान शिव और कृष्ण के विरह-भक्ति पदों में अत्यंत भावुक प्रभाव उत्पन्न करता है।",
  },
  Bhimpalasi: {
    name: "Bhimpalasi",
    nameHindi: "भीमपलासी",
    thaat: "Kafi",
    prahar: "late-afternoon",
    timeSlot: "15:00 - 18:00 (अपराह्न)",
    mood: "शांत, शृंगार एवं भक्ति (Peace & Yearning)",
    vadiSamvadi: "वादी: मध्यम (Ma), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल गंधार और कोमल निषाद (g, n)",
    spiritualSignificance:
      "अपराह्न के समय मन को एकाग्र कर ईश्वर चिंतन में लीन करने वाला अत्यंत मधुर राग।",
  },
  Kafi: {
    name: "Kafi",
    nameHindi: "काफी",
    thaat: "Kafi",
    prahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि प्रहर)",
    mood: "होली, रसिया एवं प्रेम भक्ति (Festive & Loving Devotion)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: षड्ज (Sa)",
    swaraNotes: "कोमल गंधार और कोमल निषाद (g, n)",
    spiritualSignificance:
      "ब्रज की होली, कृष्ण प्रेम और चैती-कजरी भजनों का मूल आधार।",
  },
  Bilawal: {
    name: "Bilawal",
    nameHindi: "बिलावल",
    thaat: "Bilawal",
    prahar: "morning",
    timeSlot: "06:00 - 09:00 (प्रातः प्रहर)",
    mood: "उमंग, उत्साह एवं स्तुति (Celebration & Praise)",
    vadiSamvadi: "वादी: धैवत (Dha), संवादी: गंधार (Ga)",
    swaraNotes: "सभी शुद्ध स्वर",
    spiritualSignificance:
      "प्रातःकालीन स्तुति, हनुमान चालीसा और मंगल वंदना के लिए ऊर्जावान राग।",
  },
  Khamaj: {
    name: "Khamaj",
    nameHindi: "खमाज",
    thaat: "Khamaj",
    prahar: "night",
    timeSlot: "21:00 - 00:00 (रात्रि)",
    mood: "माधुर्य, शृंगार एवं समर्पण (Sweetness & Devotion)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: निषाद (Ni)",
    swaraNotes: "शुद्ध व कोमल निषाद (N, n)",
    spiritualSignificance:
      "भजन, ठुमरी और सुदामा-कृष्ण मिलन जैसे मार्मिक प्रसंगों का अत्यंत प्रभावशाली राग।",
  },
  "Puriya Dhanashree": {
    name: "Puriya Dhanashree",
    nameHindi: "पूरिया धनाश्री",
    thaat: "Purvi",
    prahar: "evening",
    timeSlot: "18:00 - 21:00 (सांध्य प्रहर)",
    mood: "गंभीर भक्ति, वैराग्य एवं प्रकाश (Solemn Devotion)",
    vadiSamvadi: "वादी: पंचम (Pa), संवादी: ऋषभ (Re)",
    swaraNotes: "कोमल रे, तीव्र म, कोमल ध (r, M', d)",
    spiritualSignificance:
      "संध्या काल में सूर्यास्त के समय मन में वैराग्य और ईश्वर के प्रति अगाध श्रद्धा उत्पन्न करता है।",
  },
  Malkauns: {
    name: "Malkauns",
    nameHindi: "मालकौंस",
    thaat: "Bhairavi",
    prahar: "late-night",
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
    prahar: "late-night",
    timeSlot: "00:00 - 03:00 (मध्य रात्रि)",
    mood: "गंभीरता, ऐश्वर्य एवं मौन (Majesty & Deep Introspection)",
    vadiSamvadi: "वादी: ऋषभ (Re), संवादी: पंचम (Pa)",
    swaraNotes: "कोमल ग, ध, नि का मंद आंदोलन",
    spiritualSignificance:
      "मिया तानसेन द्वारा रचित। रात्रि के सन्नाटे में प्रभु की विराट महिमा का स्मरण कराता है।",
  },
  Pilu: {
    name: "Mishra Pilu",
    nameHindi: "मिश्र पीलू",
    thaat: "Kafi",
    prahar: "anytime",
    timeSlot: "सर्वकालीन / अपराह्न (Anytime / Late Afternoon)",
    mood: "आत्मीयता, भावुकता एवं समर्पण (Soulful Longing)",
    vadiSamvadi: "वादी: गंधार (Ga), संवादी: निषाद (Ni)",
    swaraNotes: "विविध कोमल व शुद्ध स्वरों का सुंदर प्रयोग",
    spiritualSignificance:
      "मीराबाई और सूरदास के पदों के गायन में पीलू का विशेष स्थान है।",
  },
};

const KNOWN_TRACK_MAPPINGS: Record<
  string,
  {
    raag: string;
    prahar: PraharId;
    mood: string;
    deity: string;
    description: string;
  }
> = {
  "hanuman chutki": {
    raag: "Bilawal",
    prahar: "morning",
    mood: "उत्साह, भक्ति एवं शक्ति (Energy & Strength)",
    deity: "Hanuman",
    description: "बिलावल अंग की ऊर्जावान धुन, जो वीर हनुमान के पराक्रम और सेवा भाव को उजागर करती है।",
  },
  "shri krishna govind": {
    raag: "Bhimpalasi",
    prahar: "late-afternoon",
    mood: "माधुर्य, शांत रस एवं कृष्ण भक्ति (Sweet Krishna Devotion)",
    deity: "Krishna",
    description: "रवींद्र जैन जी द्वारा रचित राग भीमपलासी आधारित यह भजन कृष्ण शरणागति का अनुपम उदाहरण है।",
  },
  "hanuman tumhara": {
    raag: "Bilawal",
    prahar: "morning",
    mood: "स्तुति एवं मंगल भाव (Praise & Blessing)",
    deity: "Hanuman",
    description: "मंगलवार एवं प्रातःकालीन स्मरण हेतु बिलावल राग आधारित पावन हनुमान स्तुति।",
  },
  "ashutosh shashank": {
    raag: "Bhairav",
    prahar: "morning",
    mood: "सात्विक शांति एवं शिव वंदना (Divine Shiva Praise)",
    deity: "Shiva",
    description: "राग भैरव के पावन स्वरों में भगवान भोलेनाथ की प्रातःकालीन वंदना एवं स्तुति।",
  },
  "jai jagdish hare": {
    raag: "Bhairavi",
    prahar: "evening",
    mood: "आरती भाव एवं पूर्ण शरणागति (Universal Aarti)",
    deity: "Universal",
    description: "सर्वकालीन राग भैरवी आधारित सर्वमान्य सांध्य आरती, जो समस्त संकटों का निवारण करती है।",
  },
  "teri murli": {
    raag: "Pahadi",
    prahar: "evening",
    mood: "राधा-कृष्ण प्रेम एवं माधुर्य (Radha Krishna Love)",
    deity: "Krishna",
    description: "राग पहाड़ी और मिश्र काफी के मधुर स्वरों में बरसाने की राधा रानी का कृष्ण वियोग और प्रेम।",
  },
  "shyam teri bansi": {
    raag: "Pahadi",
    prahar: "evening",
    mood: "भक्ति, शृंगार एवं शांति (Sweet Melody)",
    deity: "Krishna",
    description: "फिल्म 'गीत गाता चल' का यह कालजयी भजन राग पहाड़ी पर आधारित है, जो मन को सम्मोहित करता है।",
  },
  "radhe tere charno": {
    raag: "Pahadi",
    prahar: "anytime",
    mood: "चरण रज की अभिलाषा एवं दास्य भक्ति (Devout Surrender)",
    deity: "Krishna",
    description: "राग पहाड़ी के भावुक स्वरों में श्री राधा रानी के युगल चरणों में विश्राम की प्रार्थना।",
  },
  "main tulsi": {
    raag: "Bhairavi",
    prahar: "morning",
    mood: "पवित्रता एवं मातृत्व भाव (Purity & Devotion)",
    deity: "Devi",
    description: "लता मंगेशकर जी के स्वरों में राग भैरवी पर आधारित तुलसी वंदना एवं आध्यात्मिक समर्पण।",
  },
  "shyam choodi": {
    raag: "Khamaj",
    prahar: "night",
    mood: "लीला रस एवं बाल-सुलभ आनंद (Krishna Leela Joy)",
    deity: "Krishna",
    description: "राग खमाज और लोक संगीत का अद्भुत संगम, जो भगवान कृष्ण की मनोहारी मनिहारी लीला दर्शाता है।",
  },
  "kabhi ram banke": {
    raag: "Bhupali",
    prahar: "morning",
    mood: "समन्वय, भक्ति एवं आनंद (Omnipresent Divinity)",
    deity: "Rama",
    description: "राग भूपाली के पाँच शुद्ध स्वरों में प्रभु के सर्वव्यापी रूपों का मधुर गुणगान।",
  },
  "are dwarpalo": {
    raag: "Shivranjani",
    prahar: "anytime",
    mood: "मित्रता, करुणा एवं अश्रुपूर्ण मिलन (Sudama Krishna Reunion)",
    deity: "Krishna",
    description: "राग शिवरंजनी के करुण स्वरों में भक्त सुदामा और भगवान श्री कृष्ण की अमर मित्रता का प्रसंग।",
  },
};

export function getCurrentPrahar(date: Date = new Date()): PraharInfo {
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

export function getPraharById(id: PraharId): PraharInfo {
  return PRAHARS[id] ?? PRAHARS.anytime;
}

export function enrichTrackRaag(track: Track): Track {
  if (track.raag && track.prahar) {
    const master = RAAG_MASTER[track.raag];
    return {
      ...track,
      raagHindi: track.raagHindi || (master ? master.nameHindi : track.raag),
      thaat: track.thaat || (master ? master.thaat : "Bilawal"),
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
        prahar: mapping.prahar,
        timeSlot: master.timeSlot,
        mood: mapping.mood,
        deity: mapping.deity,
        description: mapping.description || master.spiritualSignificance,
      };
    }
  }

  if (textToSearch.includes("aarti") || textToSearch.includes("आरती") || textToSearch.includes("sandhya")) {
    const master = RAAG_MASTER.Yaman;
    return {
      ...track,
      raag: "Yaman",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      prahar: "evening",
      timeSlot: master.timeSlot,
      mood: "सांध्य आरती एवं समर्पण (Evening Aarti)",
      deity: "Universal",
      description: "संध्या आरती और दीप वंदना के लिए राग यमन के कल्याणकारी स्वर।",
    };
  }

  if (textToSearch.includes("shiv") || textToSearch.includes("शिव") || textToSearch.includes("shankar") || textToSearch.includes("bholenath")) {
    const master = RAAG_MASTER.Bhairav;
    return {
      ...track,
      raag: "Bhairav",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      prahar: "morning",
      timeSlot: master.timeSlot,
      mood: "शांत एवं गंभीर शिव भक्ति (Shiva Dhyan)",
      deity: "Shiva",
      description: "भगवान शिव के गंभीर और कल्याणकारी स्वरूप का स्मरण कराने वाला राग।",
    };
  }

  if (textToSearch.includes("krishna") || textToSearch.includes("कृष्ण") || textToSearch.includes("radha") || textToSearch.includes("राधा") || textToSearch.includes("bansi") || textToSearch.includes("murli")) {
    const master = RAAG_MASTER.Pahadi;
    return {
      ...track,
      raag: "Pahadi",
      raagHindi: master.nameHindi,
      thaat: master.thaat,
      prahar: "evening",
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
      prahar: "morning",
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
      prahar: "morning",
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
    prahar: "anytime",
    timeSlot: master.timeSlot,
    mood: "सर्वकालीन भक्ति रस (Universal Devotion)",
    deity: "Universal",
    description: "सर्वकालीन राग भैरवी, जो किसी भी समय मन को शांति और भक्ति से परिपूर्ण कर देता है।",
  };
}

export function getFilteredTracks(
  tracks: Track[],
  filter: "auto" | "all" | PraharId,
  currentPrahar: PraharInfo
): Track[] {
  if (!tracks || tracks.length === 0) return [];
  if (filter === "all") return tracks;

  const targetPraharId = filter === "auto" ? currentPrahar.id : filter;

  const matched = tracks.filter(
    (t) => t.prahar === targetPraharId || t.prahar === "anytime"
  );

  return matched.length > 0 ? matched : tracks;
}
