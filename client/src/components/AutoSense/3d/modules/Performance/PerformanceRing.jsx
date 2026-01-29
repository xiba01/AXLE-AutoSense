import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// --------------------------------------------------------
// ⏱️ THE TICK MARK SHADER (Outer Gauge)
// --------------------------------------------------------
const tickMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color("#ffaa00") },
  },
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
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

    #define PI 3.14159265359

    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 pos = vUv - center;
      float angle = atan(pos.y, pos.x);
      float radius = length(pos) * 2.0;

      float tick = smoothstep(0.4, 0.5, sin(angle * 120.0));
      float ringMask = smoothstep(0.8, 0.85, radius) * smoothstep(1.0, 0.95, radius);
      float pulse = 0.5 + 0.5 * sin(angle + time * 2.0);

      gl_FragColor = vec4(color, tick * ringMask * pulse);
    }
  `,
});

export const PerformanceRing = ({ hp = 250 }) => {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    tickMaterial.uniforms.time.value = t;

    if (outerRef.current) outerRef.current.rotation.z = -t * 0.05;
    if (innerRef.current) innerRef.current.rotation.z = t * 0.02;
  });

  return (
    <group position={[0, 0.02, 0]}>
      {/* 1. OUTER RING (The Ticks) */}
      <mesh ref={outerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.8, 128]} />
        <primitive object={tickMaterial} attach="material" />
      </mesh>

      {/* 2. INNER RING (Solid Glow Band) */}
      <mesh ref={innerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.45, 128]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. FLOOR TEXT (Side of Car) */}
      <group
        position={[1.8, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <Text
          fontSize={0.35}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff"
          color="#ffaa00"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {hp} HP
        </Text>

        <Text
          position={[0, -0.05, 0]}
          fontSize={0.12}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff"
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          fillOpacity={0.7}
        >
          TOTAL OUTPUT
        </Text>
      </group>
    </group>
  );
};
