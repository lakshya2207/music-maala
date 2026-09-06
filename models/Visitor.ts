import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitorStats extends Document {
  id: string;
  count: number;
  updatedAt: Date;
}

const VisitorStatsSchema = new Schema<IVisitorStats>(
  {
    id: { type: String, required: true, unique: true, default: "site-stats" },
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const VisitorStatsModel: Model<IVisitorStats> =
  mongoose.models.VisitorStats ||
  mongoose.model<IVisitorStats>("VisitorStats", VisitorStatsSchema);
