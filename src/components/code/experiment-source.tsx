import CodeViewer from "@/components/code/code-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ExperimentSourceFile } from "@/experiments"

type ExperimentSourceProps = {
  files: ExperimentSourceFile[]
}

export default function ExperimentSource({ files }: ExperimentSourceProps) {
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
