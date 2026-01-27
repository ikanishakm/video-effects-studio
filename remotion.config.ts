import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Enable client-side rendering in Remotion Studio
// This uses WebCodecs to render videos directly in the browser
// instead of requiring server-side FFmpeg processing
Config.setExperimentalClientSideRenderingEnabled(true);

// Disable server-side rendering to prevent memory issues
// Forces all rendering to use WebCodecs in the browser
Config.setStudioServerSideRenderingDisabled(true);
