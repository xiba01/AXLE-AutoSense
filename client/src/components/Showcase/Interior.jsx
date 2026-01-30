import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

/**
 * Interior 360° Panorama Component
 * @param {string} panoramaUrl - The URL to the 360° JPG image
 */
export default function Interior({ panoramaUrl }) {
  // Load the 360 texture from the provided URL
  const texture = useTexture(panoramaUrl);

  // Flip texture horizontally so text/steering wheel isn't backwards
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;

  return (
    <mesh>
      {/* The Sphere */}
      <sphereGeometry args={[5, 60, 40]} />

      {/* The Material */}
      {/* side={THREE.BackSide} makes the texture appear on the INSIDE */}
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false} // Keep original colors, don't react to scene lighting
      />
    </mesh>
  );
}
