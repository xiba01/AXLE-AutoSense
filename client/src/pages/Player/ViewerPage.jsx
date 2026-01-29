import React from "react";
import AutoSenseLoader from "../../components/AutoSense/AutoSenseLoader";
import { PlaybackView } from "../../components/AutoSense/playback/PlaybackView";
import { ExperienceLoader } from "../../components/AutoSense/ui/ExperienceLoader"; // <--- Import

export default function ViewerPage() {
  return (
    <AutoSenseLoader>
      <ExperienceLoader />

      <PlaybackView />
    </AutoSenseLoader>
  );
}
