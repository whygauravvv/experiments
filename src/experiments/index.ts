import type { SupportedCodeLanguage } from "@/lib/highlight-code"
import { lazy, type ComponentType, type LazyExoticComponent } from "react"

type RawSourceModule = { default: string }

type ExperimentSourceDefinition = Omit<ExperimentSourceFile, "code"> & {
  load: () => Promise<RawSourceModule>
}

export type ExperimentItem = {
  id: string
  title: string
  description: string
  year: string
  tags: string[]
  loadFiles: () => Promise<ExperimentSourceFile[]>
  url?: string
  Component: LazyExoticComponent<ComponentType>
}

export type ExperimentSourceFile = {
  filename: string
  language: SupportedCodeLanguage
  code: string
}

function loadSourceFiles(definitions: ExperimentSourceDefinition[]) {
  let filesPromise: Promise<ExperimentSourceFile[]> | undefined

  return () => {
    filesPromise ??= Promise.all(
      definitions.map(async ({ load, ...file }) => ({
        ...file,
        code: (await load()).default,
      }))
    )

    return filesPromise
  }
}

const RainbowDotField = lazy(() => import("./rainbow-dot-field"))
const MetricMatrix = lazy(() => import("./metric-matrix"))
const CreateModal = lazy(() => import("./create-modal"))
const IconReveal = lazy(() => import("./icon-reveal"))
const MotionButtonDemo = lazy(() => import("./motion-button"))
const CodexPhone = lazy(() => import("./iphone"))
const CodexAtmosphere = lazy(() => import("./codex-atmosphere"))
const ImessageMenu = lazy(() => import("./imessage-menu"))
const Vestaboard = lazy(() => import("./vestaboard"))

export const experiments: ExperimentItem[] = [
  {
    id: "vestaboard",
    title: "Vestaboard",
    description: "A tactile split-flap display that cycles through messages.",
    year: "2026",
    tags: ["Motion", "Split Flap", "Interaction"],
    loadFiles: loadSourceFiles([
      {
        filename: "vestaboard.tsx",
        language: "tsx",
        load: () => import("./vestaboard.tsx?raw"),
      },
      {
        filename: "vestaboard.css",
        language: "css",
        load: () => import("@/styles/vestaboard.css?raw"),
      },
    ]),
    Component: Vestaboard,
  },
  {
    id: "rainbow-dot-field",
    title: "Rainbow Dot Field",
    description: "A masked spectrum of dots that grows around the cursor.",
    year: "2026",
    tags: ["CSS", "Pointer", "Masking"],
    loadFiles: loadSourceFiles([
      {
        filename: "rainbow-dot-field.tsx",
        language: "tsx",
        load: () => import("./rainbow-dot-field.tsx?raw"),
      },
      {
        filename: "rainbow-dot-field.css",
        language: "css",
        load: () => import("@/styles/rainbow-dot-field.css?raw"),
      },
    ]),
    Component: RainbowDotField,
  },
  {
    id: "metric-matrix",
    title: "Metric Matrix",
    description: "A click-driven metric card with progressive dot transitions.",
    year: "2026",
    tags: ["Data", "Motion", "Interaction"],
    loadFiles: loadSourceFiles([
      {
        filename: "metric-matrix.tsx",
        language: "tsx",
        load: () => import("./metric-matrix.tsx?raw"),
      },
      {
        filename: "metric-matrix.css",
        language: "css",
        load: () => import("@/styles/metric-matrix.css?raw"),
      },
    ]),
    Component: MetricMatrix,
  },
  {
    id: "create-modal",
    title: "Create Modal",
    description: "A compact create button that morphs into an action menu.",
    year: "2026",
    tags: ["Motion", "Menu", "Interaction"],
    loadFiles: loadSourceFiles([
      {
        filename: "create-modal.tsx",
        language: "tsx",
        load: () => import("./create-modal.tsx?raw"),
      },
      {
        filename: "create-modal.css",
        language: "css",
        load: () => import("@/styles/create-modal.css?raw"),
      },
    ]),
    Component: CreateModal,
  },
  {
    id: "icon-reveal",
    title: "Icon Reveal",
    description: "A color reveal made by stacking and clipping two icons.",
    year: "2026",
    tags: ["CSS", "Clip Path", "Interaction"],
    loadFiles: loadSourceFiles([
      {
        filename: "icon-reveal.tsx",
        language: "tsx",
        load: () => import("./icon-reveal.tsx?raw"),
      },
      {
        filename: "icon-reveal.css",
        language: "css",
        load: () => import("@/styles/icon-reveal.css?raw"),
      },
      {
        filename: "grid-glow-background.tsx",
        language: "tsx",
        load: () =>
          import("@/components/backgrounds/grid-glow-background.tsx?raw"),
      },
      {
        filename: "grid-glow-background.css",
        language: "css",
        load: () => import("@/styles/grid-glow-background.css?raw"),
      },
    ]),
    url: "https://x.com/jh3yy/status/2019918728440283481",
    Component: IconReveal,
  },
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description: "Simple Framer Motion hover and tap interaction.",
    year: "2026",
    tags: ["Motion", "React", "Interaction"],
    loadFiles: loadSourceFiles([
      {
        filename: "motion-button.tsx",
        language: "tsx",
        load: () => import("./motion-button.tsx?raw"),
      },
    ]),
    Component: MotionButtonDemo,
  },
  {
    id: "codex-phone",
    title: "Codex Phone",
    description: "Codex atmosphere presented inside an iPhone frame.",
    year: "2026",
    tags: ["Mobile", "Prototype", "Codex"],
    loadFiles: loadSourceFiles([
      {
        filename: "iphone.tsx",
        language: "tsx",
        load: () => import("./iphone.tsx?raw"),
      },
    ]),
    Component: CodexPhone,
  },
  {
    id: "codex-atmosphere",
    title: "Codex Atmosphere",
    description: "Warm video texture with a cursor-reactive ASCII field.",
    year: "2026",
    tags: ["Canvas", "Pointer", "Atmosphere"],
    loadFiles: loadSourceFiles([
      {
        filename: "codex-atmosphere.tsx",
        language: "tsx",
        load: () => import("./codex-atmosphere.tsx?raw"),
      },
      {
        filename: "codex-atmosphere.css",
        language: "css",
        load: () => import("@/styles/codex-atmosphere.css?raw"),
      },
    ]),
    Component: CodexAtmosphere,
  },
  {
    id: "imessage-menu",
    title: "iMessage Menu",
    description: "IOS 18 Imessage Menu Inspired Menu",
    year: "2026",
    tags: [],
    loadFiles: loadSourceFiles([
      {
        filename: "imessage-menu.tsx",
        language: "tsx",
        load: () => import("./imessage-menu.tsx?raw"),
      },
    ]),
    Component: ImessageMenu,
  },
]
