import DotGlowBackground from "@/components/dot-glow-background"
import GridGlowBackground from "@/components/grid-glow-background"
import type { ComponentType, HTMLAttributes, ReactNode } from "react"

interface CardShellProps {
  children: ReactNode
  backgroundVariant?: CardShellBackgroundVariant
}

type CardShellBackgroundVariant = "grid-glow" | "dot-glow"
type BackgroundComponent = ComponentType<HTMLAttributes<HTMLDivElement>>

const backgroundVariants = {
  "grid-glow": GridGlowBackground,
  "dot-glow": DotGlowBackground,
} satisfies Record<CardShellBackgroundVariant, BackgroundComponent>

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
