import "./pixel-trail.css"

import { useEffect, useRef } from "react"

type Point = {
  x: number
  y: number
}

type TrailPixel = Point & {
  createdAt: number
}

const PIXEL_SIZE = 8
const PIXEL_SPACING = 14
const TRAIL_DURATION = 700
const PIXEL_STAGGER = 8
const MAX_STAGGER = 120
const MAX_PIXELS = 140

export default function PixelTrail() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    if (!root || !canvas || !context) return

    let pixels: TrailPixel[] = []
    let previousPoint: Point | null = null
    let previousCell: string | null = null
    let frame = 0
    let width = 0
    let height = 0

    const resizeCanvas = () => {
      const bounds = root.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawTrail = (now: number) => {
      context.clearRect(0, 0, width, height)
      pixels = pixels.filter(
        ({ createdAt }) => now - createdAt < TRAIL_DURATION
      )

      for (const pixel of pixels) {
        const age = (now - pixel.createdAt) / TRAIL_DURATION
        const opacity = Math.pow(1 - age, 1.8)
        const red = Math.round(246 - 160 * age)
        const green = Math.round(64 - 46 * age)
        const blue = Math.round(18 - 10 * age)

        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`
        context.fillRect(
          Math.round(pixel.x - PIXEL_SIZE / 2),
          Math.round(pixel.y - PIXEL_SIZE / 2),
          PIXEL_SIZE,
          PIXEL_SIZE
        )
      }

      frame = pixels.length > 0 ? requestAnimationFrame(drawTrail) : 0
    }

    const addPixels = (from: Point, to: Point) => {
      const distance = Math.hypot(to.x - from.x, to.y - from.y)
      const steps = Math.max(1, Math.ceil(distance / PIXEL_SPACING))
      const now = performance.now()

      for (let index = 1; index <= steps; index += 1) {
        const progress = index / steps
        const x =
          Math.round((from.x + (to.x - from.x) * progress) / PIXEL_SIZE) *
          PIXEL_SIZE
        const y =
          Math.round((from.y + (to.y - from.y) * progress) / PIXEL_SIZE) *
          PIXEL_SIZE
        const cell = `${x}:${y}`

        if (cell === previousCell) continue

        pixels.push({
          x,
          y,
          createdAt:
            now - Math.min((steps - index) * PIXEL_STAGGER, MAX_STAGGER),
        })
        previousCell = cell
      }

      if (pixels.length > MAX_PIXELS) {
        pixels.splice(0, pixels.length - MAX_PIXELS)
      }

      if (!frame) frame = requestAnimationFrame(drawTrail)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = root.getBoundingClientRect()
      const point = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }

      addPixels(previousPoint ?? point, point)
      previousPoint = point
    }

    const handleMouseLeave = () => {
      previousPoint = null
      previousCell = null
    }

    resizeCanvas()
    root.addEventListener("mousemove", handleMouseMove)
    root.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", resizeCanvas)

    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener("mousemove", handleMouseMove)
      root.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div ref={rootRef} className="pixel-trail" aria-hidden="true">
      <canvas ref={canvasRef} className="pixel-trail__canvas" />
    </div>
  )
}
