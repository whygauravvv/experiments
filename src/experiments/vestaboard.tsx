import "../styles/vestaboard.css"

import { useCallback, useEffect, useRef, useState } from "react"

const COLUMN_COUNT = 14
const ROW_COUNT = 6
const CELL_COUNT = COLUMN_COUNT * ROW_COUNT
const FLIP_INTERVAL = 70
const SETTLE_START = 670
const MAX_DEVICE_PIXEL_RATIO = 1

const CHARACTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const COLORS = [
  "#dc3c37",
  "#e9872a",
  "#e5bd20",
  "#3fa75b",
  "#3268c9",
  "#7145ab",
]
const COLOR_OFFSET = CHARACTERS.length

const MESSAGES = [
  ["", "", "COPY KING", "", "", ""],
  ["", "STAY CURIOUS", "", "KEEP MAKING", "", ""],
  ["", "SMALL IDEAS", "", "BIG ENERGY", "", ""],
  ["", "MAKE", "SOMETHING", "WONDERFUL", "", ""],
] as const
const INITIAL_MESSAGE_INDEX = 1

type BoardRuntime = {
  current: Uint8Array
  previous: Uint8Array
  target: Uint8Array
  settleTimes: Float32Array
  animationFrame: number | undefined
  animationElapsed: number
  cycle: number
  lastStep: number
  width: number
  height: number
  devicePixelRatio: number
  isAnimating: boolean
}

function createBoardRuntime(): BoardRuntime {
  const initialValues = new Uint8Array(CELL_COUNT)
  messageToValues(MESSAGES[INITIAL_MESSAGE_INDEX], initialValues)

  return {
    current: initialValues,
    previous: initialValues.slice(),
    target: initialValues.slice(),
    settleTimes: new Float32Array(CELL_COUNT),
    animationFrame: undefined,
    animationElapsed: 0,
    cycle: 0,
    lastStep: -1,
    width: 0,
    height: 0,
    devicePixelRatio: 1,
    isAnimating: false,
  }
}

function hash(seed: number) {
  let value = seed | 0
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  return (value ^ (value >>> 16)) >>> 0
}

function messageToValues(message: readonly string[], target: Uint8Array) {
  target.fill(0)

  message.forEach((line, row) => {
    const text = line.slice(0, COLUMN_COUNT).toUpperCase()
    const start = Math.floor((COLUMN_COUNT - text.length) / 2)

    for (let column = 0; column < text.length; column += 1) {
      const characterIndex = CHARACTERS.indexOf(text[column])
      target[row * COLUMN_COUNT + start + column] = Math.max(characterIndex, 0)
    }
  })
}

function shuffledValue(index: number, step: number, cycle: number) {
  const value = hash(index * 1013 + step * 7919 + cycle * 104729)

  if (value % 100 < 28) {
    return COLOR_OFFSET + ((value >>> 8) % COLORS.length)
  }

  return 1 + ((value >>> 7) % (CHARACTERS.length - 1))
}

function getSettleTime(index: number, cycle: number) {
  const column = index % COLUMN_COUNT
  const row = Math.floor(index / COLUMN_COUNT)
  const jitter = hash(index * 97 + cycle * 193) % 185

  return SETTLE_START + column * 37 + row * 12 + jitter
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2)

  context.beginPath()
  context.moveTo(x + safeRadius, y)
  context.arcTo(x + width, y, x + width, y + height, safeRadius)
  context.arcTo(x + width, y + height, x, y + height, safeRadius)
  context.arcTo(x, y + height, x, y, safeRadius)
  context.arcTo(x, y, x + width, y, safeRadius)
  context.closePath()
}

