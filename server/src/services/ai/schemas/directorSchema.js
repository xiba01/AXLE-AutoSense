const { z } = require("zod");

// 1. The Layout Object
const LayoutSchema = z.object({
  composition: z.enum([
    "split-image-left",
    "split-image-right",
    "full-bleed",
    "overlay-bottom",
    "centered-focus",
  ]),

  // FIX: Allow ALL positions so the AI doesn't crash if it gets creative
  content_alignment: z.enum([
    "top-left",
    "top-center",
    "top-right",
    "middle-left",
    "middle-center",
    "middle-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ]),

  motion: z.object({
    image: z.enum([
      "slow-zoom-in",
      "slow-zoom-out",
      "subtle-pan-right",
      "static",
    ]),
    content: z.enum(["fade-up", "slide-in-left", "slide-in-right"]),
  }),
});

// ... (Rest of the file remains exactly the same)
const DirectorSceneSchema = z.object({
  scene_id: z.string(),
  scene_type: z.enum(["intro_view", "slide_view", "outro_view"]),
  main_feature_slug: z.string().optional(),
  theme_tag: z
    .string()
    .describe(
      "Theme such as PERFORMANCE, EFFICIENCY, SAFETY, LUXURY, TECHNOLOGY, UTILITY, INTRO, OUTRO, etc.",
    ),
  visual_direction: z.object({
    setting: z.string(),
    camera_angle: z.string(),
    focus_point: z.string(),
    lighting: z.string(),
  }),
  layout: LayoutSchema.optional(),
});

const DirectorOutputSchema = z.object({
  title: z.string(),
  narrative_arc_summary: z.string().optional(),
  scenes: z.array(DirectorSceneSchema),
});

module.exports = { DirectorOutputSchema, LayoutSchema };
