import type { ExperimentItem } from "@/types/experiment.types"
import ExperimentCard from "./experiment-card"

export default function HomepageGrid({ items }: { items: ExperimentItem[] }) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map(({ id, title, description, Component }) => (
        <ExperimentCard
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
