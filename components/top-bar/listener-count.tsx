"use client";

import { useEffect, useState } from "react";

export function ListenerCount() {
  const [count, setCount] = useState<number>(1);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Generate or retrieve a persistent session client ID for this browser tab
    let clientId = sessionStorage.getItem("music_mala_client_id");
    if (!clientId) {
      clientId = "c_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      sessionStorage.setItem("music_mala_client_id", clientId);
    }

    let isMounted = true;

    async function sendHeartbeat() {
      try {
        const res = await fetch(`/api/presence?clientId=${encodeURIComponent(clientId!)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.count === "number") {
            setCount(data.count);
            setLoaded(true);
          }
        }
      } catch (err) {
        console.warn("Heartbeat error:", err);
      }
    }

    // Send immediate heartbeat on mount
    sendHeartbeat();

    // Periodic heartbeat every 10 seconds
    const intervalId = setInterval(sendHeartbeat, 10000);

    // Notify server on disconnect / unload
    const handleUnload = () => {
      if (clientId) {
        const blob = new Blob(
          [JSON.stringify({ clientId, action: "disconnect" })],
          { type: "application/json" }
        );
        navigator.sendBeacon("/api/presence", blob);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-cream transition-all duration-300 hover:border-amber/30">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </span>
      <span className="tabular font-utility font-semibold text-amber" suppressHydrationWarning>
        {loaded ? count : "1"}
      </span>
      <span className="text-cream-dim sm:inline text-[12px]">
        {count === 1 ? "live listener" : "live tuned in"}
      </span>
    </div>
  );
}
