import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { z } from "zod";

export const bounceInVideoSchema = z.object({
  videoSrc: z.string(),
  bounceDuration: z.number().min(0.1).max(3).default(0.8),
  direction: z.enum(["top", "bottom", "left", "right"]).default("bottom"),
});

export type BounceInVideoProps = z.infer<typeof bounceInVideoSchema>;

export const BounceInVideo: React.FC<BounceInVideoProps> = ({
  videoSrc,
  bounceDuration,
  direction,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const bounceFrames = bounceDuration * fps;

  const progress = spring({
    frame,
    fps,
    durationInFrames: bounceFrames,
    config: { damping: 12, stiffness: 100 },
  });

  const getTransform = () => {
    switch (direction) {
      case "top":
        return `translateY(${interpolate(progress, [0, 1], [-height, 0])}px)`;
      case "bottom":
        return `translateY(${interpolate(progress, [0, 1], [height, 0])}px)`;
      case "left":
        return `translateX(${interpolate(progress, [0, 1], [-width, 0])}px)`;
      case "right":
        return `translateX(${interpolate(progress, [0, 1], [width, 0])}px)`;
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: getTransform(),
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
          <PlaceholderVideo label="Bounce In" />
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
      <div style={{ fontSize: 48, marginBottom: 20, color: "#10b981" }}>
        {label}
      </div>
      <div style={{ color: "#a5a5c5", fontSize: 24 }}>Effect Preview</div>
    </div>
  );
};
