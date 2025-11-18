import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from '@/db';
import { Client } from "@upstash/qstash";

export async function POST(request) {
    await dbConnect();

    // QStash client pointing to local dev server
    const client = new Client({
        token: process.env.QSTASH_TOKEN
    });

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { publicId, cloudinaryUrl, originalSize } = body;

        if (!publicId || !cloudinaryUrl) {
            return NextResponse.json({ message: "publicId and cloudinaryUrl are required" }, { status: 400 });
        }

        // Use the **local subscription URL** for QStash dev server
        const result = await client.publishJSON({
            url: "https://irremediable-sherice-abstrusely.ngrok-free.dev/api/handleGenerateCaptions", // <--- local ngrok endpoint
            body: {
                CloudinaryURL: cloudinaryUrl,
                PublicId: publicId,
                OriginalSize: originalSize,
                userId
            },
            headers: { "Content-Type": "application/json" },
        });

        if (!result) {
            return NextResponse.json({
                message: "Job Queuing Failed",
                error: result
            });
        }

        console.log("Job queued:", result);
        return NextResponse.json({
            message: "Caption generation job queued successfully",
            jobId: result.messageId,
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