function drawValue(
  context: CanvasRenderingContext2D,
  value: number,
  x: number,
  y: number,
  width: number,
  height: number
) {
  context.fillStyle = "#1b181b"
  context.fillRect(x, y, width, height)

  if (value >= COLOR_OFFSET) {
    const glyphWidth = width * 0.62
    const glyphHeight = height * 0.82
    roundedRect(
      context,
      x + (width - glyphWidth) / 2,
      y + (height - glyphHeight) / 2,
      glyphWidth,
      glyphHeight,
      width * 0.1
    )
    context.fillStyle = COLORS[value - COLOR_OFFSET]
    context.fill()
    return
  }

  const character = CHARACTERS[value]
  if (!character || character === " ") return

  context.fillStyle = "#f0f0e9"
  context.font = `700 ${Math.max(7, width * 0.57)}px SFMono-Regular, Consolas, Liberation Mono, monospace`
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(character, x + width / 2, y + height * 0.52)
}

function drawClippedValue(
  context: CanvasRenderingContext2D,
  value: number,
  x: number,
  y: number,
  width: number,
  height: number,
  clipTop: number,
  clipHeight: number
) {
  context.save()
  context.beginPath()
  context.rect(x, clipTop, width, clipHeight)
  context.clip()
  drawValue(context, value, x, y, width, height)
  context.restore()
}

function drawBoard(
  canvas: HTMLCanvasElement,
  runtime: BoardRuntime,
  phase = 1,
  animateFlaps = false
) {
  const context = canvas.getContext("2d")
  if (!context || runtime.width === 0 || runtime.height === 0) return

  const { width, height, devicePixelRatio, current, previous } = runtime
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  context.clearRect(0, 0, width, height)

  const gap = width * 0.0056
  const cellWidth = (width - gap * (COLUMN_COUNT - 1)) / COLUMN_COUNT
  const cellHeight = (height - gap * (ROW_COUNT - 1)) / ROW_COUNT
  const radius = cellWidth * 0.1

  for (let index = 0; index < CELL_COUNT; index += 1) {
    const column = index % COLUMN_COUNT
    const row = Math.floor(index / COLUMN_COUNT)
    const x = column * (cellWidth + gap)
    const y = row * (cellHeight + gap)
    const middle = y + cellHeight / 2
    const animateFlap =
      animateFlaps && runtime.animationElapsed < runtime.settleTimes[index]

    roundedRect(context, x, y, cellWidth, cellHeight, radius)
    context.fillStyle = "#121012"
    context.fill()

    drawClippedValue(
      context,
      current[index],
      x,
      y,
      cellWidth,
      cellHeight,
      y,
      cellHeight / 2
    )
    drawClippedValue(
      context,
      animateFlap ? previous[index] : current[index],
      x,
      y,
      cellWidth,
      cellHeight,
      middle,
      cellHeight / 2
    )

    if (animateFlap && phase < 0.5) {
      const scale = Math.max(0.02, 1 - phase * 2)
      context.save()
      context.beginPath()
      context.rect(x, y, cellWidth, cellHeight / 2)
      context.clip()
      context.translate(0, middle)
      context.scale(1, scale)
      context.translate(0, -middle)
      drawValue(context, previous[index], x, y, cellWidth, cellHeight)
      context.fillStyle = `rgba(0, 0, 0, ${0.1 + phase * 0.55})`
      context.fillRect(x, y, cellWidth, cellHeight)
      context.restore()
    } else if (animateFlap) {
      const scale = Math.max(0.02, (phase - 0.5) * 2)
      context.save()
      context.beginPath()
      context.rect(x, middle, cellWidth, cellHeight / 2)
      context.clip()
      context.translate(0, middle)
      context.scale(1, scale)
      context.translate(0, -middle)
      drawValue(context, current[index], x, y, cellWidth, cellHeight)
      context.fillStyle = `rgba(0, 0, 0, ${Math.max(0, 0.45 - scale * 0.45)})`
      context.fillRect(x, y, cellWidth, cellHeight)
      context.restore()
    }

    context.fillStyle = "rgba(0, 0, 0, 0.9)"
    context.fillRect(
      x,
      middle - Math.max(0.5, width * 0.00045),
      cellWidth,
      Math.max(1, width * 0.0009)
    )
    context.fillStyle = "rgba(255, 255, 255, 0.035)"
    context.fillRect(
      x,
      middle - Math.max(1, width * 0.0009),
      cellWidth,
      Math.max(0.5, width * 0.00035)
    )
  }
}

