import type { ExperimentItem } from "@/experiments"
import GalleryCard from "./gallery-card"

type GalleryGridProps = {
  items: ExperimentItem[]
  activeExperimentId?: string
  isDetailOpen?: boolean
  isEnteringFromDetail?: boolean
  onOpenExperiment?: (experimentId: string) => void
}

export default function GalleryGrid({
  items,
  activeExperimentId,
  isDetailOpen = false,
  isEnteringFromDetail = false,
  onOpenExperiment,
}: GalleryGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {items.map((item, index) => (
        <GalleryCard
          key={`${item.id}-${index}`}
          {...item}
          isActive={item.id === activeExperimentId}
          isDetailOpen={isDetailOpen}
          isEnteringFromDetail={isEnteringFromDetail}
          onOpenExperiment={onOpenExperiment}
        />
      ))}
    </section>
  )
}
