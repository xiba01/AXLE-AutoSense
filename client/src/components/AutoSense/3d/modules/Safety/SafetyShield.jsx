import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --------------------------------------------------------
// 🛡️ THE FORCEFIELD SHADER
// --------------------------------------------------------
const shieldMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color("#0088ff") },
    time: { value: 0 },
  },
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,

  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform vec3 color;
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = 1.0 - dot(normal, viewDir);
      
      float rim = pow(fresnel, 3.0);
      float pulse = 0.3 + 0.3 * sin(time * 2.0);
      
      gl_FragColor = vec4(color, rim * pulse * 0.5);
    }
  `,
});

export const SafetyShield = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = clock.getElapsedTime();
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.8, 0]}>
      <sphereGeometry args={[3.2, 64, 64]} />
      <primitive object={shieldMaterial} attach="material" />
    </mesh>
  );
};
