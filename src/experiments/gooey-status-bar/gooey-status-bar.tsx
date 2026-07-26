import "./gooey-status-bar.css"

import { MOTION_EASE } from "@/lib/motion"
import { BatteryMedium, Cloud, Wifi } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react"

type StatusId = "weather" | "wifi" | "battery" | "time"

type StatusItem = {
  id: StatusId
  label: string
  bubbleWidth: number
}

type ActiveStatus = {
  id: StatusId
  center: number
}

const STATUS_ITEMS: StatusItem[] = [
  { id: "weather", label: "Weather", bubbleWidth: 50 },
  { id: "wifi", label: "Wi-Fi", bubbleWidth: 44 },
  { id: "battery", label: "Battery", bubbleWidth: 36 },
  { id: "time", label: "Time", bubbleWidth: 32 },
]

const TOUCH_REVEAL_MS = 1600

const CONTENT_VARIANTS = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 16,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -16,
    filter: "blur(6px)",
  }),
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date)
}

function getStatusDetail(id: StatusId, now: Date) {
  switch (id) {
    case "weather":
      return {
        lead: "Cloudy",
        tail: "24° · New Delhi",
        spoken: "Cloudy, 24 degrees in New Delhi",
      }
    case "wifi":
      return { lead: "WiFi", tail: "Connected", spoken: "Wi-Fi connected" }
    case "battery":
      return {
        lead: "Battery",
        tail: "86% Charged",
        spoken: "Battery 86 percent charged",
      }
    case "time": {
      const time = formatTime(now)
      return {
        lead: formatDate(now),
        tail: time,
        spoken: `${formatDate(now)}, ${time}`,
      }
    }
  }
}

function StatusGlyph({ id }: { id: StatusId }) {
  switch (id) {
    case "weather":
      return <Cloud aria-hidden="true" fill="currentColor" strokeWidth={0} />
    case "wifi":
      return <Wifi aria-hidden="true" strokeWidth={2.2} />
    case "battery":
      return <BatteryMedium aria-hidden="true" strokeWidth={2.15} />
    case "time":
      return (
        <svg
          className="gooey-status-bar__clock"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9.5" fill="currentColor" />
          <path d="M12 6.9v5.25h4.15" />
        </svg>
      )
  }
}

/** A system bar that flows into contextual status details on hover. */
export default function GooeyStatusBar() {
  const prefersReducedMotion = useReducedMotion()
  const [activeStatus, setActiveStatus] = useState<ActiveStatus | null>(null)
  const [contentDirection, setContentDirection] = useState(1)
  const [now, setNow] = useState(() => new Date())
  const barRef = useRef<HTMLDivElement>(null)
  const touchTimerRef = useRef<number | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(
    () => () => {
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current)
      }
    },
    []
  )

  const activeItem =
    STATUS_ITEMS.find((item) => item.id === activeStatus?.id) ?? null
  const activeDetail = activeItem ? getStatusDetail(activeItem.id, now) : null

  const getItemCenter = (target: HTMLButtonElement) => {
    const bar = barRef.current
    if (!bar) return 50

    const barRect = bar.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    return (
      ((targetRect.left + targetRect.width / 2 - barRect.left) /
        barRect.width) *
      100
    )
  }

  const showStatus = (id: StatusId, target: HTMLButtonElement) => {
    const nextCenter = getItemCenter(target)

    if (activeStatus && activeStatus.id !== id) {
      setContentDirection(nextCenter > activeStatus.center ? 1 : -1)
    }

    setActiveStatus({ id, center: nextCenter })
  }

  const revealOnTouch = (id: StatusId, target: HTMLButtonElement) => {
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current)
    }

    showStatus(id, target)
    touchTimerRef.current = window.setTimeout(() => {
      setActiveStatus((current) => (current?.id === id ? null : current))
      touchTimerRef.current = null
    }, TOUCH_REVEAL_MS)
  }

  const handlePointerEnter = (
    event: PointerEvent<HTMLButtonElement>,
    id: StatusId
  ) => {
    if (event.pointerType !== "touch") showStatus(id, event.currentTarget)
  }

  const handleControlsPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setActiveStatus(null)
  }

  const handleControlsBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setActiveStatus(null)
    }
  }

  const handlePointerUp = (
    event: PointerEvent<HTMLButtonElement>,
    id: StatusId
  ) => {
    if (event.pointerType === "touch") {
      revealOnTouch(id, event.currentTarget)
    }
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "Escape") {
      setActiveStatus(null)
      event.currentTarget.blur()
      return
    }

    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return

    event.preventDefault()
    const direction = event.key === "ArrowRight" ? 1 : -1
    const nextIndex =
      (index + direction + STATUS_ITEMS.length) % STATUS_ITEMS.length

    itemRefs.current[nextIndex]?.focus()
  }

  const bubbleTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: MOTION_EASE }

  return (
    <section
      className="gooey-status-bar"
      aria-label="Interactive system status bar"
    >
      <div ref={barRef} className="gooey-status-bar__bar">
        <div
          className="gooey-status-bar__controls"
          role="toolbar"
          aria-label="System status"
          onPointerLeave={handleControlsPointerLeave}
          onBlur={handleControlsBlur}
        >
          {STATUS_ITEMS.map((item, index) => {
            const detail = getStatusDetail(item.id, now)

            return (
              <button
                key={item.id}
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                type="button"
                className="gooey-status-bar__control"
                data-active={activeItem?.id === item.id}
                data-status={item.id}
                aria-label={`${item.label}: ${detail.spoken}`}
                onPointerEnter={(event) => handlePointerEnter(event, item.id)}
                onPointerUp={(event) => handlePointerUp(event, item.id)}
                onFocus={(event) => showStatus(item.id, event.currentTarget)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <StatusGlyph id={item.id} />
                {item.id === "weather" ? (
                  <span className="gooey-status-bar__temperature">24°C</span>
                ) : null}
              </button>
            )
          })}
        </div>

        <AnimatePresence initial={false}>
          {activeItem && activeStatus && activeDetail ? (
            <motion.div
              className="gooey-status-bar__bubble"
              data-status={activeItem.id}
              initial={{ y: -2, scaleY: 0.01 }}
              animate={{
                y: 0,
                scaleY: 1,
                left: `${activeStatus.center}%`,
                width: `${activeItem.bubbleWidth}%`,
              }}
              exit={{ y: -2, scaleY: 0.01 }}
              transition={bubbleTransition}
            >
              <svg
                className="gooey-status-bar__bubble-shape"
                viewBox="0 0 240 56"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 0H240C222 0 218 7 211 24C204 43 193 54 174 56H66C47 54 36 43 29 24C22 7 18 0 0 0Z" />
              </svg>

              <div
                className="gooey-status-bar__detail"
                role="status"
                aria-live="polite"
              >
                <AnimatePresence
                  initial={false}
                  mode="wait"
                  custom={contentDirection}
                >
                  <motion.span
                    key={activeItem.id}
                    className="gooey-status-bar__detail-content"
                    custom={contentDirection}
                    variants={CONTENT_VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.16,
                      ease: MOTION_EASE,
                    }}
                  >
                    {activeItem.id === "weather" ? (
                      <Cloud
                        className="gooey-status-bar__detail-weather-icon"
                        aria-hidden="true"
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    ) : null}
                    <span className="gooey-status-bar__detail-lead">
                      {activeDetail.lead}
                    </span>
                    <span
                      className="gooey-status-bar__detail-separator"
                      aria-hidden="true"
                    />
                    <span className="gooey-status-bar__detail-tail">
                      {activeDetail.tail}
                    </span>
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
