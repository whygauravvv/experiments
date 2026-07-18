import { useEffect, useRef, useState } from "react"

import "@/styles/codex-atmosphere.css"

const BACKGROUND_VIDEO = "https://cdn.openai.com/ctf-cdn/floral_a.mp4"
const CODEX_MARK_VIDEO =
  "https://cdn.openai.com/cap/76B4ISvLjfcSygxIvoMqyl/7d037d99808d419313b42980eb181ecg.mp4"

export default function CodexAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundVideoRef = useRef<HTMLVideoElement>(null)
  const markVideoRef = useRef<HTMLVideoElement>(null)
  const [markVideoFailed, setMarkVideoFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    if (!container || !canvas || !context) return

    const glyphs = [" ", ".", ":", "+", "*", "o", "O", "#"]
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const videos = [backgroundVideoRef.current, markVideoRef.current]
    let width = 0
    let height = 0
    let frame = 0
    let isIntersecting = true
    let isRunning = false

    const resize = () => {
      const bounds = container.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      pointer.x ||= width / 2
      pointer.y ||= height / 2
      pointer.targetX ||= width / 2
      pointer.targetY ||= height / 2
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.font = `${width < 500 ? 10 : 12}px Menlo, Monaco, monospace`
    }

    const updatePointer = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect()
      pointer.targetX = event.clientX - bounds.left
      pointer.targetY = event.clientY - bounds.top
    }

    const resetPointer = () => {
      pointer.targetX = width / 2
      pointer.targetY = height / 2
    }

    const render = (time: number) => {
      frame = 0
      if (!isRunning) return

      pointer.x += (pointer.targetX - pointer.x) * 0.08
      pointer.y += (pointer.targetY - pointer.y) * 0.08
      context.clearRect(0, 0, width, height)

      const spacing = width < 500 ? 15 : 19
      const columns = Math.ceil(width / spacing)
      const rows = Math.ceil(height / spacing)
      const radius = Math.min(width, height) * 0.3
      const tick = time * 0.0012

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const baseX = column * spacing + (row % 2) * 4
          const baseY = row * spacing + 8
          const dx = pointer.x - baseX
          const dy = pointer.y - baseY
          const distance = Math.hypot(dx, dy)
          const influence = Math.max(0, 1 - distance / radius)
          const wave =
            Math.sin(baseX * 0.018 + tick + row * 0.14) +
            Math.cos(baseY * 0.015 - tick * 0.9 + column * 0.11)
          const intensity = (wave + 2) / 4 + influence * 0.9
          const glyphIndex = Math.min(
            glyphs.length - 1,
            Math.max(0, Math.floor(intensity * (glyphs.length - 1)))
          )

          if (glyphIndex === 0 && influence < 0.06) continue

          const driftX = Math.sin(tick + row * 0.37 + column * 0.13) * 1.3
          const driftY = Math.cos(tick * 1.1 - row * 0.18 + column * 0.17) * 1.1
          const pullX = distance > 0 ? (dx / distance) * influence * 7 : 0
          const pullY = distance > 0 ? (dy / distance) * influence * 7 : 0

          context.fillStyle =
            influence > 0.18
              ? "rgba(98, 112, 210, 0.34)"
              : "rgba(84, 90, 150, 0.18)"
          context.globalAlpha = Math.min(
            0.62,
            0.08 + influence * 0.46 + glyphIndex * 0.04
          )
          context.fillText(
            glyphs[glyphIndex],
            baseX + driftX + pullX,
            baseY + driftY + pullY
          )
        }
      }

      context.globalAlpha = 1
      frame = requestAnimationFrame(render)
    }

    const syncActivity = () => {
      const shouldRun = isIntersecting && !document.hidden
      if (shouldRun === isRunning) return

      isRunning = shouldRun

      if (isRunning) {
        videos.forEach((video) => {
          if (video) void video.play().catch(() => undefined)
        })
        frame ||= requestAnimationFrame(render)
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        videos.forEach((video) => video?.pause())
      }
    }

    const visibilityObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              isIntersecting = entry?.isIntersecting ?? true
              syncActivity()
            },
            { threshold: 0.01 }
          )

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    visibilityObserver?.observe(container)
    document.addEventListener("visibilitychange", syncActivity)
    container.addEventListener("pointermove", updatePointer, { passive: true })
    container.addEventListener("pointerleave", resetPointer, { passive: true })
    resize()
    syncActivity()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver?.disconnect()
      document.removeEventListener("visibilitychange", syncActivity)
      container.removeEventListener("pointermove", updatePointer)
      container.removeEventListener("pointerleave", resetPointer)
      videos.forEach((video) => video?.pause())
    }
  }, [])

  return (
    <div ref={containerRef} className="codex-atmosphere">
      <video
        ref={backgroundVideoRef}
        className="codex-atmosphere__background"
        src={BACKGROUND_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onError={(event) => {
          event.currentTarget.hidden = true
        }}
      />
      <div className="codex-atmosphere__wash" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="codex-atmosphere__ascii"
        aria-hidden="true"
      />

      <div className="codex-atmosphere__content">
        <div className="codex-atmosphere__mark" aria-label="Codex">
          {markVideoFailed ? (
            <span
              className="codex-atmosphere__mark-fallback"
              aria-hidden="true"
            >
              C
            </span>
          ) : (
            <video
              ref={markVideoRef}
              src={CODEX_MARK_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onError={() => setMarkVideoFailed(true)}
            />
          )}
        </div>
        <p>A small idea, built with Codex.</p>
      </div>
    </div>
  )
}
