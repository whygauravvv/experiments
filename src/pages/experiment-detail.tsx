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

  const { Component, description, source, title, year } = experiment

  return (
    <main className="flex min-h-dvh flex-col gap-6 bg-neutral-50 px-4 pb-6 text-foreground sm:px-6 md:h-dvh md:max-h-dvh md:overflow-hidden">
      <header className="-mx-4 flex items-center justify-between border-b bg-background px-4 py-4 sm:-mx-6 sm:px-6">
        {isOverlay ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back
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

      <div className="grid grid-cols-1 gap-6 md:min-h-0 md:flex-1 md:grid-cols-2 md:gap-4">
        <motion.section
          layoutId={`experiment-${experiment.id}`}
          className="z-50 aspect-square w-full overflow-hidden rounded-lg border border-border/60 bg-card md:h-full md:max-h-full md:w-auto md:max-w-full md:justify-self-center"
        >
          <Component />
        </motion.section>

        <aside className="min-w-0 md:min-h-0 md:overflow-y-auto md:overscroll-contain">
          <div>
            <h1 className="text-[clamp(2.25rem,3.75vw,3rem)] font-semibold tracking-[-0.045em]">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>

          <section className="mt-10">
            <h2 className="mb-1 text-sm font-medium">Source</h2>
            <CodeViewer code={source} filename={`${experiment.id}.tsx`} />
          </section>
        </aside>
      </div>
    </main>
  )
}
