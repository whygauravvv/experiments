import "../styles/vestaboard.css"

import { useCallback, useEffect, useRef, useState } from "react"

const COLUMN_COUNT = 22
const ROW_COUNT = 6
const CELL_COUNT = COLUMN_COUNT * ROW_COUNT
const FLIP_INTERVAL = 74
const SETTLE_START = 670

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const COLORS = ["red", "orange", "yellow", "green", "blue", "violet"]

const MESSAGES = [
  ["", "", "COPY KING", "", "", ""],
  ["", "STAY CURIOUS", "", "KEEP MAKING", "", ""],
  ["", "SMALL IDEAS", "", "BIG ENERGY", "", ""],
  ["", "MAKE", "SOMETHING", "WONDERFUL", "", ""],
] as const

type FlapColor = (typeof COLORS)[number]

type CellValue = {
  character: string
  color?: FlapColor
  revision: number
}

const EMPTY_CELL: CellValue = { character: "", revision: 0 }

function hash(seed: number) {
  let value = seed | 0
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  return (value ^ (value >>> 16)) >>> 0
}

function messageToCells(message: readonly string[], revision = 0) {
  const cells = Array.from({ length: CELL_COUNT }, (): CellValue => ({
    ...EMPTY_CELL,
    revision,
  }))

  message.forEach((line, row) => {
    const text = line.slice(0, COLUMN_COUNT)
    const start = Math.floor((COLUMN_COUNT - text.length) / 2)

    for (let column = 0; column < text.length; column += 1) {
      cells[row * COLUMN_COUNT + start + column] = {
        character: text[column],
        revision,
      }
    }
  })

  return cells
}

function shuffledCell(index: number, step: number, cycle: number): CellValue {
  const value = hash(index * 1013 + step * 7919 + cycle * 104729)
  const isColor = value % 100 < 28

  if (isColor) {
    return {
      character: "",
      color: COLORS[(value >>> 8) % COLORS.length],
      revision: step,
    }
  }

  return {
    character: CHARACTERS[(value >>> 7) % CHARACTERS.length],
    revision: step,
  }
}

function getSettleTime(index: number, cycle: number) {
  const column = index % COLUMN_COUNT
  const row = Math.floor(index / COLUMN_COUNT)
  const jitter = hash(index * 97 + cycle * 193) % 185

  return SETTLE_START + column * 37 + row * 12 + jitter
}

function FlapFace({ value }: { value: CellValue }) {
  return (
    <span
      className="vestaboard__face-content"
      data-color={value.color}
      aria-hidden="true"
    >
      <span className="vestaboard__glyph">{value.character}</span>
    </span>
  )
}

function FlapCell({
  value,
  oldValue,
}: {
  value: CellValue
  oldValue: CellValue
}) {
  const transitionKey = `${value.revision}-${value.character}-${value.color ?? "dark"}`

  return (
    <span className="vestaboard__cell" aria-hidden="true">
      <span className="vestaboard__face vestaboard__face--top vestaboard__face--new">
        <FlapFace value={value} />
      </span>
      <span className="vestaboard__face vestaboard__face--bottom vestaboard__face--old">
        <FlapFace value={oldValue} />
      </span>

      <span className="vestaboard__moving-faces" key={transitionKey}>
        <span className="vestaboard__face vestaboard__face--top vestaboard__flap--top">
          <FlapFace value={oldValue} />
        </span>
        <span className="vestaboard__face vestaboard__face--bottom vestaboard__flap--bottom">
          <FlapFace value={value} />
        </span>
      </span>
    </span>
  )
}

export default function Vestaboard() {
  const [messageIndex, setMessageIndex] = useState(-1)
  const [board, setBoard] = useState(() => {
    const initialCells = Array.from({ length: CELL_COUNT }, (_, index) =>
      shuffledCell(index, 0, 0)
    )

    return { current: initialCells, previous: initialCells }
  })
  const [isFlipping, setIsFlipping] = useState(false)
  const cycle = useRef(0)
  const frame = useRef<number>(undefined)
  const lastStep = useRef(-1)
  const reducedMotion = useRef(false)

  const showNextMessage = useCallback(() => {
    if (isFlipping) return

    const nextMessageIndex = (messageIndex + 1) % MESSAGES.length

    if (reducedMotion.current) {
      const nextCells = messageToCells(
        MESSAGES[nextMessageIndex],
        cycle.current + 1
      )
      setBoard({ current: nextCells, previous: nextCells })
      setMessageIndex(nextMessageIndex)
      cycle.current += 1
      return
    }

    setIsFlipping(true)
    cycle.current += 1
    lastStep.current = -1

    const currentCycle = cycle.current
    const targetCells = messageToCells(MESSAGES[nextMessageIndex])
    const settleTimes = Array.from({ length: CELL_COUNT }, (_, index) =>
      getSettleTime(index, currentCycle)
    )
    const animationDuration = Math.max(...settleTimes) + FLIP_INTERVAL
    const startedAt = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startedAt
      const step = Math.floor(elapsed / FLIP_INTERVAL)

      if (step !== lastStep.current) {
        lastStep.current = step
        const nextCells = targetCells.map((target, index) =>
          elapsed >= settleTimes[index]
            ? {
                ...target,
                revision: Math.ceil(settleTimes[index] / FLIP_INTERVAL),
              }
            : shuffledCell(index, step, currentCycle)
        )

        setBoard((previousBoard) => ({
          current: nextCells,
          previous: previousBoard.current,
        }))
      }

      if (elapsed < animationDuration) {
        frame.current = requestAnimationFrame(animate)
      } else {
        setMessageIndex(nextMessageIndex)
        setIsFlipping(false)
      }
    }

    frame.current = requestAnimationFrame(animate)
  }, [isFlipping, messageIndex])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotion.current = mediaQuery.matches

    const updateMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches
    }

    mediaQuery.addEventListener("change", updateMotionPreference)
    return () =>
      mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  useEffect(() => {
    if (isFlipping || (reducedMotion.current && messageIndex >= 0)) return

    const timer = window.setTimeout(
      showNextMessage,
      messageIndex < 0 ? 180 : 3000
    )
    return () => window.clearTimeout(timer)
  }, [isFlipping, messageIndex, showNextMessage])

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current ?? 0)
    },
    []
  )

  const readableMessage =
    messageIndex < 0
      ? "Changing message"
      : MESSAGES[messageIndex].filter(Boolean).join(". ")

  return (
    <section className="vestaboard-experiment">
      <button
        type="button"
        className="vestaboard"
        onClick={showNextMessage}
        disabled={isFlipping}
        aria-label={
          isFlipping
            ? "Vestaboard is changing its message"
            : `Vestaboard reads: ${readableMessage}. Show next message`
        }
      >
        <span className="vestaboard__frame">
          <span className="vestaboard__grid">
            {board.current.map((value, index) => (
              <FlapCell
                key={index}
                value={value}
                oldValue={board.previous[index]}
              />
            ))}
          </span>
        </span>
      </button>

      <p className="vestaboard__hint" aria-hidden="true">
        {isFlipping
          ? "Setting the board…"
          : "Press the board for the next message"}
      </p>
      <p className="sr-only" aria-live="polite">
        {!isFlipping && readableMessage}
      </p>
    </section>
  )
}
