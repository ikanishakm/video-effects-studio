import React from "react";
import { useAnimationProps, AnimationConfig } from "./useAnimationProps";

interface AnimatedShapeProps extends AnimationConfig {
  shape?: "circle" | "rectangle" | "rounded";
  width?: number;
  height?: number;
  fill?: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
  shadow?: boolean;
}

export const AnimatedShape: React.FC<AnimatedShapeProps> = ({
  shape = "rounded",
  width = 200,
  height = 200,
  fill = "#6366f1",
  strokeColor = "transparent",
  strokeWidth = 0,
  borderRadius = 16,
  shadow = false,
  ...animationConfig
}) => {
  const { style } = useAnimationProps(animationConfig);

  const shapeRadius = shape === "circle" ? "50%" : shape === "rounded" ? borderRadius : 0;

  return (
    <div
      style={{
        ...style,
        width,
        height,
        backgroundColor: fill,
        borderRadius: shapeRadius,
        border: strokeWidth > 0 ? `${strokeWidth}px solid ${strokeColor}` : "none",
        boxShadow: shadow ? `0 8px 32px ${fill}40` : "none",
      }}
    />
  );
};
