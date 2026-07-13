import "@/styles/code-viewer.css"
import { Check, Copy } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

type CodeViewerProps = {
  code: string
  filename?: string
}

export default function CodeViewer({
  code,
  filename = "experiment.tsx",
}: CodeViewerProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>()
  const [copied, setCopied] = useState(false)
  const copyResetTimer = useRef<number>(undefined)
  const lineCount = useMemo(() => code.split("\n").length, [code])

  useEffect(() => {
    let cancelled = false

    void import("@/lib/highlight-code")
      .then(({ highlightCode }) => highlightCode(code))
      .then((html) => {
        if (!cancelled) setHighlightedCode(html)
      })

    return () => {
      cancelled = true
    }
  }, [code])

  useEffect(() => {
    return () => window.clearTimeout(copyResetTimer.current)
  }, [])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.clearTimeout(copyResetTimer.current)
    copyResetTimer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="code-viewer overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="flex h-11 items-center justify-between gap-4 border-b border-border/60 px-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="size-2 shrink-0 rounded-full bg-[#0040E0]" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {filename}
          </span>
          <span className="hidden text-[10px] text-muted-foreground/55 sm:inline">
            {lineCount} lines
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-md bg-muted/70 px-2 py-1 font-mono text-[9px] font-medium tracking-wider text-muted-foreground">
            TSX
          </span>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            aria-label={copied ? "Code copied" : "Copy code"}
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div className="code-viewer__scroll max-h-[34rem] overflow-auto">
        {highlightedCode ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        ) : (
          <pre className="code-viewer__fallback">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
