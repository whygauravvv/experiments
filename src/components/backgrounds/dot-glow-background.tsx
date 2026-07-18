import "@/styles/grid-glow-background.css"

import { cn } from "@/lib/utils"
import type { CSSProperties, HTMLAttributes } from "react"

const DOT_GLOW_BACKGROUND_TOKENS = {
  surfaceColor: "#f3f2ee",
  foregroundColor: "#252422",
  patternColor: "rgba(36, 35, 33, 0.12)",
  patternSize: "clamp(36px, 8vw, 64px)",
  dotRadius: "2px",
  dotFadeRadius: "1.25px",
  glowColor: "rgba(255, 255, 255, 0.72)",
  glowSize: "72%",
  glowInnerStop: "18%",
  glowOuterStop: "72%",
} as const

type DotGlowBackgroundProps = HTMLAttributes<HTMLDivElement>
type DotGlowBackgroundStyle = CSSProperties & {
  "--background-surface": string
  "--background-foreground": string
  "--background-pattern-color": string
  "--background-pattern-size": string
  "--background-pattern-mark-size": string
  "--background-pattern-fade-size": string
  "--background-glow-color": string
  "--background-glow-size": string
  "--background-glow-inner-stop": string
  "--background-glow-outer-stop": string
}

export default function DotGlowBackground({
  className,
  style,
  ...props
}: DotGlowBackgroundProps) {
  const backgroundStyle: DotGlowBackgroundStyle = {
    "--background-surface": DOT_GLOW_BACKGROUND_TOKENS.surfaceColor,
    "--background-foreground": DOT_GLOW_BACKGROUND_TOKENS.foregroundColor,
    "--background-pattern-color": DOT_GLOW_BACKGROUND_TOKENS.patternColor,
    "--background-pattern-size": DOT_GLOW_BACKGROUND_TOKENS.patternSize,
    "--background-pattern-mark-size": DOT_GLOW_BACKGROUND_TOKENS.dotRadius,
    "--background-pattern-fade-size": DOT_GLOW_BACKGROUND_TOKENS.dotFadeRadius,
    "--background-glow-color": DOT_GLOW_BACKGROUND_TOKENS.glowColor,
    "--background-glow-size": DOT_GLOW_BACKGROUND_TOKENS.glowSize,
    "--background-glow-inner-stop": DOT_GLOW_BACKGROUND_TOKENS.glowInnerStop,
    "--background-glow-outer-stop": DOT_GLOW_BACKGROUND_TOKENS.glowOuterStop,
    ...style,
  }

  return (
    <div
      className={cn(
        "grid-glow-background grid-glow-background--dots",
        className
      )}
      style={backgroundStyle}
      {...props}
    />
  )
}
