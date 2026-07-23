---
name: background-generation
description: Create, revise, or register reusable React/CSS background treatments for this experiment gallery. Use when adding a background, generating a visual surface or pattern, reorganizing background components, exposing tweakable background tokens, or adding a CardShell backgroundVariant.
---

# Background Generation

Build backgrounds as reusable experiment surfaces that render consistently in gallery cards, detail pages, and any other explicit container size.

## Workflow

1. Inspect `src/components/backgrounds/`, `src/styles/grid-glow-background.css`, `src/components/card-shell.tsx`, and the intended usage before editing.
2. Create each background in `src/components/backgrounds/<name>-background.tsx`.
3. Add a clearly named, module-private `*_BACKGROUND_TOKENS` object near the top of the component file. React Fast Refresh should continue to see a component-only value export surface.
4. Put every visual constant in the token object and apply it through typed CSS custom properties. Include surface and foreground colors, pattern color and opacity, horizontal and vertical spacing, offsets, dot size and edge softness or horizontal and vertical line widths, mask position and geometry, mask opacity and stops, and glow color, opacity, position, dimensions, and stops.
5. Use explicit fixed defaults. Do not add `clamp()`, `min()`, `max()`, viewport-based scaling, container-query scaling, media-query sizing, or other responsive behavior unless the user explicitly asks for it. Do not infer responsive values from gallery-card and detail-page size differences.
6. Merge the caller's `style` last so a usage can override any token without editing the component.
7. Accept div attributes, provide a typed `style`, accept `className`, merge it with the component class through `cn`, forward the remaining props, and render children through the wrapper.
8. Keep the surface, decorative pattern, and glow on separate CSS layers. A mask intended for dots or lines must be applied to the pattern layer rather than the wrapper, because masking the wrapper also fades its children.
9. Support `edges`, `center`, and `none` mask choices when the background family needs reusable falloff behavior. Keep mask size, position, opacity, and falloff stops tokenized.
10. Keep shared structural CSS in `src/styles/grid-glow-background.css` when the treatment belongs to the glow/pattern family. Create a scoped stylesheet only when its structure is genuinely different.
11. Import the background into `src/components/card-shell.tsx` and add a hyphen-case key to `backgroundVariants` when it is a gallery-wide option. Derive `CardShellBackgroundVariant` from the map; never maintain a separate manual union.
12. Preserve the no-variant `CardShell` output as the default. `CardShell` must also accept div attributes, use the shared typed background style so variant tokens can be overridden at the usage, and merge its caller-provided `className` with its structural classes using `cn`.
13. When an experiment uses the background, set `backgroundVariant` on its `CardShell` or render the background directly. Update the experiment's source-file registry when the shared background source is material to understanding it.
14. Format touched files, run targeted ESLint and TypeScript checks, then run the production build unless the user reserves testing.

## Component contract

Use this shape:

```tsx
import GlowBackground, {
  type GlowBackgroundMask,
  type GlowBackgroundStyle,
} from "@/components/backgrounds/glow-background"
import type { HTMLAttributes } from "react"

const EXAMPLE_BACKGROUND_TOKENS = {
  surfaceColor: "#f3f2ee",
  patternColor: "rgba(36, 35, 33, 0.08)",
  horizontalSpacing: "48px",
  verticalSpacing: "48px",
  dotSize: "1px",
  dotEdgeSize: "1.25px",
  maskWidth: "70%",
  maskHeight: "75%",
  maskInnerStop: "55%",
  maskOuterStop: "100%",
} as const

type ExampleBackgroundProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> & {
  className?: string
  patternMask?: GlowBackgroundMask
  style?: GlowBackgroundStyle
}

export default function ExampleBackground({
  className,
  patternMask = "edges",
  style,
  ...props
}: ExampleBackgroundProps) {
  const backgroundStyle: GlowBackgroundStyle = {
    "--background-surface": EXAMPLE_BACKGROUND_TOKENS.surfaceColor,
    "--background-pattern-color": EXAMPLE_BACKGROUND_TOKENS.patternColor,
    "--background-pattern-horizontal-spacing":
      EXAMPLE_BACKGROUND_TOKENS.horizontalSpacing,
    "--background-pattern-vertical-spacing":
      EXAMPLE_BACKGROUND_TOKENS.verticalSpacing,
    "--background-dot-size": EXAMPLE_BACKGROUND_TOKENS.dotSize,
    "--background-dot-edge-size": EXAMPLE_BACKGROUND_TOKENS.dotEdgeSize,
    "--background-pattern-mask-width": EXAMPLE_BACKGROUND_TOKENS.maskWidth,
    "--background-pattern-mask-height": EXAMPLE_BACKGROUND_TOKENS.maskHeight,
    "--background-pattern-mask-inner-stop":
      EXAMPLE_BACKGROUND_TOKENS.maskInnerStop,
    "--background-pattern-mask-outer-stop":
      EXAMPLE_BACKGROUND_TOKENS.maskOuterStop,
    ...style,
  }

  return (
    <GlowBackground
      pattern="dots"
      patternMask={patternMask}
      className={className}
      style={backgroundStyle}
      {...props}
    />
  )
}
```

The shared `GlowBackground` component performs the `cn` merge. A standalone background that does not use it must call `cn("example-background", className)` itself.

Keep backgrounds decorative and inexpensive. Prefer CSS gradients, masks, and pseudo-elements. Use a radial mask for glow falloff instead of `filter: blur()`. Give absolutely positioned decorative layers complete geometry—both width and height—not a single dimension. Avoid per-frame React state, and do not capture pointer events unless interaction is explicitly requested.
