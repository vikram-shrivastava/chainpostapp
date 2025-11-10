import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleGenerateCaption } from "@/utils/handleGenerateCaptions";
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
        const isCaptionGenerated=handleGenerateCaption(file)
        if(!isCaptionGenerated){
            return NextResponse.json({message:"Cannot Generated Captions"})
        }
        const currproject= new Project({
            type:'videoCaption',
            clerkuserid:userId,
            previewUrl:"generatedCaptions"
        })
        await currproject.save();
        return NextResponse.json({Captions:isCaptionGenerated.captions , message:"Caption Generated Successfully"})
    } catch (error) {
        return NextResponse.json({message:"Failed to generate Caption", error:error})
    }
}