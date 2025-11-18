import { NextResponse } from 'next/server';
import Project from '@/models/project.model';
import dbConnect from '@/db';
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
    await dbConnect();
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Sort by createdAt DESC → latest first
        const projects = await Project.find({ ownerClerkUserId: userId })
            .sort({ createdAt: -1 });

        return NextResponse.json(projects);

    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}
