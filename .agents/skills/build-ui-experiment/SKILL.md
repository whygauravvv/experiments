---
name: build-ui-experiment
description: Create polished, self-contained UI experiments from visual references, videos, screenshots, existing products, or interaction ideas. Use when Codex needs to clone, prototype, adapt, or implement a frontend interaction and integrate it into a project's experiment gallery with appropriate metadata, source exposure, responsive behavior, accessibility, and visual verification.
---

# Build UI Experiment

Turn a reference or interaction idea into a production-quality experiment that feels native to the current project.

## 1. Understand the request

Inspect the reference and repository before deciding what to ask. Read project instructions, neighboring experiments, the experiment registry, routing, source viewer, styling conventions, available dependencies, and existing assets.

Use this ambiguity gate:

- For an explicit clone, proceed without personalization questions unless essential information is missing or the user explicitly asks to customize it.
- For a clear request, infer choices from the reference and project rather than asking redundant questions.
- For an unclear or open-ended request, ask 3–5 concise personalization questions one at a time. Stop early once the direction is clear.

Prioritize questions about:

1. Fidelity to the reference versus a new interpretation.
2. Whether to use the house style or another visual direction.
3. The primary interaction, states, and intended feeling.
4. Theme, density, layout, or responsive priorities that cannot be inferred.
5. Required asset sources or content constraints.

Do not ask the user to repeat facts discoverable from the repository or supplied reference.

## 2. Choose the visual direction

Honor an explicit reference faithfully. Preserve its interaction model, timing, hierarchy, and distinctive visual details while adapting dimensions to the host surface.

When no strong direction exists, ask whether to use the house style or something else. Treat the house style as a flexible starting point, not a fixed template:

- warm neutral surfaces;
- subtle grids, texture, or atmospheric depth;
- restrained typography and clear hierarchy;
- generous but responsive spacing;
- polished, purposeful micro-motion;
- small contextual details such as a concise hint or source credit.

Adapt this language to the current project's design system. Avoid making unrelated experiments look identical.

## 3. Handle assets deliberately

Prefer asset sources in this order:

1. The source named by the user.
2. Assets and icon libraries already present in the project.
3. A suitable external source after telling the user that the requested source cannot be used directly.

Never silently replace a requested asset source. Verify that remote assets can be rendered or bundle them locally when project conventions and usage rights allow. Add unobtrusive attribution when appropriate.

## 4. Implement the experiment

Follow the host project's stack and conventions. Put each experiment in its own `src/experiments/<experiment-name>/` folder. Use `<experiment-name>.tsx` for the component and an optional colocated `<experiment-name>.css` file when custom CSS materially improves the result. Import that stylesheet directly from the experiment component.

- Keep the experiment self-contained and safe to render in both gallery cards and detail views.
- Scope CSS under a unique experiment root to prevent leakage.
- Use the project's existing components and dependencies when they help without diluting the reference.
- Implement every meaningful state shown in the reference, not only the resting frame.
- Support pointer, keyboard focus, and touch where the interaction permits.
- Provide visible focus behavior, semantic controls, useful accessible names, and reduced-motion handling.
- Make sizing responsive to the experiment container rather than a single viewport.
- Avoid unnecessary state, dependencies, abstraction, and decorative complexity.

## 5. Register it properly

Add the lazy component import and experiment entry to `src/experiments/index.ts`. Follow the existing registry order and conventions. Every entry must include:

- `id`: a stable, unique URL slug;
- `title`: a concise display name;
- `description`: a useful explanation of what the interaction does and how it behaves;
- `libraries`: references to shared `{ name, icon }` definitions from `LIBRARIES`;
- `loadFiles`: the experiment's copyable TSX file and optional CSS file, loaded with `?raw`;
- `Component`: the lazy-loaded experiment component.

Add `credit: { name, url }` when the experiment has a known inspiration or source. Use the original creator, product, article, or reference rather than a generic attribution.

Reuse existing `LIBRARIES` entries whenever possible. When a library is missing:

1. Add or reuse its SVG icon under `src/components/ui/svgs/`.
2. Import the icon in the registry.
3. Add one shared `{ name, icon }` entry to `LIBRARIES`.
4. Reference that entry from the experiment's `libraries` array.

Expose only the files needed to understand and reuse the isolated interaction: its primary TSX file and optional colocated CSS file. Do not expose shared backgrounds, gallery infrastructure, utilities, or unrelated dependencies. Ensure every exposed filename is unique within the experiment and matches the real file.

## 6. Verify the result

Validate in proportion to the project:

1. Format only the touched files.
2. Run targeted lint and type checks.
3. Run the production build.
4. Open the experiment in the local app and inspect both gallery and detail presentations.
5. Exercise the primary interaction and keyboard state.
6. Check the mobile navigator and responsive layout.
7. Confirm the description, library badges, optional inspiration/source credit, and copyable source files render correctly.
8. Check remote asset loading, clipping, overflow, responsive sizing, and reduced-motion behavior.

Fix issues found during visual verification. Distinguish pre-existing repository failures from failures introduced by the experiment.

In the final response, lead with the completed outcome, link the experiment folder and registry, state the inspiration or asset source when applicable, and summarize verification. Mention unrelated pre-existing failures briefly without implying they were fixed.
