/**
 * Constructs a high-quality prompt for Flux/Stable Diffusion
 */
function buildImagePrompt(scene, carContext) {
  const { identity, visual_directives } = carContext;
  const { visual_direction } = scene;

  // 1. THE SUBJECT (Fixed Identity)
  // We repeat the visual color and exact model to ensure consistency.
  // Example: "2022 Dacia Duster, Phytonic Blue Metallic, SUV"
  const subject = `${identity.year} ${identity.make} ${identity.model}, ${visual_directives.image_prompt_color}, ${identity.body_type}`;

  // 2. THE COMPOSITION (Camera & Action)
  // We look at the Director's specific instructions.
  // Example: "Action Shot - Duster climbing muddy hill"
  const action = visual_direction?.camera_angle || "Cinematic Wide Shot";
  const focus = visual_direction?.focus_point || "The whole car";

  // 3. THE ENVIRONMENT (Setting & Lighting)
  // Example: "Muddy Trail, Overcast lighting"
  const environment = `${visual_direction?.setting || "Showroom"}, ${
    visual_direction?.lighting || "Studio Lighting"
  }`;

  // 4. THE STYLE MODIFIERS (The "Flux Magic")
  // These keywords force the AI to look real, not cartoony.
  const style =
    "photorealistic, 8k, highly detailed, automotive photography, commercial car advertisement, ray tracing, unreal engine 5 render, sharp focus";

  // 5. ASSEMBLE
  // "Wide Shot of a 2022 Dacia Duster... driving on a Muddy Trail... photorealistic..."
  const fullPrompt = `${action} of a ${subject}, focusing on ${focus}. ${environment}. ${style}`;

  return fullPrompt;
}

module.exports = { buildImagePrompt };
