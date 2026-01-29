const { deepgram } = require("../../config/deepgram");
const { supabase } = require("../../config/supabase");

/**
 * HELPER: Convert a Readable Stream to a Buffer
 */
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Generates MP3 from text.
 * Returns both the URL (for frontend) and the Buffer (for transcription).
 */
async function generateAudio(text, sceneId) {
  if (!text || text.trim().length === 0) return null;

  try {
    console.log(`   🎧 Generating TTS for Scene ${sceneId}...`);

    // 1. CALL DEEPGRAM (TTS)
    // Model: 'aura-asteria-en' (Natural Female)
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-2-zeus-en",
        encoding: "mp3",
      },
    );

    // 2. GET THE STREAM
    const stream = await response.getStream();
    if (!stream) throw new Error("Deepgram returned empty stream");

    // 3. CONVERT TO BUFFER
    // We need this in memory to upload AND to transcribe
    const audioBuffer = await streamToBuffer(stream);

    // 4. UPLOAD TO SUPABASE
    const fileName = `${Date.now()}_${sceneId}.mp3`;
    const filePath = `generated/${fileName}`;

    const { error } = await supabase.storage
      .from("story_voiceover")
      .upload(filePath, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: false,
      });

    if (error) throw new Error(`Supabase Upload Error: ${error.message}`);

    // 5. GET PUBLIC URL
    const { data: publicData } = supabase.storage
      .from("story_voiceover")
      .getPublicUrl(filePath);

    // 6. RETURN BOTH ARTIFACTS
    return {
      publicUrl: publicData.publicUrl,
      audioBuffer: audioBuffer, // Pass this to the Transcription Service
    };
  } catch (error) {
    console.error(`❌ Audio Generation Failed [${sceneId}]:`, error.message);
    return null;
  }
}

module.exports = { generateAudio };
