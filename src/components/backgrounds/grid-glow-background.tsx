import GlowBackground, {
  type GlowBackgroundMask,
  type GlowBackgroundStyle,
} from "@/components/backgrounds/glow-background"
import type { HTMLAttributes } from "react"

const GRID_GLOW_BACKGROUND_TOKENS = {
  surfaceColor: "#ffffff",
  foregroundColor: "#252422",
  patternColor: "rgba(36, 35, 33, 0.045)",
  patternOpacity: "1",
  horizontalSpacing: "48px",
  verticalSpacing: "48px",
  patternOffsetX: "0px",
  patternOffsetY: "0px",
  horizontalLineWidth: "1px",
  verticalLineWidth: "1px",
  patternMaskWidth: "70%",
  patternMaskHeight: "75%",
  patternMaskX: "50%",
  patternMaskY: "50%",
  patternMaskOpacity: "1",
  patternMaskInnerStop: "25%",
  patternMaskOuterStop: "100%",
  glowColor: "rgba(255, 255, 255, 0.72)",
  glowOpacity: "1",
  glowWidth: "100%",
  glowHeight: "100%",
  glowX: "50%",
  glowY: "50%",
  glowInnerStop: "18%",
  glowOuterStop: "72%",
} as const

type GridGlowBackgroundProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> & {
  className?: string
  patternMask?: GlowBackgroundMask
  style?: GlowBackgroundStyle
}

export default function GridGlowBackground({
  className,
  patternMask = "edges",
  style,
  ...props
}: GridGlowBackgroundProps) {
  const backgroundStyle: GlowBackgroundStyle = {
    "--background-surface": GRID_GLOW_BACKGROUND_TOKENS.surfaceColor,
    "--background-foreground": GRID_GLOW_BACKGROUND_TOKENS.foregroundColor,
    "--background-pattern-color": GRID_GLOW_BACKGROUND_TOKENS.patternColor,
    "--background-pattern-opacity": GRID_GLOW_BACKGROUND_TOKENS.patternOpacity,
    "--background-pattern-horizontal-spacing":
      GRID_GLOW_BACKGROUND_TOKENS.horizontalSpacing,
    "--background-pattern-vertical-spacing":
      GRID_GLOW_BACKGROUND_TOKENS.verticalSpacing,
    "--background-pattern-offset-x": GRID_GLOW_BACKGROUND_TOKENS.patternOffsetX,
    "--background-pattern-offset-y": GRID_GLOW_BACKGROUND_TOKENS.patternOffsetY,
    "--background-grid-horizontal-line-width":
      GRID_GLOW_BACKGROUND_TOKENS.horizontalLineWidth,
    "--background-grid-vertical-line-width":
      GRID_GLOW_BACKGROUND_TOKENS.verticalLineWidth,
    "--background-pattern-mask-width":
      GRID_GLOW_BACKGROUND_TOKENS.patternMaskWidth,
    "--background-pattern-mask-height":
      GRID_GLOW_BACKGROUND_TOKENS.patternMaskHeight,
    "--background-pattern-mask-x": GRID_GLOW_BACKGROUND_TOKENS.patternMaskX,
    "--background-pattern-mask-y": GRID_GLOW_BACKGROUND_TOKENS.patternMaskY,
    "--background-pattern-mask-opacity":
      GRID_GLOW_BACKGROUND_TOKENS.patternMaskOpacity,
    "--background-pattern-mask-inner-stop":
      GRID_GLOW_BACKGROUND_TOKENS.patternMaskInnerStop,
    "--background-pattern-mask-outer-stop":
      GRID_GLOW_BACKGROUND_TOKENS.patternMaskOuterStop,
    "--background-glow-color": GRID_GLOW_BACKGROUND_TOKENS.glowColor,
    "--background-glow-opacity": GRID_GLOW_BACKGROUND_TOKENS.glowOpacity,
    "--background-glow-width": GRID_GLOW_BACKGROUND_TOKENS.glowWidth,
    "--background-glow-height": GRID_GLOW_BACKGROUND_TOKENS.glowHeight,
    "--background-glow-x": GRID_GLOW_BACKGROUND_TOKENS.glowX,
    "--background-glow-y": GRID_GLOW_BACKGROUND_TOKENS.glowY,
    "--background-glow-inner-stop": GRID_GLOW_BACKGROUND_TOKENS.glowInnerStop,
    "--background-glow-outer-stop": GRID_GLOW_BACKGROUND_TOKENS.glowOuterStop,
    ...style,
  }

  return (
    <GlowBackground
      pattern="grid"
      patternMask={patternMask}
      className={className}
      style={backgroundStyle}
      {...props}
    />
  )
}
