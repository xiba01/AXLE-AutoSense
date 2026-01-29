const { z } = require("zod");

const AnalystReportSchema = z.object({
  // 1. The Persona (The "Vibe")
  marketing_persona: z
    .string()
    .describe(
      "A short, catchy marketing title for the car, e.g., 'The Weekend Warrior' or 'The City Slicker'",
    ),

  // 2. The Target Audience
  target_audience: z
    .string()
    .describe(
      "Who is the ideal buyer? e.g., 'Young families looking for value'",
    ),

  // 3. The Tone
  suggested_tone: z.enum([
    "Exciting",
    "Trustworthy",
    "Luxurious",
    "Eco-Conscious",
    "Rugged",
    "Playful",
    "Serious",
  ]),

  // 4. Unique Selling Points (USPs) - The "Ammo" for the scenes
  // We extract up to 10 potential features, ranked by importance.
  // The Director will decide how many to use (3, 5, or 11).
  prioritized_features: z.array(
    z.object({
      feature_name: z.string(), // e.g., "AWD System"
      benefit_description: z.string(), // e.g., "Tackle mud and snow with confidence"
      category: z
        .string()
        .describe(
          "Category such as Performance, Efficiency, Safety, Technology, Comfort, Design, Utility, Value, Eco, etc.",
        ),
      score: z
        .number()
        .min(1)
        .max(10)
        .describe("How strong is this feature for this specific car?"),
    }),
  ),

  // 5. Strategy
  narrative_angle: z
    .string()
    .describe(
      "One sentence guidance for the scriptwriter on the overall story arc.",
    ),

  // 6. Badge Refinement
  // The Analyst reviews the calculated badges and picks the top 3 to highlight
  highlight_badges: z
    .array(z.string())
    .describe("The IDs of the top 3 most impressive badges to show."),
});

module.exports = { AnalystReportSchema };
