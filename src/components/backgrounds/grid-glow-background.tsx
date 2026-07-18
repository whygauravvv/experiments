import "@/styles/grid-glow-background.css"

import { cn } from "@/lib/utils"
import type { CSSProperties, HTMLAttributes } from "react"

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
type GridGlowBackgroundStyle = CSSProperties & {
  "--background-surface": string
  "--background-foreground": string
  "--background-pattern-color": string
  "--background-pattern-size": string
  "--background-pattern-mark-size": string
  "--background-glow-color": string
  "--background-glow-size": string
  "--background-glow-inner-stop": string
  "--background-glow-outer-stop": string
}

export default function GridGlowBackground({
  className,
  style,
  ...props
}: GridGlowBackgroundProps) {
  const backgroundStyle: GridGlowBackgroundStyle = {
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
    <div
      className={cn("grid-glow-background", className)}
      style={backgroundStyle}
      {...props}
    />
  )
}
