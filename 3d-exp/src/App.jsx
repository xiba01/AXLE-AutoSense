import React, { useState } from "react";
import Experience from "./components/Showcase/Experience";
import Overlay from "./components/Showcase/Overlay";
import Loader from "./components/Showcase/Loader";

export default function App() {
  const [mode, setMode] = useState("exterior");

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
      }}
    >
      {/* 1. LOADING SCREEN (Sits on top until loaded) */}
      <Loader />

      {/* 2. THE 3D WORLD */}
      <Experience mode={mode} />

      {/* 3. THE UI LAYER */}
      <Overlay mode={mode} setMode={setMode} />
    </div>
  );
}
