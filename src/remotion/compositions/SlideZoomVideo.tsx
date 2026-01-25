import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { z } from "zod";

export const slideZoomVideoSchema = z.object({
  videoSrc: z.string(),
  slideInDuration: z.number().min(0.1).max(5).default(1),
  pauseDuration: z.number().min(0).max(5).default(0.5),
  zoomOutDuration: z.number().min(0.1).max(5).default(1),
  finalScale: z.number().min(0.1).max(1).default(0.7),
});

export type SlideZoomVideoProps = z.infer<typeof slideZoomVideoSchema>;

export const SlideZoomVideo: React.FC<SlideZoomVideoProps> = ({
  videoSrc,
  slideInDuration,
  pauseDuration,
  zoomOutDuration,
  finalScale,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const slideInFrames = slideInDuration * fps;
  const pauseFrames = pauseDuration * fps;
  const zoomOutFrames = zoomOutDuration * fps;

  const slideEndFrame = slideInFrames;
  const pauseEndFrame = slideEndFrame + pauseFrames;
  const zoomEndFrame = pauseEndFrame + zoomOutFrames;

  // Phase 1: Slide in from left to center
  const slideProgress = spring({
    frame,
    fps,
    durationInFrames: slideInFrames,
    config: { damping: 200 },
  });

  // Calculate the X translation: start off-screen left, end at center (0)
  const translateX = interpolate(slideProgress, [0, 1], [-width, 0], {
    extrapolateRight: "clamp",
  });

  // Phase 2: Zoom out after pause
  const zoomStartFrame = pauseEndFrame;
  const zoomProgress = spring({
    frame: frame - zoomStartFrame,
    fps,
    durationInFrames: zoomOutFrames,
    config: { damping: 200 },
  });

  // Only start zooming after the pause
  const scale =
    frame < zoomStartFrame
      ? 1
      : interpolate(zoomProgress, [0, 1], [1, finalScale], {
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
          transform: `translateX(${translateX}px) scale(${scale})`,
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
          <PlaceholderVideo />
        )}
      </div>
    </AbsoluteFill>
  );
};

const PlaceholderVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = interpolate(Math.sin(frame / (fps / 2)), [-1, 1], [0.8, 1]);

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
        transform: `scale(${pulse})`,
      }}
    >
      <div
        style={{
          fontSize: 80,
          marginBottom: 20,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.5"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
      <div
        style={{
          color: "#a5a5c5",
          fontSize: 32,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        Your Video Here
      </div>
      <div
        style={{
          color: "#6a6a8a",
          fontSize: 18,
          fontFamily: "system-ui, sans-serif",
          marginTop: 10,
        }}
      >
        Add a video URL to preview
      </div>
    </div>
  );
};
