import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleUpload } from '@/utils/handleUpload';
import { v2 as cloudinary } from 'cloudinary'
import dbConnect from '@/db';
import Project from '@/models/project.model';

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
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({
                message: 'File required'
            }, { status: 400 });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: 'video-uploads',
                    transformation: [{ quality: 'auto', fetch_format: 'mp4' }],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                },
            ).end(buffer);
        });

        const thumbnailUrl = cloudinary.url(result.public_id, {
            resource_type: "video",
            format: "jpg",        // convert frame to image
            transformation: [
                { width: 400, height: 250, crop: "fill" },
                { start_offset: 2 } // frame at 2 seconds
            ]
        });

        console.log('Generated thumbnail URL:', thumbnailUrl);
        console.log('Cloudinary upload result:', result);
        const newProject = new Project({
            type: 'videoCompression',
            ownerClerkUserId: userId,
            compressedUrl: result.url,
            fileName: file.name,
            fileSizeMB: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
            compressedSizeMB: parseFloat((result.bytes / (1024 * 1024)).toFixed(2)),
            duration: result.duration,
            format: 'video/mp4',
            projectTitle: file.name.split('.')[0] + ' Compressed',
            publicId: result.public_id,
            userIP: request.headers.get('x-forwarded-for') || 'Unknown',
            browser: request.headers.get('user-agent') || 'Unknown',
            thumbnailUrl: thumbnailUrl
        })
        await newProject.save();
        return NextResponse.json({ url: result.url, public_id: result.public_id, compressedSize: result.bytes });
    } catch (error) {
        console.error('Error in video compression route:', error);
        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}