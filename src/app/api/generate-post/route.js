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

        // Call the AI post generation utility
        const generatedPost = await handleGeneratePost(mediaUrl, platform);

        // Parse the generated post JSON safely
        let parsedGeneratedPost = {};
        try {
            parsedGeneratedPost = JSON.parse(generatedPost.generatedPost);
            console.log("Generated Post Object:", parsedGeneratedPost);
        } catch (err) {
            console.error("Failed to parse generated post JSON:", err);
            parsedGeneratedPost = { error: "Failed to parse AI output" };
        }

        // Save project in DB
        const currProject = new Project({
            type: 'generatePost',
            ownerClerkUserId: userId,
            format: 'txt',
            projectTitle: fileName + "_Posts",
            fileName,
            userIP: request.headers.get('x-forwarded-for') || 'Unknown',
            browser: request.headers.get('user-agent') || 'Unknown',
            generatedPostText: generatedPost.generatedPost
        });

        await currProject.save();

        // Respond with parsed object for frontend rendering
        return NextResponse.json({
            message: 'Posts generated successfully',
            generatedPost: parsedGeneratedPost,
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
