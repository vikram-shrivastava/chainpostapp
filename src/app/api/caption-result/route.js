import { NextResponse } from "next/server";
import dbConnect from "@/db/index.js";
import Project from "@/models/project.model.js";

const MAX_LENGTH = 8;

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  console.log("🔥 Received caption result:", data);

  const { captions, srt, PublicId, OriginalSize, userId } = data;

  if (!PublicId || !userId) {
    return NextResponse.json({ message: "PublicId and userId are required" }, { status: 400 });
  }

  const baseName = PublicId.split("/").pop().split(".")[0];
  const shortName = baseName.length > MAX_LENGTH ? baseName.slice(0, MAX_LENGTH) + "..." : baseName;
  const projectTitle = `${shortName} Caption`;

  try {
    const project = new Project({
      type: "videoCaption",
      ownerClerkUserId: userId,
      generatedCaptions: captions || "",
      srtFileUrl: "", // optionally upload to cloud storage
      format: "srt",
      projectTitle,
      fileName: shortName,
      fileSizeMB: parseFloat((OriginalSize / (1024 * 1024)).toFixed(2)) || 0,
      userIP: request.headers.get("x-forwarded-for") || "Unknown",
      browser: request.headers.get("user-agent") || "Unknown"
    });

    await project.save();
    console.log("✅ Project saved successfully for", PublicId);

    return NextResponse.json({ success: true, message: "Project saved successfully" });
  } catch (error) {
    console.error("❌ Error saving project:", error);
    return NextResponse.json({ success: false, message: "Failed to save project", error: error.message }, { status: 500 });
  }
}
