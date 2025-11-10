import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import UserModel from "@/models/User.model.js";
import dbConnect from '@/db';
export const POST = async (request) => {
try {
    await dbConnect();
    const { userId } = await auth();
    console.log("User ID:", userId);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const fullname = formData.get("fullName");
    const username = formData.get("username");
    const email = formData.get("email");
    const photoUrl = "photoUrl";

    console.log("Onboarding Data:", { fullname, username, email, photoUrl });

    if(!username || !fullname || !email  || !photoUrl){
        return NextResponse.json({message:"All the fields are required"})
    }
    const newUser = new UserModel({
      name: fullname,
      username: username,
      email: email,
      imageUrl: photoUrl, 
      clerkuserid: userId,
    });

    await newUser.save();
    if(!newUser){
        return NextResponse.json({message:"Onboarding failed"}, {status:500})
    }
    console.log("New User Created:", newUser);
    return NextResponse.json({
      message: "Onboarding successful",
      status: 200,
    });
  } catch (error) {
    console.error("Error in onboarding:", error.errorResponse);
    return NextResponse.json({
      message: "Onboarding failed",
      error: error.message,
      status: 500,
    });
  }
};