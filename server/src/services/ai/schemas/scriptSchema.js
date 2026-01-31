const { z } = require("zod");

// 1. Stats for the Slide
const KeyStatSchema = z.object({
  label: z.string().describe("Short label, e.g., 'Boot Space'"),
  value: z.string().describe("The number, e.g., '1444'"),
  unit: z.string().describe("The unit, e.g., 'Liters' or 'HP'"),
});

const HotspotContentSchema = z.object({
  label: z.string().describe("Short label for the dot, e.g. 'Alloy Wheel'"),
  icon: z
    .string()
    .describe("Lucide icon name, e.g. 'circle', 'zap', 'shield', 'info'"),
  detail_title: z.string().describe("Title for the popup card"),
  detail_body: z.string().describe("1 sentence description for the popup card"),
});

// Helper: Count words
const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

// 2. Slide Content
const SlideScriptSchema = z.object({
  headline: z
    .string()
    .describe("Punchy 2-4 word headline, e.g., 'Massive Cargo Space'"),
  paragraph: z
    .string()
    .describe(
      "Professional description, approx 40 words. Factual but engaging.",
    ),

  // --- THE FIX IS HERE ---
  voiceover_text: z
    .string()
    .refine(
      (text) => {
        const wordCount = countWords(text);
        // Relaxed range: 5 to 60 words prevents crashes
        return wordCount >= 5 && wordCount <= 60;
      },
      { message: "Voiceover must be between 5 and 60 words" },
    )
    .describe(
      "Spoken script. Conversational, emotional, approx 2 sentences. No Markdown.",
    ),
  // -----------------------

  key_stats: z.array(KeyStatSchema).max(3),
  suggested_hotspots: z.array(HotspotContentSchema).max(2).optional(),
});

// 3. Intro Content
const IntroScriptSchema = z.object({
  title: z.string().describe("The main title of the experience"),
  subtitle: z.string().describe("The sub-headline, usually Year Make Model"),
  start_button_label: z
    .string()
    .describe("Inviting CTA, e.g., 'Start Adventure'"),
});

// 4. Outro Content
const OutroScriptSchema = z.object({
  headline: z.string().describe("Final closing statement"),
  subheadline: z.string().describe("Call to action text"),
  cta_button_primary: z.string().describe("Primary button text"),
  cta_button_secondary: z.string().describe("Secondary button text"),
});

const ScriptOutputSchema = z.object({
  slide_content: SlideScriptSchema.optional(),
  intro_content: IntroScriptSchema.optional(),
  outro_content: OutroScriptSchema.optional(),
});

module.exports = { ScriptOutputSchema };
