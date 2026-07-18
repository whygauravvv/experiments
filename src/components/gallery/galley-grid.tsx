import type { ExperimentItem } from "@/experiments"
import { memo } from "react"
import GalleryCard from "./gallery-card"

type GalleryGridProps = {
  items: ExperimentItem[]
}

function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <GalleryCard key={item.id} {...item} />
      ))}
    </section>
  )
}

export default memo(GalleryGrid)
