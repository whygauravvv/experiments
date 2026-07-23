import "./aura-composer.css"

import { useEscapeKey } from "@/hooks/use-escape-key"
import { MOTION_EASE } from "@/lib/motion"
import { ArrowUp } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

const PILL_TEXT_Y = -60
const FIELD_TEXT_Y = 20

export default function AuraComposer() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [prompt, setPrompt] = useState("")
  const prefersReducedMotion = useReducedMotion()
  const isOpen = isHovered || isPinned || hasFocus

  const closeComposer = () => {
    setIsHovered(false)
    setIsPinned(false)
    setHasFocus(false)

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  const openAndFocusComposer = () => {
    setIsPinned(true)

    requestAnimationFrame(() => {
      document
        .querySelector<HTMLTextAreaElement>(".aura-composer__prompt")
        ?.focus()
    })
  }

  useEscapeKey(isOpen, closeComposer)

  return (
    <section
      className="aura-composer-demo"
      data-open={isOpen}
      aria-label="Aura floating composer experiment"
    >
      <article className="aura-composer__article cursor-default">
        <p className="selection:bg-orange-500 selection:text-white">
          Ideas rarely arrive fully formed. They begin as fragments: a phrase
          overheard on a walk, a color remembered from somewhere else, a small
          question that keeps returning long after the conversation has ended.
          The useful work is not always to answer those fragments immediately,
          but to give them enough quiet to gather shape. A clear surface can
          make that easier. It leaves room for one thought to meet another
          without asking either of them to become impressive too quickly. The
          more generous the space, the more surprising the connection can be.
          Creative work needs this distance between intention and outcome. It
          needs a pause where familiar material can become strange again, where
          certainty loosens its grip, and where a direction can reveal itself
          without being forced. Instead of filling every silence, let the
          silence do some of the work. Notice what returns, what gathers energy,
          and what asks to be followed. A thoughtful invitation does not
          prescribe the result. It points toward a possibility and then steps
          aside, leaving enough room for the response to bring something new.
          The answer may be smaller, stranger, or more vivid than the original
          plan. Often, that is the moment an idea begins to feel alive. Keep
          following it. Let one observation lead to another, let the rough edges
          remain visible, and resist the urge to resolve the story before it has
          shown you what it wants to become. Give the idea time to change scale.
          What first appears to be a complete direction may only be one detail,
          while the detail that seemed incidental may contain the entire
          character of the work. Return to the material with fresh attention.
          Read it aloud, move it into a different context, or remove the part
          you were most certain about. Each shift creates another way of seeing.
          The goal is not endless possibility, but a clearer sense of what
          belongs. Eventually a rhythm appears. Some choices begin to support
          one another, unnecessary gestures fall away, and the work develops an
          internal logic that feels both inevitable and newly discovered. That
          is when refinement becomes useful. Shape the edges, strengthen the
          relationships, and protect the small irregularities that give the idea
          its voice. Clarity does not require everything to be explained. It
          only requires enough care that another person can enter, look around,
          and find a reason to stay.
        </p>
      </article>

      <div className="aura-composer__wash" aria-hidden="true" />

      <div
        className="aura-composer__cta"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setIsHovered(true)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setIsHovered(false)
        }}
      >
        <AnimatePresence initial={false} mode="sync">
          {isOpen ? (
            <motion.div
              key="composer"
              className="aura-composer__panel"
              initial={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(8px)",
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.1,
                ease: MOTION_EASE,
              }}
            >
              <motion.textarea
                className="aura-composer__prompt cursor-default"
                value={prompt}
                rows={3}
                placeholder="Describe something beautiful"
                aria-label="Aura prompt"
                initial={{
                  x: FIELD_TEXT_Y,
                  opacity: 0,
                  scale: 0.9,
                  filter: "blur(8px)",
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  x: FIELD_TEXT_Y,
                  opacity: 0,
                  scale: 0.9,
                  filter: "blur(7px)",
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.1,
                }}
                onChange={(event) => setPrompt(event.target.value)}
                onFocus={() => {
                  setHasFocus(true)
                  setIsPinned(true)
                }}
                onBlur={() => {
                  setHasFocus(false)
                  if (!isHovered) setIsPinned(false)
                }}
              />
              <AuraMark />
              <button
                type="button"
                className="aura-composer__send"
                aria-label="Send prompt"
              >
                <ArrowUp aria-hidden="true" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              key="trigger"
              className="aura-composer__trigger"
              aria-expanded="false"
              aria-label="Open Aura composer"
              onClick={openAndFocusComposer}
              onFocus={openAndFocusComposer}
              initial={{
                x: PILL_TEXT_Y,
                opacity: 0,
                scale: 0.98,
                filter: "blur(6px)",
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                x: PILL_TEXT_Y,
                opacity: 0,
                scale: 0.98,
                filter: "blur(6px)",
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.17,
              }}
            >
              <span>Create with</span>
              <AuraMark />
              <strong>Aura</strong>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function AuraMark() {
  return (
    <svg
      className="aura-composer__mark"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 1.75c.55 4.62 3.63 7.7 8.25 8.25-4.62.55-7.7 3.63-8.25 8.25C9.45 13.63 6.37 10.55 1.75 10 6.37 9.45 9.45 6.37 10 1.75Z"
        fill="currentColor"
      />
    </svg>
  )
}
