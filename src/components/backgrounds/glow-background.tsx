import "@/styles/grid-glow-background.css"

import { cn } from "@/lib/utils"
import type { CSSProperties, HTMLAttributes } from "react"

export type GlowBackgroundStyle = CSSProperties & {
  "--background-surface": string
  "--background-foreground": string
  "--background-pattern-color": string
  "--background-pattern-size": string
  "--background-pattern-mark-size": string
  "--background-pattern-fade-size"?: string
  "--background-glow-color": string
  "--background-glow-size": string
  "--background-glow-inner-stop": string
  "--background-glow-outer-stop": string
}

type GlowBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  pattern: "grid" | "dots"
  style: GlowBackgroundStyle
}

export default function GlowBackground({
  className,
  pattern,
  ...props
}: GlowBackgroundProps) {
  return (
    <div
      className={cn(
        "grid-glow-background",
        pattern === "dots" && "grid-glow-background--dots",
        className
      )}
      {...props}
    />
  )
}
