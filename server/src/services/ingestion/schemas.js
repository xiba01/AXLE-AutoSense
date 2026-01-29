const { z } = require("zod");

// Helper for nullable numbers
const nullableNumber = z.number().nullable().optional();

const CarContextSchema = z
  .object({
    context_id: z.string(),
    created_at: z.string(),

    request_params: z
      .object({
        template_style: z.string().optional(),
        dealer_color_input: z.string().optional(),
        dealer_mileage_input: nullableNumber,
      })
      .passthrough(),

    identity: z
      .object({
        vin: z.string().optional(),
        make: z.string(),
        model: z.string(),
        trim: z.string().optional(),
        year: z.number(),
        body_type: z.string().optional(),
        generation: z.any().optional(),
        series: z.any().optional(),
      })
      .passthrough(),

    visual_directives: z.object({
      image_prompt_color: z.string(),
      body_shape_prompt: z.string(),
      interior_prompt: z.string(),
    }),

    normalized_specs: z.object({
      performance: z
        .object({
          hp: nullableNumber,
          torque_nm: nullableNumber,
          zero_to_sixty_sec: nullableNumber,
          top_speed_kmh: nullableNumber,
          drivetrain: z.string().optional(),
          transmission: z.string().optional(),
          engine_cylinders: nullableNumber,
        })
        .passthrough(),
      efficiency: z
        .object({
          fuel_combined_l_100km: nullableNumber,
          tank_capacity_l: nullableNumber,
          range_km: nullableNumber,
          is_electric: z.boolean().optional(),
          emission_standard: z.string().optional(),
        })
        .passthrough(),
      dimensions: z
        .object({
          trunk_capacity_l: nullableNumber,
          seats: nullableNumber,
          length_mm: nullableNumber,
          weight_kg: nullableNumber,
        })
        .passthrough(),
      safety: z
        .object({
          rating_text: z.string().optional().nullable(),
          airbags: nullableNumber,
          assist_systems: z.array(z.string()).optional(),
        })
        .passthrough(),
    }),

    derived_intelligence: z.object({
      vehicle_state: z
        .object({
          is_new: z.boolean().optional(),
          is_low_mileage: z.boolean().optional(),
          mileage_category: z.string().optional(),
        })
        .passthrough(),
      classification: z
        .object({
          is_sport_car: z.boolean().optional(),
          is_family_car: z.boolean().optional(),
          is_eco_car: z.boolean().optional(),
        })
        .passthrough(),
      badges_to_suggest: z.array(z.string()),
    }),

    // 5. Badges (UPDATED TO MATCH REGISTRY)
    certifications: z.array(
      z
        .object({
          id: z.string(), // <--- CHANGED FROM badge_id TO id
          label: z.string(),
          category: z.string(),
          visuals: z
            .object({
              image_path: z.string().optional(),
              alt_text: z.string().optional(),
              icon: z.string().optional(),
              color: z.string().optional(),
            })
            .optional(),
          evidence: z.string().optional(),
          retrieval_method: z.string().optional(),
        })
        .passthrough(),
    ),

    raw_api_dump: z.any().optional(),
  })
  .passthrough();

module.exports = { CarContextSchema };
