import { BaseUi } from "@/components/ui/svgs/baseUi"
import { Lucide } from "@/components/ui/svgs/lucide"
import { Motion } from "@/components/ui/svgs/motion"
import { ReactLight } from "@/components/ui/svgs/reactLight"
import type { SupportedCodeLanguage } from "@/lib/highlight-code"
import {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
  type SVGProps,
} from "react"

type RawSourceModule = { default: string }

type ExperimentSourceDefinition = {
  filename: string
  load: () => Promise<RawSourceModule>
}

export type ExperimentItem = {
  id: string
  title: string
  description: string
  libraries: ExperimentLibrary[]
  credit?: ExperimentCredit
  loadFiles: () => Promise<ExperimentSourceFile[]>
  Component: LazyExoticComponent<ComponentType>
}

export type ExperimentLibrary = {
  name: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export type ExperimentCredit = {
  name: string
  url: string
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

const LIBRARIES = {
  react: { name: "React", icon: ReactLight },
  motion: { name: "Motion", icon: Motion },
  lucide: { name: "Lucide", icon: Lucide },
  baseUi: { name: "Base UI", icon: BaseUi },
} satisfies Record<string, ExperimentLibrary>

const RainbowDotField = lazy(
  () => import("./rainbow-dot-field/rainbow-dot-field")
)
const AuraComposer = lazy(() => import("./aura-composer/aura-composer"))
const MetricMatrix = lazy(() => import("./metric-matrix/metric-matrix"))
const CreateModal = lazy(() => import("./create-modal/create-modal"))
const IconReveal = lazy(() => import("./icon-reveal/icon-reveal"))
const MotionButtonDemo = lazy(() => import("./motion-button/motion-button"))
const CodexAtmosphere = lazy(
  () => import("./codex-atmosphere/codex-atmosphere")
)
const IMessageMenu = lazy(() => import("./imessage-menu/imessage-menu"))
const Vestaboard = lazy(() => import("./vestaboard/vestaboard"))

export const experiments = defineExperiments([
  {
    id: "aura-composer",
    title: "Aura Composer",
    description: "A floating CTA that blooms into a radiant prompt composer.",
    libraries: [LIBRARIES.react, LIBRARIES.motion, LIBRARIES.lucide],
    loadFiles: loadSourceFiles([
      {
        filename: "aura-composer.tsx",
        load: () => import("./aura-composer/aura-composer.tsx?raw"),
      },
      {
        filename: "aura-composer.css",
        load: () => import("./aura-composer/aura-composer.css?raw"),
      },
    ]),
    Component: AuraComposer,
  },
  {
    id: "vestaboard",
    title: "Vestaboard",
    description: "A tactile split-flap display that cycles through messages.",
    libraries: [LIBRARIES.react],
    credit: {
      name: "Vestaboard",
      url: "https://www.vestaboard.com/",
    },
    loadFiles: loadSourceFiles([
      {
        filename: "vestaboard.tsx",
        load: () => import("./vestaboard/vestaboard.tsx?raw"),
      },
      {
        filename: "vestaboard.css",
        load: () => import("./vestaboard/vestaboard.css?raw"),
      },
    ]),
    Component: Vestaboard,
  },
  {
    id: "rainbow-dot-field",
    title: "Rainbow Dot Field",
    description: "A masked spectrum of dots that grows around the cursor.",
    libraries: [LIBRARIES.react],
    loadFiles: loadSourceFiles([
      {
        filename: "rainbow-dot-field.tsx",
        load: () => import("./rainbow-dot-field/rainbow-dot-field.tsx?raw"),
      },
      {
        filename: "rainbow-dot-field.css",
        load: () => import("./rainbow-dot-field/rainbow-dot-field.css?raw"),
      },
    ]),
    Component: RainbowDotField,
  },
  {
    id: "metric-matrix",
    title: "Metric Matrix",
    description: "A click-driven metric card with progressive dot transitions.",
    libraries: [LIBRARIES.react, LIBRARIES.motion],
    loadFiles: loadSourceFiles([
      {
        filename: "metric-matrix.tsx",
        load: () => import("./metric-matrix/metric-matrix.tsx?raw"),
      },
      {
        filename: "metric-matrix.css",
        load: () => import("./metric-matrix/metric-matrix.css?raw"),
      },
    ]),
    Component: MetricMatrix,
  },
  {
    id: "create-modal",
    title: "Create Modal",
    description: "A compact create button that morphs into an action menu.",
    libraries: [LIBRARIES.react, LIBRARIES.motion, LIBRARIES.lucide],
    loadFiles: loadSourceFiles([
      {
        filename: "create-modal.tsx",
        load: () => import("./create-modal/create-modal.tsx?raw"),
      },
      {
        filename: "create-modal.css",
        load: () => import("./create-modal/create-modal.css?raw"),
      },
    ]),
    Component: CreateModal,
  },
  {
    id: "icon-reveal",
    title: "Icon Reveal",
    description: "A color reveal made by stacking and clipping two icons.",
    libraries: [LIBRARIES.react],
    loadFiles: loadSourceFiles([
      {
        filename: "icon-reveal.tsx",
        load: () => import("./icon-reveal/icon-reveal.tsx?raw"),
      },
      {
        filename: "icon-reveal.css",
        load: () => import("./icon-reveal/icon-reveal.css?raw"),
      },
    ]),
    Component: IconReveal,
  },
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description:
      "A responsive button study exploring hover lift, tactile press feedback, animated label changes, and spring-based state transitions.",
    libraries: [
      LIBRARIES.react,
      LIBRARIES.motion,
      LIBRARIES.baseUi,
      LIBRARIES.lucide,
    ],
    credit: {
      name: "Example Interaction Design Studio",
      url: "https://example.com/",
    },
    loadFiles: loadSourceFiles([
      {
        filename: "motion-button.tsx",
        load: () => import("./motion-button/motion-button.tsx?raw"),
      },
    ]),
    Component: MotionButtonDemo,
  },

  {
    id: "codex-atmosphere",
    title: "Codex Atmosphere",
    description: "Warm video texture with a cursor-reactive ASCII field.",
    libraries: [LIBRARIES.react],
    credit: {
      name: "OpenAI Codex",
      url: "https://openai.com/codex/",
    },
    loadFiles: loadSourceFiles([
      {
        filename: "codex-atmosphere.tsx",
        load: () => import("./codex-atmosphere/codex-atmosphere.tsx?raw"),
      },
      {
        filename: "codex-atmosphere.css",
        load: () => import("./codex-atmosphere/codex-atmosphere.css?raw"),
      },
    ]),
    Component: CodexAtmosphere,
  },
  {
    id: "imessage-menu",
    title: "iMessage Menu",
    description: "An iOS 18-inspired iMessage app menu.",
    libraries: [LIBRARIES.react, LIBRARIES.motion, LIBRARIES.lucide],
    credit: {
      name: "Apple Messages",
      url: "https://www.apple.com/ios/messages/",
    },
    loadFiles: loadSourceFiles([
      {
        filename: "imessage-menu.tsx",
        load: () => import("./imessage-menu/imessage-menu.tsx?raw"),
      },
    ]),
    Component: IMessageMenu,
  },
])
