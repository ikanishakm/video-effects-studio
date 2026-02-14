import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface AnimationConfig {
  fadeInDuration?: number;
  fadeOutDuration?: number;
  scaleFrom?: number;
  scaleTo?: number;
  delay?: number;
  slideFrom?: "left" | "right" | "top" | "bottom" | "none";
  slideDistance?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

export interface AnimationValues {
  opacity: number;
  scale: number;
  translateX: number;
  translateY: number;
  style: React.CSSProperties;
}

export const useAnimationProps = (config: AnimationConfig = {}): AnimationValues => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const {
    fadeInDuration = 0.5,
    fadeOutDuration = 0,
    scaleFrom = 1,
    scaleTo = 1,
    delay = 0,
    slideFrom = "none",
    slideDistance = 200,
    springConfig = { damping: 15, stiffness: 80 },
  } = config;

  const delayFrames = delay * fps;
  const adjustedFrame = frame - delayFrames;

  // Fade in
  const fadeInFrames = fadeInDuration * fps;
  const fadeInProgress = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  // Fade out
  const fadeOutFrames = fadeOutDuration * fps;
  const fadeOutStart = durationInFrames - fadeOutFrames - delayFrames;
  const fadeOutOpacity = fadeOutDuration > 0
    ? interpolate(
        adjustedFrame,
        [fadeOutStart, fadeOutStart + fadeOutFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // Combined opacity
  const opacity = adjustedFrame < 0 ? 0 : Math.min(fadeInProgress, fadeOutOpacity);

  // Scale
  const scale = interpolate(fadeInProgress, [0, 1], [scaleFrom, scaleTo]);

  // Slide translation
  let translateX = 0;
  let translateY = 0;

  if (slideFrom !== "none") {
    const slideProgress = fadeInProgress;
    switch (slideFrom) {
      case "left":
        translateX = interpolate(slideProgress, [0, 1], [-slideDistance, 0]);
        break;
      case "right":
        translateX = interpolate(slideProgress, [0, 1], [slideDistance, 0]);
        break;
      case "top":
        translateY = interpolate(slideProgress, [0, 1], [-slideDistance, 0]);
        break;
      case "bottom":
        translateY = interpolate(slideProgress, [0, 1], [slideDistance, 0]);
        break;
    }
  }

  const style: React.CSSProperties = {
    opacity,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
  };

  return { opacity, scale, translateX, translateY, style };
};
