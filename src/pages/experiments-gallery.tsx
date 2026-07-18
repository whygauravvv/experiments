import DotGridBackground from "@/components/gallery/dot-grid-background"
import GalleryGrid from "@/components/gallery/gallery-grid"
import GalleryHeader from "@/components/gallery/gallery-header"
import { GalleryPreviewProvider } from "@/components/gallery/gallery-preview-provider"
import { experiments } from "@/experiments"
import { MOTION_EASE } from "@/lib/motion"
import { motion, type Variants } from "motion/react"

const sidebarTransitionVariants = {
  enter: { opacity: 0, x: -48 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    x: -48,
    transition: { duration: 0.22, ease: MOTION_EASE },
  },
} satisfies Variants

export default function ExperimentsGallery() {
  return (
    <GalleryPreviewProvider>
      <main className="min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-[clamp(17rem,24vw,23rem)_minmax(0,1fr)]">
        <motion.aside
          variants={sidebarTransitionVariants}
          className="relative isolate overflow-hidden border-b border-border/40 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0"
        >
          <DotGridBackground />
          <GalleryHeader />
        </motion.aside>

        <section className="relative min-w-0 overflow-x-hidden bg-neutral-50/50 px-4 py-5 sm:px-6 sm:py-7 lg:px-7 lg:py-7 2xl:px-8 2xl:py-8">
          <GalleryGrid items={experiments} />
        </section>
      </main>
    </GalleryPreviewProvider>
  )
}
