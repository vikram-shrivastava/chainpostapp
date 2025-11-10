import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User.model";
import dbConnect from "@/db";

export async function POST(req) {
  await dbConnect();
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const user = await User.findOneAndUpdate(
      { clerkuserid: userId },
      {
        $set: {
          preferences: body.preferences,
          notifications: body.notifications,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Settings updated", user });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}



export async function GET() {
  
  try {
    await dbConnect();
    const { userId, isAuthenticated } =await auth();
    console.log(userId)
    if (!isAuthenticated || !userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userdetails = await User.findOne({ clerkuserid: userId })
      .select("preferences notifications storage billing");

    if (!userdetails) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User settings fetched successfully",
      preferences: userdetails.preferences,
      notifications: userdetails.notifications,
      storage: userdetails.storage,
      billing: userdetails.billing,
      status: 200
    });
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}