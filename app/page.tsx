import { getPlaylists } from "@/lib/get-playlists";
import { PlayerEngineProvider } from "@/components/player/player-engine";
import { RadioPlayer } from "@/components/player/radio-player";
import { RaagModal } from "@/components/player/raag-modal";
import { ShortcutsModal } from "@/components/player/shortcuts-modal";
import { TopBar } from "@/components/top-bar/top-bar";
import { RaagLibraryLink } from "@/components/player/raag-library-link";

export default async function Home() {
  const playlists = await getPlaylists();

  return (
    <>
      {/* Fixed background layers */}
      <div className="hero-bg" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-x-hidden pb-6 sm:pb-8">
        <PlayerEngineProvider initialPlaylists={playlists}>
          <TopBar />

          {/* ── Main Hero & Self-Descriptive Header: म्यूज़िक माला रेडियो ── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-2 sm:gap-3 px-2 sm:px-4 pt-52 pb-50 sm:pt-32 md:pt-48 w-full max-w-4xl mx-auto text-center">
            {/* Center backing scrim container for supreme legibility and sacred ambiance */}
            <div className="flex flex-col items-center gap-2 sm:gap-2.5 py-2.5 sm:py-5 px-3 sm:px-8 rounded-2xl sm:rounded-3xl bg-black/25 sm:bg-black/40 backdrop-blur-sm sm:backdrop-blur-md border border-amber/20 shadow-2xl shadow-black/80 max-w-full">
              {/* Live Vintage Radio Pill */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber/15 border border-amber/35 text-amber text-[10px] sm:text-xs font-utility font-bold uppercase tracking-wider shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span>24×7 लाइव विंटेज रेडियो • LIVE CLASSICAL RADIO</span>
              </div>

              {/* Decorative top flourish rule */}
              <div className="flex w-full max-w-[140px] xs:max-w-[200px] sm:max-w-md items-center gap-2 sm:gap-3 opacity-80">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/80 to-amber" />
                <span className="text-[10px] sm:text-[12px] font-utility tracking-widest text-amber select-none font-semibold">
                  ✦ 📻 ✦
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber/80 to-amber" />
              </div>

              {/* Main responsive heading: म्यूज़िक माला रेडियो (Yatra One) */}
              <h1
                lang="hi"
                style={{ fontFamily: "var(--font-yatra)" }}
                className="text-center font-normal tracking-normal select-none my-0 max-w-full px-1"
                aria-label="म्यूज़िक माला रेडियो"
              >
                <span
                  className="inline-block text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.15] py-0.5 px-1 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFF176 0%, #FFB300 35%, #FF8F00 70%, #FFE082 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter:
                      "drop-shadow(0 4px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 28px rgba(255, 179, 0, 0.5))",
                  }}
                >
                  म्यूज़िक माला रेडियो
                </span>
              </h1>

              {/* English Subtitle */}
              <p className="font-display text-[10px] xs:text-[11px] sm:text-sm md:text-base tracking-[0.14em] sm:tracking-[0.20em] text-cream uppercase text-center font-semibold px-1 max-w-md sm:max-w-xl text-shadow-sub">
                Music Maala Radio &bull; 8 Prahars Classical Music Broadcast
              </p>

              {/* Narrative & Raags Link */}
              <div className="mt-0.5 max-w-2xl text-center space-y-2 border-t border-white/10 pt-2 sm:pt-3">
                <p className="font-body text-[11.5px] sm:text-sm text-cream/90 leading-relaxed font-normal px-1">
                  <span className="text-amber font-semibold">राग और समय चक्र का पावन संगम: </span>
                  भारतीय शास्त्रीय संगीत में दिन के २४ घंटों को ८ पावन प्रहरों में बांटा गया है। यह विंटेज रेडियो वर्तमान समय अनुसार उस प्रहर के भजनों और रागों को स्वतः प्रसारित करता है।
                </p>

                {/* Raag & Songs Section Link */}
                <RaagLibraryLink />
              </div>
            </div>
          </div>

          {/* ── Centerpiece Vintage Temple Radio Player with Dual Rotary Tuners ── */}
          <div className="flex w-full flex-col py-50 items-center justify-center px-1.5 sm:px-4">
            <RadioPlayer />
          </div>

          {/* ── Compact Bottom-Right Floating GitHub Tag ── */}
          <a
            href="https://github.com/lakshya2207/music-maala"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-3 right-3 z-40 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-amber/40 text-amber hover:text-amber-300 shadow-xl transition-all hover:scale-110 active:scale-95 group"
            title="GitHub Repository: lakshya2207/music-maala"
            aria-label="GitHub Repository"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 transition-transform group-hover:rotate-12">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Modals */}
          <RaagModal />
          <ShortcutsModal />
        </PlayerEngineProvider>
      </main>
    </>
  );
}
