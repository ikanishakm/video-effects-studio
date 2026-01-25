import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      videoSrc = "",
      slideInDuration = 1,
      pauseDuration = 0.5,
      zoomOutDuration = 1,
      finalScale = 0.7,
      outputFormat = "mp4",
    } = body;

    const compositionId = "SlideZoomVideo";

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.resolve(process.cwd(), "src/index.ts"),
      webpackOverride: (config) => config,
    });

    // Calculate total duration
    const fps = 30;
    const totalDuration =
      (slideInDuration + pauseDuration + zoomOutDuration + 2) * fps;

    // Select the composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: {
        videoSrc,
        slideInDuration,
        pauseDuration,
        zoomOutDuration,
        finalScale,
      },
    });

    // Override duration based on input
    const compositionWithDuration = {
      ...composition,
      durationInFrames: Math.ceil(totalDuration),
    };

    // Create output directory if it doesn't exist
    const outputDir = path.resolve(process.cwd(), "public/output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(
      outputDir,
      `video-${Date.now()}.${outputFormat}`
    );

    // Render the video
    await renderMedia({
      composition: compositionWithDuration,
      serveUrl: bundleLocation,
      codec: outputFormat === "webm" ? "vp8" : "h264",
      outputLocation: outputPath,
      inputProps: {
        videoSrc,
        slideInDuration,
        pauseDuration,
        zoomOutDuration,
        finalScale,
      },
    });

    // Return the path to the rendered video
    const publicPath = `/output/${path.basename(outputPath)}`;

    return NextResponse.json({
      success: true,
      videoUrl: publicPath,
      message: "Video rendered successfully",
    });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
