import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function handleGenerateCaption(file) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const form = new FormData();
        form.append("file", file, file.name);
        const getCaptions=await fetch(`http://localhost:4000/transcribe`,{ method: "POST",body: form});
        if(!getCaptions){
            return NextResponse.json({ message: 'Failed to get captions' }, { status: 500 });
        }
        const { captions,srt } = await getCaptions.json();
        console.log("captionoutput",captions)
        return ({captions:captions,srt:srt, message:'Captions Generated Successfully', status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to generate captions' }, { status: 500 });
    }
}