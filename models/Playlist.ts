import mongoose, { Schema, Document, Model } from "mongoose";
import type { Track as TrackType, Playlist as PlaylistType } from "@/lib/types";

export interface ITrack extends Document, Omit<TrackType, "id"> {
  id: string;
}

export interface IPlaylist extends Document, Omit<PlaylistType, "id"> {
  id: string;
  updatedAt: Date;
}

const TrackSchema = new Schema<ITrack>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    film: { type: String, default: "Unknown" },
    year: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    videoId: { type: String, required: true },
    raag: { type: String, default: "" },
    raagHindi: { type: String, default: "" },
    thaat: { type: String, default: "" },
    prahar: { type: String, default: "anytime" },
    timeSlot: { type: String, default: "" },
    mood: { type: String, default: "" },
    deity: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const PlaylistSchema = new Schema<IPlaylist>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tracks: [TrackSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PlaylistModel: Model<IPlaylist> =
  mongoose.models.Playlist || mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
