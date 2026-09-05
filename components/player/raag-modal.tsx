"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePlayerEngine } from "./player-engine";
import { PRAHARS, RAAG_MASTER } from "@/lib/raags";
import type { PaharId, Track } from "@/lib/types";

const PRAHAR_ORDER: (PaharId | "anytime")[] = [
  "dawn",
  "morning",
  "late-morning",
  "afternoon",
  "late-afternoon",
  "evening",
  "night",
  "late-night",
  "anytime",
];

export function RaagModal() {
  const {
    raagModalTrack,
    setRaagModalTrack,
    raagLibraryOpen,
    setRaagLibraryOpen,
    playlists,
    selectTrack,
  } = usePlayerEngine();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"track" | "library">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaharFilter, setSelectedPaharFilter] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (raagLibraryOpen) {
      setActiveTab("library");
    } else if (raagModalTrack) {
      setActiveTab("track");
    }
  }, [raagLibraryOpen, raagModalTrack]);

  const isOpen = Boolean(raagModalTrack || raagLibraryOpen);

  const closeModal = () => {
    setRaagModalTrack(null);
    setRaagLibraryOpen(false);
  };

  // Collect all tracks across playlists
  const allTracks = useMemo(() => {
    if (!playlists || playlists.length === 0) return [];
    return playlists.flatMap((p) => p.tracks || []);
  }, [playlists]);

  // Group tracks by Pahar (Peher)
  const paharGroups = useMemo(() => {
    const map: Record<string, Track[]> = {
      dawn: [],
      morning: [],
      "late-morning": [],
      afternoon: [],
      "late-afternoon": [],
      evening: [],
      night: [],
      "late-night": [],
      anytime: [],
    };

    allTracks.forEach((t) => {
      const pid = (t.pahar as PaharId) || "anytime";
      if (!map[pid]) map[pid] = [];
      map[pid].push(t);
    });

    return PRAHAR_ORDER.map((pid) => {
      const info = PRAHARS[pid] || PRAHARS.anytime;
      return {
        id: pid,
        info,
        tracks: map[pid] || [],
      };
    });
  }, [allTracks]);

  // Filtered Pahar groups based on search & pahar filter dropdown
  const filteredGroups = useMemo(() => {
    return paharGroups
      .map((group) => {
        const matchesDropdown =
          selectedPaharFilter === "all" || group.id === selectedPaharFilter;

        if (!matchesDropdown) return null;

        const q = searchQuery.toLowerCase().trim();
        if (!q) return group;

        const groupNameMatch =
          group.info.name.toLowerCase().includes(q) ||
          group.info.nameEnglish.toLowerCase().includes(q) ||
          group.info.mood.toLowerCase().includes(q);

        const matchingTracks = group.tracks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.artist && t.artist.toLowerCase().includes(q)) ||
            (t.raag && t.raag.toLowerCase().includes(q)) ||
            (t.raagHindi && t.raagHindi.includes(q))
        );

        if (groupNameMatch) return group;
        if (matchingTracks.length > 0) {
          return {
            ...group,
            tracks: matchingTracks,
          };
        }

        return null;
      })
      .filter((g): g is NonNullable<typeof g> => g !== null);
  }, [paharGroups, searchQuery, selectedPaharFilter]);

  if (!mounted || !isOpen) return null;

  const track = raagModalTrack;
  const master = track && track.raag ? RAAG_MASTER[track.raag] : null;
  const paharInfo = track
    ? PRAHARS[(track.pahar as PaharId) || (master?.pahar as PaharId) || "anytime"] ||
      PRAHARS.anytime
    : PRAHARS.anytime;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] flex flex-col border border-amber/30 shadow-2xl shadow-amber/10 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-amber text-lg select-none">📻</span>
            <div>
              <h2
                lang="hi"
                style={{ fontFamily: "var(--font-yatra)" }}
                className="text-xl sm:text-2xl text-amber font-normal my-0"
              >
                पहर एवं भजन पुस्तकालय
              </h2>
              <p className="text-[11px] sm:text-xs text-cream/70 font-utility tracking-wider uppercase">
                DEVOTIONAL SONGS BY 8 PRAHARS TIME CYCLE
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 text-cream/60 hover:text-cream p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close Modal"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* View Switcher Tabs (if current track exists) */}
        {track && (
          <div className="flex items-center gap-2 mb-3 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-utility">
            <button
              type="button"
              onClick={() => setActiveTab("track")}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-center ${
                activeTab === "track"
                  ? "bg-amber text-neutral-950 shadow-md"
                  : "text-cream/75 hover:text-cream"
              }`}
            >
              वर्तमान भजन का राग ({track.raagHindi || track.raag || "भैरवी"})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-center ${
                activeTab === "library"
                  ? "bg-amber text-neutral-950 shadow-md"
                  : "text-cream/75 hover:text-cream"
              }`}
            >
              पहर अनुसार भजन सूची ({allTracks.length})
            </button>
          </div>
        )}

        {/* ── TAB 1: Single Track Raag Lore Details ── */}
        {activeTab === "track" && track ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Raag Heading */}
            <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/10">
              <span className="text-amber text-xs font-utility tracking-widest uppercase font-semibold">
                वर्तमान प्रकीर्णित राग ज्ञान
              </span>
              <h3
                lang="hi"
                style={{ fontFamily: "var(--font-yatra)" }}
                className="text-2xl sm:text-3xl text-amber font-normal my-0"
              >
                {track.raagHindi ? `राग ${track.raagHindi}` : track.raag ? `राग ${track.raag}` : "राग भैरवी"}
                {track.raag && track.raag !== track.raagHindi && (
                  <span className="text-base sm:text-lg text-cream/90 font-sans font-medium ml-2">
                    ({track.raag})
                  </span>
                )}
              </h3>
              <p className="text-xs text-cream/85 font-body font-medium">
                भजन: <span className="text-amber-200 font-semibold">{track.title}</span> {track.artist ? `• ${track.artist}` : ""}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 font-body text-xs">
              <div className="rounded-xl bg-white/10 border border-white/15 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber font-utility font-semibold">
                  <span>{paharInfo.icon}</span>
                  <span>गायन समय (Pahar)</span>
                </div>
                <p className="text-sm font-bold text-cream">{paharInfo.name}</p>
                <p className="text-[11px] text-cream/70 font-utility tabular">
                  {track.timeSlot || paharInfo.timeRange}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 border border-white/15 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber font-utility font-semibold">
                  <span>🎼</span>
                  <span>ठाठ (Parent Thaat)</span>
                </div>
                <p className="text-sm font-bold text-cream">
                  {track.thaat || master?.thaat || "Bilawal"}
                </p>
                <p className="text-[11px] text-cream/70 font-utility">
                  {master?.swaraNotes || "शुद्ध स्वर"}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 border border-white/15 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber font-utility font-semibold">
                  <span>✨</span>
                  <span>रस एवं भाव (Mood)</span>
                </div>
                <p className="text-xs font-semibold text-cream leading-tight">
                  {track.mood || master?.mood || "भक्ति भाव एवं शांति"}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 border border-white/15 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber font-utility font-semibold">
                  <span>🪔</span>
                  <span>आराध्य स्वरूप (Deity)</span>
                </div>
                <p className="text-xs font-semibold text-cream leading-tight">
                  {track.deity || "सर्व देव / Universal"}
                </p>
              </div>
            </div>

            {/* Spiritual Lore */}
            <div className="rounded-2xl bg-amber/15 border border-amber/35 p-3.5 space-y-1 shadow-md">
              <p className="text-[11px] font-utility uppercase tracking-wider text-amber font-bold">
                आध्यात्मिक महत्व एवं राग प्रभाव
              </p>
              <p className="text-xs sm:text-sm text-cream leading-relaxed font-medium">
                {track.description ||
                  master?.spiritualSignificance ||
                  paharInfo.description ||
                  "भारतीय शास्त्रीय संगीत में रागों का समय चक्र मन को एकाग्र कर ईश्वर भक्ति में लीन करने का दिव्य माध्यम है।"}
              </p>
            </div>
          </div>
        ) : (
          /* ── TAB 2: Songs Grouped by Pahars (Pehers) ── */
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Search Box */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="पहर, भजन या राग खोजें (Search Pahars, Songs or Raags)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-cream text-xs placeholder:text-cream/40 focus:outline-none focus:border-amber"
                />
                <span className="absolute left-2.5 top-2 text-cream/40 text-xs">🔍</span>
              </div>

              {/* Pahar Quick Filter Dropdown */}
              <select
                value={selectedPaharFilter}
                onChange={(e) => setSelectedPaharFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-black/40 border border-white/15 text-cream text-xs focus:outline-none focus:border-amber font-utility font-medium"
              >
                <option value="all">समस्त 8 पहर (All Pahars)</option>
                <option value="dawn">उषाकाल (Pre-Dawn)</option>
                <option value="morning">प्रातःकाल (Morning)</option>
                <option value="late-morning">मध्याह्न पूर्व (Late Morning)</option>
                <option value="afternoon">मध्याह्न (Afternoon)</option>
                <option value="late-afternoon">अपराह्न (Late Afternoon)</option>
                <option value="evening">सांध्य आरती (Evening)</option>
                <option value="night">रात्रि (Night)</option>
                <option value="late-night">मध्य रात्रि (Midnight)</option>
                <option value="anytime">सर्वकालीन (Anytime)</option>
              </select>
            </div>

            {/* Pahar Groups List (Scrollable Repertoire) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-8 text-cream/60 text-xs">
                  कोई पहर या भजन उपलब्ध नहीं मिला।
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const pInfo = group.info;

                  return (
                    <div
                      key={group.id}
                      className="rounded-2xl bg-white/5 border border-white/10 p-3.5 space-y-2.5 transition-all hover:border-amber/30"
                    >
                      {/* Pahar Group Header */}
                      <div className="flex items-start justify-between border-b border-white/10 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg select-none">{pInfo.icon}</span>
                            <h3 className="font-display font-bold text-base sm:text-lg text-amber my-0">
                              {pInfo.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber/20 border border-amber/35 text-amber text-[10.5px] font-utility font-bold tabular">
                              {pInfo.timeRange}
                            </span>
                          </div>

                          <p className="text-[11.5px] text-cream/75 font-body my-0 mt-0.5">
                            <span className="text-amber-200/90 font-semibold">भाव/रस: </span>
                            {pInfo.mood}
                          </p>
                        </div>

                        <span className="text-[10.5px] font-utility px-2 py-0.5 rounded bg-white/10 text-cream/90 font-bold shrink-0">
                          {group.tracks.length} भजन
                        </span>
                      </div>

                      {/* Pahar Description */}
                      <p className="text-[11px] text-cream/80 leading-relaxed font-body italic my-0">
                        {pInfo.description}
                      </p>

                      {/* Track List inside this Pahar */}
                      <div className="space-y-1.5 pt-1">
                        {group.tracks.length === 0 ? (
                          <div className="text-[11px] text-cream/50 italic px-2 py-1">
                            इस पहर के विशेष भजन शीघ्र जोड़े जाएंगे (सर्वकालीन भजन स्वतः प्रसारित होते हैं)।
                          </div>
                        ) : (
                          group.tracks.map((t) => (
                            <div
                              key={t.id}
                              className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/30 hover:bg-amber/15 border border-white/5 hover:border-amber/30 transition-all group"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-display text-xs font-semibold text-cream group-hover:text-amber truncate my-0">
                                    {t.title}
                                  </p>
                                  {t.raagHindi && (
                                    <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 font-utility font-semibold border border-amber-500/30 shrink-0">
                                      राग {t.raagHindi}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10.5px] text-cream/60 truncate font-body my-0 mt-0.5">
                                  {t.artist || "भक्ति संगीत"} {t.film ? `• ${t.film}` : ""}
                                </p>
                              </div>

                              {/* Play Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  selectTrack(t.id);
                                  closeModal();
                                }}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber hover:bg-amber-300 text-neutral-950 font-utility font-bold text-[11px] shadow-sm transition-transform active:scale-95 cursor-pointer"
                              >
                                <span>▶</span>
                                <span>सुनें</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between text-[11px] font-utility text-cream/70 pt-3 border-t border-white/10 mt-2">
          <span>8 पावन पहर एवं समय चक्र भजन संग्रह</span>
          <button
            onClick={closeModal}
            className="text-amber hover:underline font-bold cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
