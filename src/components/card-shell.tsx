import DotGlowBackground from "@/components/backgrounds/dot-glow-background"
import GridGlowBackground from "@/components/backgrounds/grid-glow-background"
import type { ComponentType, HTMLAttributes, ReactNode } from "react"

type BackgroundComponent = ComponentType<HTMLAttributes<HTMLDivElement>>

const backgroundVariants = {
  "grid-glow": GridGlowBackground,
  "dot-glow": DotGlowBackground,
} satisfies Record<string, BackgroundComponent>

export type CardShellBackgroundVariant = keyof typeof backgroundVariants

interface CardShellProps {
  children: ReactNode
  backgroundVariant?: CardShellBackgroundVariant
}

export default function CardShell({
  children,
  backgroundVariant,
}: CardShellProps) {
  if (backgroundVariant) {
    const Background = backgroundVariants[backgroundVariant]

    return (
      <Background className="flex h-full items-center justify-center p-4">
        {children}
      </Background>
    )
  }

  return (
    <div className="flex h-full items-center justify-center p-4">
      {children}
    </div>
  )
}
