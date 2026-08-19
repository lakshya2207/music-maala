import { NextResponse } from "next/server";

// Store active presence sessions in global scope to persist across API requests in hot-reloading dev mode
declare global {
  // eslint-disable-next-line no-var
  var activeSessions: Map<string, number> | undefined;
}

if (!globalThis.activeSessions) {
  globalThis.activeSessions = new Map<string, number>();
}

const sessions = globalThis.activeSessions;
const SESSION_TTL_MS = 25000; // 25 seconds inactivity window

function cleanupOldSessions() {
  const now = Date.now();
  for (const [id, lastSeen] of sessions.entries()) {
    if (now - lastSeen > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

export async function GET(req: Request) {
  cleanupOldSessions();
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  if (clientId) {
    sessions.set(clientId, Date.now());
  }

  // Count active listeners (at least 1 if client is connected)
  const count = Math.max(1, sessions.size);

  return NextResponse.json({ count });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, action } = body;

    if (clientId) {
      if (action === "disconnect") {
        sessions.delete(clientId);
      } else {
        sessions.set(clientId, Date.now());
      }
    }
  } catch {
    // Ignore body parse errors
  }

  cleanupOldSessions();
  return NextResponse.json({ count: Math.max(1, sessions.size) });
}
