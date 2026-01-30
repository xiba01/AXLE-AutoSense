const axios = require("axios");
const { supabase } = require("../../config/supabase");
require("dotenv").config();

/**
 * Generates an image via Pollinations (Authenticated),
 * uploads it to Supabase Storage, and returns the permanent URL.
 */
async function generateImage(prompt, seed = Math.floor(Math.random() * 10000)) {
  const apiKey = process.env.POLLINATIONS_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️ No Pollinations API Key found. Falling back to public URL (Unstable).",
    );
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?model=flux&nologo=true`;
  }

  try {
    console.log(`   🎨 Generative Step: Fetching from Pollinations (Flux)...`);

    // 1. CALL POLLINATIONS (Authenticated)
    // We request 'arraybuffer' because we expect an image file, not text.
    const encodedPrompt = encodeURIComponent(prompt);
    const genUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=nanobanana-pro&width=1920&height=1080&seed=${seed}&nologo=true`;

    const response = await axios.get(genUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": "AutoSense-Backend/1.0",
      },
      responseType: "arraybuffer",
    });

    // 2. PREPARE UPLOAD
    // Create a unique filename: timestamp_seed.jpg
    const fileName = `${Date.now()}_${seed}.jpg`;
    const filePath = `generated/${fileName}`;

    console.log(`   ☁️  Storage Step: Uploading ${fileName} to Supabase...`);

    // 3. UPLOAD TO SUPABASE
    const { data, error } = await supabase.storage
      .from("story_images") // Make sure this bucket exists and is PUBLIC
      .upload(filePath, response.data, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase Upload Error: ${error.message}`);
    }

    // 4. GET PUBLIC URL
    const { data: publicData } = supabase.storage
      .from("story_images")
      .getPublicUrl(filePath);

    const publicUrl = publicData.publicUrl;
    console.log(`   ✅ Image Asset Ready: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error("❌ Image Pipeline Failed:", error.message);

    // Fallback: If upload fails, try to return the public Pollinations link
    // so the app doesn't break completely.
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?model=flux&nologo=true`;
  }
}

module.exports = { generateImage };
