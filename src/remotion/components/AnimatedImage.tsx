import React from "react";
import { Img } from "remotion";
import { useAnimationProps, AnimationConfig } from "./useAnimationProps";

interface AnimatedImageProps extends AnimationConfig {
  src: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  objectFit?: "cover" | "contain" | "fill" | "none";
  shadow?: boolean;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  width = 400,
  height = 300,
  borderRadius = 12,
  objectFit = "cover",
  shadow = true,
  ...animationConfig
}) => {
  const { style } = useAnimationProps(animationConfig);

  if (!src) {
    return (
      <div
        style={{
          ...style,
          width,
          height,
          borderRadius,
          backgroundColor: "#1a1a2e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed #333",
          boxShadow: shadow ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <span style={{ color: "#555", fontSize: 16 }}>No image</span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...style,
        overflow: "hidden",
        borderRadius,
        boxShadow: shadow ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <Img
        src={src}
        style={{
          width,
          height,
          objectFit,
          display: "block",
        }}
      />
    </div>
  );
};
