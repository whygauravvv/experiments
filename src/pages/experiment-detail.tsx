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
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background px-4 py-5 text-foreground sm:px-6 lg:px-10 lg:py-8">
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

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(12rem,42%)_minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:grid-rows-1 lg:gap-8">
        <motion.section
          layoutId={`experiment-${experiment.id}`}
          transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.75 }}
          className="aspect-square h-full max-h-full w-auto max-w-full justify-self-center overflow-hidden rounded-xl border border-border/60 bg-card"
        >
          <Component />
        </motion.section>

        <aside className="min-h-0 min-w-0 overflow-y-auto overscroll-contain pr-1 lg:pl-2 lg:pr-3">
          <p className="mb-3 text-xs text-muted-foreground">Experiment</p>
          <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
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
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium">Source</h2>
              <span className="text-[11px] text-muted-foreground">TSX</span>
            </div>
            <pre className="max-h-[34rem] overflow-auto rounded-xl border border-border/70 bg-muted/35 p-4 text-xs leading-relaxed">
              <code>{source}</code>
            </pre>
          </section>
        </aside>
      </div>
    </main>
  )
}
