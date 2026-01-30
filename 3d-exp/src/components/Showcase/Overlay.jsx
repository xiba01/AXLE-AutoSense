import React from "react";

export default function Overlay({ mode, setMode }) {
  const modes = ["exterior", "interior", "powertrain"];

  return (
    <>
      {/* HEADER LOGO */}
      <div style={{ position: "absolute", top: 40, left: 40, zIndex: 10 }}>
        <h2 style={{ margin: 0, letterSpacing: "-1px" }}>AutoSense</h2>
        <p style={{ margin: 0, opacity: 0.5, fontSize: "12px" }}>
          IMMERSIVE CONFIGURATOR
        </p>
      </div>

      {/* BOTTOM DOCK */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <div className="glass-panel">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`nav-btn ${mode === m ? "active" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
