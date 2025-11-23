import { NextResponse } from "next/server";
import dbConnect from "@/db/index.js";
import Project from "@/models/project.model.js";
import { handleGeneratePost } from "@/utils/handleGeneratePost";

export async function POST(request) {
  await dbConnect();
  
  try {
    const data = await request.json();
    console.log("🔥 Received caption result:", data);

    const { captions, srt, PublicId, OriginalSize, userId, platform, projectId } = data;

    // 1. Basic Validation
    if (!PublicId || !userId || !projectId) {
      return NextResponse.json({ message: "PublicId, userId, and projectId are required" }, { status: 400 });
    }

    // 2. Update the Database (And handle "Project Not Found")
    // Note: We remove the extra .save() call because findByIdAndUpdate does it automatically.
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        generatedCaptions: captions || "",
        srtFileUrl: "", 
        format: "srt",
        // Fix: OriginalSize is likely already in MB from the worker/QStash payload. 
        // If the worker sends bytes, keep the division. If it sends MB (6.61), remove the division.
        // Assuming it's already MB based on your logs:
        fileSizeMB: OriginalSize || 0, 
        status: "completed"
      },
      { new: true } // This ensures 'project' variable holds the *updated* version
    );

    // 3. Safety Check: Did we actually find a project?
    if (!project) {
      console.error("❌ Project not found in DB:", projectId);
      return NextResponse.json({ message: "Project not found. Did you save it before queuing?" }, { status: 404 });
    }

    console.log("✅ Project saved successfully for", PublicId);

    // 4. Trigger post generation
    if (platform && platform !== "not required") {
      // We don't await this so the response returns fast
      handleGeneratePost({
        captions,
        platform: platform || "all",
        userId,
        projectId
      }).catch(err => console.error("Async post generation failed:", err));
      
      return NextResponse.json({ success: true, message: "Project saved and post generation triggered" });
    }

    return NextResponse.json({ success: true, message: "Project saved and Caption Generated" });

  } catch (error) {
    console.error("❌ Error saving project:", error);
    return NextResponse.json({ success: false, message: "Failed to save project", error: error.message }, { status: 500 });
  }
}