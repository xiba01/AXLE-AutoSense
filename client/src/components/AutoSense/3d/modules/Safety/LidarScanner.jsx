import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --------------------------------------------------------
// 🌊 SINGLE RADAR WAVE (TUNED)
// --------------------------------------------------------
const RadarWave = ({ delay = 0, speed = 1, color = "#00ffff" }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    // 1. Lifecycle (Looping 0 to 1)
    const t = (clock.getElapsedTime() * speed - delay) % 1;
    const phase = t < 0 ? 1 + t : t;

    // 2. Animate Scale (Much smaller now)
    // Starts at 1x size, expands to 4x size (instead of 6x)
    const scale = 1 + phase * 3;
    meshRef.current.scale.set(scale, scale, 1);

    // 3. Animate Opacity (Fade out faster)
    materialRef.current.opacity = (1 - phase) * 0.5;
  });

  return (
    // ROTATION FIX:
    // [-Math.PI / 2, 0, Math.PI]
    // X: -90 deg (Lays flat on floor)
    // Z: 180 deg (Points "Forward" relative to most car models)
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
      <ringGeometry args={[0.2, 0.5, 32, 1, -Math.PI / 4, Math.PI / 2]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

// --------------------------------------------------------
// 📡 MAIN COMPONENT
// --------------------------------------------------------
export const LidarScanner = ({ anchor }) => {
  if (!anchor) return null;

  return (
    <group position={anchor.position}>
      <group position={[0, -0.3, 0.2]}>
        <RadarWave delay={0.0} speed={0.8} />
        <RadarWave delay={0.33} speed={0.8} />
        <RadarWave delay={0.66} speed={0.8} />

        {/* The Solid Base (Source) */}
        <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <ringGeometry args={[0.15, 0.2, 32, 1, -Math.PI / 4, Math.PI / 2]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};
