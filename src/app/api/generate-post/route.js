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
        const formData = await request.formData();
        const file = formData.get('file')
        const platform = formData.get('platform')
        const generatedPost = await handleGeneratePost(file, platform)


        let parsedGeneratedPost;
        let postObj;
        try {
            parsedGeneratedPost = generatedPost.generatedPost;
            postObj=JSON.parse(parsedGeneratedPost);
            console.log("Generated Post Object:", postObj);
        } catch (err) {
            console.error("Failed to parse JSON from LLM:", err);
        }
        const currproject = new Project({
            type: 'generatePost',
            ownerClerkUserId: userId,
            format: 'txt',
            projectTitle: formData.get('fileName') + "_Posts" || 'Untitled',
            userIP: request.headers.get('x-forwarded-for') || 'Unknown',
            browser: request.headers.get('user-agent') || 'Unknown',
            generatedPostText: generatedPost.generatedPost
        })
        await currproject.save();
        return NextResponse.json({ message: 'Post generated successfully', generatedPost: postObj, status: 200 })
    } catch (error) {
        console.error("Error generating post:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}