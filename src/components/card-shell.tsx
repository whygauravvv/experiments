import DotGlowBackground from "@/components/backgrounds/dot-glow-background"
import type { GlowBackgroundStyle } from "@/components/backgrounds/glow-background"
import GridGlowBackground from "@/components/backgrounds/grid-glow-background"
import { cn } from "@/lib/utils"
import type { ComponentType, HTMLAttributes, ReactNode } from "react"

type BackgroundComponent = ComponentType<HTMLAttributes<HTMLDivElement>>

const backgroundVariants = {
  "grid-glow": GridGlowBackground,
  "dot-glow": DotGlowBackground,
} satisfies Record<string, BackgroundComponent>

export type CardShellBackgroundVariant = keyof typeof backgroundVariants

interface CardShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  children: ReactNode
  backgroundVariant?: CardShellBackgroundVariant
  style?: GlowBackgroundStyle
}

export default function CardShell({
  children,
  backgroundVariant,
  className,
  ...props
}: CardShellProps) {
  const shellClassName = cn(
    "flex h-full items-center justify-center p-4",
    className
  )

  if (backgroundVariant) {
    const Background = backgroundVariants[backgroundVariant]

    return (
      <Background className={shellClassName} {...props}>
        {children}
      </Background>
    )
  }

  return (
    <div className={shellClassName} {...props}>
      {children}
    </div>
  )
}
