import { getPlaylists } from "@/lib/get-playlists";
import { PlayerEngineProvider } from "@/components/player/player-engine";
import { DesktopPlayer } from "@/components/player/desktop-player";
import { MobilePlayer } from "@/components/player/mobile-player";
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

      <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-x-hidden">
        <PlayerEngineProvider initialPlaylists={playlists}>
          <TopBar />

          {/* ── Main Heading: म्यूज़िक माला (Yatra One) ── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 pt-12 pb-2 sm:pt-16 md:pt-20 w-full max-w-5xl mx-auto">
            {/* Center backing scrim container for supreme text legibility */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3 py-4 px-3 sm:px-6 rounded-3xl bg-black/25 backdrop-blur-[2px] border border-white/5 shadow-2xl shadow-black/60 max-w-full">
              {/* Decorative top flourish rule */}
              <div className="flex w-full max-w-[160px] xs:max-w-[220px] sm:max-w-md md:max-w-lg items-center gap-2 sm:gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/80 to-amber" />
                <span className="text-[10px] sm:text-[12px] font-utility tracking-widest text-amber select-none font-semibold">
                  ✦ ✨ ✦
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber/80 to-amber" />
              </div>

              {/* Main responsive heading using Yatra One */}
              <h1
                lang="hi"
                style={{ fontFamily: "var(--font-yatra)" }}
                className="text-center font-normal tracking-normal select-none my-0 sm:my-1 max-w-full px-2"
                aria-label="म्यूज़िक माला"
              >
                <span
                  className="inline-block text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[8.2rem] leading-[1.2] sm:leading-[1.22] md:leading-[1.18] py-1.5 sm:py-2.5 px-2 sm:px-4 transition-all duration-300"
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
                  म्यूज़िक माला
                </span>
              </h1>

              {/* Subtitle / Tagline */}
              <p className="font-display text-[11px] xs:text-xs sm:text-sm md:text-base tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em] text-cream uppercase text-center font-medium px-2 max-w-md sm:max-w-xl text-shadow-sub drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                शास्त्रीय राग समय चक्र &bull; Vintage Melodies
              </p>

              {/* Decorative bottom flourish rule */}
              <div className="flex w-full max-w-[160px] xs:max-w-[220px] sm:max-w-md md:max-w-lg items-center gap-2 sm:gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/80 to-amber" />
                <span className="text-[9px] sm:text-[11px] font-utility text-amber select-none font-semibold">
                  ✦
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber/80 to-amber" />
              </div>
            </div>
          </div>

          {/* Player controls bottom wrapper */}
          <div className="flex w-full items-end justify-center px-2 sm:px-4 pb-3 sm:pb-6 safe-b">
            <DesktopPlayer />
            <MobilePlayer />
          </div>

          {/* Modals */}
          <RaagModal />
          <ShortcutsModal />
        </PlayerEngineProvider>
      </main>
    </>
  );
}
