import "@/styles/grid-glow-background.css"

import { cn } from "@/lib/utils"
import type { CSSProperties, HTMLAttributes } from "react"

type GlowBackgroundCustomProperties = {
  "--background-surface": string
  "--background-foreground": string
  "--background-pattern-color": string
  "--background-pattern-opacity": string
  "--background-pattern-horizontal-spacing": string
  "--background-pattern-vertical-spacing": string
  "--background-pattern-offset-x": string
  "--background-pattern-offset-y": string
  "--background-grid-horizontal-line-width": string
  "--background-grid-vertical-line-width": string
  "--background-dot-size": string
  "--background-dot-edge-size": string
  "--background-pattern-mask-width": string
  "--background-pattern-mask-height": string
  "--background-pattern-mask-x": string
  "--background-pattern-mask-y": string
  "--background-pattern-mask-opacity": string
  "--background-pattern-mask-inner-stop": string
  "--background-pattern-mask-outer-stop": string
  "--background-glow-color": string
  "--background-glow-opacity": string
  "--background-glow-width": string
  "--background-glow-height": string
  "--background-glow-x": string
  "--background-glow-y": string
  "--background-glow-inner-stop": string
  "--background-glow-outer-stop": string
}

export type GlowBackgroundStyle = CSSProperties &
  Partial<GlowBackgroundCustomProperties>

export type GlowBackgroundMask = "center" | "edges" | "none"

type GlowBackgroundProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> & {
  className?: string
  pattern: "dots" | "grid"
  patternMask?: GlowBackgroundMask
  style?: GlowBackgroundStyle
}

export default function GlowBackground({
  className,
  pattern,
  patternMask = "none",
  ...props
}: GlowBackgroundProps) {
  return (
    <div
      className={cn(
        "glow-background",
        `glow-background--${pattern}`,
        `glow-background--mask-${patternMask}`,
        className
      )}
      {...props}
    />
  )
}
