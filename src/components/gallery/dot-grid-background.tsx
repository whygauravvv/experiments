import { useEffect, useRef } from "react"
import "@/styles/dot-grid.css"

export default function DotGridBackground() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current

    if (
      !grid ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    let frame = 0
    let currentX = window.innerWidth / 2
    let currentY = window.innerHeight * 0.35
    let targetX = currentX
    let targetY = currentY

    const renderSpotlight = () => {
      currentX += (targetX - currentX) * 0.16
      currentY += (targetY - currentY) * 0.16

      grid.style.setProperty("--pointer-x", `${currentX}px`)
      grid.style.setProperty("--pointer-y", `${currentY}px`)

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        frame = requestAnimationFrame(renderSpotlight)
      }
    }

    const updatePointer = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(renderSpotlight)
      grid.dataset.active = "true"
    }

    const hideSpotlight = () => {
      grid.dataset.active = "false"
    }

    window.addEventListener("pointermove", updatePointer, { passive: true })
    document.documentElement.addEventListener("mouseleave", hideSpotlight)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", updatePointer)
      document.documentElement.removeEventListener("mouseleave", hideSpotlight)
    }
  }, [])

  return (
    <div ref={gridRef} className="dot-grid" aria-hidden="true">
      <div className="dot-grid__base" />
      <div className="dot-grid__growth dot-grid__growth--outer" />
      <div className="dot-grid__growth dot-grid__growth--middle" />
      <div className="dot-grid__growth dot-grid__growth--inner" />
      <div className="dot-grid__growth dot-grid__growth--core" />
    </div>
  )
}
