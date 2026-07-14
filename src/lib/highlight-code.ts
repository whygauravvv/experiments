import css from "@shikijs/langs/css"
import tsx from "@shikijs/langs/tsx"
import githubLight from "@shikijs/themes/github-light"
import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

const highlighterPromise = createHighlighterCore({
  themes: [githubLight],
  langs: [tsx, css],
  engine: createJavaScriptRegexEngine(),
})

export type SupportedCodeLanguage = "tsx" | "css"

export type HighlightedCodeLine = Array<{
  content: string
  color?: string
}>

export async function highlightCode(
  code: string,
  language: SupportedCodeLanguage
) {
  const highlighter = await highlighterPromise
  const result = highlighter.codeToTokens(code, {
    lang: language,
    theme: "github-light",
  })

  return result.tokens.map((line) =>
    line.map(({ content, color }) => ({ content, color }))
  ) satisfies HighlightedCodeLine[]
}
