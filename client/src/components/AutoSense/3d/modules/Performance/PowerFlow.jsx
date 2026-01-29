import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --------------------------------------------------------
// ⚡ THE PLASMA SHADER
// --------------------------------------------------------
const flowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color("#00ffff") }, // Cyan Energy
  },
  transparent: true,
  depthTest: false, // X-Ray visibility
  depthWrite: false,
  blending: THREE.AdditiveBlending, // Glowing light effect
  side: THREE.DoubleSide,

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;

    void main() {
      // 1. Create a moving dashed pattern
      float dash = sin(vUv.x * 20.0 - time * 8.0);
      
      // 2. Sharpen the pulse
      float alpha = smoothstep(0.8, 1.0, dash);
      
      // 3. Add a weak base glow
      float baseGlow = 0.1;
      
      // Final Alpha
      float finalAlpha = alpha + baseGlow;

      // 4. Fade out at ends
      float endsFade = 4.0 * vUv.x * (1.0 - vUv.x);
      
      gl_FragColor = vec4(color, finalAlpha * endsFade);
    }
  `,
});

// --------------------------------------------------------
// ➰ SINGLE BEAM COMPONENT
// --------------------------------------------------------
const EnergyBeam = ({ start, end, curveStrength = 0.5 }) => {
  const path = useMemo(() => {
    const p1 = start;
    const p2 = new THREE.Vector3(start.x, start.y - 0.4, start.z);
    const p3 = new THREE.Vector3(end.x, end.y, end.z - (end.z - start.z) * 0.2);
    const p4 = end;
    return new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
  }, [start, end]);

  return (
    <mesh>
      <tubeGeometry args={[path, 64, 0.04, 8, false]} />
      <primitive object={flowMaterial} attach="material" />
    </mesh>
  );
};

// --------------------------------------------------------
// 🔌 MAIN MANAGER
// --------------------------------------------------------
export const PowerFlow = ({ nodes, drivetrain = "AWD" }) => {
  useFrame(({ clock }) => {
    flowMaterial.uniforms.time.value = clock.getElapsedTime();
  });

  if (!nodes.Anchor_Engine_Core) return null;

  const enginePos = nodes.Anchor_Engine_Core.position;

  return (
    <group>
      {(drivetrain === "FWD" || drivetrain === "AWD") && (
        <>
          {nodes.Wheel_FL && (
            <EnergyBeam start={enginePos} end={nodes.Wheel_FL.position} />
          )}
          {nodes.Wheel_FR && (
            <EnergyBeam start={enginePos} end={nodes.Wheel_FR.position} />
          )}
        </>
      )}

      {(drivetrain === "RWD" || drivetrain === "AWD") && (
        <>
          {nodes.Wheel_RL && (
            <EnergyBeam start={enginePos} end={nodes.Wheel_RL.position} />
          )}
          {nodes.Wheel_RR && (
            <EnergyBeam start={enginePos} end={nodes.Wheel_RR.position} />
          )}
        </>
      )}
    </group>
  );
};
