import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
const client = new OpenAI();
export async function handleGeneratePost(file, platform) {

    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    try {
        const form = new FormData();
        form.append("file", file, file.name);
        const getCaptions = await fetch(`http://localhost:4000/transcribe`, { method: "POST", body: form });
        if (!getCaptions) {
            return NextResponse.json({ message: 'Failed to get captions' }, { status: 500 });
        }
        const { captions } = await getCaptions.json();
        const output_format = `{
            "twitter": { "post_text_twitter": "corresponding_post_text1" },
            "instagram": { "post_text_instagram": "corresponding_post_text2" },
            "linkedin": { "post_text_linkedin": "corresponding_post_text3" }
        }`;

        const prompt = `You are an AI assistant whose sole task is to generate a social post for a video based on two inputs: ${platform} and ${captions}.
            OUTPUT RULES (must be followed exactly)

            1. Output must be plain, simple text only. No markdown, no bold, no italics, no surrounding quotes, no labels, no commentary, and no explanation. Return only the final post text(s) and nothing else.

            2. Do not preface the output with "Your LinkedIn post is:" or any similar phrase. Do not show your reasoning or steps.

            3. If multiple platforms are requested, produce the posts in the order requested and separate each post by exactly one blank line. Do not add labels or headings between them.

            4. If ${platform} contains a single platform name, produce exactly one post for that platform. If ${platform} is "all" or lists multiple platforms, produce posts for each requested platform in the order requested.

            5. If ${captions} is missing or clearly empty, respond with the single plain text line: ERROR: captions missing

            PROCESS BEFORE OUTPUT (internal steps you must perform, but do not print)

            1. Read and summarize ${captions} into one clear sentence.

            2. Identify the video’s main topic, target audience, 3 key takeaways, and the single strongest viewer benefit.

            3. Decide the best tone, CTA, hashtags, and emojis for the requested platform(s).

            4. Compose the post(s) using the platform-specific rules below.

            5. Return the output in this ${output_format} structure only

            PLATFORM RULES (strict)
            Twitter
            • Length: about 120 words (rough target).
            • Tone: slightly funny, technically informative, concise and punchy.
            • Content: include 2–3 short, relevant hashtags (no more than 3). Use at most one emoji.
            • Structure: hook → 1–2 technical takeaways or insight → benefit to viewer → short CTA (e.g., "Watch the full clip", "Link in bio").
            • Avoid thread markers, lists, or multi-line labels. Single paragraph preferred.

            Instagram (caption)
            • Length: very short — maximum 6–7 words (target 4–7 words).
            • Tone: humorous, catchy, highly engaging. Use 1–2 emojis if they enhance the line.
            • Do not include hashtags in this short caption. No extra lines or explanation. Exactly one short caption line only.

            LinkedIn
            • Length: 100–150 words (target).
            • Tone: professional, value-first, slightly formal. Emphasize benefit, outcome, or insight.
            • Content: include 2–4 relevant professional hashtags (e.g., #AI, #WebDev). Include a clear CTA (e.g., "Watch to learn more", "Share your thoughts below").
            • Structure: hook → 2–3 specific takeaways or insights → why it matters (value/outcome) → CTA. Use full sentences and a professional voice.

            ADDITIONAL RULES
            • Always make the post directly relevant to the ${captions} — do not invent facts not implied by the captions. If the captions clearly state metrics/numbers, include them where appropriate; if not, avoid inventing numeric claims.
            • Keep tone appropriate for the platform (light humor for Twitter, concise fun for Instagram, professional for LinkedIn).
            • Keep hashtags short and relevant. Do not use more hashtags than allowed above per platform.
            • Avoid lists, labels, or step-by-step instructions in the returned post. Return natural prose only.
            • Do not include URLs; use a short CTA (e.g., "Watch the full video" or "Link in bio") instead.

            EXAMPLE BEHAVIOR (do not output examples; this is for your internal behavior only)
            • If platform = LinkedIn → output exactly one LinkedIn-style post in plain text (100–150 words) and nothing else.
            • If platform = Instagram → output exactly one short caption line (max 6–7 words) and nothing else.
            • If platform = Twitter → output a single paragraph ~120 words with 2–3 hashtags and 1 emoji and nothing else.

            Now: read the given ${captions}, perform the analysis steps above, then output only in the required ${output_format} following the rules exactly.`;

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });
        const generatedText = response?.output_text;
        console.log("Generated Post Text:", generatedText);
        console.log("Generated Post Text twitter:", generatedText.Twitter);
        return ({ generatedPost: generatedText, message: `Post Generated for the ${platform} successfully` })
    } catch (error) {
        console.error("Error generating post:", error);
        throw new Error("Failed to generate post");
    }
}