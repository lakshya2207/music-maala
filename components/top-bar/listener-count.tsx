"use client";

import { useEffect, useState } from "react";

const BASE_COUNT = 214;

export function ListenerCount() {
  const [count, setCount] = useState(BASE_COUNT);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((current) => {
        const drift = Math.floor(Math.random() * 5) - 2;
        const next = current + drift;
        return Math.max(40, Math.min(600, next));
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-cream">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
      </span>
      <span className="tabular font-utility" suppressHydrationWarning>
        {count}
      </span>
      <span className="hidden text-cream-dim sm:inline">tuned in</span>
    </div>
  );
}
