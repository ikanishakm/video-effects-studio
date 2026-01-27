import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { z } from "zod";
import {
  uniform,
  positionLocal,
  distance,
  sin,
  float,
  vec2,
  vec3,
  mix,
  uv,
  MeshStandardNodeMaterial,
} from "three/tsl";

export const ripplePlaneSchema = z.object({
  gridSize: z.number().default(50),
  amplitude: z.number().default(0.5),
  frequency: z.number().default(2),
  speed: z.number().default(1),
  waveCount: z.number().default(3),
  color1: z.string().default("#6366f1"),
  color2: z.string().default("#ec4899"),
  backgroundColor: z.string().default("#000000"),
});

type RipplePlaneProps = z.infer<typeof ripplePlaneSchema>;

interface RipplePlaneSceneProps extends RipplePlaneProps {
  frame: number;
}

const RipplePlaneScene: React.FC<RipplePlaneSceneProps> = ({
  gridSize,
  amplitude,
  frequency,
  speed,
  waveCount,
  color1,
  color2,
  frame,
}) => {
  // TSL uniforms
  const uTime = uniform((frame / 30) * speed);
  const uAmplitude = uniform(amplitude);
  const uFrequency = uniform(frequency);
  const uWaveCount = uniform(waveCount);
  const uColor1 = uniform(vec3(new THREE.Color(color1)));
  const uColor2 = uniform(vec3(new THREE.Color(color2)));

  // TSL node-based shader material
  const shaderMaterial = useMemo(() => {
    // Calculate distance from center using TSL
    const dist = distance(vec2(positionLocal.x, positionLocal.y), vec2(0, 0));

    // Create ripple elevation effect
    let elevation = float(0);
    for (let i = 1; i <= waveCount; i++) {
      const wave = sin(dist.mul(uFrequency).mul(i).sub(uTime)).div(i);
      elevation = elevation.add(wave);
    }
    elevation = elevation.mul(uAmplitude);

    // Normalize elevation for color mixing
    const normalized = elevation.add(uAmplitude).div(uAmplitude.mul(2.0));

    // Mix colors based on elevation
    const color = mix(uColor1, uColor2, normalized);

    // Add brightness variation
    const brightness = float(0.7).add(normalized.mul(0.3));
    const finalColor = color.mul(brightness);

    // Create material with position offset
    const material = new MeshStandardNodeMaterial({
      side: THREE.DoubleSide,
    });

    // Apply vertex displacement
    material.positionNode = positionLocal.add(vec3(0, 0, elevation));

    // Apply color
    material.colorNode = finalColor;

    return material;
  }, [amplitude, frequency, waveCount, color1, color2, frame, speed]);

  // Update uniforms
  uTime.value = (frame / 30) * speed;
  uAmplitude.value = amplitude;
  uFrequency.value = frequency;
  uWaveCount.value = waveCount;
  uColor1.value = new THREE.Color(color1);
  uColor2.value = new THREE.Color(color2);

  // Camera rotation
  const cameraY = Math.sin(frame * 0.005) * 2 + 3;
  const cameraZ = Math.cos(frame * 0.005) * 2 + 3;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#ffffff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10, gridSize, gridSize]} />
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      <perspectiveCamera
        position={[0, cameraY, cameraZ]}
        fov={60}
        rotation={[-Math.PI / 4, 0, 0]}
      />
    </>
  );
};

export const RipplePlane: React.FC<RipplePlaneProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 3, 3], fov: 60 }}
      >
        <RipplePlaneScene {...props} frame={frame} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
