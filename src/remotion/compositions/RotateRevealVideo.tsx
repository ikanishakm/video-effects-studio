import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { z } from "zod";

export const rotateRevealVideoSchema = z.object({
  videoSrc: z.string(),
  revealDuration: z.number().min(0.1).max(3).default(1.2),
  rotationDegrees: z.number().min(-360).max(360).default(-15),
  startScale: z.number().min(0.1).max(2).default(0.8),
});

export type RotateRevealVideoProps = z.infer<typeof rotateRevealVideoSchema>;

export const RotateRevealVideo: React.FC<RotateRevealVideoProps> = ({
  videoSrc,
  revealDuration,
  rotationDegrees,
  startScale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealFrames = revealDuration * fps;

  const progress = spring({
    frame,
    fps,
    durationInFrames: revealFrames,
    config: { damping: 15, stiffness: 80 },
  });

  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const rotation = interpolate(progress, [0, 1], [rotationDegrees, 0], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [startScale, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        perspective: 1000,
      }}
    >
      <div
        style={{
          opacity,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {videoSrc ? (
          <Video
            src={videoSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <PlaceholderVideo label="Rotate Reveal" />
        )}
      </div>
    </AbsoluteFill>
  );
};

const PlaceholderVideo: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      style={{
        width: "80%",
        height: "80%",
        backgroundColor: "#1a1a2e",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "3px solid #4a4a6a",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 20, color: "#f59e0b" }}>
        {label}
      </div>
      <div style={{ color: "#a5a5c5", fontSize: 24 }}>Effect Preview</div>
    </div>
  );
};
