export type PresetConfig = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  compositionId: string;
  durationInFrames: number;
  thumbnail?: string;
};

export const presets: PresetConfig[] = [
  {
    id: "slide-zoom",
    name: "Slide & Zoom",
    description: "Video slides in from left and zooms out when centered",
    icon: "↔️",
    color: "#6366f1",
    compositionId: "SlideZoomVideo",
    durationInFrames: 150,
  },
  {
    id: "fade-scale",
    name: "Fade & Scale",
    description: "Smooth fade in with subtle scale animation",
    icon: "✨",
    color: "#8b5cf6",
    compositionId: "FadeScaleVideo",
    durationInFrames: 90,
  },
  {
    id: "bounce-in",
    name: "Bounce In",
    description: "Playful bouncy entrance from any direction",
    icon: "🎾",
    color: "#10b981",
    compositionId: "BounceInVideo",
    durationInFrames: 90,
  },
  {
    id: "rotate-reveal",
    name: "Rotate Reveal",
    description: "Elegant rotation with scale reveal effect",
    icon: "🔄",
    color: "#f59e0b",
    compositionId: "RotateRevealVideo",
    durationInFrames: 120,
  },
  {
    id: "zoom-blur",
    name: "Zoom Blur",
    description: "Cinematic zoom with blur transition",
    icon: "🎬",
    color: "#ec4899",
    compositionId: "ZoomBlurVideo",
    durationInFrames: 90,
  },
];

export const getPresetById = (id: string): PresetConfig | undefined => {
  return presets.find((preset) => preset.id === id);
};

export const getPresetByCompositionId = (compositionId: string): PresetConfig | undefined => {
  return presets.find((preset) => preset.compositionId === compositionId);
};
