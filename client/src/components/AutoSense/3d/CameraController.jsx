import React, { useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useStoryStore } from "../../../store/useStoryStore";
import { useControls, button } from "leva";
import * as THREE from "three";

// 🗺️ COORDINATE MAPPING
const CAMERA_PRESETS = {
  SAFETY: {
    primary: { pos: [4.23, 2.1, 6.24], target: [1.52, 0.37, -0.09] },
    secondary: { pos: [3.47, 1.47, -6.54], target: [-0.53, 0.47, -2.54] },
    tertiary: { pos: [0.1, 10, -2.25], target: [0, 0, -2.25] },
  },
  UTILITY: {
    primary: { pos: [3.96, 3.91, 7.02], target: [1.57, -0.19, -0.53] },
    secondary: { pos: [2.06, 1.95, -6.4], target: [-0.82, 0.62, -2.01] },
  },
  PERFORMANCE: {
    primary: { pos: [4.23, 2.1, 6.24], target: [1.52, 0.37, -0.09] },
    secondary: { pos: [0.1, 10, -2.25], target: [0, 0, -2.25] },
  },
  SHOWROOM: {
    primary: { pos: [5, 2, 5], target: [0, 0, 0] },
    secondary: { pos: [5, 2, 5], target: [0, 0, 0] },
  },
};

export const CameraController = ({ isTechView }) => {
  const cameraControlsRef = useRef();
  const { camera } = useThree();

  // Get State
  const { getCurrentScene, activeCameraView, isFreeRoam } = useStoryStore();
  const currentScene = getCurrentScene();
  const theme = currentScene?.theme_tag || "SHOWROOM";

  // ... (Keep your Debug Controls here if you want) ...

  useEffect(() => {
    if (!cameraControlsRef.current) return;

    // 1. FREE ROAM MODE
    if (isFreeRoam) {
      cameraControlsRef.current.setLookAt(6, 2, 6, 0, 0, 0, true);
      return;
    }

    // 2. TECH VIEW MODE
    if (isTechView) {
      const preset =
        CAMERA_PRESETS[theme]?.[activeCameraView] ||
        CAMERA_PRESETS.SHOWROOM.primary;

      cameraControlsRef.current.setLookAt(
        preset.pos[0],
        preset.pos[1],
        preset.pos[2],
        preset.target[0],
        preset.target[1],
        preset.target[2],
        true,
      );
    }
    // 3. DEFAULT
    else {
      cameraControlsRef.current.setLookAt(4, 2, 5, 0, 0, 0, true);
    }
  }, [isTechView, theme, activeCameraView, isFreeRoam]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      smoothTime={0.8}
      azimuthRotateSpeed={isFreeRoam ? 0.5 : 0}
      polarRotateSpeed={isFreeRoam ? 0.5 : 0}
      truckSpeed={isFreeRoam ? 0.5 : 0}
      dollySpeed={isFreeRoam ? 0.5 : 0.2}
      minDistance={2}
      maxDistance={isFreeRoam ? 15 : 12}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2 - 0.05}
      enabled={true}
    />
  );
};
