import HomepageGrid from "@/components/homepage/homepage-grid"
import HomepageHeader from "@/components/homepage/homepage-header"
import { experiments } from "@/registry/experiments-registry"

export default function Homepage() {
  return (
    <main className="min-h-screen bg-background p-10 text-foreground">
      <div className="mx-auto flex w-full flex-col items-center gap-32">
        <HomepageHeader />

        <section className="h-full w-full">
          <HomepageGrid items={experiments} />
        </section>
      </div>
    </main>
  )
}
