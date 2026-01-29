const { writeScript } = require("./src/services/ai/scriptwriterAgent");

// 1. MOCK CONTEXT (The Dacia Duster Facts)
const mockContext = {
  identity: { make: "Dacia", model: "Duster", year: 2022 },
  normalized_specs: {
    performance: {
      hp: 115,
      torque_nm: 260,
      zero_to_sixty_sec: 10.2,
      top_speed_kmh: 175,
      drivetrain: "AWD",
      transmission: "6 gears, manual transmission",
      engine_cylinders: 4,
    },
    efficiency: {
      fuel_combined_l_100km: null,
      tank_capacity_l: 50,
      range_km: null,
      is_electric: false,
      emission_standard: "Diesel",
    },
    dimensions: {
      trunk_capacity_l: 1444,
      seats: 5,
      length_mm: 4341,
      weight_kg: 1439,
    },
    safety: {
      airbags: 8,
      assist_systems: ["ABS", "Traction Control"],
    },
  },
};

// 2. MOCK STORYBOARD (The Director's Output)
const mockStoryboard = {
  title: "Rugged Family Trailblazer: Dacia Duster Adventure",
  narrative_arc_summary:
    "The story opens with a bold hero shot of the Duster ready for adventure, then walks the viewer through its most compelling family‑focused strengths – massive cargo space, top‑tier safety, low‑mileage confidence, all‑terrain performance, spacious seating, refined cockpit, and eco‑friendly efficiency – each highlighted with distinct visual styles that keep the rugged, overcast Muddy Trail setting consistent. The journey ends with a heartfelt outro reinforcing the Duster as the ultimate family trailblazer.",
  scenes: [
    {
      scene_id: "00",
      scene_type: "intro_view",
      theme_tag: "INTRO",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Static Wide",
        focus_point: "Dacia Duster front silhouette",
        lighting: "Overcast",
      },
      layout: {
        composition: "centered-focus",
        content_alignment: "middle-center",
        motion: { image: "static", content: "fade-up" },
      },
    },
    {
      scene_id: "01",
      scene_type: "slide_view",
      main_feature_slug: "trunk-capacity-1444l",
      theme_tag: "UTILITY",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Wide Hero Shot",
        focus_point: "Duster loaded with family gear",
        lighting: "Overcast",
      },
      layout: {
        composition: "split-image-left",
        content_alignment: "middle-left",
        motion: { image: "subtle-pan-right", content: "slide-in-left" },
      },
    },
    {
      scene_id: "02",
      scene_type: "slide_view",
      main_feature_slug: "8-airbags-abs-traction-control",
      theme_tag: "SAFETY",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Detail Shot - Airbag Display",
        focus_point: "Airbag module on dashboard",
        lighting: "Overcast",
      },
      layout: {
        composition: "overlay-bottom",
        content_alignment: "bottom-center",
        motion: { image: "slow-zoom-out", content: "fade-up" },
      },
    },
    {
      scene_id: "03",
      scene_type: "slide_view",
      main_feature_slug: "low-mileage-badge",
      theme_tag: "UTILITY",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Detail Shot - Low Mileage Badge",
        focus_point: "Low mileage badge on rear bumper",
        lighting: "Overcast",
      },
      layout: {
        composition: "split-image-right",
        content_alignment: "middle-right",
        motion: { image: "subtle-pan-right", content: "slide-in-right" },
      },
    },
    {
      scene_id: "04",
      scene_type: "slide_view",
      main_feature_slug: "4wd-awd-drivetrain",
      theme_tag: "PERFORMANCE",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Action Shot - Duster climbing muddy hill",
        focus_point: "4WD drivetrain engaged",
        lighting: "Overcast",
      },
      layout: {
        composition: "full-bleed",
        content_alignment: "middle-center",
        motion: { image: "subtle-pan-right", content: "fade-up" },
      },
    },
    {
      scene_id: "05",
      scene_type: "slide_view",
      main_feature_slug: "5-seat-layout",
      theme_tag: "UTILITY",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Detail Shot - Rear Seat Layout",
        focus_point: "Five‑seat arrangement",
        lighting: "Overcast",
      },
      layout: {
        composition: "split-image-left",
        content_alignment: "middle-left",
        motion: { image: "subtle-pan-right", content: "slide-in-left" },
      },
    },
    {
      scene_id: "06",
      scene_type: "slide_view",
      main_feature_slug: "115hp-diesel-260nm-torque",
      theme_tag: "PERFORMANCE",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Action Shot - Duster accelerating on trail",
        focus_point: "Engine delivering 260 Nm torque",
        lighting: "Overcast",
      },
      layout: {
        composition: "full-bleed",
        content_alignment: "middle-center",
        motion: { image: "subtle-pan-right", content: "fade-up" },
      },
    },
    {
      scene_id: "07",
      scene_type: "slide_view",
      main_feature_slug: "6-speed-manual-transmission",
      theme_tag: "PERFORMANCE",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Detail Shot - 6‑Speed Manual Gear Lever",
        focus_point: "Driver‑engaged manual gearbox",
        lighting: "Overcast",
      },
      layout: {
        composition: "full-bleed",
        content_alignment: "middle-center",
        motion: { image: "subtle-pan-right", content: "fade-up" },
      },
    },
    {
      scene_id: "08",
      scene_type: "slide_view",
      main_feature_slug: "modern-interior-cockpit",
      theme_tag: "UTILITY",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Detail Shot - Modern Cockpit",
        focus_point: "Touchscreen dashboard and premium‑feel controls",
        lighting: "Overcast",
      },
      layout: {
        composition: "overlay-bottom",
        content_alignment: "bottom-center",
        motion: { image: "slow-zoom-out", content: "fade-up" },
      },
    },
    {
      scene_id: "09",
      scene_type: "slide_view",
      main_feature_slug: "critair-1-certification",
      theme_tag: "EFFICIENCY",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Detail Shot - Emission Badge",
        focus_point: "Crit'Air 1 certification emblem",
        lighting: "Overcast",
      },
      layout: {
        composition: "split-image-right",
        content_alignment: "middle-right",
        motion: { image: "subtle-pan-right", content: "slide-in-right" },
      },
    },
    {
      scene_id: "10",
      scene_type: "slide_view",
      main_feature_slug: "50l-fuel-tank",
      theme_tag: "EFFICIENCY",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Detail Shot - Fuel Tank Cap",
        focus_point: "50 L fuel tank for extended range",
        lighting: "Overcast",
      },
      layout: {
        composition: "split-image-left",
        content_alignment: "middle-left",
        motion: { image: "subtle-pan-right", content: "slide-in-left" },
      },
    },
    {
      scene_id: "99",
      scene_type: "outro_view",
      theme_tag: "OUTRO",
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Static Wide",
        focus_point: "Duster parked at sunset on the trail",
        lighting: "Overcast",
      },
      layout: {
        composition: "centered-focus",
        content_alignment: "middle-center",
        motion: { image: "static", content: "fade-up" },
      },
    },
  ],
};
async function run() {
  const finalStory = await writeScript(mockContext, mockStoryboard);
  console.log("\n------ FINAL SCRIPT ------");
  console.log(JSON.stringify(finalStory, null, 2));
}

run();
