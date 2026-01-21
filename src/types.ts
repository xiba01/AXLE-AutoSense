export interface HotspotContent {
    title: string;
    body: string;
}

export interface Hotspot {
    id: string;
    x: number;
    y: number;
    icon: string;
    label: string;
    hover_content: HotspotContent;
}

export interface Scene {
    id: string;
    type: string;
    order: number;
    image_url?: string;
    audio_url?: string;
    intro_content?: {
        title: string;
        background_image?: string;
        subtitle: string;
        brand_logo?: string;
        start_button_label: string;
    };
    slide_content?: {
        theme_tag: string;
        headline: string;
        paragraph: string;
        alignment?: 'left' | 'right' | 'center';
        badges?: { label: string; icon: string; color: string }[];
        key_stats?: { label: string; value: string; unit: string }[];
    };
    hotspots?: Hotspot[];
    subtitles?: { text: string; start: number; end: number }[];
    outro_content?: {
        headline: string;
        subheadline: string;
        cta_buttons: { label: string; action: string; style: string }[];
    };
}

export interface StoryData {
    story_id: string;
    title: string;
    scenes: Scene[];
}
