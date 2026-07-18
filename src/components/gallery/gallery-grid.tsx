import type { ExperimentItem } from "@/experiments"
import { MOTION_EASE } from "@/lib/motion"
import { motion, type Variants } from "motion/react"
import { memo } from "react"
import GalleryCard from "./gallery-card"

type GalleryGridProps = {
  items: ExperimentItem[]
}

const MAX_STAGGER_DELAY = 0.12

function getStaggerDelay(index: number, interval: number) {
  return Math.min(index * interval, MAX_STAGGER_DELAY)
}

const gridTransitionVariants = {
  enter: {},
  center: {},
  exit: {
    transition: {
      when: "afterChildren",
    },
  },
} satisfies Variants

const cardTransitionVariants = {
  enter: { opacity: 0, x: 48 },
  center: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: getStaggerDelay(index, 0.025),
      duration: 0.28,
      ease: MOTION_EASE,
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    x: 48,
    transition: {
      delay: getStaggerDelay(index, 0.018),
      duration: 0.2,
      ease: MOTION_EASE,
    },
  }),
} satisfies Variants

function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <motion.section
      variants={gridTransitionVariants}
      className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          custom={index}
          variants={cardTransitionVariants}
        >
          <GalleryCard {...item} />
        </motion.div>
      ))}
    </motion.section>
  )
}

export default memo(GalleryGrid)
