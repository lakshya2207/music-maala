import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const configuredPassword = process.env.PASSWORD || process.env.password;

    // If no password configured on server, allow access
    if (!configuredPassword || configuredPassword.trim() === "") {
      return NextResponse.json({
        ok: true,
        requiresPassword: false,
        message: "No admin password configured on server.",
      });
    }

    let inputPassword = req.headers.get("x-admin-password");

    if (!inputPassword) {
      try {
        const body = await req.json();
        inputPassword = body.password;
      } catch {
        // Body might be empty
      }
    }

    if (!inputPassword || inputPassword.trim() !== configuredPassword.trim()) {
      return NextResponse.json(
        { ok: false, error: "Invalid password. Access denied." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      requiresPassword: true,
      message: "Authentication successful.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Failed to verify password: " + String(err) },
      { status: 500 }
    );
  }
}
