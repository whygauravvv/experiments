import type { SupportedCodeLanguage } from "@/lib/highlight-code"
import { lazy, type ComponentType, type LazyExoticComponent } from "react"

type RawSourceModule = { default: string }

type ExperimentSourceDefinition = {
  filename: string
  load: () => Promise<RawSourceModule>
}

export type ExperimentItem = {
  id: string
  title: string
  description: string
  loadFiles: () => Promise<ExperimentSourceFile[]>
  Component: LazyExoticComponent<ComponentType>
}

export type ExperimentSourceFile = {
  filename: string
  language: SupportedCodeLanguage
  code: string
}

function loadSourceFiles(definitions: ExperimentSourceDefinition[]) {
  if (
    new Set(definitions.map(({ filename }) => filename)).size !==
    definitions.length
  ) {
    throw new Error("Experiment source filenames must be unique")
  }

  let filesPromise: Promise<ExperimentSourceFile[]> | undefined

  return () => {
    if (!filesPromise) {
      const pendingFiles = Promise.all(
        definitions.map(async ({ load, ...file }) => {
          const language: SupportedCodeLanguage = file.filename.endsWith(".css")
            ? "css"
            : "tsx"

          return {
            ...file,
            language,
            code: (await load()).default,
          } satisfies ExperimentSourceFile
        })
      )

      filesPromise = pendingFiles
      void pendingFiles.catch(() => {
        if (filesPromise === pendingFiles) filesPromise = undefined
      })
    }

    return filesPromise
  }
}

function defineExperiments(items: ExperimentItem[]) {
  if (new Set(items.map(({ id }) => id)).size !== items.length) {
    throw new Error("Experiment ids must be unique")
  }

  return items
}

const RainbowDotField = lazy(() => import("./rainbow-dot-field"))
const AuraComposer = lazy(() => import("./aura-composer"))
const MetricMatrix = lazy(() => import("./metric-matrix"))
const CreateModal = lazy(() => import("./create-modal"))
const IconReveal = lazy(() => import("./icon-reveal"))
const MotionButtonDemo = lazy(() => import("./motion-button"))
const CodexAtmosphere = lazy(() => import("./codex-atmosphere"))
const IMessageMenu = lazy(() => import("./imessage-menu"))
const Vestaboard = lazy(() => import("./vestaboard"))

export const experiments = defineExperiments([
  {
    id: "aura-composer",
    title: "Aura Composer",
    description: "A floating CTA that blooms into a radiant prompt composer.",
    loadFiles: loadSourceFiles([
      {
        filename: "aura-composer.tsx",
        load: () => import("./aura-composer.tsx?raw"),
      },
      {
        filename: "aura-composer.css",
        load: () => import("@/styles/aura-composer.css?raw"),
      },
    ]),
    Component: AuraComposer,
  },
  {
    id: "vestaboard",
    title: "Vestaboard",
    description: "A tactile split-flap display that cycles through messages.",
    loadFiles: loadSourceFiles([
      {
        filename: "vestaboard.tsx",
        load: () => import("./vestaboard.tsx?raw"),
      },
      {
        filename: "vestaboard.css",
        load: () => import("@/styles/vestaboard.css?raw"),
      },
    ]),
    Component: Vestaboard,
  },
  {
    id: "rainbow-dot-field",
    title: "Rainbow Dot Field",
    description: "A masked spectrum of dots that grows around the cursor.",
    loadFiles: loadSourceFiles([
      {
        filename: "rainbow-dot-field.tsx",
        load: () => import("./rainbow-dot-field.tsx?raw"),
      },
      {
        filename: "rainbow-dot-field.css",
        load: () => import("@/styles/rainbow-dot-field.css?raw"),
      },
    ]),
    Component: RainbowDotField,
  },
  {
    id: "metric-matrix",
    title: "Metric Matrix",
    description: "A click-driven metric card with progressive dot transitions.",
    loadFiles: loadSourceFiles([
      {
        filename: "metric-matrix.tsx",
        load: () => import("./metric-matrix.tsx?raw"),
      },
      {
        filename: "metric-matrix.css",
        load: () => import("@/styles/metric-matrix.css?raw"),
      },
    ]),
    Component: MetricMatrix,
  },
  {
    id: "create-modal",
    title: "Create Modal",
    description: "A compact create button that morphs into an action menu.",
    loadFiles: loadSourceFiles([
      {
        filename: "create-modal.tsx",
        load: () => import("./create-modal.tsx?raw"),
      },
      {
        filename: "create-modal.css",
        load: () => import("@/styles/create-modal.css?raw"),
      },
    ]),
    Component: CreateModal,
  },
  {
    id: "icon-reveal",
    title: "Icon Reveal",
    description: "A color reveal made by stacking and clipping two icons.",
    loadFiles: loadSourceFiles([
      {
        filename: "icon-reveal.tsx",
        load: () => import("./icon-reveal.tsx?raw"),
      },
      {
        filename: "icon-reveal.css",
        load: () => import("@/styles/icon-reveal.css?raw"),
      },
      {
        filename: "grid-glow-background.tsx",
        load: () =>
          import("@/components/backgrounds/grid-glow-background.tsx?raw"),
      },
      {
        filename: "glow-background.tsx",
        load: () => import("@/components/backgrounds/glow-background.tsx?raw"),
      },
      {
        filename: "grid-glow-background.css",
        load: () => import("@/styles/grid-glow-background.css?raw"),
      },
    ]),
    Component: IconReveal,
  },
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description: "Simple Framer Motion hover and tap interaction.",
    loadFiles: loadSourceFiles([
      {
        filename: "motion-button.tsx",
        load: () => import("./motion-button.tsx?raw"),
      },
      {
        filename: "card-shell.tsx",
        load: () => import("@/components/card-shell.tsx?raw"),
      },
      {
        filename: "dot-glow-background.tsx",
        load: () =>
          import("@/components/backgrounds/dot-glow-background.tsx?raw"),
      },
      {
        filename: "glow-background.tsx",
        load: () => import("@/components/backgrounds/glow-background.tsx?raw"),
      },
      {
        filename: "grid-glow-background.css",
        load: () => import("@/styles/grid-glow-background.css?raw"),
      },
      {
        filename: "button.tsx",
        load: () => import("@/components/ui/button.tsx?raw"),
      },
    ]),
    Component: MotionButtonDemo,
  },
  
  {
    id: "codex-atmosphere",
    title: "Codex Atmosphere",
    description: "Warm video texture with a cursor-reactive ASCII field.",
    loadFiles: loadSourceFiles([
      {
        filename: "codex-atmosphere.tsx",
        load: () => import("./codex-atmosphere.tsx?raw"),
      },
      {
        filename: "codex-atmosphere.css",
        load: () => import("@/styles/codex-atmosphere.css?raw"),
      },
    ]),
    Component: CodexAtmosphere,
  },
  {
    id: "imessage-menu",
    title: "iMessage Menu",
    description: "An iOS 18-inspired iMessage app menu.",
    loadFiles: loadSourceFiles([
      {
        filename: "imessage-menu.tsx",
        load: () => import("./imessage-menu.tsx?raw"),
      },
      {
        filename: "iphone-mockup.tsx",
        load: () => import("@/components/iphone-mockup.tsx?raw"),
      },
      {
        filename: "card-shell.tsx",
        load: () => import("@/components/card-shell.tsx?raw"),
      },
      {
        filename: "skeleton.tsx",
        load: () => import("@/components/ui/skeleton.tsx?raw"),
      },
    ]),
    Component: IMessageMenu,
  },
])
