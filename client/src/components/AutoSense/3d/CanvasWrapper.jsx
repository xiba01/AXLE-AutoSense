import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
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
  const drivetrain = storyData?.car_data?.specs?.drivetrain || "AWD";

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
            {/* 
               Pass isTechView so camera knows to shift 
            */}
            <CameraController isTechView={isTechView} />

            <Environment />

            <CarModel mode={mode} drivetrain={drivetrain} />
          </Suspense>
        </Canvas>
      </div>
      {/* <Loader /> */}
    </>
  );
};
