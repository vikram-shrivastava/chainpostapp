import { NextResponse } from "next/server";
import {v2 as cloudinary } from 'cloudinary';
import { handleUpload } from "@/utils/handleUpload";
import dbConnect from '@/db';
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
        const currproject= new Project({
            type:'imageResize',
            clerkuserid:userId,
            previewUrl:"ImageResizedUrl"
        })
        await currproject.save();
        return NextResponse.json({message:'Image resized successfully',resizedUrl:resizedUrl})
    } catch (error) {
        return NextResponse.json({message:"The Image Cannot be resized",error:error})
    }
}