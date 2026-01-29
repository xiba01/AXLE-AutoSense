const { deepgram } = require("../../config/deepgram");

/**
 * Sends an audio buffer to Deepgram STT to get word-level timestamps.
 * Using buffer directly avoids race conditions with Supabase URL propagation.
 *
 * @param {Buffer} audioBuffer - MP3 audio buffero
 * @returns {Promise<Array>} - Array of objects: [{ word: "The", start: 0.0, end: 0.15 }, ...]
 */
async function getWordTimestamps(audioBuffer) {
  if (!audioBuffer || audioBuffer.length === 0) return [];

  try {
    // console.log("   ⏱️  Calculating sync timestamps (via buffer)...");

    // 1. CALL DEEPGRAM (STT via Buffer)
    // Using buffer directly is more reliable than URL (no propagation delay).
    const response = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-3",
        language: "en",
        smart_format: true,
        punctuate: true,
        mimetype: "audio/mpeg",
      }
    );

    // 2. EXTRACT WORDS
    const result = response.result;

    // Structure: result.results.channels[0].alternatives[0].words
    if (result?.results?.channels?.[0]?.alternatives?.[0]?.words) {
      const words = result.results.channels[0].alternatives[0].words;
      return words;
    }

    console.warn("   ⚠️ Deepgram returned no words.");
    return [];
  } catch (error) {
    console.warn("   ⚠️ Timestamp calculation failed:", error.message);
    return [];
  }
}

module.exports = { getWordTimestamps };
