import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";
import Project from "@/models/project.model";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

export async function handleGeneratePost({ captions, platform, userId, projectId }) {
    try {
        // 1. Validate inputs
        if (!captions || !userId || !projectId) {
            throw new Error("Captions, userId, and projectId are required");
        }
        // 2. Prompt construction
        const output_format = `{
  "twitter": { "post_text_twitter": "corresponding_post_text1" },
  "instagram": { "post_text_instagram": "corresponding_post_text2" },
  "linkedin": { "post_text_linkedin": "corresponding_post_text3" }
}`;
        const prompt = `You are an AI assistant tasked with generating social posts for a video based on these captions: ${captions} and platform: ${platform}.
Follow these rules exactly and output JSON in this structure only: ${output_format}.`;

        // 3. Generate post using OpenAI
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        let generatedText = response?.output_text || "";
        let generatedJSON = {};
        try {
            generatedJSON = JSON.parse(generatedText);
        } catch (err) {
            console.warn("Failed to parse AI output as JSON, returning raw text instead.", err);
            generatedJSON = {
                twitter: { post_text_twitter: generatedText },
                instagram: { post_text_instagram: generatedText },
                linkedin: { post_text_linkedin: generatedText }
            };
        }

        // 4. Generate a downloadable text file for all posts
        const allPostsContent = Object.entries(generatedJSON)
            .map(([platformId, obj]) => `=== ${platformId.toUpperCase()} ===\n\n${obj[`post_text_${platformId}`]}\n\n`)
            .join("\n");
        
        // Save temporary file in OS temp dir
        const tempFilePath = path.join(os.tmpdir(), `social_media_posts_${Date.now()}.txt`);
        fs.writeFileSync(tempFilePath, allPostsContent, "utf-8");

        // Return URL for frontend (in real production, upload to Cloudinary/S3 and return URL)
        const captionFileUrl = `file://${tempFilePath}`; // temporary local path


        // 5. Update Project with generated post info
        const updatedProject=await Project.findByIdAndUpdate(projectId, {
            generatedPost: JSON.stringify(generatedJSON),
            postFileUrl: captionFileUrl
        });
        if(!updatedProject){
            throw new Error("Failed to update project with generated post");
        }
        return {
            generatedPost: JSON.stringify(generatedJSON),
            message: `Post Generated for ${platform} successfully`,
            postFileUrl: captionFileUrl
        };
    } catch (error) {
        console.error("Error in handleGeneratePost:", error);
        throw new Error("Failed to generate post");
    }
}
