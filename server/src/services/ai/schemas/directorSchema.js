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

// 2. Tech Config Schema (for 3D Digital Twin scenes)
const TechConfigSchema = z
  .object({
    mode: z.enum(["PERFORMANCE", "SAFETY", "UTILITY"]),

    // PERFORMANCE mode fields
    drivetrain: z.string().optional(),
    engine_hp: z.number().nullable().optional(),
    torque_nm: z.number().nullable().optional(),
    zero_to_sixty_sec: z.number().nullable().optional(),

    // SAFETY mode fields
    airbag_count: z.number().optional(),
    has_front_sensors: z.boolean().optional(),
    has_rear_sensors: z.boolean().optional(),
    safety_rating: z.string().nullable().optional(),
    assist_systems: z.array(z.string()).optional(),

    // UTILITY mode fields
    dimensions: z
      .object({
        length_mm: z.number().nullable().optional(),
        width_mm: z.number().nullable().optional(),
        height_mm: z.number().nullable().optional(),
        wheelbase_mm: z.number().nullable().optional(),
      })
      .optional(),
    trunk_capacity_liters: z.number().nullable().optional(),
    seat_count: z.number().optional(),
  })
  .optional();

// 3. Director Scene Schema (UPDATED to include tech_view)
const DirectorSceneSchema = z.object({
  scene_id: z.string(),
  scene_type: z.enum(["intro_view", "slide_view", "tech_view", "outro_view"]),
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
  // Flag for the Director to indicate this should be a 3D scene
  use_3d_mode: z.boolean().optional(),
});

const DirectorOutputSchema = z.object({
  title: z.string(),
  narrative_arc_summary: z.string().optional(),
  scenes: z.array(DirectorSceneSchema),
});

module.exports = { DirectorOutputSchema, LayoutSchema, TechConfigSchema };
