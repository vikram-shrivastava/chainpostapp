import {NextResponse} from 'next/server';
import Project from '@/models/project.model';
import dbConnect from '@/db';
import { auth } from "@clerk/nextjs/server";
export async function GET(request) {
    await dbConnect();
    try {
        const {userId} =await auth()
        const projects = await Project.find({ownerClerkUserId:userId});
        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

