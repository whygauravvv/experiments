import type { ExperimentItem } from "@/experiments"
import GalleryCard from "./gallery-card"

export default function GalleryGrid({ items }: { items: ExperimentItem[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <GalleryCard key={`${item.id}-${index}`} {...item} />
      ))}
    </section>
  )
}
