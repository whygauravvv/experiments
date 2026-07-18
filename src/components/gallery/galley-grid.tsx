import type { ExperimentItem } from "@/experiments"
import { useNearViewportCount } from "@/hooks/use-gallery-preview"
import { memo } from "react"
import GalleryCard from "./gallery-card"

type GalleryGridProps = {
  items: ExperimentItem[]
}

function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <>
      <GalleryPerformanceMonitor totalCount={items.length} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {items.map((item) => (
          <GalleryCard key={item.id} {...item} />
        ))}
      </section>
    </>
  )
}

function GalleryPerformanceMonitor({ totalCount }: { totalCount: number }) {
  const mountedPreviewCount = useNearViewportCount()

  if (!import.meta.env.DEV) return null

  return (
    <div
      data-testid="gallery-performance-monitor"
      className="fixed top-4 right-4 z-[100] rounded-full border border-border/70 bg-background/90 px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-md"
    >
      <span className="font-semibold text-foreground">
        {mountedPreviewCount}
      </span>{" "}
      / {totalCount} previews mounted
    </div>
  )
}

export default memo(GalleryGrid)
