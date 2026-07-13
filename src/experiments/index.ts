import MotionButtonDemo from "@/experiments/motion-button"
import motionButtonSource from "@/experiments/motion-button.tsx?raw"
import type { ComponentType } from "react"
import CodexAtmosphere from "./codex-atmosphere"
import codexAtmosphereSource from "./codex-atmosphere.tsx?raw"
import MotionButton from "./iphone"
import iphoneSource from "./iphone.tsx?raw"

export type ExperimentItem = {
  id: string
  title: string
  description: string
  year: string
  tags: string[]
  source: string
  url?: string
  Component: ComponentType
}

export const experiments: ExperimentItem[] = [
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description: "Simple Framer Motion hover and tap interaction.",
    year: "2026",
    tags: ["Motion", "React", "Interaction"],
    source: motionButtonSource,
    Component: MotionButtonDemo,
  },
  {
    id: "codex-phone",
    title: "Codex Phone",
    description: "Codex atmosphere presented inside an iPhone frame.",
    year: "2026",
    tags: ["Mobile", "Prototype", "Codex"],
    source: iphoneSource,
    Component: MotionButton,
  },
  {
    id: "codex-atmosphere",
    title: "Codex Atmosphere",
    description: "Warm video texture with a cursor-reactive ASCII field.",
    year: "2026",
    tags: ["Canvas", "Pointer", "Atmosphere"],
    source: codexAtmosphereSource,
    Component: CodexAtmosphere,
  },
]
