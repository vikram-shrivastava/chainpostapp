import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/db';
import Project from '@/models/project.model.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Read from query string (?id=...)
    const { searchParams } = new URL(request.url);
    const projectid = searchParams.get('id');

    if (!projectid) {
      return NextResponse.json({ message: 'Project ID missing' }, { status: 400 });
    }

    const project = await Project.findOne({ _id: projectid, ownerClerkUserId: userId });
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
