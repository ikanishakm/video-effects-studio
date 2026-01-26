"use client";

import { useParams, useRouter } from "next/navigation";
import { Player, PlayerRef } from "@remotion/player";
import { getPresetById } from "@/config/presets";
import { SlideZoomVideo } from "@/remotion/compositions/SlideZoomVideo";
import { FadeScaleVideo } from "@/remotion/compositions/FadeScaleVideo";
import { BounceInVideo } from "@/remotion/compositions/BounceInVideo";
import { RotateRevealVideo } from "@/remotion/compositions/RotateRevealVideo";
import { ZoomBlurVideo } from "@/remotion/compositions/ZoomBlurVideo";
import { useCallback, useMemo, useRef, useState } from "react";

const componentMap: Record<string, React.FC<any>> = {
  SlideZoomVideo,
  FadeScaleVideo,
  BounceInVideo,
  RotateRevealVideo,
  ZoomBlurVideo,
};

type ControlConfig = {
  key: string;
  label: string;
  type: "range" | "select" | "text";
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
};

const controlsConfig: Record<string, ControlConfig[]> = {
  SlideZoomVideo: [
    { key: "videoSrc", label: "Video URL", type: "text" },
    { key: "slideInDuration", label: "Slide In Duration (s)", type: "range", min: 0.1, max: 3, step: 0.1 },
    { key: "pauseDuration", label: "Pause Duration (s)", type: "range", min: 0, max: 2, step: 0.1 },
    { key: "zoomOutDuration", label: "Zoom Out Duration (s)", type: "range", min: 0.1, max: 3, step: 0.1 },
    { key: "finalScale", label: "Final Scale", type: "range", min: 0.3, max: 1, step: 0.05 },
  ],
  FadeScaleVideo: [
    { key: "videoSrc", label: "Video URL", type: "text" },
    { key: "fadeInDuration", label: "Fade Duration (s)", type: "range", min: 0.1, max: 3, step: 0.1 },
    { key: "scaleFrom", label: "Scale From", type: "range", min: 0.5, max: 2, step: 0.1 },
    { key: "scaleTo", label: "Scale To", type: "range", min: 0.5, max: 1.5, step: 0.1 },
  ],
  BounceInVideo: [
    { key: "videoSrc", label: "Video URL", type: "text" },
    { key: "bounceDuration", label: "Bounce Duration (s)", type: "range", min: 0.2, max: 2, step: 0.1 },
    {
      key: "direction",
      label: "Direction",
      type: "select",
      options: [
        { value: "top", label: "From Top" },
        { value: "bottom", label: "From Bottom" },
        { value: "left", label: "From Left" },
        { value: "right", label: "From Right" },
      ],
    },
  ],
  RotateRevealVideo: [
    { key: "videoSrc", label: "Video URL", type: "text" },
    { key: "revealDuration", label: "Reveal Duration (s)", type: "range", min: 0.2, max: 3, step: 0.1 },
    { key: "rotationDegrees", label: "Rotation (deg)", type: "range", min: -45, max: 45, step: 5 },
    { key: "startScale", label: "Start Scale", type: "range", min: 0.3, max: 1.5, step: 0.1 },
  ],
  ZoomBlurVideo: [
    { key: "videoSrc", label: "Video URL", type: "text" },
    { key: "zoomDuration", label: "Zoom Duration (s)", type: "range", min: 0.2, max: 3, step: 0.1 },
    { key: "startScale", label: "Start Scale", type: "range", min: 1, max: 4, step: 0.1 },
    { key: "startBlur", label: "Start Blur (px)", type: "range", min: 0, max: 50, step: 1 },
  ],
};

