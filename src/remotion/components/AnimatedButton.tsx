import React from "react";
import { useAnimationProps, AnimationConfig } from "./useAnimationProps";

interface AnimatedButtonProps extends AnimationConfig {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  borderRadius?: number;
  paddingX?: number;
  paddingY?: number;
  borderColor?: string;
  borderWidth?: number;
  shadow?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  backgroundColor = "#6366f1",
  textColor = "#ffffff",
  fontSize = 18,
  fontWeight = 600,
  borderRadius = 12,
  paddingX = 32,
  paddingY = 16,
  borderColor = "transparent",
  borderWidth = 0,
  shadow = true,
  ...animationConfig
}) => {
  const { style } = useAnimationProps(animationConfig);

  return (
    <div
      style={{
        ...style,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
        color: textColor,
        fontSize,
        fontWeight,
        borderRadius,
        padding: `${paddingY}px ${paddingX}px`,
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        boxShadow: shadow ? `0 4px 20px ${backgroundColor}40` : "none",
        fontFamily: "Inter, sans-serif",
        cursor: "pointer",
      }}
    >
      {label}
    </div>
  );
};
