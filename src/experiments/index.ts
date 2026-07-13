import MotionButtonDemo from "@/experiments/motion-button"
import type { ComponentType } from "react"
import CodexAtmosphere from "./codex-atmosphere"
import MotionButton from "./iphone"

export type ExperimentItem = {
  id: string
  title: string
  description: string
  url?: string
  Component: ComponentType
}

export const experiments: ExperimentItem[] = [
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description: "Simple Framer Motion hover and tap interaction.",
    Component: MotionButtonDemo,
  },
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description: "Simple Framer Motion hover and tap interaction.",
    Component: MotionButton,
  },
  {
    id: "codex-atmosphere",
    title: "Codex Atmosphere",
    description: "Warm video texture with a cursor-reactive ASCII field.",
    Component: CodexAtmosphere,
  },
]
