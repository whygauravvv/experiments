import "./morphing-timer.css"

import CardShell from "@/components/card-shell"
import { useEscapeKey } from "@/hooks/use-escape-key"
import { MOTION_EASE } from "@/lib/motion"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react"

type TimerMode = "idle" | "picking" | "running" | "paused" | "complete"
type InputModality = "keyboard" | "pointer"

const DEFAULT_SECONDS = 20
const MAX_SECONDS = 60
const SECOND_MS = 1000
const PICKER_OFFSETS = [-2, -1, 0, 1, 2] as const
const DRAG_STEP_PX = 24
const COMPLETION_HOLD_MS = 450

const CONTENT_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(6px)",
  },
} satisfies Variants

const PICKER_VARIANTS = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * 32,
    filter: "blur(3px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -32,
    filter: "blur(3px)",
  }),
} satisfies Variants

function wrapSecond(value: number) {
  return ((((value - 1) % MAX_SECONDS) + MAX_SECONDS) % MAX_SECONDS) + 1
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/** A compact control that morphs between a seconds picker and live timer. */
export default function MorphingTimer() {
  const prefersReducedMotion = useReducedMotion()
  const [mode, setMode] = useState<TimerMode>("idle")
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS)
  const [pickerDirection, setPickerDirection] = useState(1)
  const [totalMs, setTotalMs] = useState(DEFAULT_SECONDS * SECOND_MS)
  const [remainingMs, setRemainingMs] = useState(DEFAULT_SECONDS * SECOND_MS)
  const [announcement, setAnnouncement] = useState("Timer ready")

  const deadlineRef = useRef<number | null>(null)
  const dragRef = useRef<{ pointerId: number; y: number } | null>(null)
  const wheelTimeRef = useRef(0)
  const lastInputModalityRef = useRef<InputModality>("pointer")
  const idleButtonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const pauseButtonRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const completionTimeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current)
      }
    },
    []
  )

  const changeSeconds = useCallback((delta: number) => {
    if (delta === 0) return

    setPickerDirection(delta > 0 ? 1 : -1)
    setSeconds((current) => wrapSecond(current + delta))
  }, [])

  const closePicker = useCallback(() => {
    setMode("idle")
    setAnnouncement("Timer picker closed")
  }, [])

  useEscapeKey(mode === "picking", closePicker)

  useEffect(() => {
    const stage = stageRef.current
    if (mode !== "picking" || !stage) return

    const preventPageScroll = (event: WheelEvent) => {
      event.preventDefault()
    }

    stage.addEventListener("wheel", preventPageScroll, { passive: false })

    return () => stage.removeEventListener("wheel", preventPageScroll)
  }, [mode])

  useEffect(() => {
    if (mode !== "running") return

    const updateRemainingTime = () => {
      if (deadlineRef.current === null) return

      const nextRemainingMs = Math.max(
        0,
        deadlineRef.current - performance.now()
      )

      setRemainingMs(nextRemainingMs)

      if (nextRemainingMs === 0) {
        deadlineRef.current = null
        setMode("complete")
        setAnnouncement("Timer complete")

        completionTimeoutRef.current = window.setTimeout(
          () => {
            const duration = seconds * SECOND_MS

            setMode("idle")
            setTotalMs(duration)
            setRemainingMs(duration)
            completionTimeoutRef.current = null
          },
          prefersReducedMotion ? 0 : COMPLETION_HOLD_MS
        )
      }
    }

    updateRemainingTime()
    const interval = window.setInterval(updateRemainingTime, 100)

    return () => window.clearInterval(interval)
  }, [mode, prefersReducedMotion, seconds])

  useEffect(() => {
    if (lastInputModalityRef.current !== "keyboard") return

    const frame = requestAnimationFrame(() => {
      if (mode === "idle") idleButtonRef.current?.focus()
      if (mode === "picking") startButtonRef.current?.focus()
      if (mode === "running") pauseButtonRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [mode])

  useLayoutEffect(() => {
    const galleryCard = stageRef.current?.closest<HTMLElement>("article.group")
    if (!galleryCard) return

    const startedAt = performance.now()
    let frame = 0

    const keepPreviewAligned = () => {
      galleryCard.scrollTop = 0

      if (performance.now() - startedAt < 500) {
        frame = requestAnimationFrame(keepPreviewAligned)
      }
    }

    keepPreviewAligned()

    return () => cancelAnimationFrame(frame)
  }, [mode])

  const startTimer = () => {
    const duration = seconds * SECOND_MS

    setTotalMs(duration)
    setRemainingMs(duration)
    deadlineRef.current = performance.now() + duration
    setMode("running")
    setAnnouncement(
      `Timer started for ${seconds} ${seconds === 1 ? "second" : "seconds"}`
    )
  }

  const pauseTimer = () => {
    if (deadlineRef.current === null) return

    const nextRemainingMs = Math.max(0, deadlineRef.current - performance.now())

    deadlineRef.current = null
    setRemainingMs(nextRemainingMs)
    setMode("paused")
    setAnnouncement(`Timer paused at ${formatTime(nextRemainingMs)}`)
  }

  const resumeTimer = () => {
    deadlineRef.current = performance.now() + remainingMs
    setMode("running")
    setAnnouncement("Timer resumed")
  }

  const cancelTimer = () => {
    const duration = seconds * SECOND_MS

    deadlineRef.current = null
    setTotalMs(duration)
    setRemainingMs(duration)
    setMode("idle")
    setAnnouncement("Timer cancelled")
  }

  const handlePickerWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault()

    const now = performance.now()
    if (now - wheelTimeRef.current < 70 || Math.abs(event.deltaY) < 1) return

    wheelTimeRef.current = now
    changeSeconds(event.deltaY > 0 ? 1 : -1)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { pointerId: event.pointerId, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const distance = drag.y - event.clientY
    const steps = Math.trunc(distance / DRAG_STEP_PX)

    if (steps === 0) return

    changeSeconds(steps)
    drag.y -= steps * DRAG_STEP_PX
  }

  const endPointerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return

    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const progress = totalMs === 0 ? 0 : remainingMs / totalMs
  const isTimerVisible =
    mode === "running" || mode === "paused" || mode === "complete"
  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: MOTION_EASE }
  const shellTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 440, damping: 38, mass: 0.82 }

  return (
    <CardShell
      className="morphing-timer"
      role="region"
      aria-label="Morphing timer experiment"
      onPointerDownCapture={(event) => {
        lastInputModalityRef.current = "pointer"

        if (
          mode === "picking" &&
          shellRef.current &&
          !shellRef.current.contains(event.target as Node)
        ) {
          closePicker()
        }
      }}
      onKeyDownCapture={() => {
        lastInputModalityRef.current = "keyboard"
      }}
    >
      <div ref={stageRef} className="morphing-timer__stage">
        <motion.div
          ref={shellRef}
          layout
          initial={false}
          transition={shellTransition}
          className={`morphing-timer__shell ${
            mode === "picking"
              ? "is-picker"
              : isTimerVisible
                ? "is-running"
                : "is-idle"
          }`}
        >
          <AnimatePresence initial={false} mode="wait">
            {mode === "idle" ? (
              <motion.button
                ref={idleButtonRef}
                key="idle"
                layout
                type="button"
                className="morphing-timer__idle-button morphing-timer__layer"
                aria-label="Set a timer"
                onClick={(event) => {
                  event.currentTarget.blur()
                  setMode("picking")
                  setAnnouncement("Choose a timer duration")
                }}
                variants={CONTENT_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={contentTransition}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              >
                <StopwatchIcon />
                <span>Set timer</span>
              </motion.button>
            ) : null}

            {mode === "picking" ? (
              <motion.div
                key="picker"
                layout
                className="morphing-timer__picker morphing-timer__layer"
                variants={CONTENT_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={contentTransition}
              >
                <div
                  ref={pickerRef}
                  className="morphing-timer__second-input"
                  onWheel={handlePickerWheel}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endPointerDrag}
                  onPointerCancel={endPointerDrag}
                >
                  <AnimatePresence
                    initial={false}
                    custom={pickerDirection}
                    mode="sync"
                  >
                    <motion.div
                      key={seconds}
                      aria-hidden="true"
                      className="morphing-timer__second-values"
                      custom={pickerDirection}
                      variants={PICKER_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 520,
                              damping: 42,
                              mass: 0.72,
                            }
                      }
                    >
                      {PICKER_OFFSETS.map((offset) => {
                        const value = wrapSecond(seconds + offset)
                        const isSelected = offset === 0

                        return (
                          <span
                            key={value}
                            className={
                              isSelected
                                ? "morphing-timer__second is-selected"
                                : "morphing-timer__second"
                            }
                          >
                            {value}
                          </span>
                        )
                      })}
                    </motion.div>
                  </AnimatePresence>

                  <span
                    aria-hidden="true"
                    className="morphing-timer__second-unit"
                  >
                    seconds
                  </span>
                </div>

                <motion.button
                  ref={startButtonRef}
                  type="button"
                  className="morphing-timer__start-button"
                  aria-label={`Start a ${seconds}-second timer`}
                  onClick={(event) => {
                    event.currentTarget.blur()
                    startTimer()
                  }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.93 }}
                >
                  Start
                </motion.button>
              </motion.div>
            ) : null}

            {isTimerVisible ? (
              <motion.div
                key="timer"
                layout
                className={`morphing-timer__timer morphing-timer__layer ${
                  mode === "complete" ? "is-complete" : ""
                }`}
                variants={CONTENT_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={contentTransition}
              >
                <svg
                  className="morphing-timer__progress"
                  viewBox="0 0 324 150"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M162 7 H287 A30 30 0 0 1 317 37 V113 A30 30 0 0 1 287 143 H37 A30 30 0 0 1 7 113 V37 A30 30 0 0 1 37 7 H162"
                    pathLength={1}
                    initial={false}
                    animate={{
                      pathLength: progress,
                      opacity: mode === "complete" ? 0 : 1,
                    }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            pathLength: { duration: 0.14, ease: "linear" },
                            opacity: { duration: 0.1 },
                          }
                    }
                  />
                </svg>

                <motion.button
                  ref={pauseButtonRef}
                  type="button"
                  className="morphing-timer__timer-button is-pause"
                  disabled={mode === "complete"}
                  onClick={mode === "paused" ? resumeTimer : pauseTimer}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={mode === "paused" ? "resume" : "pause"}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 4 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={contentTransition}
                    >
                      {mode === "paused" ? "Resume" : "Pause"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <span
                  className="morphing-timer__time"
                  role="timer"
                  aria-live="off"
                  aria-label={`${formatTime(remainingMs)} remaining`}
                >
                  {formatTime(remainingMs)}
                </span>

                <motion.button
                  type="button"
                  className="morphing-timer__timer-button is-cancel"
                  disabled={mode === "complete"}
                  onClick={(event) => {
                    event.currentTarget.blur()
                    cancelTimer()
                  }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </CardShell>
  )
}

function StopwatchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="morphing-timer__stopwatch"
      viewBox="0 0 32 32"
    >
      <path
        d="M12 3.75h8M16 3.75v3.2M24.25 7.25l2.2 2.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.8"
      />
      <circle cx="16" cy="18" r="10.25" fill="#666765" />
      <path
        d="M16 12.25V18l4 3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  )
}
