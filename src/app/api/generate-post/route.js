import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from '@/db';
import Project from "@/models/project.model.js";
import { Client } from "@upstash/qstash"; // 1. Import the SDK

export async function POST(request) {
  await dbConnect();
  
  // 2. Initialize the client
  const client = new Client({ token: process.env.QSTASH_TOKEN });

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { publicId, mediaUrl, fileName, originalSize, fileType, platform } = body;

    if (!mediaUrl || !fileName || !publicId) {
      return NextResponse.json({ message: "Media URL and file name are required" }, { status: 400 });
    }

    // 3. Create the DB entry
    const newProject = new Project({
      type: "generatePost",
      ownerClerkUserId: userId,
      projectTitle: fileName,
      OriginalSize: parseFloat((originalSize / (1024 * 1024)).toFixed(2)) || 0,
      fileName: fileName.split('.').slice(0, -1).join('.') || fileName,
      format: fileType || "unknown",
      status: "queued",
      publicId: publicId,
      userIP: request.headers.get("x-forwarded-for") || "Unknown",
      browser: request.headers.get("user-agent") || "Unknown"
    });

    // ⚠️ CRITICAL FIX: Save to DB before queuing
    await newProject.save();

    // 4. Use the SDK to publish (Cleaner than fetch)
    const result = await client.publishJSON({
      topic: "transcribe-videos", // Make sure this matches your worker topic
      body: {
        CloudinaryURL: mediaUrl,
        PublicId: publicId,
        OriginalSize: parseFloat((originalSize / (1024 * 1024)).toFixed(2)) || 0,
        userId,
        platform: platform,
        projectId: newProject._id
      }
    });

    console.log("✅ QStash job created:", result.messageId);

    // 5. Standardize response using NextResponse
    return NextResponse.json({
      message: "Caption generation job queued successfully",
      jobId: result.messageId,
      projectId: newProject._id
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error.message || error
    }, { status: 500 });
  }
}