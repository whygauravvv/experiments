import ExperimentSource from "@/components/code/experiment-source"
import ExperimentErrorBoundary from "@/components/experiment-error-boundary"
import ExperimentLoading, {
  ExperimentReady,
} from "@/components/experiment-loading"
import { getExperimentNavigation } from "@/lib/experiment-navigation"
import { MOTION_EASE } from "@/lib/motion"
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { Suspense } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

const experimentTransitionVariants = {
  enter: { opacity: 0, x: -28 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    x: -28,
    transition: { duration: 0.13, ease: MOTION_EASE },
  },
} satisfies Variants

const experimentDetailsTransitionVariants = {
  enter: { opacity: 0, x: 28 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    x: 28,

    transition: { duration: 0.13, ease: MOTION_EASE },
  },
} satisfies Variants

type ExperimentDetailProps = {
  hideHeader?: boolean
  experimentId?: string
}

export default function ExperimentDetail({
  hideHeader = false,
  experimentId,
}: ExperimentDetailProps) {
  const { id: routeExperimentId } = useParams()
  const navigate = useNavigate()
  const {
    routeIndex,
    activeExperiment: experiment,
    previousExperiment,
    nextExperiment,
  } = getExperimentNavigation(experimentId ?? routeExperimentId)

  if (routeIndex === -1) return <Navigate to="/" replace />

  const { Component, credit, description, libraries, loadFiles, title } =
    experiment

  const navigateToExperiment = (experimentId: string) => {
    requestAnimationFrame(() => {
      navigate(`/experiments/${experimentId}`, {
        replace: true,
      })
    })
  }

  return (
    <main
      className={`flex min-h-dvh flex-col gap-6 bg-transparent px-4 text-foreground sm:px-6 md:h-dvh md:max-h-dvh md:overflow-hidden ${
        hideHeader ? "pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))]" : "pb-6"
      }`}
    >
      {hideHeader ? null : (
        <motion.header
          initial={{ opacity: 0, y: -32, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            y: -32,
            filter: "blur(6px)",
            transition: {
              duration: 0.26,
              ease: MOTION_EASE,
            },
          }}
          transition={{
            delay: 0.05,
            duration: 0.36,
            ease: MOTION_EASE,
          }}
          className="-mx-4 flex items-center justify-between border-b bg-background px-4 py-4 sm:-mx-6 sm:px-6"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            All experiments
          </Link>
          <nav
            aria-label="Experiment navigation"
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => navigateToExperiment(previousExperiment.id)}
              aria-label={`Previous experiment: ${previousExperiment.title}`}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => navigateToExperiment(nextExperiment.id)}
              aria-label={`Next experiment: ${nextExperiment.title}`}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        </motion.header>
      )}

      <div className="grid grid-cols-1 gap-6 md:min-h-0 md:flex-1 md:grid-cols-2 md:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -48, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            x: -48,
            filter: "blur(8px)",
            transition: {
              duration: 0.28,
              ease: MOTION_EASE,
            },
          }}
          transition={{
            delay: 0.09,
            duration: 0.44,
            ease: MOTION_EASE,
          }}
          className="z-50 aspect-square w-full md:h-full md:max-h-full md:w-auto md:max-w-full md:justify-self-center"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.section
              key={experiment.id}
              variants={experimentTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="h-full w-full overflow-hidden rounded-lg border border-border/60 bg-card"
            >
              <ExperimentErrorBoundary key={experiment.id}>
                <Suspense fallback={<ExperimentLoading />}>
                  <ExperimentReady>
                    <Component />
                  </ExperimentReady>
                </Suspense>
              </ExperimentErrorBoundary>
            </motion.section>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 48, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            x: 48,
            filter: "blur(8px)",
            transition: {
              duration: 0.28,
              ease: MOTION_EASE,
            },
          }}
          transition={{
            delay: 0.13,
            duration: 0.44,
            ease: MOTION_EASE,
          }}
          className="min-w-0 md:min-h-0"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={experiment.id}
              variants={experimentDetailsTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="h-full min-w-0 md:min-h-0"
            >
              <aside className="flex h-full min-w-0 flex-col font-rounded md:min-h-0 md:overflow-hidden">
                <div className="shrink-0 space-y-6">
                  <div>
                    <h1 className="text-[clamp(2.25rem,3.75vw,3rem)] font-semibold tracking-[-0.045em]">
                      {title}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {credit ? (
                      <div>
                        <p className="pl-1 text-[10px] font-medium tracking-wide text-muted-foreground/50">
                          Inspiration/Source
                        </p>
                        <a
                          href={credit.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-xs px-1 py-1 font-rounded text-sm text-blue-400 duration-150 hover:bg-muted hover:text-foreground"
                        >
                          {credit.name}
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      </div>
                    ) : null}
                    <section className="space-y-2">
                      <p className="pl-1 text-[10px] font-medium tracking-wide text-muted-foreground/50">
                        Libraries Used
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pl-1">
                        {libraries.map(({ icon: LibraryIcon, name }) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-linear-to-t from-white to-muted px-2.5 py-1 font-rounded text-xs font-medium shadow-xs"
                          >
                            <LibraryIcon
                              className="size-3"
                              aria-hidden="true"
                            />
                            {name}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>

                <section className="mt-10 flex flex-col md:min-h-0 md:flex-1">
                  <h2 className="mb-2 shrink-0 text-sm font-medium">Source</h2>
                  <ExperimentSource loadFiles={loadFiles} />
                </section>
              </aside>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
