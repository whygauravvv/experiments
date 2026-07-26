import "./undo-delete-button.css"

import { MOTION_EASE } from "@/lib/motion"
import { Check, RotateCcw } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

const DELETE_DELAY_SECONDS = 10

type DeletePhase = "idle" | "pending" | "deleted"

export default function UndoDeleteButton() {
  const [phase, setPhase] = useState<DeletePhase>("idle")
  const [secondsRemaining, setSecondsRemaining] = useState(DELETE_DELAY_SECONDS)
  const [announcement, setAnnouncement] = useState("")
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (phase !== "pending") return

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((currentSeconds) => {
        if (currentSeconds <= 1) {
          setPhase("deleted")
          setAnnouncement(
            "Item deleted. Activate the button to reset the demo."
          )
          return 0
        }

        return currentSeconds - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [phase])

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: MOTION_EASE }

  const handleClick = () => {
    if (phase === "idle") {
      setSecondsRemaining(DELETE_DELAY_SECONDS)
      setPhase("pending")
      setAnnouncement(
        `Deletion scheduled. ${DELETE_DELAY_SECONDS} seconds to cancel.`
      )
      return
    }

    if (phase === "pending") {
      setPhase("idle")
      setSecondsRemaining(DELETE_DELAY_SECONDS)
      setAnnouncement("Deletion canceled.")
      return
    }

    setPhase("idle")
    setSecondsRemaining(DELETE_DELAY_SECONDS)
    setAnnouncement("Delete button reset.")
  }

  const label =
    phase === "idle" ? "Delete" : phase === "pending" ? "Cancel" : "Deleted"
  const accessibleLabel =
    phase === "idle"
      ? "Delete item"
      : phase === "pending"
        ? `Cancel deletion, ${secondsRemaining} seconds remaining`
        : "Reset delete button demo"

  return (
    <section className="undo-delete" aria-label="Undo delete button experiment">
      <motion.button
        type="button"
        className="undo-delete__button"
        data-phase={phase}
        aria-label={accessibleLabel}
        onClick={handleClick}
        initial={false}
        animate={{
          backgroundColor:
            phase === "idle"
              ? "#ef0d36"
              : phase === "pending"
                ? "#fad0d6"
                : "#e7ebf2",
          color:
            phase === "idle"
              ? "#ffffff"
              : phase === "pending"
                ? "#e90d34"
                : "#687386",
        }}
        transition={transition}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.965, y: 0 }}
      >
        <motion.span
          className="undo-delete__label-viewport"
          aria-hidden="true"
          animate={{ x: phase === "pending" ? 0 : -13 }}
          transition={transition}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={label}
              className="undo-delete__label"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, scale: 0.88, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 1.08, filter: "blur(4px)" }
              }
              transition={transition}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </motion.span>

        <AnimatePresence initial={false} mode="popLayout">
          {phase === "idle" ? (
            <motion.span
              key="trash"
              className="undo-delete__orbit is-trash"
              aria-hidden="true"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: 17, y: -14, scale: 0.65 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 16, y: -14, scale: 0.65 }
              }
              transition={transition}
            >
              <FilledTrashIcon />
            </motion.span>
          ) : null}

          {phase === "pending" ? (
            <motion.span
              key="countdown"
              className="undo-delete__orbit is-countdown"
              aria-hidden="true"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: -16, y: 18, scale: 0.7 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -14, y: 17, scale: 0.68 }
              }
              transition={transition}
            >
              <CountdownDigits
                value={secondsRemaining}
                prefersReducedMotion={prefersReducedMotion}
              />
            </motion.span>
          ) : null}

          {phase === "deleted" ? (
            <motion.span
              key="deleted"
              className="undo-delete__orbit is-deleted"
              aria-hidden="true"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 10, scale: 0.68 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.72 }
              }
              transition={transition}
            >
              <Check className="undo-delete__check" />
              <RotateCcw className="undo-delete__reset" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.button>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </section>
  )
}

function CountdownDigits({
  value,
  prefersReducedMotion,
}: {
  value: number
  prefersReducedMotion: boolean | null
}) {
  const digits = String(value).padStart(2, "0").split("")

  return (
    <span className="undo-delete__digits">
      {digits.map((digit, index) => (
        <span key={index} className="undo-delete__digit-slot">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={digit}
              className="undo-delete__digit"
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: -3,
                      scale: 0.92,
                      filter: "blur(1.5px)",
                    }
              }
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 3,
                      scale: 1.06,
                      filter: "blur(1.5px)",
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.2,
                      delay: index * 0.055,
                      ease: MOTION_EASE,
                    }
              }
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

function FilledTrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.25 3.5h5.5c.5 0 .93.3 1.12.76l.41.99H19a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2h2.72l.41-.99c.19-.46.62-.76 1.12-.76ZM7.06 8.75h9.88l-.61 10.06a1.8 1.8 0 0 1-1.8 1.69H9.47a1.8 1.8 0 0 1-1.8-1.69L7.06 8.75Z"
      />
      <path
        d="M10.25 11.25v6.5M13.75 11.25v6.5"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  )
}
