import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleGeneratePost } from "@/utils/handleGeneratePost";
import dbConnect from '@/db';
export async function POST(request) {
    await dbConnect();
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const formData = await request.formData();
        const file=formData.get('file')
        const platform=formData.get('platform')
        const generatedPost=handleGeneratePost(file,platform)
        if(!generatedPost){
            return NextResponse.json({ message: 'Post generation failed' }, { status: 500 });
        }
        const currproject= new Project({
            type:'generatePost',
            clerkuserid:userId,
            previewUrl:"generatedPost"
        })
        await currproject.save();
        return NextResponse.json({message:'Post generated successfully',generatedPost:generatedPost})

    } catch (error) {
        console.error("Error generating post:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}