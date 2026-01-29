import React from "react";
import {
  Environment as DreiEnvironment,
  ContactShadows,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";

export const Environment = () => {
  return (
    <>
      {/* --------------------------------------------------------
          1. LIGHTING RIG
      -------------------------------------------------------- */}

      {/* HDRI Reflections ("City" preset gives good contrast) */}
      <DreiEnvironment preset="city" environmentIntensity={0.5} />

      {/* Key Light (Front-Top-Left) */}
      <spotLight
        position={[-5, 10, 5]}
        angle={0.5}
        penumbra={1}
        intensity={200}
        castShadow
        shadow-bias={-0.0001}
      />

      {/* Rim Light Left (Cool) */}
      <spotLight
        position={[-5, 0, -5]}
        angle={0.5}
        penumbra={1}
        intensity={300}
        color="#cceeff"
        lookAt={[0, 0, 0]}
      />

      {/* Rim Light Right (Warm) */}
      <spotLight
        position={[5, 0, -5]}
        angle={0.5}
        penumbra={1}
        intensity={300}
        color="#ffffff"
        lookAt={[0, 0, 0]}
      />

      {/* --------------------------------------------------------
          2. FLOOR SHADOWS (Grounding)
      -------------------------------------------------------- */}
      <ContactShadows
        resolution={1024}
        scale={20}
        blur={2}
        opacity={0.5}
        far={10}
        color="#000000"
      />

      {/* --------------------------------------------------------
          3. POST-PROCESSING EFFECTS
      -------------------------------------------------------- */}
      <EffectComposer disableNormalPass>
        {/* Bloom (Glow) */}
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />

        {/* Vignette (Focus) */}
        <Vignette eskil={false} offset={0.1} darkness={1.1} />

        {/* Film Grain (Texture) */}
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};
