import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// --- MODULE IMPORTS ---
import { LidarScanner } from "./modules/Safety/LidarScanner";
import { BlindSpotSensor } from "./modules/Safety/BlindSpotSensor";
import { SafetyShield } from "./modules/Safety/SafetyShield";
import { CargoVolume } from "./modules/Utility/CargoVolume";
import { Dimensions } from "./modules/Utility/Dimensions";
import { PowerFlow } from "./modules/Performance/PowerFlow";
import { PerformanceRing } from "./modules/Performance/PerformanceRing";
import { WindLines } from "./modules/Performance/WindLines";

// THE FRESNEL SHADER (Hologram Logic)
const fresnelMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color1: { value: new THREE.Color("#0088ff") },
    color2: { value: new THREE.Color("#000000") },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  },
  transparent: true,
  depthWrite: false,
  vertexShader: `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    varying float vReflectionFactor;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
      vec3 I = worldPosition.xyz - cameraPosition;
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    varying float vReflectionFactor;
    void main() {
      float f = clamp( vReflectionFactor, 0.0, 1.0 );
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f); 
    }
  `,
});

export const CarModel = ({
  mode = "SHOWROOM",
  drivetrain = "AWD",
  bodyType = "Sedan",
  techConfig = {},
}) => {
  // 1. DETERMINE WHICH MODEL TO LOAD
  // Normalize input: 'SUV', 'Sedan', 'Coupe' -> 'suv_hologram.glb'
  const modelFile = bodyType.toLowerCase().includes("suv")
    ? "/models/suv_hologram.glb"
    : "/models/sedan_hologram.glb";

  const { nodes } = useGLTF(modelFile, "/draco/gltf/");
  const groupRef = useRef();
  const engineLightRef = useRef();

  // -----------------------------------------------------
  // THE MATERIAL LIBRARY
  // -----------------------------------------------------
  const library = useMemo(() => {
    return {
      paint: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        metalness: 1.0,
        roughness: 0.1,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#000000",
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.9,
        transparent: true,
      }),
      ghost: fresnelMaterial,
      techMesh: new THREE.MeshPhysicalMaterial({
        color: "#ff0000",
        transmission: 0.6,
        opacity: 0.8,
        metalness: 0.0,
        roughness: 0.1,
        transparent: true,
      }),
      graphite: new THREE.MeshStandardMaterial({
        color: "#181818",
        roughness: 0.6,
        metalness: 0.8,
        envMapIntensity: 0.2,
      }),
      tintedGlass: new THREE.MeshPhysicalMaterial({
        color: "#001133",
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        transparent: true,
        opacity: 0.8,
      }),
      outline: new THREE.LineBasicMaterial({
        color: "#ffffff",
        linewidth: 1,
        opacity: 0.6,
        transparent: true,
      }),
      satin: new THREE.MeshStandardMaterial({
        color: "#111111",
        roughness: 0.4,
        metalness: 0.5,
        envMapIntensity: 0.8,
      }),
      magma: new THREE.MeshBasicMaterial({
        color: "#ff4400",
        toneMapped: false,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      }),
      hotMetal: new THREE.MeshBasicMaterial({
        color: "#ff2200",
        toneMapped: false,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      }),
      darkGlass: new THREE.MeshPhysicalMaterial({
        color: "#000000",
        metalness: 0.8,
        roughness: 0.2,
        transmission: 0.5,
        transparent: true,
        opacity: 0.6,
      }),
    };
  }, []);

  // -----------------------------------------------------
  // 🛠️ HELPERS
  // -----------------------------------------------------
  const applyMaterial = (node, material, renderOrder = 0) => {
    if (!node) return;
    const apply = (mesh) => {
      mesh.material = material;
      mesh.renderOrder = renderOrder;
    };
    if (node.isMesh) apply(node);
    if (node.traverse) {
      node.traverse((child) => {
        if (child.isMesh) apply(child);
      });
    }
  };

  const toggleVisibility = (node, visible) => {
    if (!node) return;
    node.visible = visible;
  };

  const setupEdges = (node) => {
    if (!node) return;
    const createEdgeOnMesh = (mesh) => {
      if (mesh.userData.hasEdges) return;
      const edgesGeo = new THREE.EdgesGeometry(mesh.geometry, 15);
      const edgesMesh = new THREE.LineSegments(edgesGeo, library.outline);
      edgesMesh.name = "Blueprint_Edges";
      edgesMesh.visible = false;
      mesh.add(edgesMesh);
      mesh.userData.hasEdges = true;
    };
    if (node.isMesh) createEdgeOnMesh(node);
    if (node.traverse) {
      node.traverse((child) => {
        if (child.isMesh) createEdgeOnMesh(child);
      });
    }
  };

  const toggleEdges = (node, visible) => {
    if (!node) return;
    if (node.traverse) {
      node.traverse((child) => {
        if (child.name === "Blueprint_Edges") child.visible = visible;
      });
    }
  };

  // -----------------------------------------------------
  // THE LOGIC ENGINE
  // -----------------------------------------------------
  useEffect(() => {
    setupEdges(nodes.Chassis_Main);
    setupEdges(nodes.Trunk || nodes.trunk);

    const resetVisibility = () => {
      toggleVisibility(nodes.Engine_Block, false);
      toggleVisibility(nodes.Drivetrain_Front, false);
      toggleVisibility(nodes.Drivetrain_Rear, false);
      toggleVisibility(nodes.Exhaust_System, false);
      toggleVisibility(nodes.Airbags_Group, false);

      toggleVisibility(nodes.Chassis_Main, true);
      toggleVisibility(nodes.Chassis_Glass, true);
      toggleVisibility(nodes.Interior_Detail, true);
      toggleVisibility(nodes.Trunk || nodes.trunk, true);
      toggleVisibility(nodes.Headlights, true);
      toggleVisibility(nodes.Taillights, true);
      [nodes.Wheel_FL, nodes.Wheel_FR, nodes.Wheel_RL, nodes.Wheel_RR].forEach(
        (w) => toggleVisibility(w, true),
      );

      if (nodes.Chassis_Main) nodes.Chassis_Main.renderOrder = 0;
      toggleEdges(nodes.Chassis_Main, false);
      toggleEdges(nodes.Trunk || nodes.trunk, false);
    };

    resetVisibility();

    switch (mode) {
      case "SHOWROOM":
        applyMaterial(nodes.Chassis_Main, library.paint);
        applyMaterial(nodes.Trunk || nodes.trunk, library.paint);
        applyMaterial(nodes.Chassis_Glass, library.glass);
        applyMaterial(nodes.Headlights, library.glass);
        applyMaterial(nodes.Taillights, library.glass);
        applyMaterial(nodes.Interior_Detail, library.graphite);
        [
          nodes.Wheel_FL,
          nodes.Wheel_FR,
          nodes.Wheel_RL,
          nodes.Wheel_RR,
        ].forEach((w) => applyMaterial(w, library.chrome));
        break;

      case "SAFETY":
        applyMaterial(nodes.Chassis_Main, library.ghost);
        applyMaterial(nodes.Trunk || nodes.trunk, library.ghost);
        applyMaterial(nodes.Chassis_Glass, library.ghost);
        applyMaterial(nodes.Headlights, library.ghost);
        applyMaterial(nodes.Taillights, library.ghost);
        applyMaterial(nodes.Interior_Detail, library.ghost);
        [
          nodes.Wheel_FL,
          nodes.Wheel_FR,
          nodes.Wheel_RL,
          nodes.Wheel_RR,
        ].forEach((w) => applyMaterial(w, library.ghost));

        toggleVisibility(nodes.Airbags_Group, true);
        applyMaterial(nodes.Airbags_Group, library.techMesh);
        break;

      case "PERFORMANCE":
        applyMaterial(nodes.Chassis_Main, library.satin, 0);
        applyMaterial(nodes.Trunk || nodes.trunk, library.satin, 0);
        toggleVisibility(nodes.Chassis_Glass, true);
        applyMaterial(nodes.Chassis_Glass, library.darkGlass, 1);
        toggleVisibility(nodes.Interior_Detail, false);
        toggleVisibility(nodes.Headlights, false);
        toggleVisibility(nodes.Taillights, false);

        const XRAY_ORDER = 999;

        toggleVisibility(nodes.Engine_Block, true);
        applyMaterial(nodes.Engine_Block, library.magma, XRAY_ORDER);
        toggleVisibility(nodes.Exhaust_System, true);
        applyMaterial(nodes.Exhaust_System, library.magma, XRAY_ORDER);

        const isFront =
          drivetrain === "AWD" || drivetrain === "FWD" || drivetrain === "4WD";
        const isRear =
          drivetrain === "AWD" || drivetrain === "RWD" || drivetrain === "4WD";

        toggleVisibility(nodes.Drivetrain_Front, isFront);
        if (isFront)
          applyMaterial(nodes.Drivetrain_Front, library.hotMetal, XRAY_ORDER);

        toggleVisibility(nodes.Drivetrain_Rear, isRear);
        if (isRear)
          applyMaterial(nodes.Drivetrain_Rear, library.hotMetal, XRAY_ORDER);

        const frontWheelMat = isFront ? library.hotMetal : library.satin;
        const frontOrder = isFront ? XRAY_ORDER : 0;
        applyMaterial(nodes.Wheel_FL, frontWheelMat, frontOrder);
        applyMaterial(nodes.Wheel_FR, frontWheelMat, frontOrder);

        const rearWheelMat = isRear ? library.hotMetal : library.satin;
        const rearOrder = isRear ? XRAY_ORDER : 0;
        applyMaterial(nodes.Wheel_RL, rearWheelMat, rearOrder);
        applyMaterial(nodes.Wheel_RR, rearWheelMat, rearOrder);
        break;

      case "UTILITY":
        applyMaterial(nodes.Chassis_Main, library.graphite);
        applyMaterial(nodes.Trunk || nodes.trunk, library.graphite);
        applyMaterial(nodes.Chassis_Glass, library.tintedGlass);
        toggleEdges(nodes.Chassis_Main, true);
        toggleEdges(nodes.Trunk || nodes.trunk, true);

        [
          nodes.Wheel_FL,
          nodes.Wheel_FR,
          nodes.Wheel_RL,
          nodes.Wheel_RR,
        ].forEach((w) => applyMaterial(w, library.graphite));

        applyMaterial(nodes.Interior_Detail, library.graphite);
        break;

      default:
        break;
    }
  }, [mode, nodes, library, drivetrain]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    const trunkNode = nodes.Trunk || nodes.trunk;
    if (trunkNode) {
      const targetAngle = mode === "UTILITY" ? 1.3 : 0;
      trunkNode.rotation.x = THREE.MathUtils.lerp(
        trunkNode.rotation.x,
        targetAngle,
        delta * 2,
      );
    }

    if (mode === "PERFORMANCE") {
      const pulse = Math.sin(t * 8) * 0.5 + 0.5;
      const baseOrange = new THREE.Color("#ff4400");
      const hotYellow = new THREE.Color("#ffaa00");
      library.magma.color.lerpColors(baseOrange, hotYellow, pulse * 0.3);

      if (engineLightRef.current) {
        engineLightRef.current.intensity = 5 + pulse * 10;
      }

      const wheelSpeed = 15 * delta;
      if (nodes.Wheel_FL) nodes.Wheel_FL.rotation.x += wheelSpeed;
      if (nodes.Wheel_FR) nodes.Wheel_FR.rotation.x += wheelSpeed;
      if (nodes.Wheel_RL) nodes.Wheel_RL.rotation.x += wheelSpeed;
      if (nodes.Wheel_RR) nodes.Wheel_RR.rotation.x += wheelSpeed;

      if (nodes.Car_Root) {
        nodes.Car_Root.position.y = Math.sin(t * 60) * 0.002;
        nodes.Car_Root.rotation.z = Math.sin(t * 40) * 0.001;
      }
    } else {
      if (nodes.Car_Root) {
        nodes.Car_Root.position.y = 0;
        nodes.Car_Root.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={nodes.Car_Root} />

      {mode === "PERFORMANCE" && (
        <>
          {nodes.Anchor_Engine_Core && (
            <group position={nodes.Anchor_Engine_Core.position}>
              <pointLight
                ref={engineLightRef}
                color="#ff6600"
                distance={3}
                decay={2}
                castShadow={false}
              />
            </group>
          )}

          <PowerFlow nodes={nodes} drivetrain={drivetrain} />
          <PerformanceRing hp={techConfig.engine_hp ?? 220} />
          <WindLines count={60} />
        </>
      )}

      {mode === "SAFETY" && nodes.Anchor_Sensor_Front && (
        <>
          {/* <SafetyShield /> */}
          {(techConfig.has_front_sensors ?? true) && (
            <LidarScanner anchor={nodes.Anchor_Sensor_Front} />
          )}
          {(techConfig.has_rear_sensors ?? true) && (
            <>
              <BlindSpotSensor anchor={nodes.Anchor_BlindSpot_L} side="left" />
              <BlindSpotSensor anchor={nodes.Anchor_BlindSpot_R} side="right" />
            </>
          )}
        </>
      )}

      {mode === "UTILITY" && (
        <>
          {nodes.Anchor_Trunk && (
            <CargoVolume
              anchor={nodes.Anchor_Trunk}
              isOpen={true}
              capacity={techConfig.trunk_capacity_liters}
            />
          )}
          <Dimensions
            nodes={nodes}
            data={techConfig.dimensions}
          />
        </>
      )}
    </group>
  );
};

// 4. Preload BOTH models to avoid lag when switching
useGLTF.preload("/models/sedan_hologram.glb");
useGLTF.preload("/models/suv_hologram.glb");
