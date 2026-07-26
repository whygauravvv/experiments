import CardShell from "@/components/card-shell"
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"

import "./curved-city-wheel.css"

const CITIES = [
  "Sao Paulo, Brazil",
  "Auckland, New Zealand",
  "Sydney, Australia",
  "Paris, France",
  "Rome, Italy",
  "Toronto, Canada",
  "Seoul, South Korea",
  "Moscow, Russia",
  "New York, USA",
  "Stockholm, Sweden",
  "Berlin, Germany",
  "Oslo, Norway",
  "Copenhagen, Denmark",
  "London, UK",
  "Madrid, Spain",
  "Helsinki, Finland",
  "Shanghai, China",
  "San Francisco, USA",
  "Tokyo, Japan",
] as const

const INITIAL_CITY_INDEX = 8
const ITEM_GAP = 28
const DRAG_PIXELS_PER_ITEM = 30
const WHEEL_PIXELS_PER_ITEM = 105

type DragState = {
  pointerId: number
  startY: number
  startPosition: number
  lastY: number
  lastTime: number
  velocity: number
}

function wrapIndex(index: number) {
  return ((index % CITIES.length) + CITIES.length) % CITIES.length
}

function getRelativeDistance(index: number, position: number) {
  const halfLength = CITIES.length / 2

  return (
    ((((index - position + halfLength) % CITIES.length) + CITIES.length) %
      CITIES.length) -
    halfLength
  )
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export default function CurvedCityWheel() {
  const position = useMotionValue(INITIAL_CITY_INDEX)
  const prefersReducedMotion = useReducedMotion()
  const listboxId = useId().replaceAll(":", "")
  const animationRef = useRef<{ stop: () => void } | null>(null)
  const wheelTimeoutRef = useRef<number | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(INITIAL_CITY_INDEX)
  const [isDragging, setIsDragging] = useState(false)

  const stopCurrentAnimation = useCallback(() => {
    animationRef.current?.stop()
    animationRef.current = null
  }, [])

  const settleAt = useCallback(
    (rawTarget: number, velocity = 0) => {
      const target = Math.round(rawTarget)

      stopCurrentAnimation()

      if (prefersReducedMotion) {
        position.set(target)
        return
      }

      animationRef.current = animate(position, target, {
        type: "spring",
        stiffness: 260,
        damping: 29,
        mass: 0.72,
        velocity,
        onComplete: () => {
          animationRef.current = null
        },
      })
    },
    [position, prefersReducedMotion, stopCurrentAnimation]
  )

  useMotionValueEvent(position, "change", (latest) => {
    const nextIndex = wrapIndex(Math.round(latest))
    setActiveIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex
    )
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()
      stopCurrentAnimation()

      const modeMultiplier =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? stage.clientHeight
            : 1
      const pixelDelta = event.deltaY * modeMultiplier
      const itemDelta = clamp(pixelDelta / WHEEL_PIXELS_PER_ITEM, -2.25, 2.25)

      position.set(position.get() + itemDelta)

      if (wheelTimeoutRef.current !== null) {
        window.clearTimeout(wheelTimeoutRef.current)
      }

      wheelTimeoutRef.current = window.setTimeout(() => {
        settleAt(position.get())
        wheelTimeoutRef.current = null
      }, 90)
    }

    stage.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      stage.removeEventListener("wheel", handleWheel)
      stopCurrentAnimation()

      if (wheelTimeoutRef.current !== null) {
        window.clearTimeout(wheelTimeoutRef.current)
      }
    }
  }, [position, settleAt, stopCurrentAnimation])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return

    stopCurrentAnimation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startPosition: position.get(),
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
    }
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const elapsedMs = Math.max(event.timeStamp - drag.lastTime, 1)
    const distance = drag.startY - event.clientY
    const instantVelocity =
      ((drag.lastY - event.clientY) / DRAG_PIXELS_PER_ITEM / elapsedMs) * 1000

    drag.velocity = drag.velocity * 0.72 + instantVelocity * 0.28
    drag.lastY = event.clientY
    drag.lastTime = event.timeStamp
    position.set(drag.startPosition + distance / DRAG_PIXELS_PER_ITEM)
  }

  const finishPointerDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    projectVelocity: boolean
  ) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const velocity = projectVelocity ? drag.velocity : 0
    const projectedPosition = position.get() + clamp(velocity * 0.16, -4.5, 4.5)

    dragRef.current = null
    setIsDragging(false)
    settleAt(projectedPosition, velocity)
  }

  const moveBy = (amount: number) => {
    settleAt(Math.round(position.get()) + amount)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyMovements: Record<string, number> = {
      ArrowUp: -1,
      ArrowDown: 1,
      PageUp: -4,
      PageDown: 4,
    }
    const movement = keyMovements[event.key]

    if (movement !== undefined) {
      event.preventDefault()
      moveBy(movement)
      return
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      const currentCycle = Math.floor(position.get() / CITIES.length)
      const cycleStart = currentCycle * CITIES.length

      settleAt(
        event.key === "Home" ? cycleStart : cycleStart + CITIES.length - 1
      )
    }
  }

  return (
    <CardShell
      className="city-wheel-experiment p-0"
      role="region"
      aria-label="Curved city wheel experiment"
    >
      <div
        ref={stageRef}
        className={`city-wheel__stage ${isDragging ? "is-dragging" : ""}`}
        role="listbox"
        aria-label="Choose a city"
        aria-orientation="vertical"
        aria-activedescendant={`${listboxId}-city-${activeIndex}`}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishPointerDrag(event, true)}
        onPointerCancel={(event) => finishPointerDrag(event, false)}
        onKeyDown={handleKeyDown}
      >
        <span className="city-wheel__marker" aria-hidden="true" />

        <div className="city-wheel__items">
          {CITIES.map((city, index) => (
            <CityOption
              key={city}
              id={`${listboxId}-city-${index}`}
              city={city}
              index={index}
              position={position}
              isSelected={index === activeIndex}
            />
          ))}
        </div>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {CITIES[activeIndex]}
      </span>
    </CardShell>
  )
}

