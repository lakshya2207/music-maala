"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentPrahar } from "@/lib/raags";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const [prahar, setPrahar] = useState(getCurrentPrahar());
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTimeStr(formatter.format(now));
      setPrahar(getCurrentPrahar(now));
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape or click outside
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    {
      href: "/",
      label: "म्यूज़िक माला प्लेयर",
      subLabel: "Vintage Melodies Player",
      icon: "🎵",
      active: pathname === "/",
    },
    {
      href: "/raags",
      label: "राग एवं प्रहर दर्शन",
      subLabel: "Classical Raags & 8 Prahars",
      icon: "🎼",
      active: pathname === "/raags",
    },
    {
      href: "/admin",
      label: "प्रबंधन कंसोल",
      subLabel: "Playlist Sync & Raag Editor",
      icon: "⚙️",
      active: pathname === "/admin",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Menu" : "Open Navigation Menu"}
        aria-expanded={isOpen}
        className={`glass group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 active:scale-95 border ${
          isOpen
            ? "border-amber/50 text-amber shadow-lg shadow-amber/20 bg-amber/15"
            : "border-white/10 text-cream/90 hover:text-amber hover:border-amber/30"
        }`}
      >
        {/* Animated Hamburger / Close Icon */}
        <div className="relative flex flex-col justify-center items-center w-4 h-4 gap-1">
          <span
            className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </div>
        <span className="font-utility text-[11px] uppercase tracking-wider hidden xs:inline">
          Menu
        </span>
      </button>

      {/* Slide-over Drawer / Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-start p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="glass rounded-3xl p-5 sm:p-6 w-full max-w-sm space-y-5 border border-amber/30 shadow-2xl shadow-amber/10 animate-in slide-in-from-top-4 sm:slide-in-from-left-4 duration-300 bg-dusk/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-amber text-xs font-utility tracking-widest uppercase">
                    ✦ म्यूज़िक माला ✦
                  </span>
                </div>
                <h3
                  lang="hi"
                  style={{ fontFamily: "var(--font-yatra)" }}
                  className="font-display text-xl sm:text-2xl text-amber font-normal"
                >
                  मार्गदर्शन (Navigation)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-cream/50 hover:text-cream p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2 font-body">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
                    link.active
                      ? "bg-amber text-dusk font-semibold shadow-md shadow-amber/20 scale-[1.02]"
                      : "bg-white/5 text-cream/90 hover:bg-white/10 hover:text-amber"
                  }`}
                >
                  <span className="text-xl shrink-0">{link.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight truncate">
                      {link.label}
                    </p>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        link.active ? "text-dusk/70" : "text-cream/40"
                      }`}
                    >
                      {link.subLabel}
                    </p>
                  </div>
                  {link.active && <span className="text-xs font-bold shrink-0">●</span>}
                </Link>
              ))}
            </nav>

            {/* Live Clock & Prahar Status Widget */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-utility text-cream/50 border-b border-white/5 pb-2">
                <span>🕒 भारतीय समय (IST)</span>
                <span className="text-amber font-semibold tabular">
                  {timeStr || "--:--"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{prahar.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-cream">
                      {prahar.name}
                    </p>
                    <p className="text-[10px] text-cream/40 font-utility tabular">
                      {prahar.timeRange}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-amber/15 text-amber text-[10px] font-utility font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Keyboard Shortcuts Hint & Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-cream/50 font-utility">
              <span className="text-[11px]">शॉर्टकट्स के लिए <kbd className="text-amber font-bold">?</kbd> दबाएँ</span>
              <a
                href="https://github.com/lakshya2207"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:underline text-[11px]"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
