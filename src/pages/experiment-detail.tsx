import CodeViewer from "@/components/code/code-viewer"
import { experiments } from "@/experiments"
import { ArrowLeft } from "lucide-react"
import { motion } from "motion/react"
import { useEffect } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

export default function ExperimentDetail({ isOverlay = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const experiment = experiments.find((item) => item.id === id)

  useEffect(() => {
    if (!isOverlay) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") navigate(-1)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isOverlay, navigate])

  if (!experiment) return <Navigate to="/" replace />

  const { Component, description, source, tags, title, year } = experiment

  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8 lg:py-7 2xl:px-10 2xl:py-8">
      <header className="mb-5 flex shrink-0 items-center justify-between gap-6 lg:mb-6">
        {isOverlay ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            All experiments
          </button>
        ) : (
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            All experiments
          </Link>
        )}
        <p className="text-xs text-muted-foreground">{year}</p>
      </header>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(12rem,42%)_minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,1fr)] lg:grid-rows-1 lg:gap-7 2xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] 2xl:gap-8">
        <motion.section
          layoutId={`experiment-${experiment.id}`}
          transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.75 }}
          className="aspect-square h-full max-h-full w-auto max-w-full justify-self-center overflow-hidden rounded-xl border border-border/60 bg-card"
        >
          <Component />
        </motion.section>

        <aside className="min-h-0 min-w-0 overflow-y-auto overscroll-contain pr-1 lg:pl-2 lg:pr-3">
          <p className="mb-3 text-xs text-muted-foreground">Experiment</p>
          <h1 className="text-[clamp(2.25rem,3.75vw,3rem)] font-semibold tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>

          <section className="mt-10">
            <h2 className="mb-3 text-sm font-medium">Source</h2>
            <CodeViewer code={source} filename={`${experiment.id}.tsx`} />
          </section>
        </aside>
      </div>
    </main>
  )
}
