import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono, Yatra_One } from "next/font/google";
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

const yatraOne = Yatra_One({
  subsets: ["devanagari"],
  weight: ["400"],
  variable: "--font-yatra-raw",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Music Mala | म्यूज़िक माला",
  description: "A late-night radio dial for classic Hindi music and vintage melodies.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0e14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} ${yatraOne.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/bg/scene-wide.webp"
          type="image/webp"
          media="(min-width: 641px)"
        />
        <link
          rel="preload"
          as="image"
          href="/bg/scene-tall.webp"
          type="image/webp"
          media="(max-width: 640px)"
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

