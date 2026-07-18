---
name: background-generation
description: Create, revise, or register reusable React/CSS background treatments for this experiment gallery. Use when adding a background, generating a visual surface or pattern, reorganizing background components, exposing tweakable background tokens, or adding a CardShell backgroundVariant.
---

# Background Generation

Build backgrounds as reusable experiment surfaces that work identically in gallery cards, detail pages, and mobile views.

## Workflow

1. Inspect `src/components/backgrounds/`, `src/styles/grid-glow-background.css`, and `src/components/card-shell.tsx` before editing.
2. Create each background in `src/components/backgrounds/<name>-background.tsx`.
3. Add a clearly named `*_BACKGROUND_TOKENS` object near the top of the component file. Keep it module-private so React Fast Refresh treats the file as component-only. Put every likely visual adjustment there: surface and foreground colors, pattern color and sizing, glow color, size, mask falloff stops, and variant-specific geometry.
4. Apply tokens through typed CSS custom properties. Merge the caller's `style` last so one-off overrides remain possible.
5. Accept `HTMLAttributes<HTMLDivElement>`, merge `className` with `cn`, forward remaining props, and render children through the wrapper.
6. Keep shared structural CSS in `src/styles/grid-glow-background.css` when the new treatment belongs to the same background family. Create a scoped stylesheet only when the structure is genuinely different.
7. Import the background into `src/components/card-shell.tsx` and add a hyphen-case key to `backgroundVariants`. Derive `CardShellBackgroundVariant` from the map; never maintain a separate manual union.
8. Preserve the no-variant `CardShell` output as the default background.
9. When an experiment uses the background, set `backgroundVariant` on its `CardShell`. Update its source-file registry when the shared background source is material to understanding the experiment.
10. Format touched files, run targeted ESLint and TypeScript checks, then run the production build unless the user reserves testing.

## Component pattern

Use this contract:

```tsx
const EXAMPLE_BACKGROUND_TOKENS = {
  surfaceColor: "#f3f2ee",
  patternSize: "48px",
} as const

export default function ExampleBackground({ className, style, ...props }) {
  return (
    <div
      className={cn("example-background", className)}
      style={{
        "--background-surface": EXAMPLE_BACKGROUND_TOKENS.surfaceColor,
        "--background-pattern-size": EXAMPLE_BACKGROUND_TOKENS.patternSize,
        ...style,
      }}
      {...props}
    />
  )
}
```

Keep backgrounds decorative and inexpensive: prefer CSS gradients, masks, and pseudo-elements. Use a radial mask for glow falloff instead of `filter: blur()`. Avoid per-frame React state, and do not capture pointer events unless interaction is explicitly requested.
