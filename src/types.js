// Hotspot content structure
export const hotspotContentSchema = {
  title: '',
  body: ''
};

// Hotspot structure
export const hotspotSchema = {
  id: '',
  x: 0,
  y: 0,
  icon: '',
  label: '',
  hover_content: hotspotContentSchema
};

// Scene structure
export const sceneSchema = {
  id: '',
  type: '',
  order: 0,
  image_url: '',
  audio_url: '',
  layout: {
    composition: '',
    content_alignment: '',
    image_focus: '',
    safe_area: '',
    motion: {
      image: '',
      content: ''
    }
  },
  intro_content: {
    title: '',
    background_image: '',
    subtitle: '',
    brand_logo: '',
    start_button_label: ''
  },
  slide_content: {
    theme_tag: '',
    headline: '',
    badges: [],
    paragraph: '',
    key_stats: []
  },
  hotspots: [],
  subtitles: []
};

// Story data structure
export const storyDataSchema = {
  story_id: '',
  car_id: '',
  title: '',
  scenes: []
};

// Car specification structure
export const carSpecSchema = {
  id: '',
  make: '',
  model: '',
  year: 0,
  trim: '',
  price: 0,
  images: {
    exterior: [],
    interior: [],
    dashboard: []
  },
  engine: {
    type: '',
    displacement: '',
    horsepower: 0,
    torque: 0
  },
  transmission: {
    type: '',
    gears: 0
  },
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    wheelbase: 0
  },
  performance: {
    zero_to_sixty: 0,
    top_speed: 0,
    quarter_mile: 0
  },
  fuel_economy: {
    city: 0,
    highway: 0,
    combined: 0
  },
  features: []
};

// Car configuration structure
export const carConfigSchema = {
  make: '',
  model: '',
  year: 0,
  trim: ''
};

// Car comparison structure
export const carComparisonSchema = {
  cars: [],
  categories: []
};
