import { NextResponse } from "next/server";
import dbConnect from "@/db/index.js";
import Project from "@/models/project.model.js";
import { handleGeneratePost } from "@/utils/handleGeneratePost";
const MAX_LENGTH = 8;

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  console.log("🔥 Received caption result:", data);

  const { captions, srt, PublicId, OriginalSize, userId, platform,projectId } = data;

  if (!PublicId || !userId) {
    return NextResponse.json({ message: "PublicId and userId are required" }, { status: 400 });
  }

  try {
    const project=await Project.findByIdAndUpdate(projectId,{
      generatedCaptions: captions || "",
      srtFileUrl: "", // optionally upload to cloud storage
      format: "srt",
      fileSizeMB: parseFloat((OriginalSize / (1024 * 1024)).toFixed(2)) || 0,
      status: "completed"
    });

    await project.save();
    console.log("✅ Project saved successfully for", PublicId);

    // --- Trigger post generation asynchronously ---

    if(platform!="not required"){
      handleGeneratePost({
        captions,
        platform: platform || "all",
        userId,
        projectId
      });
      return NextResponse.json({ success: true, message: "Project saved and post generation triggered" });
    }

    return NextResponse.json({ success: true, message: "Project saved and Caption Generated" });
  } catch (error) {
    console.error("❌ Error saving project:", error);
    return NextResponse.json({ success: false, message: "Failed to save project", error: error.message }, { status: 500 });
  }
}
