import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Project from "@/models/project.model.js";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/db";
import { nanoid } from "nanoid"; // for unique short IDs
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const MAX_LENGTH = 10;
export const POST = async (request) => {
    await dbConnect();

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { publicId, width, height, fileName } = body;

        if (!publicId) {
            return NextResponse.json(
                { message: "publicId is required" },
                { status: 400 }
            );
        }

        // Generate resized Cloudinary URL
        const resizedUrl = cloudinary.url(publicId, {
            width: width ? Number(width) : undefined,
            height: height ? Number(height) : undefined,
            crop: "scale",
            quality: "auto",
            fetch_format: "auto",
        });
        const baseName = publicId.split("/").pop().split(".")[0];
        const shortName = baseName.length > MAX_LENGTH
            ? baseName.slice(0, MAX_LENGTH) + "..."
            : baseName;
        console.log("Resized Image URL:", resizedUrl);

        const projectTitle = `${shortName} Compressed ${nanoid(4)}`; // adds 4-char unique suffix



        // SAVE to database
        const newProject = new Project({
            type: "imageResize",
            ownerClerkUserId: userId,
            projectTitle,
            publicId: publicId,
            compressedUrl: resizedUrl,
            fileName: shortName,
            format: "image",
            userIP: request.headers.get("x-forwarded-for") || "Unknown",
            browser: request.headers.get("user-agent") || "Unknown",
            thumbnailUrl: resizedUrl,
        });

        await newProject.save();

        return NextResponse.json({
            message: "Image resized successfully",
            resizedUrl,
        });

    } catch (error) {
        console.error("Image Resize Error:", error);
        return NextResponse.json(
            {
                message: "The Image cannot be resized",
                error: error.message,
            },
            { status: 500 }
        );
    }
};
