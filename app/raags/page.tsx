"use client";

import { useEffect, useState } from "react";
import type { Playlist, Track, PraharId } from "@/lib/types";
import { PRAHARS, RAAG_MASTER, getCurrentPrahar } from "@/lib/raags";
import { FALLBACK_PLAYLISTS } from "@/lib/default-playlists";
import { HamburgerMenu } from "@/components/top-bar/hamburger-menu";
import Link from "next/link";

export default function RaagsPage() {
  const [playlist, setPlaylist] = useState<Playlist | null>(FALLBACK_PLAYLISTS[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"prahars" | "raags" | "deities" | "all">("prahars");
  const [currentPrahar, setCurrentPrahar] = useState(getCurrentPrahar());
  const [selectedLoreTrack, setSelectedLoreTrack] = useState<Track | null>(null);

  useEffect(() => {
    fetchPlaylist();
    const timer = setInterval(() => setCurrentPrahar(getCurrentPrahar()), 60000);
    return () => clearInterval(timer);
  }, []);

  async function fetchPlaylist() {
    try {
      const res = await fetch("/api/playlists");
      if (res.ok) {
        const playlists = await res.json();
        if (Array.isArray(playlists) && playlists.length > 0 && playlists[0]) {
          setPlaylist(playlists[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const tracks = playlist?.tracks ?? [];

  // Filtered tracks for search
  const searchedTracks = tracks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      (t.raag && t.raag.toLowerCase().includes(q)) ||
      (t.raagHindi && t.raagHindi.toLowerCase().includes(q)) ||
      (t.deity && t.deity.toLowerCase().includes(q)) ||
      (t.mood && t.mood.toLowerCase().includes(q))
    );
  });

  // Comprehensive Raag Catalog (Master definitions + any custom playlist raags)
  const allRaagsList = Array.from(
    new Set([
      ...Object.keys(RAAG_MASTER),
      ...tracks.map((t) => t.raag).filter(Boolean),
    ])
  ) as string[];

  // Unique Deities
  const uniqueDeities = Array.from(
    new Set(tracks.map((t) => t.deity || "Universal").filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-dvh bg-dusk text-cream font-body selection:bg-amber selection:text-dusk pb-16">
      {/* Backgrounds */}
      <div className="hero-bg opacity-30" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-3 sm:px-8 py-3.5 backdrop-blur-md bg-dusk/70 sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <HamburgerMenu />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-cream/70 hover:text-amber transition-colors text-xs sm:text-sm font-medium"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden xs:inline">Back to Player</span>
            <span className="xs:hidden">Player</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-amber/15 text-amber border border-amber/30 font-utility font-medium">
            {currentPrahar.icon} अभी का समय: {currentPrahar.name} ({currentPrahar.timeRange})
          </span>
        </div>

        <Link
          href="/admin"
          className="text-xs text-cream/50 hover:text-cream font-utility transition-colors hidden sm:block"
        >
          Admin Console →
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero Banner */}
        <div className="glass rounded-3xl p-6 sm:p-10 space-y-6 text-center max-w-3xl mx-auto border border-amber/20 shadow-2xl">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-utility text-amber tracking-widest uppercase">
              ✦ राग-समय चक्र दर्शन ✦
            </span>
          </div>

          <h1
            lang="hi"
            style={{ fontFamily: "var(--font-yatra)" }}
            className="text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber to-amber-500 font-normal leading-tight"
          >
            राग एवं प्रहर अनुसार भजन
          </h1>

          <p className="text-sm sm:text-base text-cream/80 max-w-xl mx-auto leading-relaxed font-body">
            भारतीय शास्त्रीय संगीत में प्रत्येक प्रहर और राग का प्रकृति, मन एवं आध्यात्मिक साधना से सीधा संबंध है। अपने समय एवं भाव के अनुसार भजन सुनें।
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by song, raag, artist, deity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-cream/40 hover:text-cream"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab("prahars")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "prahars"
                  ? "bg-amber text-dusk shadow-lg shadow-amber/20 scale-105"
                  : "bg-white/5 text-cream/70 hover:bg-white/10"
              }`}
            >
              🌅 ८ प्रहर (8 Prahars)
            </button>
            <button
              onClick={() => setActiveTab("raags")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "raags"
                  ? "bg-amber text-dusk shadow-lg shadow-amber/20 scale-105"
                  : "bg-white/5 text-cream/70 hover:bg-white/10"
              }`}
            >
              🎼 शास्त्रीय राग (Raag Collection)
            </button>
            <button
              onClick={() => setActiveTab("deities")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "deities"
                  ? "bg-amber text-dusk shadow-lg shadow-amber/20 scale-105"
                  : "bg-white/5 text-cream/70 hover:bg-white/10"
              }`}
            >
              🪔 आराध्य स्वरूप (Deity)
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-amber text-dusk shadow-lg shadow-amber/20 scale-105"
                  : "bg-white/5 text-cream/70 hover:bg-white/10"
              }`}
            >
              📜 समस्त भजन ({tracks.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Prahars View */}
        {activeTab === "prahars" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(PRAHARS).map((p) => {
                const isCurrent = currentPrahar.id === p.id;
                const praharTracks = searchedTracks.filter(
                  (t) => t.prahar === p.id || (p.id === "anytime" && t.prahar === "anytime")
                );

                return (
                  <div
                    key={p.id}
                    className={`glass rounded-3xl p-6 space-y-4 border transition-all duration-300 ${
                      isCurrent
                        ? "border-amber shadow-2xl shadow-amber/15 ring-1 ring-amber/50 bg-amber/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{p.icon}</span>
                          <h2
                            lang="hi"
                            style={{ fontFamily: "var(--font-yatra)" }}
                            className="text-xl sm:text-2xl text-cream font-normal"
                          >
                            {p.name}
                          </h2>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-amber text-dusk text-[10px] font-utility font-bold animate-pulse">
                              LIVE NOW
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-cream/50 font-utility mt-0.5">
                          {p.nameEnglish} &bull; {p.timeRange}
                        </p>
                      </div>

                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-cream/60 font-utility tabular">
                        {praharTracks.length} भजन
                      </span>
                    </div>

                    {/* Mood & Lore */}
                    <p className="text-xs sm:text-sm text-cream/80 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Representative Raags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-utility text-amber mr-1">मुख्य राग:</span>
                      {p.representativeRaags.map((r) => (
                        <span
                          key={r}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/70"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    {/* Track List */}
                    {praharTracks.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <p className="text-[11px] font-utility text-cream/40 uppercase tracking-wider">
                          इस प्रहर के भजन:
                        </p>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {praharTracks.map((t) => (
                            <div
                              key={t.id}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-cream truncate">
                                  {t.title}
                                </p>
                                <p className="text-[11px] text-cream/50 truncate">
                                  {t.artist} {t.film !== "Unknown" ? `• ${t.film}` : ""}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {t.raag && (
                                  <button
                                    onClick={() => setSelectedLoreTrack(t)}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-amber/15 text-amber border border-amber/30 hover:bg-amber/25 transition-colors"
                                  >
                                    ✦ {t.raagHindi ? `राग ${t.raagHindi}` : t.raag}
                                  </button>
                                )}
                                <Link
                                  href="/"
                                  className="text-xs px-2.5 py-1 rounded-lg bg-amber text-dusk font-semibold hover:bg-amber-deep transition-colors"
                                >
                                  ▶ Play
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Raags Collection View */}
        {activeTab === "raags" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allRaagsList.map((r) => {
              const master = RAAG_MASTER[r];
              const raagTracks = searchedTracks.filter(
                (t) =>
                  t.raag?.toLowerCase() === r.toLowerCase() ||
                  (master?.nameHindi && t.raagHindi === master.nameHindi) ||
                  (master?.name && t.raag?.toLowerCase() === master.name.toLowerCase())
              );

              if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesRaag =
                  r.toLowerCase().includes(q) ||
                  (master?.nameHindi && master.nameHindi.toLowerCase().includes(q)) ||
                  (master?.thaat && master.thaat.toLowerCase().includes(q)) ||
                  (master?.mood && master.mood.toLowerCase().includes(q)) ||
                  (master?.spiritualSignificance && master.spiritualSignificance.toLowerCase().includes(q));
                if (!matchesRaag && raagTracks.length === 0) return null;
              }

              return (
                <div
                  key={r}
                  className="glass rounded-3xl p-6 space-y-4 border border-white/15 hover:border-amber/50 transition-all duration-300 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        lang="hi"
                        style={{ fontFamily: "var(--font-yatra)" }}
                        className="text-xl sm:text-2xl text-amber font-normal"
                      >
                        {master?.nameHindi ? `राग ${master.nameHindi}` : `राग ${r}`}
                      </h3>
                      <p className="text-xs text-cream/70 font-utility font-medium mt-0.5">
                        {r} &bull; ठाठ: {master?.thaat || "Bilawal"}
                      </p>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber/20 text-amber font-utility font-bold shadow-sm">
                      {raagTracks.length} भजन
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-body">
                    <p className="text-cream/90 font-medium">
                      <span className="text-amber font-semibold">गायन समय:</span> {master?.timeSlot || "सर्वकालीन (Universal)"}
                    </p>
                    <p className="text-cream/90 font-medium">
                      <span className="text-amber font-semibold">भाव/रस:</span> {master?.mood || "भक्ति भाव एवं शांति"}
                    </p>
                    {master?.swaraNotes && (
                      <p className="text-cream/75 text-[11px] font-utility">
                        <span className="text-amber font-semibold">स्वर लक्षण:</span> {master.swaraNotes}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-cream/80 leading-relaxed line-clamp-3">
                    {master?.spiritualSignificance || "भारतीय शास्त्रीय संगीत का मधुर राग जो मन को एकाग्र कर भक्ति रस में लीन करता है।"}
                  </p>

                  {/* Songs list */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    {raagTracks.length > 0 ? (
                      raagTracks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-xs"
                        >
                          <span className="truncate flex-1 mr-2 text-cream font-medium">{t.title}</span>
                          <Link
                            href="/"
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-amber text-dusk font-bold hover:bg-amber-deep transition-colors shadow-sm shrink-0"
                          >
                            ▶ Play
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-cream/60 font-utility italic">
                        इस राग का भजन जल्द ही जोड़ा जाएगा।
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Deities View */}
        {activeTab === "deities" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueDeities.map((deity) => {
              const deityTracks = searchedTracks.filter(
                (t) => (t.deity || "Universal") === deity
              );
              if (deityTracks.length === 0) return null;

              return (
                <div
                  key={deity}
                  className="glass rounded-3xl p-6 space-y-4 border border-white/15 hover:border-amber/50 transition-all shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🪔</span>
                      <h3
                        lang="hi"
                        style={{ fontFamily: "var(--font-yatra)" }}
                        className="text-xl sm:text-2xl text-cream font-normal"
                      >
                        {deity}
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-cream/80 font-utility font-semibold">
                      {deityTracks.length} भजन
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    {deityTracks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs transition-colors"
                      >
                        <div className="truncate flex-1 mr-2">
                          <p className="text-cream font-medium truncate">{t.title}</p>
                          <p className="text-[10.5px] text-cream/70 font-utility truncate">
                            {t.raagHindi ? `राग ${t.raagHindi}` : t.raag}
                          </p>
                        </div>
                        <Link
                          href="/"
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-amber text-dusk font-bold hover:bg-amber-deep transition-colors shadow-sm shrink-0"
                        >
                          Play
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: All Songs View */}
        {activeTab === "all" && (
          <div className="glass rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/10 text-[11px] font-utility uppercase tracking-wider text-cream/70 font-bold">
                    <th className="px-4 py-3.5 w-10">#</th>
                    <th className="px-4 py-3.5 min-w-[200px]">Song & Artist</th>
                    <th className="px-4 py-3.5 min-w-[140px]">राग (Raag)</th>
                    <th className="px-4 py-3.5 min-w-[160px]">प्रहर (Time / Prahar)</th>
                    <th className="px-4 py-3.5 min-w-[120px] hidden sm:table-cell">Deity</th>
                    <th className="px-4 py-3.5 text-right w-20">Play</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-body">
                  {searchedTracks.map((track, i) => {
                    const praharInfo =
                      PRAHARS[(track.prahar as PraharId) || "anytime"] || PRAHARS.anytime;

                    return (
                      <tr key={track.id} className="hover:bg-white/10 transition-colors">
                        <td className="px-4 py-3.5 text-cream/60 font-utility text-xs tabular font-medium">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-cream text-[14px] leading-tight truncate">
                            {track.title}
                          </p>
                          <p className="text-xs text-cream/80 font-medium truncate mt-0.5">
                            {track.artist} {track.film !== "Unknown" ? `• ${track.film}` : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => setSelectedLoreTrack(track)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/20 border border-amber/40 text-amber text-xs font-semibold hover:bg-amber/30 transition-colors shadow-sm"
                          >
                            <span>✦</span>
                            <span>{track.raagHindi ? `राग ${track.raagHindi}` : track.raag}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-cream font-medium">
                          <div className="flex items-center gap-1.5">
                            <span>{praharInfo.icon}</span>
                            <span>{praharInfo.name}</span>
                          </div>
                          <span className="text-[11px] text-cream/70 font-utility">
                            {track.timeSlot || praharInfo.timeRange}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-cream/80 border border-white/15 font-medium">
                            {track.deity || "Universal"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href="/"
                            className="px-3 py-1 text-xs font-bold rounded-lg bg-amber text-dusk hover:bg-amber-deep transition-colors shadow-sm"
                          >
                            ▶
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Raag Lore Modal on this page */}
      {selectedLoreTrack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedLoreTrack(null)}
        >
          <div
            className="glass rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-6 border border-amber/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLoreTrack(null)}
              className="absolute right-5 top-5 text-cream/70 hover:text-cream p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-amber text-xs font-utility uppercase tracking-widest font-bold">
                राग विवरण &bull; Raag Lore
              </span>
              <h2
                lang="hi"
                style={{ fontFamily: "var(--font-yatra)" }}
                className="text-2xl sm:text-3xl text-amber font-normal mt-1"
              >
                {selectedLoreTrack.raagHindi
                  ? `राग ${selectedLoreTrack.raagHindi}`
                  : `Raag ${selectedLoreTrack.raag}`}
              </h2>
              <p className="text-xs text-cream/80 mt-0.5 font-medium truncate">
                भजन: {selectedLoreTrack.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 font-body text-xs">
              <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15 shadow-sm">
                <span className="text-amber font-utility font-semibold">गायन प्रहर:</span>
                <p className="font-bold text-cream text-sm mt-0.5">
                  {selectedLoreTrack.prahar}
                </p>
                <p className="text-cream/70 font-utility text-[11px] font-medium">
                  {selectedLoreTrack.timeSlot}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <span className="text-amber font-utility">ठाठ (Thaat):</span>
                <p className="font-semibold text-cream text-sm mt-0.5">
                  {selectedLoreTrack.thaat || "Bilawal"}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <span className="text-amber font-utility">भाव / रस:</span>
                <p className="font-semibold text-cream text-sm mt-0.5">
                  {selectedLoreTrack.mood || "भक्ति भाव"}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <span className="text-amber font-utility">आराध्य:</span>
                <p className="font-semibold text-cream text-sm mt-0.5">
                  {selectedLoreTrack.deity || "Universal"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-amber/10 border border-amber/25 p-4 space-y-1">
              <p className="text-xs font-utility text-amber font-semibold uppercase">
                आध्यात्मिक एवं शास्त्रीय महत्व
              </p>
              <p className="text-xs sm:text-sm text-cream/90 leading-relaxed">
                {selectedLoreTrack.description ||
                  "भारतीय शास्त्रीय संगीत में इस राग का विशेष स्थान है जो मन को शांत एवं एकाग्र करता है।"}
              </p>
            </div>

            <div className="flex justify-end">
              <Link
                href="/"
                className="px-5 py-2 rounded-full bg-amber text-dusk font-semibold text-xs hover:bg-amber-deep transition-all shadow-lg shadow-amber/20"
              >
                ▶ Listen to Bhajan in Player
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
