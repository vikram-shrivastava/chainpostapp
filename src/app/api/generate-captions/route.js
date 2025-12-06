// /api/generate-caption.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from '@/db';
import { Client } from "@upstash/qstash";
import Project from "@/models/project.model.js";
export async function POST(request) {
  await dbConnect();

  const client = new Client({ token: process.env.QSTASH_TOKEN });

  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { publicId, cloudinaryUrl, originalSize,fileName,fileType } = body;
    if (!publicId || !cloudinaryUrl) return NextResponse.json({ message: "publicId and cloudinaryUrl are required" }, { status: 400 });

    const newProject=new Project({
          type:"videoCaption",
          ownerClerkUserId: userId,
          projectTitle: fileName,
          fileName: fileName.split('.').slice(0, -1).join('.') || fileName,
          format: fileType || "unknown",
          status: "queued",
          publicId:publicId,
          userIP: request.headers.get("x-forwarded-for") || "Unknown",
          browser: request.headers.get("user-agent") || "Unknown"
        })
    await newProject.save();
    // Queue job to QStash for background processing
    const result = await client.publishJSON({
      topic: "transcribe-videos",   // QStash topic name
      body: {
        CloudinaryURL: cloudinaryUrl,
        PublicId: publicId,
        OriginalSize: parseFloat((originalSize / (1024 * 1024)).toFixed(2)) || 0,
        userId,
        projectId:newProject._id,
        platform:"not required",
      }
    });

    console.log("✅ Job queued:", result);
    return NextResponse.json({ message: "Job queued successfully", jobId: result.messageId,projectId:newProject._id, status: 200 });

  } catch (err) {
    console.error("❌ Error queuing job:", err);
    return NextResponse.json({ message: "Failed to queue job", error: err.message }, { status: 500 });
  }
}
