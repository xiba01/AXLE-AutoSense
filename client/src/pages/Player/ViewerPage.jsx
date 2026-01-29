import React from "react";
import AutoSenseLoader from "../../components/AutoSense/AutoSenseLoader";
import { PlaybackView } from "../../components/AutoSense/playback/PlaybackView";

export default function ViewerPage() {
  return (
    <AutoSenseLoader>
      <PlaybackView />
    </AutoSenseLoader>
  );
}
