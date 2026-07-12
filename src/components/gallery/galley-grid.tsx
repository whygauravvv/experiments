import type { ExperimentItem } from "@/experiments"
import GalleryCard from "./gallery-card"

export default function GalleryGrid({ items }: { items: ExperimentItem[] }) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map(({ id, title, description, Component }) => (
        <GalleryCard
          key={id}
          id={id}
          title={title}
          description={description}
          Component={Component}
        />
      ))}
    </section>
  )
}
