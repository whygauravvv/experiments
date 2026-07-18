import { Spinner } from "@/components/ui/spinner"

export default function ExperimentLoading() {
  return (
    <div className="grid h-full w-full place-items-center bg-muted/20">
      <Spinner className="size-5 text-muted-foreground/60" />
    </div>
  )
}
