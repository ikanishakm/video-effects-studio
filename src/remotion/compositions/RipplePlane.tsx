import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { z } from "zod";

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
  // Custom vertex shader for ripple effect
  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFrequency;
    uniform float uWaveCount;

    void main() {
      vUv = uv;

      vec3 pos = position;

      // Calculate distance from center
      float dist = distance(vec2(pos.x, pos.y), vec2(0.0, 0.0));

      // Create outward ripples using sine waves
      float elevation = 0.0;
      for (float i = 1.0; i <= 10.0; i++) {
        if (i > uWaveCount) break;
        elevation += sin(dist * uFrequency * i - uTime) / i;
      }

      elevation *= uAmplitude;
      pos.z = elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Custom fragment shader for color gradient based on elevation
  const fragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uAmplitude;

    void main() {
      // Normalize elevation to 0-1 range
      float normalized = (vElevation + uAmplitude) / (uAmplitude * 2.0);

      // Mix colors based on elevation
      vec3 color = mix(uColor1, uColor2, normalized);

      // Add some brightness variation
      float brightness = 0.7 + normalized * 0.3;
      color *= brightness;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uWaveCount: { value: waveCount },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
      },
      wireframe: false,
      side: THREE.DoubleSide,
    });
  }, [amplitude, frequency, waveCount, color1, color2]);

  // Update time uniform based on frame
  const time = (frame / 30) * speed;
  shaderMaterial.uniforms.uTime.value = time;

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
