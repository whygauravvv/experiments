import { MOTION_EASE } from "@/lib/motion"
import { motion, useIsPresent, type Variants } from "motion/react"
import {
  type PropsWithChildren,
  type UIEvent,
  useLayoutEffect,
  useRef,
} from "react"

const pageTransitionVariants = {
  enter: { opacity: 0, filter: "blur(8px)" },
  center: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.32, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    filter: "blur(6px)",
    transition: {
      duration: 0.2,
      ease: MOTION_EASE,
      when: "afterChildren",
    },
  },
} satisfies Variants

type PageWrapperProps = PropsWithChildren<{
  getInitialScrollTop?: () => number
  onScrollTopChange?: (scrollTop: number) => void
}>

export default function PageWrapper({
  children,
  getInitialScrollTop,
  onScrollTopChange,
}: PageWrapperProps) {
  const isPresent = useIsPresent()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    scrollContainer.scrollTop = getInitialScrollTop?.() ?? 0
  }, [getInitialScrollTop])

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    onScrollTopChange?.(event.currentTarget.scrollTop)
  }

  return (
    <motion.div
      ref={scrollContainerRef}
      variants={pageTransitionVariants}
      initial="enter"
      animate="center"
      exit="exit"
      onScroll={handleScroll}
      className="col-start-1 row-start-1 h-dvh overflow-y-auto overscroll-contain bg-background"
      style={{
        pointerEvents: isPresent ? "auto" : "none",
        zIndex: isPresent ? 1 : 0,
      }}
    >
      {children}
    </motion.div>
  )
}
