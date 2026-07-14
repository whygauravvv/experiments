import MotionButtonDemo from "@/experiments/motion-button"
import motionButtonSource from "@/experiments/motion-button.tsx?raw"
import type { SupportedCodeLanguage } from "@/lib/highlight-code"
import codexAtmosphereStyles from "@/styles/codex-atmosphere.css?raw"
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
  files: ExperimentSourceFile[]
  url?: string
  Component: ComponentType
}

export type ExperimentSourceFile = {
  filename: string
  language: SupportedCodeLanguage
  code: string
}

export const experiments: ExperimentItem[] = [
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description: "Simple Framer Motion hover and tap interaction.",
    year: "2026",
    tags: ["Motion", "React", "Interaction"],
    files: [
      {
        filename: "motion-button.tsx",
        language: "tsx",
        code: motionButtonSource,
      },
    ],
    Component: MotionButtonDemo,
  },
  {
    id: "codex-phone",
    title: "Codex Phone",
    description: "Codex atmosphere presented inside an iPhone frame.",
    year: "2026",
    tags: ["Mobile", "Prototype", "Codex"],
    files: [
      {
        filename: "iphone.tsx",
        language: "tsx",
        code: iphoneSource,
      },
    ],
    Component: MotionButton,
  },
  {
    id: "codex-atmosphere",
    title: "Codex Atmosphere",
    description: "Warm video texture with a cursor-reactive ASCII field.",
    year: "2026",
    tags: ["Canvas", "Pointer", "Atmosphere"],
    files: [
      {
        filename: "codex-atmosphere.tsx",
        language: "tsx",
        code: codexAtmosphereSource,
      },
      {
        filename: "codex-atmosphere.css",
        language: "css",
        code: codexAtmosphereStyles,
      },
    ],
    Component: CodexAtmosphere,
  },
]
