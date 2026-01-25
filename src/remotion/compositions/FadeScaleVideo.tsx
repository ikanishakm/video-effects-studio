import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { z } from "zod";

export const fadeScaleVideoSchema = z.object({
  videoSrc: z.string(),
  fadeInDuration: z.number().min(0.1).max(5).default(1),
  scaleFrom: z.number().min(0.1).max(2).default(1.2),
  scaleTo: z.number().min(0.5).max(1).default(1),
});

export type FadeScaleVideoProps = z.infer<typeof fadeScaleVideoSchema>;

export const FadeScaleVideo: React.FC<FadeScaleVideoProps> = ({
  videoSrc,
  fadeInDuration,
  scaleFrom,
  scaleTo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeInFrames = fadeInDuration * fps;

  const progress = spring({
    frame,
    fps,
    durationInFrames: fadeInFrames,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [scaleFrom, scaleTo], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
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
          <PlaceholderVideo label="Fade & Scale" />
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
      <div style={{ fontSize: 48, marginBottom: 20, color: "#6366f1" }}>
        {label}
      </div>
      <div style={{ color: "#a5a5c5", fontSize: 24 }}>Effect Preview</div>
    </div>
  );
};
