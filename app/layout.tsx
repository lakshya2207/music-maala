import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono, Kalam } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-raw",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-raw",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-utility-raw",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["devanagari"],
  weight: ["400", "700"],
  variable: "--font-kalam-raw",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nostalgia FM",
  description: "A late-night radio dial for old film songs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0e14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} ${kalam.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
