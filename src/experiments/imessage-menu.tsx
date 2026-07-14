import CardShell from "@/components/card-shell"
import IphoneMockup from "@/components/iphone-mockup"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Camera,
  CircleCheck,
  Heart,
  Images,
  MapPin,
  Plus,
  Sticker,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

type MenuItem = {
  label: string
  icon: LucideIcon
  iconClassName: string
  iconBackground: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Photos",
    icon: Images,
    iconClassName: "text-blue-600",
    iconBackground: "bg-blue-50",
  },
  {
    label: "Camera",
    icon: Camera,
    iconClassName: "text-orange-600",
    iconBackground: "bg-orange-50",
  },
  {
    label: "Location",
    icon: MapPin,
    iconClassName: "text-emerald-600",
    iconBackground: "bg-emerald-50",
  },
  {
    label: "Check In",
    icon: CircleCheck,
    iconClassName: "text-yellow-600",
    iconBackground: "bg-yellow-50",
  },
  {
    label: "Stickers",
    icon: Sticker,
    iconClassName: "text-pink-600",
    iconBackground: "bg-pink-50",
  },
  {
    label: "Digital Touch",
    icon: Heart,
    iconClassName: "text-sky-600",
    iconBackground: "bg-sky-50",
  },
]

export default function ImessageMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isMenuOpen])

  return (
    <CardShell>
      <IphoneMockup contentClassName="bg-[#f4f5f7] [container-type:inline-size]">
        <MessageCanvas />

        <div className="absolute bottom-[3.5%] left-[5%] z-30">
          <MenuToggle
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          />
        </div>

        <AnimatePresence initial={false}>
          {isMenuOpen ? (
            <MessageMenuOverlay onDismiss={() => setIsMenuOpen(false)} />
          ) : null}
        </AnimatePresence>
      </IphoneMockup>
    </CardShell>
  )
}

function MessageCanvas() {
  return (
    <section
      aria-hidden="true"
      className="grid h-full w-full grid-rows-[48%_1fr] gap-[3%] px-[5%] pt-[17%]"
    >
      <Skeleton className="h-full w-full bg-zinc-300/60" />

      <div className="grid min-h-0 grid-cols-2 gap-[4%]">
        <Skeleton className="aspect-square w-full bg-zinc-300/60" />
        <Skeleton className="aspect-square w-full bg-zinc-300/60" />
      </div>
    </section>
  )
}

function MessageMenuOverlay({ onDismiss }: { onDismiss: () => void }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.24 }}
    >
      <motion.button
        type="button"
        aria-label="Close iMessage menu"
        className="absolute inset-0 cursor-default bg-white"
        onClick={onDismiss}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.28 }}
      />

      <div className="pointer-events-none relative flex h-full w-full items-end pr-[5%] pb-[22%] pl-[3%]">
        <motion.div
          id="imessage-app-menu"
          role="menu"
          aria-label="iMessage apps"
          className="pointer-events-auto w-full overflow-hidden rounded-[8%] bg-white/36 py-[2%] shadow-[0_1px_0_rgba(255,255,255,0.75)_inset]"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: "4%", scale: 0.96, filter: "blur(8px)" }
          }
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: "3%", scale: 0.975, filter: "blur(5px)" }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.01 }
              : { type: "spring", stiffness: 410, damping: 34, mass: 0.82 }
          }
        >
          {MENU_ITEMS.map((item, index) => (
            <MessageMenuItem
              key={item.label}
              item={item}
              index={index}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

function MessageMenuItem({
  item,
  index,
  shouldReduceMotion,
}: {
  item: MenuItem
  index: number
  shouldReduceMotion: boolean | null
}) {
  const Icon = item.icon

  return (
    <motion.button
      type="button"
      role="menuitem"
      className="flex w-full items-center gap-[4%] px-[3%] py-[2.6%]"
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 12, scale: 0.97, filter: "blur(5px)" }
      }
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{
        delay: shouldReduceMotion
          ? 0
          : 0.035 + (MENU_ITEMS.length - 1 - index) * 0.045,
        duration: shouldReduceMotion ? 0.01 : 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
    >
      <span
        className={`flex aspect-square w-[15cqw] shrink-0 items-center justify-center rounded-full ${item.iconBackground}`}
      >
        <Icon
          aria-hidden="true"
          strokeWidth={2.15}
          className={`h-auto w-[50%] ${item.iconClassName}`}
        />
      </span>
      <span className="font-rounded text-[clamp(0.72rem,3.3cqh,1rem)] font-medium tracking-[-0.02em] text-zinc-900">
        {item.label}
      </span>
    </motion.button>
  )
}

function MenuToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      aria-label={isOpen ? "Close iMessage menu" : "Open iMessage menu"}
      aria-expanded={isOpen}
      aria-controls="imessage-app-menu"
      onClick={onClick}
      className="flex aspect-square w-[15cqw] items-center justify-center rounded-full bg-zinc-950 text-white"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 360, damping: 24 }
      }
    >
      <Plus aria-hidden="true" className="h-auto w-[46%]" strokeWidth={2.25} />
    </motion.button>
  )
}
