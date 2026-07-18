import type { ExperimentItem } from "@/experiments"
import ExperimentErrorBoundary from "@/components/experiment-error-boundary"
import ExperimentLoading, {
  ExperimentReady,
} from "@/components/experiment-loading"
import { useNearViewport } from "@/hooks/use-gallery-preview"
import { MoveUpRight } from "lucide-react"
import { memo, Suspense } from "react"
import { Link } from "react-router-dom"

type GalleryCardProps = ExperimentItem

function GalleryCard({ id, title, description, Component }: GalleryCardProps) {
  const { isNearViewport, viewportRef } = useNearViewport<HTMLElement>()

  return (
    <article
      ref={viewportRef}
      className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-card"
    >
      <section className="pointer-events-none absolute bottom-0 z-50 h-14 max-h-16 w-full">
        <div className="flex h-full w-full items-center justify-between px-3">
          <div
            id="component-details"
            className="translate-y-0 scale-100 opacity-100 duration-150 md:translate-y-14 md:scale-95 md:opacity-0 md:blur-sm md:group-hover:translate-y-0 md:group-hover:scale-100 md:group-hover:opacity-100 md:group-hover:blur-none"
          >
            <p className="text-xs font-medium text-primary lg:text-sm">
              {title}
            </p>
            <p className="line-clamp-1 text-[10px] text-muted-foreground/60 lg:text-xs">
              {description}
            </p>
          </div>

          <Link
            id="redirect-button"
            to={`/experiments/${id}`}
            state={{ transitionFromGallery: true }}
            aria-label={`View ${title}`}
            className="pointer-events-auto translate-y-0 scale-100 rounded-full bg-muted/60 p-2 opacity-100 delay-50 duration-150 hover:rotate-45 hover:bg-primary/10 hover:text-primary focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:blur-none focus-visible:outline-none md:translate-y-14 md:scale-95 md:bg-muted/40 md:opacity-0 md:blur-sm md:group-hover:translate-y-0 md:group-hover:scale-100 md:group-hover:opacity-100 md:group-hover:blur-none"
          >
            <MoveUpRight size={18} className="text-muted-foreground/60" />
          </Link>
        </div>
      </section>
      <section className="h-full w-full" aria-live="off">
        {isNearViewport ? (
          <ExperimentErrorBoundary key={id}>
            <Suspense fallback={<ExperimentLoading />}>
              <ExperimentReady>
                <Component />
              </ExperimentReady>
            </Suspense>
          </ExperimentErrorBoundary>
        ) : null}
      </section>
    </article>
  )
}

export default memo(GalleryCard)
