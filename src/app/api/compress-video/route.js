import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleUpload } from '@/utils/handleUpload';
import {v2 as cloudinary} from 'cloudinary'
export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file');
        if(!file){
            return NextResponse.json({ 
                message: 'File required' 
            }, { status: 400 });
        }
        const isUploadSuccessful = await handleUpload(file, 'video');
        if (!isUploadSuccessful) {
            return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
        }
        const public_id=isUploadSuccessful.public_id;
        const compressedUrl = cloudinary.url(public_id, {
            resource_type: 'video',
            format: 'mp4',
            quality: 'auto:good', // automatic compression  
        });
        return NextResponse.json({message:'compressed successfully',compressedUrl:compressedUrl})
    } catch (error) {
        console.error('Error in video compression route:', error);
        return NextResponse.json({
            message: 'Internal Server Error'
            }, { status: 500 });
    }
}