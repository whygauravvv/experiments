import { Skeleton } from "@/components/ui/skeleton"
import type { PropsWithChildren } from "react"

export default function ExperimentLoading() {
  return <Skeleton className="h-full w-full rounded-none" />
}

export function ExperimentReady({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full animate-in duration-150 fade-in-0 motion-reduce:animate-none">
      {children}
    </div>
  )
}
