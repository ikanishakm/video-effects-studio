import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { z } from "zod";

export const zoomBlurVideoSchema = z.object({
  videoSrc: z.string(),
  zoomDuration: z.number().min(0.1).max(3).default(1),
  startScale: z.number().min(1).max(3).default(2),
  startBlur: z.number().min(0).max(30).default(20),
});

export type ZoomBlurVideoProps = z.infer<typeof zoomBlurVideoSchema>;

export const ZoomBlurVideo: React.FC<ZoomBlurVideoProps> = ({
  videoSrc,
  zoomDuration,
  startScale,
  startBlur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomFrames = zoomDuration * fps;

  const progress = spring({
    frame,
    fps,
    durationInFrames: zoomFrames,
    config: { damping: 200 },
  });

  const scale = interpolate(progress, [0, 1], [startScale, 1], {
    extrapolateRight: "clamp",
  });

  const blur = interpolate(progress, [0, 1], [startBlur, 0], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
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
          filter: `blur(${blur}px)`,
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
          <PlaceholderVideo label="Zoom Blur" />
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
      <div style={{ fontSize: 48, marginBottom: 20, color: "#ec4899" }}>
        {label}
      </div>
      <div style={{ color: "#a5a5c5", fontSize: 24 }}>Effect Preview</div>
    </div>
  );
};
