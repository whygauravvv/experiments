import GlowBackground, {
  type GlowBackgroundStyle,
} from "@/components/backgrounds/glow-background"
import type { HTMLAttributes } from "react"

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

export default function DotGlowBackground({
  className,
  style,
  ...props
}: DotGlowBackgroundProps) {
  const backgroundStyle: GlowBackgroundStyle = {
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
    <GlowBackground
      pattern="dots"
      className={className}
      style={backgroundStyle}
      {...props}
    />
  )
}
