import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { z } from "zod";
import { AnimatedText } from "../components/AnimatedText";
import { AnimatedButton } from "../components/AnimatedButton";
import { AnimatedImage } from "../components/AnimatedImage";
import { AnimatedShape } from "../components/AnimatedShape";

export const sequenceCompositionSchema = z.object({
  // Title
  titleText: z.string().default("Create Stunning Videos"),
  titleFontSize: z.number().default(64),
  titleColor: z.string().default("#ffffff"),
  // Subtitle
  subtitleText: z.string().default("With Remotion & React"),
  subtitleFontSize: z.number().default(32),
  subtitleColor: z.string().default("#a78bfa"),
  // Button
  buttonLabel: z.string().default("Get Started"),
  buttonColor: z.string().default("#6366f1"),
  // Image
  imageSrc: z.string().default(""),
  // Shape
  shapeColor: z.string().default("#ec4899"),
  // Background
  backgroundColor: z.string().default("#0a0a1a"),
  // Timing
  staggerDelay: z.number().default(0.3),
});

type SequenceCompositionProps = z.infer<typeof sequenceCompositionSchema>;

export const SequenceComposition: React.FC<SequenceCompositionProps> = ({
  titleText,
  titleFontSize,
  titleColor,
  subtitleText,
  subtitleFontSize,
  subtitleColor,
  buttonLabel,
  buttonColor,
  imageSrc,
  shapeColor,
  backgroundColor,
  staggerDelay,
}) => {
  const { fps } = useVideoConfig();
  const stagger = Math.round(staggerDelay * fps);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Background decorative shape */}
      <Sequence from={0} layout="none">
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <AnimatedShape
            shape="circle"
            width={500}
            height={500}
            fill={`${shapeColor}15`}
            scaleFrom={0}
            scaleTo={1}
            fadeInDuration={1}
            springConfig={{ damping: 20, stiffness: 60 }}
          />
        </div>
      </Sequence>

      {/* Title */}
      <Sequence from={stagger} layout="none">
        <div
          style={{
            position: "absolute",
            top: "25%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AnimatedText
            text={titleText}
            fontSize={titleFontSize}
            fontWeight={800}
            color={titleColor}
            slideFrom="bottom"
            slideDistance={60}
            fadeInDuration={0.6}
            scaleFrom={0.9}
            scaleTo={1}
          />
        </div>
      </Sequence>

      {/* Subtitle */}
      <Sequence from={stagger * 2} layout="none">
        <div
          style={{
            position: "absolute",
            top: "38%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AnimatedText
            text={subtitleText}
            fontSize={subtitleFontSize}
            fontWeight={400}
            color={subtitleColor}
            slideFrom="bottom"
            slideDistance={40}
            fadeInDuration={0.6}
            scaleFrom={0.95}
            scaleTo={1}
          />
        </div>
      </Sequence>

      {/* Image */}
      <Sequence from={stagger * 3} layout="none">
        <div
          style={{
            position: "absolute",
            top: "48%",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <AnimatedImage
            src={imageSrc}
            width={600}
            height={300}
            borderRadius={16}
            fadeInDuration={0.8}
            scaleFrom={0.8}
            scaleTo={1}
            slideFrom="bottom"
            slideDistance={50}
          />
        </div>
      </Sequence>

      {/* Button */}
      <Sequence from={stagger * 4} layout="none">
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AnimatedButton
            label={buttonLabel}
            backgroundColor={buttonColor}
            textColor="#ffffff"
            fontSize={20}
            paddingX={40}
            paddingY={18}
            borderRadius={50}
            fadeInDuration={0.5}
            scaleFrom={0}
            scaleTo={1}
            springConfig={{ damping: 12, stiffness: 100 }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
