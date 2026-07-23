import GlowBackground, {
  type GlowBackgroundMask,
  type GlowBackgroundStyle,
} from "@/components/backgrounds/glow-background"
import type { HTMLAttributes } from "react"

const DOT_GLOW_BACKGROUND_TOKENS = {
  surfaceColor: "#ffffff",
  foregroundColor: "#252422",
  patternColor: "rgba(36, 35, 33, 0.12)",
  patternOpacity: "1",
  horizontalDotSpacing: "24px",
  verticalDotSpacing: "24px",
  patternOffsetX: "0px",
  patternOffsetY: "0px",
  dotSize: "1px",
  dotEdgeSize: "1.25px",
  patternMaskWidth: "58%",
  patternMaskHeight: "64%",
  patternMaskX: "50%",
  patternMaskY: "50%",
  patternMaskOpacity: "1",
  patternMaskInnerStop: "10%",
  patternMaskOuterStop: "100%",
  glowColor: "rgba(255, 255, 255, 0.7)",
  glowOpacity: "0",
  glowWidth: "100%",
  glowHeight: "100%",
  glowX: "50%",
  glowY: "50%",
  glowInnerStop: "18%",
  glowOuterStop: "72%",
} as const

type DotGlowBackgroundProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> & {
  className?: string
  patternMask?: GlowBackgroundMask
  style?: GlowBackgroundStyle
}

export default function DotGlowBackground({
  className,
  patternMask = "center",
  style,
  ...props
}: DotGlowBackgroundProps) {
  const backgroundStyle: GlowBackgroundStyle = {
    "--background-surface": DOT_GLOW_BACKGROUND_TOKENS.surfaceColor,
    "--background-foreground": DOT_GLOW_BACKGROUND_TOKENS.foregroundColor,
    "--background-pattern-color": DOT_GLOW_BACKGROUND_TOKENS.patternColor,
    "--background-pattern-opacity": DOT_GLOW_BACKGROUND_TOKENS.patternOpacity,
    "--background-pattern-horizontal-spacing":
      DOT_GLOW_BACKGROUND_TOKENS.horizontalDotSpacing,
    "--background-pattern-vertical-spacing":
      DOT_GLOW_BACKGROUND_TOKENS.verticalDotSpacing,
    "--background-pattern-offset-x": DOT_GLOW_BACKGROUND_TOKENS.patternOffsetX,
    "--background-pattern-offset-y": DOT_GLOW_BACKGROUND_TOKENS.patternOffsetY,
    "--background-dot-size": DOT_GLOW_BACKGROUND_TOKENS.dotSize,
    "--background-dot-edge-size": DOT_GLOW_BACKGROUND_TOKENS.dotEdgeSize,
    "--background-pattern-mask-width":
      DOT_GLOW_BACKGROUND_TOKENS.patternMaskWidth,
    "--background-pattern-mask-height":
      DOT_GLOW_BACKGROUND_TOKENS.patternMaskHeight,
    "--background-pattern-mask-x": DOT_GLOW_BACKGROUND_TOKENS.patternMaskX,
    "--background-pattern-mask-y": DOT_GLOW_BACKGROUND_TOKENS.patternMaskY,
    "--background-pattern-mask-opacity":
      DOT_GLOW_BACKGROUND_TOKENS.patternMaskOpacity,
    "--background-pattern-mask-inner-stop":
      DOT_GLOW_BACKGROUND_TOKENS.patternMaskInnerStop,
    "--background-pattern-mask-outer-stop":
      DOT_GLOW_BACKGROUND_TOKENS.patternMaskOuterStop,
    "--background-glow-color": DOT_GLOW_BACKGROUND_TOKENS.glowColor,
    "--background-glow-opacity": DOT_GLOW_BACKGROUND_TOKENS.glowOpacity,
    "--background-glow-width": DOT_GLOW_BACKGROUND_TOKENS.glowWidth,
    "--background-glow-height": DOT_GLOW_BACKGROUND_TOKENS.glowHeight,
    "--background-glow-x": DOT_GLOW_BACKGROUND_TOKENS.glowX,
    "--background-glow-y": DOT_GLOW_BACKGROUND_TOKENS.glowY,
    "--background-glow-inner-stop": DOT_GLOW_BACKGROUND_TOKENS.glowInnerStop,
    "--background-glow-outer-stop": DOT_GLOW_BACKGROUND_TOKENS.glowOuterStop,
    ...style,
  }

  return (
    <GlowBackground
      pattern="dots"
      patternMask={patternMask}
      className={className}
      style={backgroundStyle}
      {...props}
    />
  )
}
