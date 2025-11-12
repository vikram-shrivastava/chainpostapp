import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Project from "@/models/project.model.js";
import {v2 as cloudinary } from 'cloudinary';
import { handleUpload } from "@/utils/handleUpload";
import dbConnect from '@/db';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request) => {
    await dbConnect();
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }    
        const formData = await request.formData();
        const file = formData.get('file');
        const width=formData.get('width')
        const height=formData.get('height')
        const fileName=formData.get('fileName')
        if(!file){
            return NextResponse.json({ 
                message: 'File required' 
            }, { status: 400 });
        }
        const isUploadSuccessful = await handleUpload(file, 'image');
        if(!isUploadSuccessful){
            return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
        }
        const public_id=isUploadSuccessful.public_id;
        const resizedUrl = cloudinary.url(public_id, {
            width: width,
            height: height,
            crop: 'scale',
        });
        console.log("Resized Image URL:", resizedUrl);
        const currproject= new Project({
            type:'imageResize',
            ownerClerkUserId:userId,
            projectTitle:"Image Resize - "+fileName,
            publicId:public_id,
            compressedUrl:resizedUrl,
            fileName:fileName,
            format:'image',
            userIP: request.headers.get('x-forwarded-for') || 'Unknown',
            browser: request.headers.get('user-agent') || 'Unknown',
            thumbnailUrl:resizedUrl,
        })
        await currproject.save();
        return NextResponse.json({message:'Image resized successfully',resizedUrl:resizedUrl})
    } catch (error) {
        return NextResponse.json({message:"The Image Cannot be resized",error:error})
    }
}