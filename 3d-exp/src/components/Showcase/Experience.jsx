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

export default function Experience({ mode }) {
  const controlsRef = useRef();

  // We use this internal state to delay hiding the exterior until the camera arrives
  const [showExterior, setShowExterior] = useState(true);

  return (
    <Canvas shadows dpr={[1, 2]}>
      {/* 1. THE INFINITE VOID */}
      <color attach="background" args={["#151515"]} />
      <fog attach="fog" args={["#151515", 10, 20]} />

      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[4, 2, 5]} fov={50} />

        <CameraHandler
          mode={mode}
          controlsRef={controlsRef}
          setShowExterior={setShowExterior}
        />

        {/* 2. THE SCENES */}
        <group>
          {showExterior && (
            <Stage
              intensity={1}
              environment={null}
              adjustCamera={false}
              shadows={false}
            >
              <Exterior />
            </Stage>
          )}

          {mode !== "interior" && <GlossyFloor />}

          {mode === "interior" && <Interior />}

          {mode === "powertrain" && (
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry />
              <meshStandardMaterial color="orange" wireframe />
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

// --- SUB-COMPONENT: THE LOGIC ENGINE ---
function CameraHandler({ mode, controlsRef, setShowExterior }) {
  useEffect(() => {
    if (!controlsRef.current) return;

    // Keep a handle so we can cancel when modes change quickly
    let hideExteriorTimer;

    // A. GOING TO INTERIOR (Zoom In)
    if (mode === "interior") {
      // 1. Animate Camera to the "Driver's Head" position
      // setLookAt(camX, camY, camZ, targetX, targetY, targetZ, enableTransition)
      controlsRef.current.setLookAt(
        0,
        0.4,
        0.1, // Camera Position (Inside car center)
        0,
        0.4,
        1, // Look At Target (Towards windshield)
        true, // Smooth transition? YES
      );

      // 2. Hide exterior sooner to avoid a flash while we move inside
      hideExteriorTimer = setTimeout(() => setShowExterior(false), 700);

      // 3. Enable full rotation for 360 view
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI;
    }

    // B. GOING TO EXTERIOR (Zoom Out)
    if (mode === "exterior") {
      setShowExterior(true); // Show car immediately

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

      // Restrict floor angles again
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI / 2.1;
    }

    // C. GOING TO POWERTRAIN
    if (mode === "powertrain") {
      setShowExterior(false);
      controlsRef.current.setLookAt(3, 3, 3, 0, 0, 0, true);
    }
    return () => {
      if (hideExteriorTimer) clearTimeout(hideExteriorTimer);
    };
  }, [mode, controlsRef, setShowExterior]);

  return null;
}
