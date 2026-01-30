import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export default function Interior() {
  // 1. Load the 360 texture
  // Ensure 'interior.jpg' is in public/textures/
  const texture = useTexture("/textures/interior.jpg");

  // 2. Flip texture horizontally so text/steering wheel isn't backwards
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;

  return (
    <mesh>
      {/* 3. The Sphere */}
      <sphereGeometry args={[5, 60, 40]} />

      {/* 4. The Material */}
      {/* side={THREE.BackSide} makes the texture appear on the INSIDE */}
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false} // Keep original colors, don't react to scene lighting
      />
    </mesh>
  );
}
