const { z } = require("zod");

// 1. Stats for the Slide (The 3 numbers below the text)
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

// 2. Slide Content (For standard scenes)
const SlideScriptSchema = z.object({
  headline: z
    .string()
    .describe("Punchy 2-4 word headline, e.g., 'Massive Cargo Space'"),
  paragraph: z
    .string()
    .describe(
      "Professional description, approx 40 words. Factual but engaging."
    ),
  voiceover_text: z
    .string()
    .describe(
      "Spoken script. Conversational, emotional, approx 15-20 words. No Markdown."
    ),
  key_stats: z
    .array(KeyStatSchema)
    .max(3)
    .describe("Pick up to 3 relevant specs from the context for this scene."),
  suggested_hotspots: z
    .array(HotspotContentSchema)
    .max(2)
    .describe(
      "Identify 1 or 2 distinct visual elements visible in this scene to be clickable hotspots."
    ),
});

// 3. Intro Content (For Scene 00)
const IntroScriptSchema = z.object({
  title: z.string().describe("The main title of the experience"),
  subtitle: z.string().describe("The sub-headline, usually Year Make Model"),
  start_button_label: z
    .string()
    .describe("Inviting CTA, e.g., 'Start Adventure'"),
});

// 4. Outro Content (For Scene 99)
const OutroScriptSchema = z.object({
  headline: z.string().describe("Final closing statement"),
  subheadline: z.string().describe("Call to action text"),
  cta_button_primary: z
    .string()
    .describe("Primary button text, e.g., 'Book Test Drive'"),
  cta_button_secondary: z
    .string()
    .describe("Secondary button text, e.g., 'Replay Story'"),
});

// 5. The Container for the AI Output
// The AI will return ONE of these depending on the scene type requested
const ScriptOutputSchema = z.object({
  slide_content: SlideScriptSchema.optional(),
  intro_content: IntroScriptSchema.optional(),
  outro_content: OutroScriptSchema.optional(),
});

module.exports = { ScriptOutputSchema };
