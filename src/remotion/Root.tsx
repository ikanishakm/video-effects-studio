import { Composition, Folder } from "remotion";
import { SlideZoomVideo, slideZoomVideoSchema } from "./compositions/SlideZoomVideo";
import { FadeScaleVideo, fadeScaleVideoSchema } from "./compositions/FadeScaleVideo";
import { BounceInVideo, bounceInVideoSchema } from "./compositions/BounceInVideo";
import { RotateRevealVideo, rotateRevealVideoSchema } from "./compositions/RotateRevealVideo";
import { ZoomBlurVideo, zoomBlurVideoSchema } from "./compositions/ZoomBlurVideo";
import { SphereToCanvas, sphereToCanvasSchema } from "./compositions/SphereToCanvas";
import { RipplePlane, ripplePlaneSchema } from "./compositions/RipplePlane";
import { SequenceComposition, sequenceCompositionSchema } from "./compositions/SequenceComposition";

export const RemotionRoot = () => {
  return (
    <Folder name="Video-Effects">
      <Composition
        id="SlideZoomVideo"
        component={SlideZoomVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={slideZoomVideoSchema}
        defaultProps={{
          videoSrc: "",
          slideInDuration: 1,
          pauseDuration: 0.5,
          zoomOutDuration: 1,
          finalScale: 0.7,
        }}
      />
      <Composition
        id="FadeScaleVideo"
        component={FadeScaleVideo}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={fadeScaleVideoSchema}
        defaultProps={{
          videoSrc: "",
          fadeInDuration: 1,
          scaleFrom: 1.2,
          scaleTo: 1,
        }}
      />
      <Composition
        id="BounceInVideo"
        component={BounceInVideo}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={bounceInVideoSchema}
        defaultProps={{
          videoSrc: "",
          bounceDuration: 0.8,
          direction: "bottom",
        }}
      />
      <Composition
        id="RotateRevealVideo"
        component={RotateRevealVideo}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        schema={rotateRevealVideoSchema}
        defaultProps={{
          videoSrc: "",
          revealDuration: 1.2,
          rotationDegrees: -15,
          startScale: 0.8,
        }}
      />
      <Composition
        id="ZoomBlurVideo"
        component={ZoomBlurVideo}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={zoomBlurVideoSchema}
        defaultProps={{
          videoSrc: "",
          zoomDuration: 1,
          startScale: 2,
          startBlur: 20,
        }}
      />
      <Composition
        id="SphereToCanvas"
        component={SphereToCanvas}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        schema={sphereToCanvasSchema}
        defaultProps={{
          imageUrls: [],
          cardCount: 12,
          sphereRadius: 3,
          cardWidth: 0.8,
          cardHeight: 0.5,
          scaleDelay: 1,
          scaleDuration: 0.5,
          flattenDuration: 1,
          finalScale: 1.5,
          backgroundColor: "#0a0a0a",
        }}
      />
      <Composition
        id="RipplePlane"
        component={RipplePlane}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        schema={ripplePlaneSchema}
        defaultProps={{
          gridSize: 50,
          amplitude: 0.5,
          frequency: 2,
          speed: 1,
          waveCount: 3,
          color1: "#6366f1",
          color2: "#ec4899",
          backgroundColor: "#000000",
        }}
      />
      <Composition
        id="SequenceBuilder"
        component={SequenceComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={sequenceCompositionSchema}
        defaultProps={{
          titleText: "Create Stunning Videos",
          titleFontSize: 64,
          titleColor: "#ffffff",
          subtitleText: "With Remotion & React",
          subtitleFontSize: 32,
          subtitleColor: "#a78bfa",
          buttonLabel: "Get Started",
          buttonColor: "#6366f1",
          imageSrc: "",
          shapeColor: "#ec4899",
          backgroundColor: "#0a0a1a",
          staggerDelay: 0.3,
        }}
      />
    </Folder>
  );
};