const defaultPropsMap: Record<string, Record<string, any>> = {
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

export default function StudioPage() {
  const params = useParams();
  const router = useRouter();
  const presetId = params.id as string;
  const preset = getPresetById(presetId);
  const playerRef = useRef<PlayerRef>(null);

  const [props, setProps] = useState<Record<string, any>>(
    preset ? { ...defaultPropsMap[preset.compositionId] } : {}
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const updateProp = useCallback((key: string, value: any) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  }, []);

  const fps = 30;
  const durationInFrames = useMemo(() => {
    if (!preset) return 90;

    // Calculate duration based on effect parameters
    if (preset.compositionId === "SlideZoomVideo") {
      return Math.ceil((props.slideInDuration + props.pauseDuration + props.zoomOutDuration + 2) * fps);
    }
    return preset.durationInFrames;
  }, [preset, props]);

  const handleRecord = useCallback(async () => {
    if (!playerRef.current) return;

    setIsRecording(true);
    setRecordingProgress(0);

    try {
      const container = document.querySelector('[data-player-container]');
      if (!container) throw new Error("Player container not found");

      const canvas = container.querySelector('canvas') || container.querySelector('video');
      if (!canvas) throw new Error("No canvas or video element found");

      // Get the actual video/canvas element
      const playerElement = container.querySelector('[data-remotion-player]') as HTMLElement;
      if (!playerElement) throw new Error("Player element not found");

      // Use MediaRecorder on a canvas stream
      const stream = (canvas as any).captureStream?.(30);
      if (!stream) {
        alert("Your browser doesn't support video recording. Please use Chrome or Firefox.");
        setIsRecording(false);
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${preset?.id || 'video'}-effect.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordingProgress(0);
      };

      // Start recording
      mediaRecorder.start();

      // Play from beginning
      playerRef.current.seekTo(0);
      playerRef.current.play();

      // Track progress
      const totalFrames = durationInFrames;
      const checkProgress = setInterval(() => {
        const currentFrame = playerRef.current?.getCurrentFrame() || 0;
        setRecordingProgress(Math.round((currentFrame / totalFrames) * 100));

        if (currentFrame >= totalFrames - 1) {
          clearInterval(checkProgress);
          setTimeout(() => {
            mediaRecorder.stop();
            playerRef.current?.pause();
          }, 100);
        }
      }, 100);

    } catch (error) {
      console.error("Recording error:", error);
      alert("Recording failed. For best results, run Remotion Studio locally.");
      setIsRecording(false);
    }
  }, [durationInFrames, preset?.id]);

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
  const controls = controlsConfig[preset.compositionId] || [];

  return (
    <main style={styles.main}>
      <div style={styles.studioLayout}>
        {/* Left: Player */}
        <div style={styles.playerPane}>
          <div style={styles.playerHeader}>
            <button onClick={() => router.push("/")} style={styles.backLink}>
              ← Back
            </button>
            <div style={styles.titleRow}>
              <span style={styles.icon}>{preset.icon}</span>
              <h1 style={{ ...styles.title, color: preset.color }}>{preset.name}</h1>
            </div>
          </div>

          <div style={styles.playerWrapper} data-player-container>
            <Player
              ref={playerRef}
              component={Component}
              inputProps={props}
              durationInFrames={durationInFrames}
              fps={fps}
              compositionWidth={1920}
              compositionHeight={1080}
              style={styles.player}
              controls
              loop
            />
          </div>

          <div style={styles.playerInfo}>
            <span>{(durationInFrames / fps).toFixed(1)}s</span>
            <span>•</span>
            <span>{durationInFrames} frames</span>
            <span>•</span>
            <span>1920×1080</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div style={styles.controlsPane}>
          <h2 style={styles.controlsTitle}>Settings</h2>

          <div style={styles.controlsList}>
            {controls.map((control) => (
              <div key={control.key} style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  {control.label}
                  {control.type === "range" && (
                    <span style={styles.controlValue}>
                      {typeof props[control.key] === "number"
                        ? props[control.key].toFixed(control.step && control.step < 1 ? 1 : 0)
                        : props[control.key]}
                    </span>
                  )}
                </label>

                {control.type === "text" && (
                  <input
                    type="text"
                    value={props[control.key] || ""}
                    onChange={(e) => updateProp(control.key, e.target.value)}
                    placeholder="Enter video URL (optional)"
                    style={styles.textInput}
                  />
                )}

                {control.type === "range" && (
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={props[control.key]}
                    onChange={(e) => updateProp(control.key, parseFloat(e.target.value))}
                    style={styles.rangeInput}
                  />
                )}

                {control.type === "select" && (
                  <select
                    value={props[control.key]}
                    onChange={(e) => updateProp(control.key, e.target.value)}
                    style={styles.selectInput}
                  >
                    {control.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <div style={styles.downloadSection}>
            <button
              onClick={handleRecord}
              disabled={isRecording}
              style={{
                ...styles.downloadButton,
                backgroundColor: preset.color,
                opacity: isRecording ? 0.7 : 1,
              }}
            >
              {isRecording ? `Recording... ${recordingProgress}%` : "Record & Download"}
            </button>
            <p style={styles.downloadNote}>
              Records the preview as WebM video. For high-quality MP4 export, run Remotion Studio locally.
            </p>
          </div>

          <div style={styles.resetSection}>
            <button
              onClick={() => setProps({ ...defaultPropsMap[preset.compositionId] })}
              style={styles.resetButton}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
  },
  studioLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    minHeight: "100vh",
  },
  playerPane: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
  },
  playerHeader: {
    marginBottom: 24,
  },
  backLink: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: 14,
    cursor: "pointer",
    padding: 0,
    marginBottom: 12,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
  },
  playerWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  player: {
    width: "100%",
    aspectRatio: "16 / 9",
  },
  playerInfo: {
    display: "flex",
    gap: 12,
    marginTop: 16,
    color: "var(--text-muted)",
    fontSize: 13,
  },
  controlsPane: {
    background: "var(--bg-secondary)",
    borderLeft: "1px solid var(--border)",
    padding: 24,
    overflowY: "auto",
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 24,
    color: "var(--text-primary)",
  },
  controlsList: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  controlGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  controlLabel: {
    fontSize: 13,
    color: "var(--text-secondary)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlValue: {
    color: "var(--accent)",
    fontWeight: 500,
    fontFamily: "monospace",
  },
  textInput: {
    width: "100%",
    padding: "10px 12px",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
  },
  rangeInput: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    background: "var(--bg-tertiary)",
    outline: "none",
    cursor: "pointer",
  },
  selectInput: {
    width: "100%",
    padding: "10px 12px",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
  },
  downloadSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTop: "1px solid var(--border)",
  },
  downloadButton: {
    width: "100%",
    padding: "14px 20px",
    border: "none",
    borderRadius: 10,
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  downloadNote: {
    fontSize: 11,
    color: "var(--text-muted)",
    marginTop: 12,
    lineHeight: 1.5,
  },
  resetSection: {
    marginTop: 16,
  },
  resetButton: {
    width: "100%",
    padding: "10px 16px",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-secondary)",
    fontSize: 13,
    cursor: "pointer",
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
