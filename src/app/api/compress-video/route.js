import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/db";
import Project from "@/models/project.model";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  await dbConnect();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { publicId, originalSize } = body;

    if (!publicId) {
      return NextResponse.json(
        { message: "publicId is required" },
        { status: 400 }
      );
    }

    // Re-upload the video with compression to get actual compressed size
    const compressedResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.explicit(publicId, {
        resource_type: "video",
        type: "upload",
        eager: [
          { quality: "auto:good", fetch_format: "mp4" } // compressed transformation
        ]
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    const compressedUrl = compressedResult.eager[0].secure_url;
    const compressedBytes = compressedResult.eager[0].bytes;

    // Generate thumbnail at 2 seconds
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 400, height: 250, crop: "pad", background: "auto" },
        { start_offset: 2 },
      ],
    });

    // Save project in DB
    const newProject = new Project({
      type: "videoCompression",
      ownerClerkUserId: userId,
      compressedUrl,
      fileName: publicId,
      fileSizeMB: parseFloat((originalSize / (1024 * 1024)).toFixed(2)) || 0,
      compressedSizeMB: parseFloat((compressedBytes / (1024 * 1024)).toFixed(2)),
      format: "video/mp4",
      projectTitle: publicId + " Compressed",
      publicId,
      userIP: request.headers.get("x-forwarded-for") || "Unknown",
      browser: request.headers.get("user-agent") || "Unknown",
      thumbnailUrl,
    });

    await newProject.save();

    return NextResponse.json({
      url: compressedUrl,
      public_id: publicId,
      compressedSize: compressedBytes,
      thumbnailUrl,
    });

  } catch (error) {
    console.error("Error in video compression route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
