import { getPlaylists } from "@/lib/get-playlists";
import { PlayerEngineProvider } from "@/components/player/player-engine";
import { DesktopPlayer } from "@/components/player/desktop-player";
import { MobilePlayer } from "@/components/player/mobile-player";
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

          {/* ── Main Heading: म्यूज़िक माला ── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 pt-16 pb-4 sm:pt-20">
            {/* Decorative top flourish rule */}
            <div className="flex w-full max-w-xs sm:max-w-md items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/50 to-amber" />
              <span className="text-[12px] font-utility tracking-widest text-amber/80">✦ ✨ ✦</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber/50 to-amber" />
            </div>

            {/* Main responsive heading */}
            <h1
              lang="hi"
              style={{ fontFamily: "var(--font-kalam)" }}
              className="text-center font-bold tracking-normal select-none my-1"
              aria-label="म्यूज़िक माला"
            >
              <span
                className="inline-block text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[1.3] sm:leading-[1.25] py-3 px-4 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #FFE082 0%, #FFB300 30%, #E65100 70%, #FFCA28 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 24px rgba(255, 179, 0, 0.45)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))",
                }}
              >
                म्यूज़िक माला
              </span>
            </h1>

            {/* Subtitle / Tagline */}
            <p className="font-display text-xs sm:text-sm md:text-base tracking-[0.2em] text-cream/75 uppercase text-center font-medium">
              क्लासिक हिंदी संगीत &bull; Vintage Melodies
            </p>

            {/* Decorative bottom flourish rule */}
            <div className="flex w-full max-w-xs sm:max-w-md items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/50 to-amber" />
              <span className="text-[11px] font-utility text-amber/70">✦</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber/50 to-amber" />
            </div>
          </div>

          {/* Player controls bottom wrapper */}
          <div className="flex w-full items-end justify-center px-4 pb-6 safe-b">
            <DesktopPlayer />
            <MobilePlayer />
          </div>
        </PlayerEngineProvider>
      </main>
    </>
  );
}
