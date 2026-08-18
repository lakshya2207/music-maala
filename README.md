# Nostalgia FM

A single-page nostalgia radio site: a glass-pill player that streams tracks
via the YouTube IFrame API, over a film-grain hero photo.

## Setup

```bash
npm install
npm run dev
```

Builds cleanly with `npm run build`. (If a build ever fails immediately on
font-fetch errors, that's a sandbox/network issue reaching
`fonts.googleapis.com` — it isn't a bug in the code.)

## Before you ship it

1. **Backgrounds** — drop your two images in:
   - `public/bg/scene-wide.png` (landscape)
   - `public/bg/scene-tall.png` (portrait, separately composed)

2. **Tracks** — `lib/tracks.ts` is intentionally full of placeholders
   (`REPLACE_WITH_VIDEO_ID_*`). I didn't add any real songs, since you asked
   me not to pick copyrighted tracks on your behalf. For each track:
   - Fill in `title`, `artist`, `film`, `year`, `duration` (seconds).
   - Set `videoId` to the official rights-holder's YouTube upload id (the
     part after `?v=` in the URL), and confirm embedding is enabled for it.
   - Tell me the specific videos if you'd like help wiring them in — I'll
     flag anything that looks copyrighted before adding it.

3. **Social links** — `components/top-bar/social-links.tsx` has placeholder
   `href="#"` links; point them at your real profiles.

## How it's built

- `components/player/player-engine.tsx` — the only place that talks to the
  YouTube IFrame API. One `YT.Player` instance is created once and portaled
  (via `createPortal`) into whichever of the desktop/mobile vinyl slots is
  actually visible on screen, so the video is never hidden in a 1px/opacity-0
  box and never gets destroyed/recreated on resize.
- `components/player/vinyl.tsx` — the spinning artwork circle; the actual
  `<iframe>` lives inside it.
- `components/player/desktop-player.tsx` / `mobile-player.tsx` — two
  separate layouts (`hidden sm:flex` / `sm:hidden`), not one reflowing grid.
- `lib/tracks.ts` — playlists. Adding a track is duplicating one object.



pandit ji playlist
mandir mood
mandir morning
music mala



arti simulator
