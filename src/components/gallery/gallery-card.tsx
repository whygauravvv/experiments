import type { ExperimentItem } from "@/experiments"
import { MoveUpRight } from "lucide-react"
import { motion } from "motion/react"
import { Link, useLocation } from "react-router-dom"

export default function GalleryCard({
  id,
  title,
  description,
  Component,
}: ExperimentItem) {
  const location = useLocation()

  return (
    <motion.article
      key={id}
      layoutId={`experiment-${id}`}
      transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.75 }}
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
            state={{ backgroundLocation: location }}
            aria-label={`View ${title}`}
            className="pointer-events-auto translate-y-0 scale-100 rounded-full bg-muted/60 p-2 opacity-100 delay-50 duration-150 hover:rotate-45 hover:bg-primary/10 hover:text-primary focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:blur-none focus-visible:outline-none md:translate-y-14 md:scale-95 md:bg-muted/40 md:opacity-0 md:blur-sm md:group-hover:translate-y-0 md:group-hover:scale-100 md:group-hover:opacity-100 md:group-hover:blur-none"
          >
            <MoveUpRight size={18} className="text-muted-foreground/60" />
          </Link>
        </div>
      </section>
      <section className="h-full w-full">
        <Component />
      </section>
    </motion.article>
  )
}
