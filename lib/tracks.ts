import { Playlist } from "./types";

/**
 * PLACEHOLDER DATA.
 *
 * Per your instructions, this file does not contain any real songs — adding
 * tracks means picking the videoId yourself (or telling me which specific,
 * rights-cleared upload to use, and I'll ask before adding anything that
 * looks copyrighted).
 *
 * Each entry below is a one-line change: duplicate a row, fill in the real
 * title/artist/film/year/duration, and swap `videoId` for the official
 * uploader's YouTube video id (the part after `?v=`).
 *
 * `duration` is in seconds and is only used as a fallback before the YouTube
 * player reports the real duration.
 */

export const playlists: Playlist[] = [
  {
    id: "golden-reels",
    name: "Golden Reels",
    tracks: [
      {
        id: "gr-1",
        title: "Add track title",
        artist: "Add artist",
        film: "Add film",
        year: 1965,
        duration: 240,
        videoId: "REPLACE_WITH_VIDEO_ID_1",
      },
      {
        id: "gr-2",
        title: "Add track title",
        artist: "Add artist",
        film: "Add film",
        year: 1968,
        duration: 210,
        videoId: "REPLACE_WITH_VIDEO_ID_2",
      },
      {
        id: "gr-3",
        title: "Add track title",
        artist: "Add artist",
        film: "Add film",
        year: 1972,
        duration: 255,
        videoId: "REPLACE_WITH_VIDEO_ID_3",
      },
    ],
  },
  {
    id: "silver-screen-nights",
    name: "Silver Screen Nights",
    tracks: [
      {
        id: "ssn-1",
        title: "Add track title",
        artist: "Add artist",
        film: "Add film",
        year: 1980,
        duration: 225,
        videoId: "REPLACE_WITH_VIDEO_ID_4",
      },
      {
        id: "ssn-2",
        title: "Add track title",
        artist: "Add artist",
        film: "Add film",
        year: 1984,
        duration: 198,
        videoId: "REPLACE_WITH_VIDEO_ID_5",
      },
      {
        id: "ssn-3",
        title: "Add track title",
        artist: "Add artist",
        film: "Add film",
        year: 1990,
        duration: 264,
        videoId: "REPLACE_WITH_VIDEO_ID_6",
      },
    ],
  },
];
