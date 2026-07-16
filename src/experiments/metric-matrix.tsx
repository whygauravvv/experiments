import "../styles/metric-matrix.css"

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import { useState } from "react"

type Direction = 1 | -1

type MetricState = {
  value: number
  copy: string
  background: string
  foreground: string
  activeDot: string
  inactiveDot: string
  muted: string
  accent: string
}

type CharacterMotion = {
  index: number
  total: number
  direction: Direction
  reduceMotion: boolean
}

const DOT_COUNT = 96
const DOTS = Array.from({ length: DOT_COUNT })

const METRIC_STATES: MetricState[] = [
  {
    value: 24,
    copy: "of adults have no clear monthly budget.",
    background: "#ffffff",
    foreground: "#141414",
    activeDot: "#f36300",
    inactiveDot: "#f0efeb",
    muted: "#4e4b46",
    accent: "#e85f00",
  },
  {
    value: 61,
    copy: "of adults do not know where their money is truly kept.",
    background: "#171717",
    foreground: "#ffffff",
    activeDot: "#ff6700",
    inactiveDot: "#222222",
    muted: "#d0cec9",
    accent: "#e86918",
  },
  {
    value: 87,
    copy: "of people believe they should be saving more money.",
    background: "#f76500",
    foreground: "#ffffff",
    activeDot: "#fffdf8",
    inactiveDot: "#f87d2b",
    muted: "#ffe1ca",
    accent: "#fff0e4",
  },
]

const CHARACTER_VARIANTS = {
  hidden: ({ direction, reduceMotion }: CharacterMotion) =>
    reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: direction === 1 ? 18 : -18,
          filter: "blur(5px)",
        },
  visible: ({ index, reduceMotion }: CharacterMotion) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: reduceMotion ? 0 : index * 0.038,
      duration: reduceMotion ? 0.01 : 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: ({ index, total, direction, reduceMotion }: CharacterMotion) => ({
    opacity: 0,
    y: reduceMotion ? 0 : direction === 1 ? -16 : 16,
    filter: reduceMotion ? "blur(0px)" : "blur(4px)",
    transition: {
      delay: reduceMotion ? 0 : (total - index - 1) * 0.02,
      duration: reduceMotion ? 0.01 : 0.16,
      ease: "easeIn",
    },
  }),
} satisfies Variants

export default function MetricMatrix() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>(1)
  const shouldReduceMotion = Boolean(useReducedMotion())
  const state = METRIC_STATES[activeIndex]
  const nextIndex = (activeIndex + 1) % METRIC_STATES.length
  const nextState = METRIC_STATES[nextIndex]
  const activeDots = state.value

  const advanceMetric = () => {
    setDirection(activeIndex === METRIC_STATES.length - 1 ? -1 : 1)
    setActiveIndex(nextIndex)
  }

  return (
    <section
      className="metric-matrix-demo"
      aria-label="Interactive metric card experiment"
    >
      <motion.button
        type="button"
        className="metric-matrix"
        aria-label={`${state.value} percent. Show ${nextState.value} percent.`}
        onClick={advanceMetric}
        initial={false}
        animate={{
          backgroundColor: state.background,
          color: state.foreground,
        }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
        transition={{
          backgroundColor: {
            duration: shouldReduceMotion ? 0.01 : 0.42,
            ease: [0.16, 1, 0.3, 1],
          },
          color: { duration: shouldReduceMotion ? 0.01 : 0.3 },
          scale: { type: "spring", stiffness: 500, damping: 34 },
        }}
      >
        <span className="metric-matrix__dots" aria-hidden="true">
          {DOTS.map((_, index) => {
            const isActive = index < activeDots

            return (
              <motion.span
                key={index}
                className="metric-matrix__dot"
                initial={false}
                animate={{
                  backgroundColor: isActive
                    ? state.activeDot
                    : state.inactiveDot,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: shouldReduceMotion || !isActive ? 0 : index * 0.0025,
                  duration: shouldReduceMotion ? 0.01 : 0.26,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            )
          })}
        </span>

        <span className="metric-matrix__footer">
          <span className="metric-matrix__value-viewport" aria-hidden="true">
            <AnimatePresence
              initial={false}
              custom={{ direction, shouldReduceMotion }}
            >
              <motion.span
                key={state.value}
                className="metric-matrix__value"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {`${state.value}%`
                  .split("")
                  .map((character, index, characters) => (
                    <motion.span
                      key={`${character}-${index}`}
                      className="metric-matrix__character"
                      custom={{
                        index,
                        total: characters.length,
                        direction,
                        reduceMotion: shouldReduceMotion,
                      }}
                      variants={CHARACTER_VARIANTS}
                    >
                      {character}
                    </motion.span>
                  ))}
              </motion.span>
            </AnimatePresence>
          </span>

          <span className="metric-matrix__copy">
            <span className="metric-matrix__copy-viewport">
              <AnimatePresence initial={false}>
                <motion.span
                  key={state.value}
                  className="metric-matrix__copy-text"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 5, filter: "blur(3px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -5, filter: "blur(3px)" }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ color: state.muted }}
                >
                  {state.copy}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.span
              className="metric-matrix__link"
              animate={{ color: state.accent }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
            >
              learn more n3xt.com
            </motion.span>
          </span>
        </span>
      </motion.button>
    </section>
  )
}
