import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleGeneratePost } from "@/utils/handleGeneratePost";
import dbConnect from '@/db';
import Project from "@/models/project.model.js";

export async function POST(request) {
  await dbConnect();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse JSON from frontend
    const body = await request.json();
    const {publicId, mediaUrl, fileName,originalSize, fileType, platform } = body;

    if (!mediaUrl || !fileName || !publicId) {
      return NextResponse.json({ message: "Media URL and file name are required" }, { status: 400 });
    }

    const newProject = new Project({
      type:"generatePost",
      ownerClerkUserId: userId,
      projectTitle: fileName,
      OriginalSize: parseFloat((originalSize / (1024 * 1024)).toFixed(2)) || 0,
      fileName: fileName,
      format: fileType || "unknown",
      status: "queued",
      publicId:publicId,
      userIP: request.headers.get("x-forwarded-for") || "Unknown",
      browser: request.headers.get("user-agent") || "Unknown"
    })
    const qstashUrl = process.env.QSTASH_QUEUE_URL; // e.g., https://qstash.upstash.io/v1/publish/<topic>
    if (!qstashUrl) throw new Error("QSTASH_QUEUE_URL not set");


    const payload = {
      CloudinaryURL: mediaUrl,
      PublicId: publicId,
      OriginalSize: parseFloat((originalSize / (1024 * 1024)).toFixed(2)) || 0,
      userId,
      platform:platform,
      projectId:newProject._id
    };


    const res = await fetch(qstashUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.QSTASH_TOKEN}` // Upstash QStash auth token
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Failed to create QStash job: ${res.statusText}`);
    }

    const jobResponse = await res.json();
    console.log("✅ QStash job created:", jobResponse);

    // Return immediately, frontend can poll for final posts
    return {
      message: "Caption generation job queued successfully",
      jobId: jobResponse?.id || null,
      projectId: newProject._id
    };

  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error.message || error
    }, { status: 500 });
  }
}
