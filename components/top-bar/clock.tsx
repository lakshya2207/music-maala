"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function splitTime(date: Date) {
  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  return { hour, minute, dayPeriod };
}

export function Clock() {
  const [time, setTime] = useState<{ hour: string; minute: string; dayPeriod: string } | null>(
    null,
  );

  useEffect(() => {
    setTime(splitTime(new Date()));
    const id = setInterval(() => setTime(splitTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass flex items-center gap-1 rounded-full px-3 py-1.5 font-utility text-[13px] text-cream tabular">
      <span suppressHydrationWarning>{time?.hour ?? "--"}</span>
      <span className="clock-colon" aria-hidden>
        :
      </span>
      <span suppressHydrationWarning>{time?.minute ?? "--"}</span>
      <span className="ml-1 text-[10px] text-cream-dim" suppressHydrationWarning>
        {time?.dayPeriod ?? ""}
      </span>
    </div>
  );
}
