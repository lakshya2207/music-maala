import { getPlaylists } from "@/lib/get-playlists";
import { PlayerEngineProvider } from "@/components/player/player-engine";
import { DesktopPlayer } from "@/components/player/desktop-player";
import { MobilePlayer } from "@/components/player/mobile-player";
import { TopBar } from "@/components/top-bar/top-bar";

export default function Home() {
  const playlists = getPlaylists();

  return (
    <>
      {/* Fixed background layers — must live outside any overflow:hidden ancestor */}
      <div className="hero-bg" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between">
        <PlayerEngineProvider initialPlaylists={playlists}>
          <TopBar />

          {/* ── Bhakti Bhaav heading ── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 pb-4">
            {/* Decorative rule */}
            <div className="flex w-full max-w-xs items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber/50" />
              <span
                className="text-[11px] font-utility uppercase tracking-[0.25em] text-amber/60"
                lang="en"
              >
                ✦
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/50" />
            </div>

            {/* Main heading */}
            <h1
              lang="hi"
              style={{ fontFamily: "var(--font-kalam)" }}
              className="text-center text-5xl font-bold leading-snug tracking-wide"
              aria-label="Bhakti Bhaav"
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #f3ecda 0%, #d9a441 45%, #f3ecda 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 18px rgba(217,164,65,0.45))",
                  display: "inline-block",
                }}
              >
                भक्ति भाव
              </span>
            </h1>

            {/* Decorative rule (mirrored) */}
            <div className="flex w-full max-w-xs items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber/50" />
              <span className="text-[11px] font-utility text-amber/60">✦</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/50" />
            </div>
          </div>

          <div className="flex w-full items-end justify-center px-4 pb-6 safe-b">
            <DesktopPlayer />
            <MobilePlayer />
          </div>
        </PlayerEngineProvider>
      </main>
    </>
  );
}

