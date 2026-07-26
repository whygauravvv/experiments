import CodeViewer from "@/components/code/code-viewer"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ExperimentSourceFile } from "@/experiments"
import { playSound } from "@/lib/sound"
import { useEffect, useState } from "react"

type ExperimentSourceProps = {
  loadFiles: () => Promise<ExperimentSourceFile[]>
}

type SourceState =
  | {
      loadFiles: ExperimentSourceProps["loadFiles"]
      status: "loading"
    }
  | {
      loadFiles: ExperimentSourceProps["loadFiles"]
      status: "loaded"
      files: ExperimentSourceFile[]
    }
  | {
      loadFiles: ExperimentSourceProps["loadFiles"]
      status: "error"
    }

export default function ExperimentSource({ loadFiles }: ExperimentSourceProps) {
  const [sourceState, setSourceState] = useState<SourceState>({
    loadFiles,
    status: "loading",
  })
  const [loadAttempt, setLoadAttempt] = useState(0)
  const currentState =
    sourceState.loadFiles === loadFiles
      ? sourceState
      : ({ loadFiles, status: "loading" } satisfies SourceState)

  useEffect(() => {
    let cancelled = false

    void loadFiles()
      .then((loadedFiles) => {
        if (!cancelled) {
          setSourceState({ loadFiles, status: "loaded", files: loadedFiles })
          if (loadAttempt > 0) playSound("ready")
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSourceState({ loadFiles, status: "error" })
          if (loadAttempt > 0) playSound("error")
        }
      })

    return () => {
      cancelled = true
    }
  }, [loadAttempt, loadFiles])

  if (currentState.status === "error") {
    return (
      <div
        role="alert"
        className="grid min-h-40 place-items-center rounded-xl border border-border/70 bg-card px-6 text-center text-xs text-muted-foreground"
      >
        <div className="grid justify-items-center gap-3">
          <p>Source code could not be loaded.</p>
          <button
            type="button"
            className="rounded-full border border-border bg-background px-3 py-1.5 text-foreground transition-colors hover:bg-muted"
            onClick={() => {
              playSound("loading")
              setSourceState({ loadFiles, status: "loading" })
              setLoadAttempt((attempt) => attempt + 1)
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (currentState.status === "loading") {
    return (
      <div className="grid min-h-40 place-items-center rounded-xl border border-border/70 bg-card">
        <Spinner className="text-muted-foreground/60" />
      </div>
    )
  }

  const { files } = currentState
  const firstFile = files[0]

  if (!firstFile) return null

  if (files.length === 1) {
    return (
      <CodeViewer
        code={firstFile.code}
        filename={firstFile.filename}
        language={firstFile.language}
      />
    )
  }

  return (
    <Tabs defaultValue={firstFile.filename} className="md:min-h-0 md:flex-1">
      <TabsList
        aria-label="Experiment source files"
        className="max-w-full shrink-0 justify-start overflow-x-auto border border-border/60 bg-background shadow-xs"
      >
        {files.map((file) => (
          <TabsTrigger
            key={file.filename}
            value={file.filename}
            data-cuelume-toggle="toggle"
            className="data-active:bg-muted"
          >
            <span className="font-mono text-xs">{file.filename}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {files.map((file) => (
        <TabsContent
          key={file.filename}
          value={file.filename}
          className="md:min-h-0 md:data-active:flex"
        >
          <CodeViewer
            code={file.code}
            filename={file.filename}
            language={file.language}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
