const { supabase } = require("../../config/supabase");

/**
 * Updates the Story row in Supabase with the current progress.
 * This triggers the Realtime subscription on the Frontend.
 *
 * @param {string} storyId - The UUID of the story being generated
 * @param {string} stepKey - The Enum key (INGESTION, ANALYST, etc.) matches Frontend Config
 * @param {string} message - Human readable log message
 */
async function logStep(storyId, stepKey, message) {
  // 1. Always log to Server Console (so you can debug in terminal)
  console.log(`🔹 [${stepKey}] ${message}`);

  if (!storyId) return;

  try {
    // 2. Update the 'current_agent' in Database
    // This simple update is what drives the UI Visualizer Ring.
    const { error } = await supabase
      .from("stories")
      .update({
        current_agent: stepKey,
        // We update the timestamp to ensure the 'change' event fires
        // even if the stepKey is the same (e.g. Ingestion -> Ingestion)
        updated_at: new Date().toISOString(),
      })
      .eq("id", storyId);

    if (error) {
      console.error("⚠️ Supabase Log Error:", error.message);
    }

    // Note: We are intentionally NOT appending to 'progress_logs' array here
    // to keep the operation extremely fast (low latency).
    // The 'current_agent' is sufficient for the Visualizer Ring.
  } catch (err) {
    console.error("⚠️ Logger Exception:", err.message);
  }
}

module.exports = { logStep };
