import dns from "node:dns";
import mongoose from "mongoose";

// Set reliable public DNS servers to resolve MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
  dns.setDefaultResultOrder?.("ipv4first");
  console.log("[MongoDB/DNS] Configured DNS resolvers: [8.8.8.8, 8.8.4.4, 1.1.1.1, 1.0.0.1] (ipv4first)");
} catch (e) {
  console.warn("[MongoDB/DNS] Could not configure custom DNS servers:", e);
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseGlobalCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    console.log("[MongoDB] No MONGODB_URI configured. Operating in fallback mode.");
    return null;
  }

  // Re-ensure DNS servers in serverless/runtime environments
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
  } catch {
    // Ignore if not permitted
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("[MongoDB] Initiating connection to MongoDB Atlas...");
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("[MongoDB] Successfully connected to database:", m.connection.name || "music-maala");
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    console.error("[MongoDB] Connection failed:", e);
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

