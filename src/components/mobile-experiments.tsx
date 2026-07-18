import ExperimentLoading, {
  ExperimentReady,
} from "@/components/experiment-loading"
import ExperimentErrorBoundary from "@/components/experiment-error-boundary"
import { getExperimentNavigation } from "@/lib/experiment-navigation"
import { MOTION_EASE } from "@/lib/motion"
import ExperimentDetail from "@/pages/experiment-detail"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { Suspense, useEffect, useState } from "react"
import { Navigate, useMatch, useNavigate } from "react-router-dom"

type Direction = 1 | -1

const experimentVariants = {
  enter: (direction: Direction) => ({
    opacity: 0,
    x: direction * 24,
    filter: "blur(12px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: MOTION_EASE },
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    x: direction * -24,
    filter: "blur(6px)",
    transition: { duration: 0.13, ease: MOTION_EASE },
  }),
} satisfies Variants

const titleVariants = {
  enter: (direction: Direction) => ({
    opacity: 0,
    scale: 0.9,
    x: direction * 24,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.13, ease: MOTION_EASE },
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    scale: 0.9,
    x: direction * -24,
    filter: "blur(4px)",
    transition: { duration: 0.13, ease: MOTION_EASE },
  }),
} satisfies Variants

const floatingControlVariants = {
  enter: { opacity: 0, y: 12, scale: 0.96 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.97,
    transition: { duration: 0.12, ease: MOTION_EASE },
  },
} satisfies Variants

export default function MobileExperiments() {
  const navigate = useNavigate()
  const galleryMatch = useMatch("/")
  const detailMatch = useMatch("/experiments/:id")
  const [direction, setDirection] = useState<Direction>(1)
  const [selectedExperimentId, setSelectedExperimentId] = useState(
    detailMatch?.params.id
  )
  const requestedNavigation = getExperimentNavigation(
    detailMatch?.params.id ?? selectedExperimentId
  )
  const navigation =
    galleryMatch && requestedNavigation.routeIndex === -1
      ? getExperimentNavigation()
      : requestedNavigation
  const { routeIndex, activeExperiment, previousExperiment, nextExperiment } =
    navigation
  const { Component } = activeExperiment

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousOverscroll = document.documentElement.style.overscrollBehavior

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    document.documentElement.style.overscrollBehavior = "none"

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.documentElement.style.overscrollBehavior = previousOverscroll
    }
  }, [])

  if ((!galleryMatch && !detailMatch) || routeIndex === -1) {
    return <Navigate to="/" replace />
  }

  const showExperiment = (experimentId: string, nextDirection: Direction) => {
    setDirection(nextDirection)
    setSelectedExperimentId(experimentId)
  }

  const openExperimentDetail = () => {
    navigate(`/experiments/${activeExperiment.id}`)
  }

  const closeExperimentDetail = () => {
    navigate("/")
  }

  return (
    <main className="fixed inset-0 isolate overflow-hidden overscroll-none text-foreground">
      {detailMatch ? (
        <section className="absolute inset-0 overflow-y-auto overscroll-contain bg-background">
          <ExperimentDetail hideHeader />
        </section>
      ) : (
        <section className="absolute inset-x-0 top-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] grid place-items-center overflow-hidden p-3">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.article
              key={activeExperiment.id}
              custom={direction}
              variants={experimentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-label={activeExperiment.title}
              className="h-full overflow-hidden rounded-xl"
              style={{
                width:
                  "min(100%, calc(100dvh - 7.5rem - env(safe-area-inset-bottom)))",
              }}
            >
              <ExperimentErrorBoundary key={activeExperiment.id}>
                <Suspense fallback={<ExperimentLoading />}>
                  <ExperimentReady>
                    <Component />
                  </ExperimentReady>
                </Suspense>
              </ExperimentErrorBoundary>
            </motion.article>
          </AnimatePresence>
        </section>
      )}

      <div
        className="fixed inset-x-0 z-50 flex justify-center px-3"
        style={{
          bottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          {detailMatch ? (
            <motion.button
              key="back"
              type="button"
              aria-label="Back to experiments"
              onClick={closeExperimentDetail}
              variants={floatingControlVariants}
              initial="enter"
              animate="center"
              exit="exit"
              whileTap={{ scale: 0.94 }}
              className="inline-flex h-14 cursor-pointer items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/40 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="size-4" strokeWidth={2} />
              All experiments
            </motion.button>
          ) : (
            <motion.nav
              key="carousel"
              aria-label="Experiment navigation"
              variants={floatingControlVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid w-full max-w-md grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-1 rounded-[1.4rem] bg-zinc-950 p-2 text-white shadow-2xl"
            >
              <motion.button
                type="button"
                aria-label={`Previous experiment: ${previousExperiment.title}`}
                onClick={() => showExperiment(previousExperiment.id, -1)}
                whileTap={{ scale: 0.92 }}
                className="grid size-12 cursor-pointer place-items-center rounded-[1rem] bg-white/8 text-white/75 transition-colors outline-none hover:bg-white/12 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ChevronLeft className="size-5" strokeWidth={2} />
              </motion.button>

              <motion.button
                type="button"
                aria-label={`View ${activeExperiment.title} details`}
                onClick={openExperimentDetail}
                whileTap={{ scale: 0.97 }}
                className="relative h-12 min-w-0 cursor-pointer overflow-hidden px-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <AnimatePresence initial={false} mode="wait" custom={direction}>
                  <motion.span
                    key={activeExperiment.id}
                    custom={direction}
                    variants={titleVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center truncate px-2 text-sm font-bold text-white"
                  >
                    {activeExperiment.title}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <motion.button
                type="button"
                aria-label={`Next experiment: ${nextExperiment.title}`}
                onClick={() => showExperiment(nextExperiment.id, 1)}
                whileTap={{ scale: 0.92 }}
                className="grid size-12 cursor-pointer place-items-center rounded-[1rem] bg-white/8 text-white/75 transition-colors outline-none hover:bg-white/12 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ChevronRight className="size-5" strokeWidth={2} />
              </motion.button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
