import React from "react";
import { MeshReflectorMaterial } from "@react-three/drei";

export default function GlossyFloor() {
  return (
    // Rotate -90 degrees to lay flat. Position slightly lower to avoid Z-fighting with wheels.
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[50, 50]} />

      <MeshReflectorMaterial
        // Slightly glossy floor with subtle reflection
        color="#151515"
        metalness={0.6}
        roughness={0.35}
        mirror={0.25}
        mixStrength={12}
        blur={[180, 60]}
        mixBlur={1}
        resolution={1024}
        depthScale={1}
        minDepthThreshold={0.35}
        maxDepthThreshold={1.25}
      />
    </mesh>
  );
}
