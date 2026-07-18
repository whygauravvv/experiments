import "@/styles/grid-glow-background.css"

import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type DotGlowBackgroundProps = HTMLAttributes<HTMLDivElement>

export default function DotGlowBackground({
  className,
  ...props
}: DotGlowBackgroundProps) {
  return (
    <div
      className={cn(
        "grid-glow-background grid-glow-background--dots",
        className
      )}
      {...props}
    />
  )
}
