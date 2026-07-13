import type { ExperimentItem } from "@/experiments"
import { MoveUpRight } from "lucide-react"

export default function GalleryCard({
  id,
  title,
  description,
  Component,
}: ExperimentItem) {
  return (
    <article
      key={id}
      className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-card"
    >
      <section className="pointer-events-none absolute bottom-0 z-50 h-14 max-h-16 w-full">
        <div className="flex h-full w-full items-center justify-between px-3">
          <div
            id="component-details"
            className="translate-y-14 scale-95 opacity-0 blur-sm duration-150 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none"
          >
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground/60">
              {description}
            </p>
          </div>

          <button
            id="redirect-button"
            className="pointer-events-auto translate-y-14 scale-95 rounded-full bg-muted/40 p-2 opacity-0 blur-sm delay-50 duration-150 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none hover:rotate-45 hover:bg-primary/10 hover:text-primary"
          >
            <MoveUpRight className="text-muted-foreground/60" />
          </button>
        </div>
      </section>
      <section className="h-full w-full">
        <Component />
      </section>
    </article>
  )
}
