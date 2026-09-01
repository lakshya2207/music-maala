"use client";

import { useState } from "react";
import type { Playlist } from "@/lib/types";
import { FlowerShower } from "@/components/top-bar/flower-shower";
import Link from "next/link";

type SyncResult = {
  ok: boolean;
  count?: number;
  syncedAt?: string;
  error?: string;
};

type Status = "idle" | "loading" | "success" | "error";

export default function AdminPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SyncResult | null>(null);
  const [preview, setPreview] = useState<Playlist | null>(null);
  const [enrichStatus, setEnrichStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [enrichResult, setEnrichResult] = useState<{ ok: boolean; count?: number; model?: string; usedAI?: boolean; error?: string } | null>(null);

  async function handleRefetch() {
    setStatus("loading");
    setResult(null);
    setPreview(null);

    try {
      const res = await fetch("/api/sync-playlist", { method: "POST" });
      const data: SyncResult = await res.json();

      if (!res.ok || !data.ok) {
        setResult({ ok: false, error: data.error ?? "Unknown error" });
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("success");

      // Fetch the refreshed cache to show preview
      const cacheRes = await fetch("/api/playlist-cache");
      if (cacheRes.ok) {
        const playlists: Playlist[] = await cacheRes.json();
        setPreview(playlists[0] ?? null);
      }
    } catch (err) {
      setResult({ ok: false, error: String(err) });
      setStatus("error");
    }
  }

  async function handleEnrichRaags() {
    setEnrichStatus("loading");
    setEnrichResult(null);

    try {
      const res = await fetch("/api/enrich-raags", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setEnrichResult({ ok: false, error: data.error ?? "Enrichment failed" });
        setEnrichStatus("error");
        return;
      }

      setEnrichResult(data);
      setEnrichStatus("success");

      // Refresh table preview
      const cacheRes = await fetch("/api/playlist-cache");
      if (cacheRes.ok) {
        const playlists: Playlist[] = await cacheRes.json();
        setPreview(playlists[0] ?? null);
      }
    } catch (err) {
      setEnrichResult({ ok: false, error: String(err) });
      setEnrichStatus("error");
    }
  }

  const statusColor = {
    idle: "text-cream/40",
    loading: "text-amber",
    success: "text-emerald-400",
    error: "text-red-400",
  }[status];

  const statusLabel = {
    idle: "Ready to sync",
    loading: "Fetching from YouTube…",
    success: `Synced ${result?.count ?? 0} tracks`,
    error: "Sync failed",
  }[status];

  return (
    <div className="min-h-dvh bg-dusk text-cream font-body">
      {/* Fixed background */}
      <div className="hero-bg opacity-30" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 sm:px-8 py-3.5 backdrop-blur-md bg-dusk/70 sticky top-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <FlowerShower />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-cream/60 hover:text-cream transition-colors text-xs sm:text-sm font-medium"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden xs:inline">Back to player</span>
            <span className="xs:hidden">Player</span>
          </Link>
        </div>

        <p className="font-display text-sm font-semibold tracking-wide text-amber">
          Music Mala — Admin
        </p>

        <Link
          href="/raags"
          className="text-xs text-cream/50 hover:text-cream font-utility transition-colors hidden sm:block"
        >
          Raags & Prahars →
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-12 space-y-10">

        {/* Hero card */}
        <div className="glass rounded-3xl p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold text-cream">
              Playlist Sync
            </h1>
            <p className="text-sm text-cream/60">
              Pulls all public videos from the YouTube playlist and updates the
              track data. After syncing, refresh the main page to hear the
              new tracks.
            </p>
          </div>

          {/* Playlist source info */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-red-400" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-cream/40 mb-0.5">Source playlist</p>
              <a
                href="https://www.youtube.com/playlist?list=PLTxRrsk4y7tk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber hover:underline truncate block"
              >
                youtube.com/playlist?list=PLTxRrsk4y7tk
              </a>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Dot */}
              <span
                className={`inline-block size-2 rounded-full ${
                  status === "loading"
                    ? "bg-amber animate-pulse"
                    : status === "success"
                    ? "bg-emerald-400"
                    : status === "error"
                    ? "bg-red-400"
                    : "bg-cream/20"
                }`}
              />
              <span className={`text-sm font-utility ${statusColor}`}>
                {statusLabel}
              </span>
              {result?.syncedAt && (
                <span className="text-xs text-cream/30 font-utility">
                  — {new Date(result.syncedAt).toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Refetch button */}
            <button
              id="refetch-btn"
              onClick={handleRefetch}
              disabled={status === "loading"}
              className={`
                flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold
                transition-all duration-200
                ${status === "loading"
                  ? "bg-amber/20 text-amber/60 cursor-not-allowed"
                  : "bg-amber text-dusk hover:bg-amber-deep active:scale-95 shadow-lg shadow-amber/20"}
              `}
            >
              {status === "loading" ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
                  </svg>
                  Syncing…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
                  </svg>
                  Refetch Playlist
                </>
              )}
            </button>
          </div>

          {/* Error message */}
          {status === "error" && result?.error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-300 font-utility break-all">{result.error}</p>
              {result.error.includes("YOUTUBE_API_KEY") && (
                <p className="mt-2 text-xs text-cream/40">
                  Create a{" "}
                  <code className="text-amber">.env.local</code> file in the
                  project root and add:{" "}
                  <code className="text-amber">YOUTUBE_API_KEY=your_key</code>,
                  then restart the dev server.
                </p>
              )}
            </div>
          )}
        </div>

        {/* AI Raag & Prahar Enrichment Card */}
        <div className="glass rounded-3xl p-8 space-y-6 border border-amber/25 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h2 className="font-display text-2xl font-semibold text-amber">
                AI Raag & Prahar Classification
              </h2>
            </div>
            <p className="text-sm text-cream/70">
              Analyzes all synced bhajans using <strong>Gemini 3.7 Flash</strong> with auto-cascading fallback (3.7 → 3.6 → 3.5 → 2.5 → Curated Heuristics) to accurately classify Classical Raags, Thaats, 8-Prahar time cycles, and spiritual lore.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block size-2 rounded-full ${
                  enrichStatus === "loading"
                    ? "bg-amber animate-pulse"
                    : enrichStatus === "success"
                    ? "bg-emerald-400"
                    : enrichStatus === "error"
                    ? "bg-red-400"
                    : "bg-cream/20"
                }`}
              />
              <span className="text-sm font-utility text-cream/80">
                {enrichStatus === "idle"
                  ? "Ready for AI enrichment"
                  : enrichStatus === "loading"
                  ? "Analyzing with Gemini AI…"
                  : enrichStatus === "success"
                  ? `Enriched ${enrichResult?.count ?? 0} tracks via ${enrichResult?.model || "AI"}`
                  : "Enrichment failed"}
              </span>
            </div>

            <button
              onClick={handleEnrichRaags}
              disabled={enrichStatus === "loading"}
              className={`
                flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold
                transition-all duration-200
                ${enrichStatus === "loading"
                  ? "bg-amber/20 text-amber/60 cursor-not-allowed"
                  : "bg-amber text-dusk hover:bg-amber-deep active:scale-95 shadow-lg shadow-amber/20"}
              `}
            >
              {enrichStatus === "loading" ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
                  </svg>
                  Classifying…
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Enrich Raags with AI</span>
                </>
              )}
            </button>
          </div>

          {enrichStatus === "error" && enrichResult?.error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-300 font-utility">{enrichResult.error}</p>
            </div>
          )}
        </div>

        {/* Track preview table */}
        {preview && preview.tracks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-cream">
                {preview.tracks.length} tracks in database
              </h2>
              <Link href="/raags" className="text-xs text-amber font-utility hover:underline">
                View Raags & Prahars View ↗
              </Link>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/15">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left bg-white/5">
                      <th className="px-4 py-3 text-[11px] font-utility uppercase tracking-wider text-cream/60 w-10 font-bold">#</th>
                      <th className="px-4 py-3 text-[11px] font-utility uppercase tracking-wider text-cream/60 font-bold">Title</th>
                      <th className="px-4 py-3 text-[11px] font-utility uppercase tracking-wider text-cream/60 font-bold">राग (Raag)</th>
                      <th className="px-4 py-3 text-[11px] font-utility uppercase tracking-wider text-cream/60 font-bold">प्रहर (Prahar)</th>
                      <th className="px-4 py-3 text-[11px] font-utility uppercase tracking-wider text-cream/60 hidden sm:table-cell font-bold">Artist</th>
                      <th className="px-4 py-3 text-[11px] font-utility uppercase tracking-wider text-cream/60 font-bold">Video ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.tracks.map((track, i) => (
                      <tr
                        key={track.id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-cream/60 font-utility tabular text-xs font-medium">{i + 1}</td>
                        <td className="px-4 py-3 text-cream font-semibold max-w-[180px]">
                          <span className="block truncate">{track.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber/20 text-amber text-xs font-utility font-semibold">
                            {track.raagHindi ? `राग ${track.raagHindi}` : track.raag || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-cream/80 font-utility">
                          {track.prahar || "anytime"}
                        </td>
                        <td className="px-4 py-3 text-cream/70 hidden sm:table-cell max-w-[120px]">
                          <span className="block truncate">{track.artist}</span>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`https://youtu.be/${track.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-utility text-amber hover:underline font-semibold"
                          >
                            {track.videoId}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
