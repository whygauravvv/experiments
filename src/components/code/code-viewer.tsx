import "@/styles/code-viewer.css"
import type {
  HighlightedCodeLine,
  SupportedCodeLanguage,
} from "@/lib/highlight-code"
import { Check, Copy } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

type CodeViewerProps = {
  code: string
  filename?: string
  language: SupportedCodeLanguage
}

type CopyStatus = "idle" | "copied" | "error"

export default function CodeViewer({
  code,
  filename = "experiment.tsx",
  language,
}: CodeViewerProps) {
  const highlightKey = `${language}:${code}`
  const [highlightedCode, setHighlightedCode] = useState<{
    key: string
    lines: HighlightedCodeLine[]
  }>()
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const copyResetTimer = useRef<number>(undefined)
  const lines = useMemo(() => code.split("\n"), [code])

  useEffect(() => {
    let cancelled = false
    const currentHighlightKey = `${language}:${code}`

    void import("@/lib/highlight-code")
      .then(({ highlightCode }) => highlightCode(code, language))
      .then((highlightedLines) => {
        if (!cancelled) {
          setHighlightedCode({
            key: currentHighlightKey,
            lines: highlightedLines,
          })
        }
      })
      .catch(() => {
        // Plain code is already rendered, so highlighting can fail gracefully.
      })

    return () => {
      cancelled = true
    }
  }, [code, language])

  useEffect(() => {
    return () => window.clearTimeout(copyResetTimer.current)
  }, [])

  const copyCode = async () => {
    window.clearTimeout(copyResetTimer.current)

    try {
      await navigator.clipboard.writeText(code)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("error")
    }

    copyResetTimer.current = window.setTimeout(
      () => setCopyStatus("idle"),
      1600
    )
  }

  const copyLabel =
    copyStatus === "copied"
      ? "Code copied"
      : copyStatus === "error"
        ? "Copy failed"
        : "Copy code"

  return (
    <div className="code-viewer flex max-h-screen min-h-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-card md:max-h-full">
      <div className="flex h-11 shrink-0 items-center justify-between gap-4 border-b border-border/60 px-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="size-2 shrink-0 rounded-full bg-[#0040E0]" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {filename}
          </span>
          <span className="hidden text-[10px] text-muted-foreground/55 sm:inline">
            {lines.length} lines
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-md bg-muted/70 px-2 py-1 font-mono text-[9px] font-medium tracking-wider text-muted-foreground">
            {language.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            aria-label={copyLabel}
          >
            {copyStatus === "copied" ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
            <span aria-live="polite">
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "error"
                  ? "Unable to copy"
                  : "Copy"}
            </span>
          </button>
        </div>
      </div>

      <div className="code-viewer__scroll min-h-0 flex-1 overflow-auto">
        <div className="code-viewer__code">
          {lines.map((line, lineIndex) => {
            const highlightedLine =
              highlightedCode?.key === highlightKey
                ? highlightedCode.lines[lineIndex]
                : undefined

            return (
              <div className="code-viewer__line" key={lineIndex}>
                <span className="code-viewer__line-number" aria-hidden="true">
                  {lineIndex + 1}
                </span>
                <code className="code-viewer__line-content">
                  {highlightedLine
                    ? highlightedLine.map((token, tokenIndex) => (
                        <span key={tokenIndex} style={{ color: token.color }}>
                          {token.content}
                        </span>
                      ))
                    : line}
                </code>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
