import { getPlaylists } from "@/lib/get-playlists";
import { PlayerEngineProvider } from "@/components/player/player-engine";
import { RadioPlayer } from "@/components/player/radio-player";
import { RaagModal } from "@/components/player/raag-modal";
import { ShortcutsModal } from "@/components/player/shortcuts-modal";
import { TopBar } from "@/components/top-bar/top-bar";

export default async function Home() {
  const playlists = await getPlaylists();

  return (
    <>
      {/* Fixed background layers */}
      <div className="hero-bg" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-x-hidden pb-8">
        <PlayerEngineProvider initialPlaylists={playlists}>
          <TopBar />

          {/* ── Main Hero & Self-Descriptive Header: म्यूज़िक माला रेडियो ── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 sm:px-4 pt-16 pb-4 sm:pt-20 md:pt-24 w-full max-w-4xl mx-auto text-center">
            {/* Center backing scrim container for supreme legibility and sacred ambiance */}
            <div className="flex flex-col items-center gap-2.5 sm:gap-3 py-4 sm:py-5 px-4 sm:px-8 rounded-3xl bg-black/40 backdrop-blur-md border border-amber/20 shadow-2xl shadow-black/80 max-w-full">
              {/* Live Vintage Radio Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/15 border border-amber/35 text-amber text-[11px] sm:text-xs font-utility font-bold uppercase tracking-wider shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span>24×7 लाइव विंटेज रेडियो • LIVE CLASSICAL RADIO</span>
              </div>

              {/* Decorative top flourish rule */}
              <div className="flex w-full max-w-[180px] xs:max-w-[240px] sm:max-w-md items-center gap-2 sm:gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/80 to-amber" />
                <span className="text-[11px] sm:text-[13px] font-utility tracking-widest text-amber select-none font-semibold">
                  ✦ 📻 ✦
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber/80 to-amber" />
              </div>

              {/* Main responsive heading: म्यूज़िक माला रेडियो (Yatra One) */}
              <h1
                lang="hi"
                style={{ fontFamily: "var(--font-yatra)" }}
                className="text-center font-normal tracking-normal select-none my-0 max-w-full px-2"
                aria-label="म्यूज़िक माला रेडियो"
              >
                <span
                  className="inline-block text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.2] py-1 px-2 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFF176 0%, #FFB300 35%, #FF8F00 70%, #FFE082 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter:
                      "drop-shadow(0 4px 18px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 36px rgba(255, 179, 0, 0.6)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.9))",
                  }}
                >
                  म्यूज़िक माला रेडियो
                </span>
              </h1>

              {/* English Subtitle */}
              <p className="font-display text-[11px] xs:text-xs sm:text-sm md:text-base tracking-[0.18em] sm:tracking-[0.22em] text-cream uppercase text-center font-semibold px-2 max-w-md sm:max-w-xl text-shadow-sub drop-shadow-md">
                Music Maala Radio &bull; 8 Prahars Classical Music Broadcast
              </p>

              {/* Self-Descriptive Narrative: Classical Music & 8 Prahars Time Cycle */}
              <div className="mt-1 max-w-2xl text-center space-y-2 border-t border-white/10 pt-3">
                <p className="font-body text-xs sm:text-sm text-cream/90 leading-relaxed font-normal">
                  <span className="text-amber font-semibold">राग और समय चक्र का पावन संगम: </span>
                  भारतीय शास्त्रीय संगीत में दिन के २४ घंटों को ८ पावन प्रहरों में बांटा गया है, जहां प्रत्येक प्रहर का अपना विशेष राग, भाव और रस होता है। यह विंटेज रेडियो वर्तमान समय अनुसार उस प्रहर के भजनों और रागों को स्वतः प्रसारित करता है।
                </p>

                {/* 3 Interactive Quick Guide Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-utility text-[10.5px] sm:text-[11.5px]">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-cream/90 flex items-center gap-1.5 shadow-sm">
                    <span>📻</span>
                    <span>रेडियो डायल से प्रहर ट्यून करें</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-cream/90 flex items-center gap-1.5 shadow-sm">
                    <span>⏱️</span>
                    <span>भारतीय समय (IST) स्वतः ट्यूनिंग</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-cream/90 flex items-center gap-1.5 shadow-sm">
                    <span>🌸</span>
                    <span>पुष्प वर्षा से भाव अर्पण</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Centerpiece Vintage Temple Radio Player with Scroll Tuner ── */}
          <div className="flex w-full flex-col items-center justify-center px-2 sm:px-4">
            <RadioPlayer />
          </div>

          {/* Modals */}
          <RaagModal />
          <ShortcutsModal />
        </PlayerEngineProvider>
      </main>
    </>
  );
}
