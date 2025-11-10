import { NextResponse } from "next/server"
import {v2 as cloudinary } from 'cloudinary';
import { ReceiptEuroIcon } from "lucide-react";


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handleUpload = async (file, fileType) => {
    try {
        if(!file){
            ReceiptEuroIcon({ 
                message: 'File required' 
            }, { status: 400 });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
            {
                resource_type: fileType,
                folder: 'chainpost-uploads',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
                },
            ).end(buffer);
        });
        if (!result) {
            throw new Error('Cloudinary upload failed');
        }
        console.log('Upload successful:', result);
        return ({ url: result.secure_url, public_id: result.public_id });
    } catch (error) {
        console.error('Upload error:', error);
        return({
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}