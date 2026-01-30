import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export const CargoVolume = ({ anchor, isOpen, capacity }) => {
  const volumeRef = useRef();
  const edgesRef = useRef();

  // --------------------------------------------------
  // 1. DIMENSIONS (Width, Height, Depth) — meters
  // --------------------------------------------------
  const boxArgs = useMemo(() => [0.9, 0.45, 0.8], []);

  // --------------------------------------------------
  // 2. Use provided trunk capacity (liters)
  // --------------------------------------------------
  const capacityLiters = capacity ?? 500;

  // --------------------------------------------------
  // 3. GEOMETRIES (Memoized)
  // --------------------------------------------------
  const volumeGeometry = useMemo(
    () => new THREE.BoxGeometry(...boxArgs),
    [boxArgs],
  );

  const edgesGeometry = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(
          boxArgs[0] + 0.01,
          boxArgs[1] + 0.01,
          boxArgs[2] + 0.01,
        ),
        15,
      ),
    [boxArgs],
  );

  // --------------------------------------------------
  // 4. ANIMATION LOOP (Fill Up / Down)
  // --------------------------------------------------
  useFrame((_, delta) => {
    if (!volumeRef.current || !edgesRef.current) return;

    const targetScaleY = isOpen ? 1 : 0;

    const nextScale = THREE.MathUtils.lerp(
      volumeRef.current.scale.y,
      targetScaleY,
      delta * 3,
    );

    volumeRef.current.scale.y = nextScale;
    edgesRef.current.scale.y = nextScale;
  });

  if (!anchor) return null;

  return (
    <group position={anchor.position} rotation={anchor.rotation}>
      {/* --------------------------------------------------
          STATIC LABEL (NOT SCALED)
      -------------------------------------------------- */}
      <Text
        position={[0, boxArgs[1] + 0.05, 0]}
        fontSize={0.16}
        rotation={[0, Math.PI, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {capacityLiters.toLocaleString()} L
      </Text>

      {/* Lower container so fill starts from trunk floor */}
      <group position={[0, -0.1, 0]}>
        {/* --------------------------------------------------
            A. TRANSLUCENT CARGO VOLUME (ANIMATED)
        -------------------------------------------------- */}
        <mesh ref={volumeRef} position={[0, boxArgs[1] / 2, 0]}>
          <primitive object={volumeGeometry} />
          <meshPhysicalMaterial
            color="#0088ff"
            emissive="#0044aa"
            emissiveIntensity={0.5}
            transmission={0.6}
            thickness={1.0}
            roughness={0.2}
            metalness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* --------------------------------------------------
            B. EDGE OUTLINE
        -------------------------------------------------- */}
        <lineSegments
          ref={edgesRef}
          geometry={edgesGeometry}
          position={[0, boxArgs[1] / 2, 0]}
        >
          <lineBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </lineSegments>
      </group>
    </group>
  );
};
