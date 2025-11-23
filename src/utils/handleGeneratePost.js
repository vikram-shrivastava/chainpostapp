import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dbConnect from "@/db/index.js";
import Project from "@/models/project.model";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

export async function handleGeneratePost({ captions, platform, userId, projectId }) {
    try {
        await dbConnect();
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


        // 5. Update Project with generated post info
        const updatedProject=await Project.findByIdAndUpdate(projectId, {
            generatedPostText: JSON.stringify(generatedJSON),
        });
        if(!updatedProject){
            throw new Error("Failed to update project with generated post");
        }
        return {
            generatedPost: generatedJSON,
            message: `Post Generated for ${platform} successfully`,
        };
    } catch (error) {
        console.error("Error in handleGeneratePost:", error);
        throw new Error("Failed to generate post");
    }
}
