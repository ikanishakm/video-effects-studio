import { Composition, Folder } from "remotion";
import { SlideZoomVideo, slideZoomVideoSchema } from "./compositions/SlideZoomVideo";
import { FadeScaleVideo, fadeScaleVideoSchema } from "./compositions/FadeScaleVideo";
import { BounceInVideo, bounceInVideoSchema } from "./compositions/BounceInVideo";
import { RotateRevealVideo, rotateRevealVideoSchema } from "./compositions/RotateRevealVideo";
import { ZoomBlurVideo, zoomBlurVideoSchema } from "./compositions/ZoomBlurVideo";

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
    </Folder>
  );
};
