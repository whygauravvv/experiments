import GlowBackground, {
  type GlowBackgroundStyle,
} from "@/components/backgrounds/glow-background"
import type { HTMLAttributes } from "react"

const GRID_GLOW_BACKGROUND_TOKENS = {
  surfaceColor: "#f3f2ee",
  foregroundColor: "#252422",
  patternColor: "rgba(36, 35, 33, 0.045)",
  patternSize: "clamp(36px, 8vw, 64px)",
  lineWidth: "1px",
  glowColor: "rgba(255, 255, 255, 0.72)",
  glowSize: "72%",
  glowInnerStop: "18%",
  glowOuterStop: "72%",
} as const

type GridGlowBackgroundProps = HTMLAttributes<HTMLDivElement>

export default function GridGlowBackground({
  className,
  style,
  ...props
}: GridGlowBackgroundProps) {
  const backgroundStyle: GlowBackgroundStyle = {
    "--background-surface": GRID_GLOW_BACKGROUND_TOKENS.surfaceColor,
    "--background-foreground": GRID_GLOW_BACKGROUND_TOKENS.foregroundColor,
    "--background-pattern-color": GRID_GLOW_BACKGROUND_TOKENS.patternColor,
    "--background-pattern-size": GRID_GLOW_BACKGROUND_TOKENS.patternSize,
    "--background-pattern-mark-size": GRID_GLOW_BACKGROUND_TOKENS.lineWidth,
    "--background-glow-color": GRID_GLOW_BACKGROUND_TOKENS.glowColor,
    "--background-glow-size": GRID_GLOW_BACKGROUND_TOKENS.glowSize,
    "--background-glow-inner-stop": GRID_GLOW_BACKGROUND_TOKENS.glowInnerStop,
    "--background-glow-outer-stop": GRID_GLOW_BACKGROUND_TOKENS.glowOuterStop,
    ...style,
  }

  return (
    <GlowBackground
      pattern="grid"
      className={className}
      style={backgroundStyle}
      {...props}
    />
  )
}
