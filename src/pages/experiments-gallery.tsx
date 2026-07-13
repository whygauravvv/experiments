import DotGridBackground from "@/components/gallery/dot-grid-background"
import GalleryHeader from "@/components/gallery/gallery-header"
import GalleryGrid from "@/components/gallery/galley-grid"
import { experiments } from "@/experiments"

export default function ExperimentsGallery() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-[clamp(17rem,24vw,23rem)_minmax(0,1fr)]">
      <aside className="relative isolate overflow-hidden border-b border-border/40 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <DotGridBackground />
        <GalleryHeader />
      </aside>

      <section className="relative min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <GalleryGrid items={experiments} />
      </section>
    </main>
  )
}
