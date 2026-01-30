import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Stage,
  Environment,
  CameraControls,
  PerspectiveCamera,
} from "@react-three/drei";
import Exterior from "./Exterior";
import Interior from "./Interior";
import GlossyFloor from "./GlossyFloor";

/**
 * 3D Experience Component for Car Visualization
 * @param {string} modelUrl - URL to the 3D model (.glb file)
 * @param {string} panoramaUrl - URL to the 360° interior image (.jpg)
 * @param {"exterior"|"interior"|"powertrain"} mode - Current view mode
 */
export default function Experience({
  modelUrl,
  panoramaUrl,
  mode = "exterior",
}) {
  const controlsRef = useRef();

  // We use this internal state to delay hiding the exterior until the camera arrives
  const [showExterior, setShowExterior] = useState(true);

  // Check if we have the necessary assets
  const hasModel = !!modelUrl;
  const hasPanorama = !!panoramaUrl;

  return (
    <Canvas shadows dpr={[1, 2]} className="touch-none">
      {/* THE INFINITE VOID */}
      <color attach="background" args={["#151515"]} />
      <fog attach="fog" args={["#151515", 10, 20]} />

      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[4, 2, 5]} fov={50} />

        <CameraHandler
          mode={mode}
          controlsRef={controlsRef}
          setShowExterior={setShowExterior}
          hasPanorama={hasPanorama}
        />

        {/* THE SCENES */}
        <group>
          {/* Exterior View */}
          {showExterior && hasModel && (
            <Stage
              intensity={1}
              environment={null}
              adjustCamera={false}
              shadows={false}
            >
              <Exterior modelUrl={modelUrl} />
            </Stage>
          )}

          {/* Floor (only for exterior mode) */}
          {mode !== "interior" && <GlossyFloor />}

          {/* Interior 360° View */}
          {mode === "interior" && hasPanorama && (
            <Interior panoramaUrl={panoramaUrl} />
          )}

          {/* Fallback for interior without panorama */}
          {mode === "interior" && !hasPanorama && (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[5, 32, 32]} />
              <meshBasicMaterial color="#1a1a1a" side={2} />
            </mesh>
          )}
        </group>

        <Environment preset="warehouse" background={false} />

        <CameraControls
          ref={controlsRef}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Suspense>
    </Canvas>
  );
}

// --- CAMERA HANDLER: Controls camera transitions between modes ---
function CameraHandler({ mode, controlsRef, setShowExterior, hasPanorama }) {
  useEffect(() => {
    if (!controlsRef.current) return;

    let hideExteriorTimer;

    // GOING TO INTERIOR (Zoom In)
    if (mode === "interior" && hasPanorama) {
      // Animate Camera to the "Driver's Head" position
      controlsRef.current.setLookAt(
        0,
        0.4,
        0.1, // Camera Position (Inside car center)
        0,
        0.4,
        1, // Look At Target (Towards windshield)
        true, // Smooth transition
      );

      // Hide exterior after transition to avoid overlap
      hideExteriorTimer = setTimeout(() => setShowExterior(false), 700);

      // Enable full rotation for 360 view
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI;
    }

    // GOING TO EXTERIOR (Zoom Out)
    if (mode === "exterior") {
      setShowExterior(true);

      // Fly out to showroom position
      controlsRef.current.setLookAt(
        4,
        2,
        5, // Camera Position (Outside)
        0,
        0,
        0, // Look At Target (Car Center)
        true, // Smooth
      );

      // Restrict floor angles
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI / 2.1;
    }

    return () => {
      if (hideExteriorTimer) clearTimeout(hideExteriorTimer);
    };
  }, [mode, controlsRef, setShowExterior, hasPanorama]);

  return null;
}
