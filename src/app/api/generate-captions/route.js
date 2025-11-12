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
        const formData = await request.formData();
        const file = formData.get('file')
        const isCaptionGenerated = await handleGenerateCaption(file)
        if (!isCaptionGenerated) {
            return NextResponse.json({ message: "Cannot Generated Captions" })
        }
        const currproject = new Project({
            type: 'videoCaption',
            ownerClerkUserId: userId,
            generatedCaptions: isCaptionGenerated.srt,
            format: 'srt',
            projectTitle: formData.get('fileName') + "_Captions" || 'Untitled',
            userIP: request.headers.get('x-forwarded-for') || 'Unknown',
            browser: request.headers.get('user-agent') || 'Unknown',
        })
        try {
            await currproject.save();
        } catch (error) {
            console.error("Error saving project:", error);
            return NextResponse.json({
                message: "Failed to save project",
                error: error.message || error.toString()
            }, { status: 500 });
        }
        console.log("responseObject", isCaptionGenerated)
        return NextResponse.json({ Captions: isCaptionGenerated.captions, srtFile: isCaptionGenerated.srt, message: "Caption Generated Successfully",status:200 })
    } catch (error) {
        console.log("Error in generating captions:", error)
        return NextResponse.json({ message: "Failed to generate Caption", error: error })
    }
}