import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleGenerateCaption } from "@/utils/handleGenerateCaptions";
import dbConnect from '@/db';
import Project from '@/models/project.model.js';

export async function POST(request) {
    await dbConnect();
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get JSON from frontend
        const body = await request.json();
        const { publicId, cloudinaryUrl, originalSize } = body;

        if (!publicId || !cloudinaryUrl) {
            return NextResponse.json({ message: "publicId and cloudinaryUrl are required" }, { status: 400 });
        }

        // Generate captions
        const result = await handleGenerateCaption(cloudinaryUrl);
        if (!result) {
            return NextResponse.json({ message: "Cannot generate captions" }, { status: 500 });
        }

        const { captions, srt } = result; // srt is raw SRT content

        // Save project in DB
        const currproject = new Project({
            type: 'videoCaption',
            ownerClerkUserId: userId,
            generatedCaptions: captions || "",
            srtFileUrl: "", // we no longer need a hosted URL
            format: 'srt',
            projectTitle: publicId + "_Captions",
            fileName: publicId,
            fileSizeMB: parseFloat((originalSize / (1024 * 1024)).toFixed(2)) || 0,
            userIP: request.headers.get('x-forwarded-for') || 'Unknown',
            browser: request.headers.get('user-agent') || 'Unknown',
        });

        await currproject.save();

        return NextResponse.json({
            text: captions,
            srtContent: srt || "",       // raw SRT content for Blob download
            message: "Caption Generated Successfully",
            status: 200
        });

    } catch (error) {
        console.error("Error in generating captions:", error);
        return NextResponse.json({
            message: "Failed to generate captions",
            error: error.message || error
        }, { status: 500 });
    }
}
