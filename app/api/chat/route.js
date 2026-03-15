import { NextResponse } from "next/server";

/**
 * POST /api/chat
 * Server-side proxy to the n8n webhook.
 * The webhook URL lives in .env and is NEVER exposed to the browser.
 */
export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "query is required" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[chat/route] N8N_WEBHOOK_URL is not set in .env");
      return NextResponse.json(
        { error: "Server misconfiguration: webhook URL missing." },
        { status: 500 }
      );
    }

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim() }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error(`[chat/route] upstream error ${upstream.status}: ${text}`);
      return NextResponse.json(
        { error: "Upstream service error. Please try again." },
        { status: 502 }
      );
    }

    const data = await upstream.json();

    // n8n returns an array; take the first element
    const result = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      message: result?.message ?? "",
      isTicketRequired: result?.isTicketRequired ?? false,
      userNotification: result?.userNotification ?? "",
    });
  } catch (err) {
    console.error("[chat/route] unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
