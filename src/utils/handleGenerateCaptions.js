import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function handleGenerateCaption(videoUrl) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Send video URL instead of file
        const response = await fetch(`http://localhost:4000/transcribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: videoUrl }),
        });

        if (!response.ok) {
            const err = await response.json();
            return NextResponse.json({ message: err.message || 'Failed to get captions' }, { status: 500 });
        }

        const { captions, srt } = await response.json();
        console.log("captionoutput", captions);

        return { captions, srt, message: 'Captions Generated Successfully', status: 200 };
    } catch (error) {
        console.error("Error in handleGenerateCaption:", error);
        return NextResponse.json({ message: 'Failed to generate captions', error: error.message || error }, { status: 500 });
    }
}
