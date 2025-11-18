import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

export async function handler(request) {
  const body = await request.json();
  const { CloudinaryURL, PublicId, OriginalSize, userId } = body;

  try {
    // Just trigger the Python server
    await fetch(process.env.CAPTION_GENERATION_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: CloudinaryURL, PublicId, OriginalSize, userId }),
    });

    // Respond immediately
    return NextResponse.json({ success: true, message: "Job queued and processing in background" });
  } catch (err) {
    console.error("Failed to queue Python job:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
