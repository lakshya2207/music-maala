import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VisitorStatsModel } from "@/models/Visitor";

// In-memory fallback in case MongoDB is unavailable
declare global {
  // eslint-disable-next-line no-var
  var fallbackVisitorCount: number | undefined;
}

if (typeof globalThis.fallbackVisitorCount !== "number") {
  globalThis.fallbackVisitorCount = 0;
}

async function getOrInitVisitorCount(): Promise<number> {
  try {
    const db = await connectToDatabase();
    if (db) {
      let stats = await VisitorStatsModel.findOne({ id: "site-stats" });
      if (!stats) {
        stats = await VisitorStatsModel.create({ id: "site-stats", count: 0 });
      }
      globalThis.fallbackVisitorCount = stats.count;
      return stats.count;
    }
  } catch (err) {
    console.warn("[Visitor Count API] MongoDB count fetch error, using fallback count:", err);
  }
  return globalThis.fallbackVisitorCount ?? 0;
}

async function incrementVisitorCount(): Promise<number> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const stats = await VisitorStatsModel.findOneAndUpdate(
        { id: "site-stats" },
        { $inc: { count: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      if (stats) {
        globalThis.fallbackVisitorCount = stats.count;
        return stats.count;
      }
    }
  } catch (err) {
    console.warn("[Visitor Count API] MongoDB count increment error, using fallback count:", err);
  }
  globalThis.fallbackVisitorCount = (globalThis.fallbackVisitorCount ?? 0) + 1;
  return globalThis.fallbackVisitorCount;
}

export async function GET() {
  const count = await getOrInitVisitorCount();
  return NextResponse.json({ count });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body && body.isNewVisitor) {
      const count = await incrementVisitorCount();
      return NextResponse.json({ count, registered: true });
    }
  } catch {
    // Empty body
  }

  const count = await getOrInitVisitorCount();
  return NextResponse.json({ count, registered: false });
}
