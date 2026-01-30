import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * Exterior 3D Model Component
 * @param {string} modelUrl - The URL to the .glb model file
 */
export default function Exterior({ modelUrl }) {
  // Load the GLB model from the provided URL
  const { scene } = useGLTF(modelUrl);

  // Clone the scene to avoid issues with reusing the same model
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return <primitive object={clonedScene} scale={1} position={[0, 0, 0]} />;
}