function resizeCanvas(canvas: HTMLCanvasElement, runtime: BoardRuntime) {
  const bounds = canvas.getBoundingClientRect()
  const devicePixelRatio = Math.min(
    window.devicePixelRatio || 1,
    MAX_DEVICE_PIXEL_RATIO
  )
  const width = Math.max(1, bounds.width)
  const height = Math.max(1, bounds.height)
  const pixelWidth = Math.round(width * devicePixelRatio)
  const pixelHeight = Math.round(height * devicePixelRatio)

  runtime.width = width
  runtime.height = height
  runtime.devicePixelRatio = devicePixelRatio

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }

  drawBoard(canvas, runtime, runtime.isAnimating ? 0 : 1, runtime.isAnimating)
}

export default function Vestaboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<BoardRuntime | null>(null)
  const [messageIndex, setMessageIndex] = useState(INITIAL_MESSAGE_INDEX)
  const [isFlipping, setIsFlipping] = useState(false)

  if (runtimeRef.current === null) {
    runtimeRef.current = createBoardRuntime()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const runtime = runtimeRef.current
    if (!canvas || !runtime) return

    const resizeObserver = new ResizeObserver(() =>
      resizeCanvas(canvas, runtime)
    )
    resizeObserver.observe(canvas)
    resizeCanvas(canvas, runtime)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(
    () => () => {
      const runtime = runtimeRef.current
      if (!runtime) return

      runtime.isAnimating = false
      if (runtime.animationFrame !== undefined) {
        cancelAnimationFrame(runtime.animationFrame)
      }
    },
    []
  )

  const showNextMessage = useCallback(() => {
    const canvas = canvasRef.current
    const runtime = runtimeRef.current
    if (!canvas || !runtime || runtime.isAnimating) return

    const nextMessageIndex = (messageIndex + 1) % MESSAGES.length
    runtime.cycle += 1
    messageToValues(MESSAGES[nextMessageIndex], runtime.target)

    let animationDuration = 0
    for (let index = 0; index < CELL_COUNT; index += 1) {
      const settleTime = getSettleTime(index, runtime.cycle)
      runtime.settleTimes[index] = settleTime
      animationDuration = Math.max(animationDuration, settleTime)
    }
    animationDuration += FLIP_INTERVAL

    runtime.isAnimating = true
    runtime.animationElapsed = 0
    runtime.lastStep = -1
    setIsFlipping(true)
    const startedAt = performance.now()

    const animate = (now: number) => {
      if (!runtime.isAnimating) return

      const elapsed = now - startedAt
      runtime.animationElapsed = elapsed
      const step = Math.floor(elapsed / FLIP_INTERVAL)

      if (step !== runtime.lastStep) {
        runtime.lastStep = step
        runtime.previous.set(runtime.current)

        for (let index = 0; index < CELL_COUNT; index += 1) {
          runtime.current[index] =
            elapsed >= runtime.settleTimes[index]
              ? runtime.target[index]
              : shuffledValue(index, step, runtime.cycle)
        }
      }

      const phase = (elapsed % FLIP_INTERVAL) / FLIP_INTERVAL
      drawBoard(canvas, runtime, phase, true)

      if (elapsed < animationDuration) {
        runtime.animationFrame = requestAnimationFrame(animate)
        return
      }

      runtime.current.set(runtime.target)
      runtime.previous.set(runtime.target)
      runtime.isAnimating = false
      runtime.animationElapsed = 0
      runtime.animationFrame = undefined
      drawBoard(canvas, runtime)
      setMessageIndex(nextMessageIndex)
      setIsFlipping(false)
    }

    runtime.animationFrame = requestAnimationFrame(animate)
  }, [messageIndex])

  const readableMessage = MESSAGES[messageIndex].filter(Boolean).join(". ")

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
          <canvas
            ref={canvasRef}
            className="vestaboard__canvas"
            aria-hidden="true"
          />
        </span>
      </button>

      <p className="sr-only" aria-live="polite">
        {readableMessage}
      </p>
    </section>
  )
}
