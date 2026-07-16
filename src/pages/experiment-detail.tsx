import ExperimentSource from "@/components/code/experiment-source"
import { experiments } from "@/experiments"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import { useCallback, useEffect, useState } from "react"
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"

const experimentTransitionVariants = {
  enter: { opacity: 0, filter: "blur(2px)" },
  center: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(2px)" },
} satisfies Variants

const experimentDetailsTransitionVariants = {
  enter: (direction: 1 | -1) => ({ opacity: 0, x: direction * 12 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.12, duration: 0.16, ease: "easeOut" },
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * -12,
    transition: { duration: 0.16, ease: "easeOut" },
  }),
} satisfies Variants

export default function ExperimentDetail({ isOverlay = false }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const experiment = experiments.find((item) => item.id === id)
  const [navigationDirection, setNavigationDirection] = useState<1 | -1>(1)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimateOverlay = isOverlay && !shouldReduceMotion

  const closeDetail = useCallback(() => {
    navigate("/")
  }, [navigate])

  useEffect(() => {
    if (!isOverlay) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDetail()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => {
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [closeDetail, isOverlay])

  if (!experiment) return <Navigate to="/" replace />

  const experimentIndex = experiments.indexOf(experiment)
  const previousExperiment =
    experiments[(experimentIndex - 1 + experiments.length) % experiments.length]
  const nextExperiment = experiments[(experimentIndex + 1) % experiments.length]
  const { Component, description, files, title } = experiment

  const navigateToExperiment = (experimentId: string, direction: 1 | -1) => {
    setNavigationDirection(direction)

    requestAnimationFrame(() => {
      navigate(`/experiments/${experimentId}`, {
        replace: true,
        state: location.state,
      })
    })
  }

  return (
    <main className="flex min-h-dvh flex-col gap-6 bg-transparent px-4 pb-6 text-foreground sm:px-6 md:h-dvh md:max-h-dvh md:overflow-hidden">
      <motion.header
        initial={
          shouldAnimateOverlay
            ? { opacity: 0, y: -32, filter: "blur(6px)" }
            : false
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={
          shouldAnimateOverlay
            ? {
                opacity: 0,
                y: -32,
                filter: "blur(6px)",
                transition: {
                  duration: 0.26,
                  ease: [0.16, 1, 0.3, 1],
                },
              }
            : undefined
        }
        transition={{
          delay: shouldAnimateOverlay ? 0.05 : 0,
          duration: shouldAnimateOverlay ? 0.36 : 0.01,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="-mx-4 flex items-center justify-between border-b bg-background px-4 py-4 sm:-mx-6 sm:px-6"
      >
        {isOverlay ? (
          <button
            type="button"
            onClick={closeDetail}
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
      </motion.header>

      <div className="grid grid-cols-1 gap-6 md:min-h-0 md:flex-1 md:grid-cols-2 md:gap-4">
        <motion.section
          initial={
            shouldAnimateOverlay
              ? { opacity: 0, x: -48, filter: "blur(8px)" }
              : false
          }
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={
            shouldAnimateOverlay
              ? {
                  opacity: 0,
                  x: -48,
                  filter: "blur(8px)",
                  transition: {
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }
              : undefined
          }
          transition={{
            delay: shouldAnimateOverlay ? 0.09 : 0,
            duration: shouldAnimateOverlay ? 0.44 : 0.01,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="z-50 aspect-square w-full overflow-hidden rounded-lg border border-border/60 bg-card md:h-full md:max-h-full md:w-auto md:max-w-full md:justify-self-center"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={experiment.id}
              variants={experimentTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="h-full w-full"
            >
              <Component />
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.div
          initial={
            shouldAnimateOverlay
              ? { opacity: 0, x: 48, filter: "blur(8px)" }
              : false
          }
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={
            shouldAnimateOverlay
              ? {
                  opacity: 0,
                  x: 48,
                  filter: "blur(8px)",
                  transition: {
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }
              : undefined
          }
          transition={{
            delay: shouldAnimateOverlay ? 0.13 : 0,
            duration: shouldAnimateOverlay ? 0.44 : 0.01,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="min-w-0 md:min-h-0"
        >
          <AnimatePresence
            initial={false}
            mode="wait"
            custom={navigationDirection}
          >
            <motion.div
              key={experiment.id}
              custom={navigationDirection}
              variants={experimentDetailsTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="h-full min-w-0 md:min-h-0"
            >
              <aside className="flex h-full min-w-0 flex-col md:min-h-0 md:overflow-hidden">
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
        </motion.div>
      </div>
    </main>
  )
}
