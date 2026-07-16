import DotGridBackground from "@/components/gallery/dot-grid-background"
import GalleryHeader from "@/components/gallery/gallery-header"
import GalleryGrid from "@/components/gallery/galley-grid"
import { experiments } from "@/experiments"
import { motion } from "motion/react"

type ExperimentsGalleryProps = {
  activeExperimentId?: string
  isDetailOpen?: boolean
}

export default function ExperimentsGallery({
  activeExperimentId,
  isDetailOpen = false,
}: ExperimentsGalleryProps) {
  return (
    <main className="min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-[clamp(17rem,24vw,23rem)_minmax(0,1fr)]">
      <motion.aside
        animate={{
          x: isDetailOpen ? -48 : 0,
          opacity: isDetailOpen ? 0 : 1,
        }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="relative isolate overflow-hidden border-b border-border/40 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0"
      >
        <DotGridBackground />
        <GalleryHeader />
      </motion.aside>

      <section className="relative min-w-0 bg-neutral-50/50 px-4 py-5 sm:px-6 sm:py-7 lg:px-7 lg:py-7 2xl:px-8 2xl:py-8">
        <GalleryGrid
          items={experiments}
          activeExperimentId={activeExperimentId}
          isDetailOpen={isDetailOpen}
        />
      </section>
    </main>
  )
}
