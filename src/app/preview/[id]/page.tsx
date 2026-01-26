"use client";

import { useParams, useRouter } from "next/navigation";
import { Player } from "@remotion/player";
import { getPresetById, presets } from "@/config/presets";
import { SlideZoomVideo } from "@/remotion/compositions/SlideZoomVideo";
import { FadeScaleVideo } from "@/remotion/compositions/FadeScaleVideo";
import { BounceInVideo } from "@/remotion/compositions/BounceInVideo";
import { RotateRevealVideo } from "@/remotion/compositions/RotateRevealVideo";
import { ZoomBlurVideo } from "@/remotion/compositions/ZoomBlurVideo";

const componentMap: Record<string, React.FC<any>> = {
  SlideZoomVideo,
  FadeScaleVideo,
  BounceInVideo,
  RotateRevealVideo,
  ZoomBlurVideo,
};

const defaultPropsMap: Record<string, any> = {
  SlideZoomVideo: {
    videoSrc: "",
    slideInDuration: 1,
    pauseDuration: 0.5,
    zoomOutDuration: 1,
    finalScale: 0.7,
  },
  FadeScaleVideo: {
    videoSrc: "",
    fadeInDuration: 1,
    scaleFrom: 1.2,
    scaleTo: 1,
  },
  BounceInVideo: {
    videoSrc: "",
    bounceDuration: 0.8,
    direction: "bottom",
  },
  RotateRevealVideo: {
    videoSrc: "",
    revealDuration: 1.2,
    rotationDegrees: -15,
    startScale: 0.8,
  },
  ZoomBlurVideo: {
    videoSrc: "",
    zoomDuration: 1,
    startScale: 2,
    startBlur: 20,
  },
};

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const presetId = params.id as string;
  const preset = getPresetById(presetId);

  if (!preset) {
    return (
      <main style={styles.main}>
        <div style={styles.notFound}>
          <h1>Effect not found</h1>
          <button onClick={() => router.push("/")} style={styles.backButton}>
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  const Component = componentMap[preset.compositionId];
  const defaultProps = defaultPropsMap[preset.compositionId];

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={() => router.push("/")} style={styles.backLink}>
            ← Back to Effects
          </button>
          <div style={styles.titleRow}>
            <span style={styles.icon}>{preset.icon}</span>
            <h1 style={{ ...styles.title, color: preset.color }}>{preset.name}</h1>
          </div>
          <p style={styles.description}>{preset.description}</p>
        </header>

        <div style={styles.playerSection}>
          <div style={styles.playerWrapper}>
            <Player
              component={Component}
              inputProps={defaultProps}
              durationInFrames={preset.durationInFrames}
              fps={30}
              compositionWidth={1920}
              compositionHeight={1080}
              style={styles.player}
              controls
              loop
            />
          </div>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Composition ID</h3>
            <code style={styles.code}>{preset.compositionId}</code>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Duration</h3>
            <span>{(preset.durationInFrames / 30).toFixed(1)}s ({preset.durationInFrames} frames)</span>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Resolution</h3>
            <span>1920 × 1080</span>
          </div>
        </div>

        <div style={styles.localDev}>
          <h3 style={styles.localDevTitle}>Run Locally with Remotion Studio</h3>
          <p style={styles.localDevText}>
            To render videos, clone the repo and run Remotion Studio:
          </p>
          <code style={styles.codeBlock}>
            git clone https://github.com/ikanishakm/video-effects-studio.git{"\n"}
            cd video-effects-studio{"\n"}
            npm install{"\n"}
            npm run remotion:studio
          </code>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    padding: "40px 20px",
  },
  container: {
    maxWidth: 1000,
    margin: "0 auto",
  },
  header: {
    marginBottom: 32,
  },
  backLink: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: 14,
    cursor: "pointer",
    marginBottom: 16,
    padding: 0,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
  },
  description: {
    color: "var(--text-secondary)",
    fontSize: 16,
  },
  playerSection: {
    marginBottom: 32,
  },
  playerWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    background: "#000",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  player: {
    width: "100%",
    aspectRatio: "16 / 9",
  },
  infoSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 32,
  },
  infoCard: {
    background: "var(--bg-secondary)",
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 12,
    color: "var(--text-muted)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  code: {
    background: "var(--bg-tertiary)",
    padding: "4px 8px",
    borderRadius: 6,
    fontFamily: "monospace",
    fontSize: 14,
    color: "var(--accent)",
  },
  localDev: {
    background: "var(--bg-secondary)",
    padding: 24,
    borderRadius: 16,
    border: "1px dashed var(--border)",
  },
  localDevTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  localDevText: {
    color: "var(--text-secondary)",
    fontSize: 14,
    marginBottom: 16,
  },
  codeBlock: {
    display: "block",
    background: "var(--bg-tertiary)",
    padding: 16,
    borderRadius: 8,
    fontFamily: "monospace",
    fontSize: 13,
    color: "var(--text-primary)",
    whiteSpace: "pre",
    overflow: "auto",
  },
  notFound: {
    textAlign: "center",
    padding: 60,
  },
  backButton: {
    marginTop: 20,
    padding: "12px 24px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
};
