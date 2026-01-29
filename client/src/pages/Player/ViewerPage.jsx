import React from "react";
import AutoSenseLoader from "../../components/AutoSense/AutoSenseLoader";
import { PlaybackView } from "../../components/AutoSense/playback/PlaybackView";

export default function ViewerPage() {
  return (
    // 1. Fetch Data from Supabase based on URL ID
    <AutoSenseLoader>
      {/* 2. Render the Player (Read-Only Mode) */}
      <PlaybackView />
    </AutoSenseLoader>
  );
}
