import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleGeneratePost } from "@/utils/handleGeneratePost";
import dbConnect from '@/db';
import Project from "@/models/project.model";

export async function POST(request) {
  await dbConnect();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse JSON from frontend
    const body = await request.json();
    const { mediaUrl, fileName, fileType, platform } = body;

    if (!mediaUrl || !fileName) {
      return NextResponse.json({ message: "Media URL and file name are required" }, { status: 400 });
    }

    // Generate AI post
    const generatedPostRaw = await handleGeneratePost(mediaUrl, platform);

    // Parse JSON safely
    let generatedPostObj = {};
    try {
      generatedPostObj = typeof generatedPostRaw.generatedPost === "string"
        ? JSON.parse(generatedPostRaw.generatedPost)
        : generatedPostRaw.generatedPost;
    } catch (err) {
      console.error("Failed to parse AI output:", err);
      generatedPostObj = { error: "Failed to parse AI output" };
    }

    // Shorten file name and project title
    const MAX_LENGTH = 20;
    const baseName = fileName.split(".")[0];
    const shortName = baseName.length > MAX_LENGTH ? baseName.slice(0, MAX_LENGTH) + "..." : baseName;
    const projectTitle = `${shortName}_Posts`;

    // Save project in DB
    const currProject = new Project({
      type: 'generatePost',
      ownerClerkUserId: userId,
      format: 'txt',
      projectTitle,
      fileName: shortName,
      userIP: request.headers.get('x-forwarded-for') || 'Unknown',
      browser: request.headers.get('user-agent') || 'Unknown',
      generatedPostText: generatedPostObj // store JS object directly
    });

    await currProject.save();

    // Respond with parsed object for frontend
    return NextResponse.json({
      message: 'Posts generated successfully',
      generatedPost: generatedPostObj,
      status: 200
    });

  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error.message || error
    }, { status: 500 });
  }
}
