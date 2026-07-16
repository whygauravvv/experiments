import MotionButtonDemo from "@/experiments/motion-button"
import motionButtonSource from "@/experiments/motion-button.tsx?raw"
import type { SupportedCodeLanguage } from "@/lib/highlight-code"
import codexAtmosphereStyles from "@/styles/codex-atmosphere.css?raw"
import createModalStyles from "@/styles/create-modal.css?raw"
import iconRevealStyles from "@/styles/icon-reveal.css?raw"
import metricMatrixStyles from "@/styles/metric-matrix.css?raw"
import type { ComponentType } from "react"
import CodexAtmosphere from "./codex-atmosphere"
import codexAtmosphereSource from "./codex-atmosphere.tsx?raw"
import CreateModal from "./create-modal"
import createModalSource from "./create-modal.tsx?raw"
import IconReveal from "./icon-reveal"
import iconRevealSource from "./icon-reveal.tsx?raw"
import ImessageMenu from "./imessage-menu"
import imessageMenuSource from "./imessage-menu.tsx?raw"
import MotionButton from "./iphone"
import iphoneSource from "./iphone.tsx?raw"
import MetricMatrix from "./metric-matrix"
import metricMatrixSource from "./metric-matrix.tsx?raw"

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
    id: "metric-matrix",
    title: "Metric Matrix",
    description: "A click-driven metric card with progressive dot transitions.",
    year: "2026",
    tags: ["Data", "Motion", "Interaction"],
    files: [
      {
        filename: "metric-matrix.tsx",
        language: "tsx",
        code: metricMatrixSource,
      },
      {
        filename: "metric-matrix.css",
        language: "css",
        code: metricMatrixStyles,
      },
    ],
    Component: MetricMatrix,
  },
  {
    id: "create-modal",
    title: "Create Modal",
    description: "A compact create button that morphs into an action menu.",
    year: "2026",
    tags: ["Motion", "Menu", "Interaction"],
    files: [
      {
        filename: "create-modal.tsx",
        language: "tsx",
        code: createModalSource,
      },
      {
        filename: "create-modal.css",
        language: "css",
        code: createModalStyles,
      },
    ],
    Component: CreateModal,
  },
  {
    id: "icon-reveal",
    title: "Icon Reveal",
    description: "A color reveal made by stacking and clipping two icons.",
    year: "2026",
    tags: ["CSS", "Clip Path", "Interaction"],
    files: [
      {
        filename: "icon-reveal.tsx",
        language: "tsx",
        code: iconRevealSource,
      },
      {
        filename: "icon-reveal.css",
        language: "css",
        code: iconRevealStyles,
      },
    ],
    url: "https://x.com/jh3yy/status/2019918728440283481",
    Component: IconReveal,
  },
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
  {
    id: "imessage-menu",
    title: "iMessage Menu",
    description: "IOS 18 Imessage Menu Inspired Menu",
    year: "2026",
    tags: [],
    files: [
      {
        filename: "imessage-menu.tsx",
        language: "tsx",
        code: imessageMenuSource,
      },
    ],
    Component: ImessageMenu,
  },
]
