import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleGenerateCaption } from "@/utils/handleGenerateCaptions";
export async function POST(request) {
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
        return NextResponse.json({Captions:isCaptionGenerated.captions , message:"Caption Generated Successfully"})
    } catch (error) {
        return NextResponse.json({message:"Failed to generate Caption", error:error})
    }
}