import ExperimentSource from "@/components/code/experiment-source"
import { experiments } from "@/experiments"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { useEffect, useState } from "react"
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"

const experimentTransitionVariants = {
  enter: (direction: 1 | -1) => ({ opacity: 0, x: direction * 12 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: 1 | -1) => ({ opacity: 0, x: direction * -12 }),
} satisfies Variants

export default function ExperimentDetail({ isOverlay = false }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const experiment = experiments.find((item) => item.id === id)
  const [isBrowsingExperiments, setIsBrowsingExperiments] = useState(false)
  const [navigationDirection, setNavigationDirection] = useState<1 | -1>(1)

  useEffect(() => {
    if (!isOverlay) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") navigate(-1)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isOverlay, navigate])

  if (!experiment) return <Navigate to="/" replace />

  const experimentIndex = experiments.indexOf(experiment)
  const previousExperiment =
    experiments[(experimentIndex - 1 + experiments.length) % experiments.length]
  const nextExperiment = experiments[(experimentIndex + 1) % experiments.length]
  const { Component, description, files, title } = experiment

  const navigateToExperiment = (experimentId: string, direction: 1 | -1) => {
    setNavigationDirection(direction)
    setIsBrowsingExperiments(true)

    requestAnimationFrame(() => {
      navigate(`/experiments/${experimentId}`, {
        replace: true,
        state: location.state,
      })
    })
  }

  return (
    <main className="flex min-h-dvh flex-col gap-6 bg-neutral-50 px-4 pb-6 text-foreground sm:px-6 md:h-dvh md:max-h-dvh md:overflow-hidden">
      <header className="-mx-4 flex items-center justify-between border-b bg-background px-4 py-4 sm:-mx-6 sm:px-6">
        {isOverlay ? (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
        ) : (
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            All experiments
          </Link>
        )}
        <nav
          aria-label="Experiment navigation"
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => navigateToExperiment(previousExperiment.id, -1)}
            aria-label={`Previous experiment: ${previousExperiment.title}`}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => navigateToExperiment(nextExperiment.id, 1)}
            aria-label={`Next experiment: ${nextExperiment.title}`}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      </header>

      <AnimatePresence initial={false} mode="wait" custom={navigationDirection}>
        <motion.div
          key={experiment.id}
          custom={navigationDirection}
          variants={experimentTransitionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 md:min-h-0 md:flex-1 md:grid-cols-2 md:gap-4"
        >
          <motion.section
            layoutId={
              isBrowsingExperiments ? undefined : `experiment-${experiment.id}`
            }
            className="z-50 aspect-square w-full overflow-hidden rounded-lg border border-border/60 bg-card md:h-full md:max-h-full md:w-auto md:max-w-full md:justify-self-center"
          >
            <Component />
          </motion.section>

          <aside className="flex min-w-0 flex-col md:min-h-0 md:overflow-hidden">
            <div className="shrink-0">
              <h1 className="text-[clamp(2.25rem,3.75vw,3rem)] font-semibold tracking-[-0.045em]">
                {title}
              </h1>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>

            <section className="mt-10 flex flex-col md:min-h-0 md:flex-1">
              <h2 className="mb-2 shrink-0 text-sm font-medium">Source</h2>
              <ExperimentSource files={files} />
            </section>
          </aside>
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