type CityOptionProps = {
  id: string
  city: string
  index: number
  position: MotionValue<number>
  isSelected: boolean
}

function CityOption({
  id,
  city,
  index,
  position,
  isSelected,
}: CityOptionProps) {
  const distance = useTransform(position, (latest) =>
    getRelativeDistance(index, latest)
  )
  const x = useTransform(distance, (value) => {
    const absoluteDistance = Math.abs(value)
    const curveOffset = -Math.pow(absoluteDistance, 1.58) * 2.05
    const activeOffset = Math.max(0, 1 - absoluteDistance * 1.6) * 8

    return curveOffset + activeOffset
  })
  const y = useTransform(distance, (value) => value * ITEM_GAP)
  const rotate = useTransform(distance, (value) => value * 1.18)
  const scale = useTransform(distance, (value) =>
    Math.max(0.88, 1 - Math.abs(value) * 0.014)
  )
  const fontSize = useTransform(distance, (value) => {
    const activeScale = Math.max(0, 1 - Math.abs(value) * 1.6)
    return 15 + activeScale * 3.4
  })
  const opacity = useTransform(distance, (value) => {
    const fade = Math.pow(Math.abs(value) / 9.1, 1.72)
    return clamp(1 - fade, 0, 1)
  })
  const filter = useTransform(distance, (value) => {
    const blur = Math.max(0, Math.abs(value) - 6) * 0.32
    return `blur(${blur}px)`
  })

  return (
    <motion.div
      id={id}
      role="option"
      aria-selected={isSelected}
      className={`city-wheel__option ${isSelected ? "is-selected" : ""}`}
      style={{ x, y, rotate, scale, opacity, filter, fontSize }}
    >
      {city}
    </motion.div>
  )
}
