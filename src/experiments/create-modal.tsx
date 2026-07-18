import "../styles/create-modal.css"

import { useEscapeKey } from "@/hooks/use-escape-key"
import { MOTION_EASE } from "@/lib/motion"
import {
  CalendarDays,
  Copy,
  Flag,
  Folder,
  Notebook,
  Plus,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

type CreateAction = {
  label: string
  icon: LucideIcon
}

const CREATE_ACTIONS: CreateAction[] = [
  { label: "Project", icon: Folder },
  { label: "Notebook", icon: Notebook },
  { label: "Notes", icon: Copy },
  { label: "Goal", icon: Trophy },
  { label: "Milestone", icon: Flag },
  { label: "Event", icon: CalendarDays },
]

export default function CreateModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEscapeKey(isOpen, () => setIsOpen(false))

  return (
    <section className="create-modal-demo" aria-label="Create menu experiment">
      <motion.div
        className="create-modal"
        data-open={isOpen}
        initial={false}
        animate={{
          width: isOpen ? 304 : 164,
          height: isOpen ? 230 : 48,
          borderRadius: isOpen ? 14 : 24,
        }}
        transition={{
          type: "spring",
          stiffness: 360,
          damping: 34,
          mass: 0.9,
        }}
      >
        <button
          type="button"
          className="create-modal__toggle"
          aria-expanded={isOpen}
          aria-controls="create-modal-actions"
          aria-haspopup="menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>Create new</span>
          <motion.span
            className="create-modal__toggle-icon"
            aria-hidden="true"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            <Plus />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              id="create-modal-actions"
              role="menu"
              aria-label="Create new"
              className="create-modal__content"
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.94,
                filter: "blur(7px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -14,
                scale: 0.95,
                filter: "blur(5px)",
              }}
              transition={{
                delay: 0.055,
                duration: 0.24,
                ease: MOTION_EASE,
              }}
            >
              {CREATE_ACTIONS.map((action) => (
                <CreateActionButton key={action.label} action={action} />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

function CreateActionButton({ action }: { action: CreateAction }) {
  const Icon = action.icon

  return (
    <motion.button
      type="button"
      role="menuitem"
      className="create-modal__action"
      whileTap={{ scale: 0.94 }}
    >
      <Icon aria-hidden="true" />
      <span>{action.label}</span>
    </motion.button>
  )
}
