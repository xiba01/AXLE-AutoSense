import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Exterior() {
  // 1. Load the GLB model
  // Ensure 'car.glb' is inside your public/models/ folder
  const { scene } = useGLTF("/models/porshe.glb");

  // 2. Render it
  // We scale it slightly if the model is too big/small
  // We spread props to allow passing position/rotation from parent
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

// Pre-load the asset so the user doesn't wait when switching modes
useGLTF.preload("/models/porshe.glb");
