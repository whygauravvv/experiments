import GalleryHeader from "@/components/gallery/gallery-header"
import GalleryGrid from "@/components/gallery/galley-grid"
import { experiments } from "@/experiments"

export default function ExperimentsGallery() {
  return (
    <main className="min-h-screen bg-background p-10 text-foreground">
      <div className="mx-auto flex w-full flex-col items-center gap-32">
        <GalleryHeader />

        <section className="h-full w-full">
          <GalleryGrid items={experiments} />
        </section>
      </div>
    </main>
  )
}
