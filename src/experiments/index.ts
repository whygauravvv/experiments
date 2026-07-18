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

const experimentTemplates: ExperimentItem[] = [
  // Vestaboard is intentionally excluded from the gallery for now.
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

const LOAD_TEST_EXPERIMENT_COUNT = 1_000
const LOAD_TEST_HEAVY_RATIO = 0.15
const LOAD_TEST_SHUFFLE_SEED = 0x5f3759df
const HEAVY_EXPERIMENT_IDS = new Set(["codex-phone", "codex-atmosphere"])

function createLoadTestExperiments() {
  const heavyTemplates = experimentTemplates.filter((experiment) =>
    HEAVY_EXPERIMENT_IDS.has(experiment.id)
  )
  const standardTemplates = experimentTemplates.filter(
    (experiment) => !HEAVY_EXPERIMENT_IDS.has(experiment.id)
  )
  const heavyExperimentCount = Math.round(
    LOAD_TEST_EXPERIMENT_COUNT * LOAD_TEST_HEAVY_RATIO
  )
  const standardExperimentCount =
    LOAD_TEST_EXPERIMENT_COUNT - heavyExperimentCount
  const heavyCopies = createExperimentCopies(
    heavyTemplates,
    heavyExperimentCount - heavyTemplates.length,
    1
  )
  const standardCopies = createExperimentCopies(
    standardTemplates,
    standardExperimentCount - standardTemplates.length,
    heavyCopies.length + 1
  )

  return shuffleExperiments([
    ...experimentTemplates,
    ...heavyCopies,
    ...standardCopies,
  ])
}

function createExperimentCopies(
  templates: ExperimentItem[],
  count: number,
  startingCopyNumber: number
) {
  return Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length]
    const copyNumber = startingCopyNumber + index

    return {
      ...template,
      id: `${template.id}-load-test-${copyNumber}`,
      title: `${template.title} · Test ${copyNumber}`,
    }
  })
}

function shuffleExperiments(items: ExperimentItem[]) {
  const shuffledItems = [...items]
  let randomState = LOAD_TEST_SHUFFLE_SEED

  const random = () => {
    randomState = (Math.imul(randomState, 1_664_525) + 1_013_904_223) >>> 0
    return randomState / 4_294_967_296
  }

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffledItems[index], shuffledItems[swapIndex]] = [
      shuffledItems[swapIndex],
      shuffledItems[index],
    ]
  }

  return shuffledItems
}

export const experiments = createLoadTestExperiments()
