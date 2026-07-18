import "@/styles/grid-glow-background.css"

import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type GridGlowBackgroundProps = HTMLAttributes<HTMLDivElement>

export default function GridGlowBackground({
  className,
  ...props
}: GridGlowBackgroundProps) {
  return <div className={cn("grid-glow-background", className)} {...props} />
}
