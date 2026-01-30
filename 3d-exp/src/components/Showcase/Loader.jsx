import React from "react";
import { useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();

  // Hide loader when done (99.9% or 100%)
  if (progress === 100) return null;

  return (
    <div className="loader-container">
      <h1 style={{ fontSize: "2rem", letterSpacing: "4px", fontWeight: "300" }}>
        AUTOSENSE
      </h1>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p style={{ marginTop: "10px", opacity: 0.5, fontSize: "12px" }}>
        {Math.floor(progress)}% LOADED
      </p>
    </div>
  );
}
