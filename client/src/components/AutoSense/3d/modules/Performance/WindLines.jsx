import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const WindLines = ({ count = 50, color = "#ffffff" }) => {
  const meshRef = useRef();

  const [dummy] = useMemo(() => [new THREE.Object3D()], []);

  const lines = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 6,
        y: Math.random() * 1.5 + 0.1,
        z: (Math.random() - 0.5) * 15,
        speed: Math.random() * 0.5 + 0.8,
        scale: Math.random() * 0.5 + 0.5,
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    lines.forEach((line, i) => {
      line.z -= line.speed * 30 * delta;

      if (line.z < -8) {
        line.z = 8;
        line.x = (Math.random() - 0.5) * 6;
        line.y = Math.random() * 1.5 + 0.1;
      }

      dummy.position.set(line.x, line.y, line.z);
      dummy.scale.set(1, 1, line.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.005, 0.005, 4.0]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};
