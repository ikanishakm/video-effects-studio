import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Enable client-side rendering in Remotion Studio
// This uses WebCodecs to render videos directly in the browser
// instead of requiring server-side FFmpeg processing
Config.setExperimentalClientSideRenderingEnabled(true);
