import { experiments } from "@/experiments"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"

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
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    x: direction * -24,
    filter: "blur(6px)",
    transition: { duration: 0.13, ease: [0.16, 1, 0.3, 1] },
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
    transition: { duration: 0.13, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    scale: 0.9,
    x: direction * -24,
    filter: "blur(4px)",
    transition: { duration: 0.13, ease: [0.16, 1, 0.3, 1] },
  }),
} satisfies Variants

export default function MobileExperiments() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [direction, setDirection] = useState<Direction>(1)
  const routeIndex = id
    ? experiments.findIndex((experiment) => experiment.id === id)
    : 0
  const activeIndex = routeIndex === -1 ? 0 : routeIndex
  const activeExperiment = experiments[activeIndex]
  const previousExperiment =
    experiments[(activeIndex - 1 + experiments.length) % experiments.length]
  const nextExperiment = experiments[(activeIndex + 1) % experiments.length]
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

  if (routeIndex === -1) return <Navigate to="/" replace />

  const showExperiment = (experimentId: string, nextDirection: Direction) => {
    setDirection(nextDirection)
    navigate(`/experiments/${experimentId}`, { replace: true })
  }

  return (
    <main className="fixed inset-0 isolate overflow-hidden overscroll-none text-foreground">
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
            <Component />
          </motion.article>
        </AnimatePresence>
      </section>

      <nav
        aria-label="Experiment navigation"
        className="fixed left-1/2 z-50 grid -translate-x-1/2 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-1 rounded-[1.4rem] bg-zinc-950 p-2 text-white shadow-2xl"
        style={{
          bottom: "max(0.75rem, env(safe-area-inset-bottom))",
          width: "min(calc(100% - 1.5rem), 28rem)",
        }}
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

        <div
          className="relative h-12 min-w-0 overflow-hidden px-2 text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.span
              key={activeExperiment.id}
              custom={direction}
              variants={titleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center truncate px-2 text-sm font-bold text-white"
            >
              {activeExperiment.title}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          aria-label={`Next experiment: ${nextExperiment.title}`}
          onClick={() => showExperiment(nextExperiment.id, 1)}
          whileTap={{ scale: 0.92 }}
          className="grid size-12 cursor-pointer place-items-center rounded-[1rem] bg-white/8 text-white/75 transition-colors outline-none hover:bg-white/12 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ChevronRight className="size-5" strokeWidth={2} />
        </motion.button>
      </nav>
    </main>
  )
}
