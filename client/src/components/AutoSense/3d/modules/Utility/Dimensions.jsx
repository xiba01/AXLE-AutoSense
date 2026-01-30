import React from "react";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";

// --------------------------------------------------------
// 📏 SINGLE MEASUREMENT COMPONENT
// --------------------------------------------------------
const Measurement = ({ start, end, label, rotation }) => {
  const center = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  return (
    <group>
      {/* Dashed line */}
      <Line
        points={[start, end]}
        color="white"
        lineWidth={2}
        dashed
        dashScale={5}
        dashSize={0.4}
        gapSize={0.2}
        transparent
        opacity={0.8}
      />

      {/* End ticks */}
      <mesh position={start}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshBasicMaterial color="white" />
      </mesh>

      <mesh position={end}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Label */}
      <Text
        position={[center[0], center[1] + 0.05, center[2]]}
        rotation={rotation}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {label}
      </Text>
    </group>
  );
};

// --------------------------------------------------------
// 📐 DIMENSIONS MANAGER
// --------------------------------------------------------
export const Dimensions = ({ nodes, data = {} }) => {
  if (!nodes?.Wheel_FL || !nodes?.Wheel_FR || !nodes?.Wheel_RL) return null;

  // Fallbacks if data is missing
  const length = data.length_mm ?? 4341;
  const width = data.width_mm ?? 1804;
  const height = data.height_mm ?? 1440;

  // --------------------------------------------------
  // LENGTH (side view)
  // --------------------------------------------------
  const lengthZ_Back = nodes.Wheel_RL.position.z - 0.5;
  const lengthZ_Front = nodes.Wheel_FL.position.z + 0.5;
  const sideOffset = 1.4;

  const lengthStart = [sideOffset, 0.02, lengthZ_Back];
  const lengthEnd = [sideOffset, 0.02, lengthZ_Front];

  // --------------------------------------------------
  // WIDTH (front view)
  // --------------------------------------------------
  const widthX_Left = nodes.Wheel_FL.position.x;
  const widthX_Right = nodes.Wheel_FR.position.x;
  const frontOffset = nodes.Wheel_FL.position.z + 1.2;

  const widthStart = [widthX_Left, 0.02, frontOffset];
  const widthEnd = [widthX_Right, 0.02, frontOffset];

  // --------------------------------------------------
  // HEIGHT (🔗 LINKED TO WIDTH RIGHT END)
  // --------------------------------------------------
  const roofHeight = nodes.Anchor_Roof ? nodes.Anchor_Roof.position.y : 1.45;

  // 🔑 LINK: height starts EXACTLY at widthEnd
  const heightStart = [...widthEnd];
  const heightEnd = [widthEnd[0], roofHeight, widthEnd[2]];

  return (
    <group>
      {/* LENGTH */}
      <Measurement
        start={lengthStart}
        end={lengthEnd}
        label={`${length.toLocaleString()} mm`}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />

      {/* WIDTH */}
      <Measurement
        start={widthStart}
        end={widthEnd}
        label={`${width.toLocaleString()} mm`}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* HEIGHT (linked) */}
      <Measurement
        start={heightStart}
        end={heightEnd}
        label={`${height.toLocaleString()} mm`}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
};
