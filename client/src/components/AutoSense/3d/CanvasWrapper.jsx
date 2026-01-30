import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useStoryStore } from "../../../store/useStoryStore";

// --- 3D COMPONENTS ---
import { CarModel } from "./CarModel";
import { Environment } from "./Environment";
import { CameraController } from "./CameraController";

export const CanvasWrapper = () => {
  const { getCurrentScene, storyData } = useStoryStore();
  const currentScene = getCurrentScene();

  // 1. Determine Logic Props
  const isTechView = currentScene?.type === "tech_view";
  const mode = isTechView ? currentScene.theme_tag || "SHOWROOM" : "SHOWROOM";

  // 2. Extract Car Data (FIXED PATHS)
  // The log shows 'car_specs' is at the root, and 'car' contains body_type
  const specs = storyData?.car_specs || {};
  const identity = storyData?.car || {};

  // Check 'performance' object inside specs, or fallback to root if flattened
  const drivetrain = specs.performance?.drivetrain || specs.drivetrain || "AWD";
  const bodyType = identity.body_type || "Sedan";

  // Debugging (Verify it works now)
  useEffect(() => {
    if (storyData) {
      console.log("✅ CanvasWrapper Fixed Data:", { bodyType, drivetrain });
    }
  }, [storyData, bodyType, drivetrain]);

  // Extract tech_config from currentScene (for tech_view)
  const techConfig = isTechView ? currentScene.tech_config : undefined;

  return (
    <>
      <div className="absolute inset-0 z-0 bg-black">
        <Canvas
          shadows
          camera={{ position: [4, 2, 5], fov: 35 }}
          gl={{
            antialias: false,
            preserveDrawingBuffer: true,
            toneMappingExposure: 1.0,
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#050505"]} />

          <Suspense fallback={null}>
            <CameraController isTechView={isTechView} />

            <Environment />

            <CarModel
              mode={mode}
              drivetrain={drivetrain}
              bodyType={bodyType}
              techConfig={techConfig}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};
