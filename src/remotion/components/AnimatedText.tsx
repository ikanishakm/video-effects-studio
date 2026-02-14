import React from "react";
import { useAnimationProps, AnimationConfig } from "./useAnimationProps";

interface AnimatedTextProps extends AnimationConfig {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  maxWidth?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 48,
  fontWeight = 700,
  color = "#ffffff",
  fontFamily = "Inter, sans-serif",
  textAlign = "center",
  lineHeight = 1.2,
  letterSpacing = 0,
  textTransform = "none",
  maxWidth,
  ...animationConfig
}) => {
  const { style } = useAnimationProps(animationConfig);

  return (
    <div
      style={{
        ...style,
        fontSize,
        fontWeight,
        color,
        fontFamily,
        textAlign,
        lineHeight,
        letterSpacing,
        textTransform,
        maxWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start",
      }}
    >
      {text}
    </div>
  );
};
