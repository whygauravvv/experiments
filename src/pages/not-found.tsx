import DotGridBackground from "@/components/gallery/dot-grid-background"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <DotGridBackground />

      <section className="relative z-10 max-w-md bg-background/90 p-8 backdrop-blur-sm sm:p-10">
        <p className="font-rounded text-sm text-muted-foreground">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This page doesn&apos;t exist, or it may have moved somewhere else.
        </p>

        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4 origin-right transition-transform" />
          Back to experiments
        </Link>
      </section>
    </main>
  )
}
