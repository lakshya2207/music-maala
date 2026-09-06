"use client";

import { useEffect, useState } from "react";

export function ListenerCount() {
  const [count, setCount] = useState<number>(108);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function registerOrFetchVisitor() {
      try {
        const hasVisited = localStorage.getItem("music_maala_visited");

        let res: Response;
        if (!hasVisited) {
          // Mark device as visited in localStorage
          localStorage.setItem("music_maala_visited", "true");
          // Increment total listener count on server
          res = await fetch("/api/presence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isNewVisitor: true }),
            cache: "no-store",
          });
        } else {
          // Already visited device, fetch current total count
          res = await fetch("/api/presence", { cache: "no-store" });
        }

        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.count === "number") {
            setCount(data.count);
            setLoaded(true);
          }
        }
      } catch (err) {
        console.warn("Visitor count fetch error:", err);
      }
    }

    registerOrFetchVisitor();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      title="Total unique listener devices visited Music Maala"
      className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-cream transition-all duration-300 hover:border-amber/40 shadow-lg cursor-default"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/60 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
      </span>
      <span className="tabular font-utility font-bold text-amber" suppressHydrationWarning>
        {loaded ? count.toLocaleString() : "..."}
      </span>
      <span className="text-cream/90 sm:inline text-[12px] font-medium">
        {count === 1 ? "listener visited" : "listeners visited"}
      </span>
    </div>
  );
}
