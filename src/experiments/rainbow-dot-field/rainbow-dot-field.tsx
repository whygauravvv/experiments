import "./rainbow-dot-field.css"

import { useEffect, useRef } from "react"

export default function RainbowDotField() {
  const fieldRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const field = fieldRef.current

    if (!field || window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    let frame = 0
    let isActive = false
    let bounds = field.getBoundingClientRect()
    let currentX = bounds.width / 2
    let currentY = bounds.height / 2
    let targetX = currentX
    let targetY = currentY

    const setPointerProperties = () => {
      field.style.setProperty("--pointer-x", `${currentX}px`)
      field.style.setProperty("--pointer-y", `${currentY}px`)
    }

    const renderSpotlight = () => {
      if (!isActive) return

      currentX += (targetX - currentX) * 0.14
      currentY += (targetY - currentY) * 0.14
      setPointerProperties()

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        frame = requestAnimationFrame(renderSpotlight)
      }
    }

    const enterField = (event: PointerEvent) => {
      bounds = field.getBoundingClientRect()
      currentX = event.clientX - bounds.left
      currentY = event.clientY - bounds.top
      targetX = currentX
      targetY = currentY
      isActive = true
      setPointerProperties()
      field.dataset.active = "true"
    }

    const updatePointer = (event: PointerEvent) => {
      if (!isActive) return

      targetX = event.clientX - bounds.left
      targetY = event.clientY - bounds.top
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(renderSpotlight)
    }

    const leaveField = () => {
      isActive = false
      cancelAnimationFrame(frame)
      field.dataset.active = "false"
    }

    field.addEventListener("pointerenter", enterField)
    field.addEventListener("pointermove", updatePointer, { passive: true })
    field.addEventListener("pointerleave", leaveField)
    field.addEventListener("pointercancel", leaveField)

    return () => {
      cancelAnimationFrame(frame)
      field.removeEventListener("pointerenter", enterField)
      field.removeEventListener("pointermove", updatePointer)
      field.removeEventListener("pointerleave", leaveField)
      field.removeEventListener("pointercancel", leaveField)
    }
  }, [])

  return (
    <section
      ref={fieldRef}
      className="rainbow-dot-field"
      aria-label="Cursor-reactive rainbow dot field"
    >
      <div className="rainbow-dot-field__layer rainbow-dot-field__base" />
      <div className="rainbow-dot-field__layer rainbow-dot-field__growth rainbow-dot-field__growth--outer" />
      <div className="rainbow-dot-field__layer rainbow-dot-field__growth rainbow-dot-field__growth--middle" />
      <div className="rainbow-dot-field__layer rainbow-dot-field__growth rainbow-dot-field__growth--inner" />
      <div className="rainbow-dot-field__layer rainbow-dot-field__growth rainbow-dot-field__growth--core" />
    </section>
  )
}
