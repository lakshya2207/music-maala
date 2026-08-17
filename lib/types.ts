export type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  /** seconds */
  duration: number;
  /** YouTube video id — must be an upload you have the right to use */
  videoId: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};
