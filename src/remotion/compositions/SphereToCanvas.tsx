import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { z } from "zod";

export const sphereToCanvasSchema = z.object({
  imageUrls: z.array(z.string()).default([]),
  cardCount: z.number().default(12),
  sphereRadius: z.number().default(3),
  cardWidth: z.number().default(0.8),
  cardHeight: z.number().default(0.5),
  scaleDelay: z.number().default(1),
  scaleDuration: z.number().default(0.5),
  flattenDuration: z.number().default(1),
  finalScale: z.number().default(1.5),
  backgroundColor: z.string().default("#0a0a0a"),
});

type SphereToCanvasProps = z.infer<typeof sphereToCanvasSchema>;

// Generate evenly distributed points on a sphere using Fibonacci lattice
const fibonacciSphere = (samples: number, radius: number) => {
  const points: { x: number; y: number; z: number; theta: number; phi: number }[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < samples; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / samples);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    points.push({ x, y, z, theta, phi });
  }

  return points;
};

interface CardProps {
  position: [number, number, number];
  originalPosition: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  color: string;
  imageUrl?: string;
  flattenProgress: number;
  index: number;
}

const Card: React.FC<CardProps> = ({
  position,
  originalPosition,
  rotation,
  width,
  height,
  color,
  flattenProgress,
  index,
}) => {
  // Calculate flattened position (project to 2D plane at z=0)
  const gridCols = 4;
  const gridRows = 3;
  const spacing = 1.2;

  const gridX = (index % gridCols) - (gridCols - 1) / 2;
  const gridY = Math.floor(index / gridCols) - (gridRows - 1) / 2;

  const flatX = gridX * spacing;
  const flatY = -gridY * spacing;
  const flatZ = 0;

  // Interpolate between sphere position and grid position
  const currentX = interpolate(flattenProgress, [0, 1], [position[0], flatX]);
  const currentY = interpolate(flattenProgress, [0, 1], [position[1], flatY]);
  const currentZ = interpolate(flattenProgress, [0, 1], [position[2], flatZ]);

  // Flatten rotation to face camera
  const currentRotationX = interpolate(flattenProgress, [0, 1], [rotation[0], 0]);
  const currentRotationY = interpolate(flattenProgress, [0, 1], [rotation[1], 0]);
  const currentRotationZ = interpolate(flattenProgress, [0, 1], [rotation[2], 0]);

  return (
    <mesh
      position={[currentX, currentY, currentZ]}
      rotation={[currentRotationX, currentRotationY, currentRotationZ]}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
};

const Scene: React.FC<SphereToCanvasProps & { frame: number; fps: number }> = ({
  cardCount,
  sphereRadius,
  cardWidth,
  cardHeight,
  scaleDelay,
  scaleDuration,
  flattenDuration,
  finalScale,
  frame,
  fps,
}) => {
  // Calculate timing
  const scaleStartFrame = scaleDelay * fps;
  const scaleEndFrame = scaleStartFrame + scaleDuration * fps;
  const flattenStartFrame = scaleEndFrame;
  const flattenEndFrame = flattenStartFrame + flattenDuration * fps;

  // Scale animation (starts after 1 second)
  const scaleProgress = spring({
    frame: frame - scaleStartFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
    },
  });

  const currentScale = interpolate(
    Math.max(0, scaleProgress),
    [0, 1],
    [1, finalScale]
  );

  // Flatten animation
  const flattenProgress = interpolate(
    frame,
    [flattenStartFrame, flattenEndFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Generate sphere points
  const spherePoints = useMemo(
    () => fibonacciSphere(cardCount, sphereRadius),
    [cardCount, sphereRadius]
  );

  // Card colors (gradient palette)
  const colors = [
    "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#f97316", "#eab308",
    "#84cc16", "#22c55e", "#14b8a6", "#06b6d4",
  ];

  // Slow rotation driven by frame
  const rotationY = frame * 0.01;

  // Camera position - pull back as it flattens
  const cameraZ = interpolate(flattenProgress, [0, 1], [8, 6]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.4} />

      <group scale={currentScale} rotation={[0, rotationY * (1 - flattenProgress), 0]}>
        {spherePoints.map((point, index) => {
          // Calculate rotation to face outward from sphere center
          const lookAtRotation = new THREE.Euler();
          const position = new THREE.Vector3(point.x, point.y, point.z);
          const matrix = new THREE.Matrix4();
          matrix.lookAt(position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
          lookAtRotation.setFromRotationMatrix(matrix);

          return (
            <Card
              key={index}
              index={index}
              position={[point.x, point.y, point.z]}
              originalPosition={[point.x, point.y, point.z]}
              rotation={[lookAtRotation.x, lookAtRotation.y + Math.PI, lookAtRotation.z]}
              width={cardWidth}
              height={cardHeight}
              color={colors[index % colors.length]}
              flattenProgress={flattenProgress}
            />
          );
        })}
      </group>

      <perspectiveCamera position={[0, 0, cameraZ]} fov={50} />
    </>
  );
};

export const SphereToCanvas: React.FC<SphereToCanvasProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <Scene {...props} frame={frame} fps={fps} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
