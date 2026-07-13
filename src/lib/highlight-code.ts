import tsx from "@shikijs/langs/tsx"
import githubLight from "@shikijs/themes/github-light"
import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

const highlighterPromise = createHighlighterCore({
  themes: [githubLight],
  langs: [tsx],
  engine: createJavaScriptRegexEngine(),
})

export async function highlightCode(code: string) {
  const highlighter = await highlighterPromise

  return highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "github-light",
    transformers: [
      {
        line(node, line) {
          node.properties["data-line"] = line
        },
      },
    ],
  })
}
