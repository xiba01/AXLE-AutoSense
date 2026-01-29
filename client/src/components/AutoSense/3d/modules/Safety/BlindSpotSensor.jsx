import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --------------------------------------------------------
// 🟠 SINGLE EXPANDING SPHERE
// --------------------------------------------------------
const PulseSphere = ({ delay = 0, speed = 1.5 }) => {
  const meshRef = useRef();
  const matRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;

    // 1. Lifecycle 0..1
    const t = (clock.getElapsedTime() * speed - delay) % 1;
    const phase = t < 0 ? 1 + t : t;

    // 2. Animate Scale (Pulsing Orb)
    const s = 0.8 + phase * 1.7;
    meshRef.current.scale.set(s, s, s);

    // 3. Animate Opacity (Fade out)
    matRef.current.opacity = (1 - phase) * 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.11, 32, 32]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffaa00" // Safety Orange
        transparent
        blending={THREE.AdditiveBlending} // Glowing core effect
        depthWrite={false}
      />
    </mesh>
  );
};

// --------------------------------------------------------
// 📡 MAIN SENSOR GROUP
// --------------------------------------------------------
export const BlindSpotSensor = ({ anchor, side = "left" }) => {
  if (!anchor) return null;

  return (
    <group position={anchor.position}>
      <group>
        {/* Stack 3 pulses for continuous flow */}
        <PulseSphere delay={0.0} speed={1.0} />
        <PulseSphere delay={0.33} speed={1.0} />
        <PulseSphere delay={0.66} speed={1.0} />

        {/* The Solid Core (The Sensor itself) */}
        <mesh>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshBasicMaterial
            color="#ffaa00"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};
