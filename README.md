# Experiments

A responsive gallery of interaction studies, interface details, and working prototypes by Yash Gaurav.

## Development

```bash
npm install
npm run dev
```

Useful commands:

- `npm run build` — type-check and create a production build.
- `npm run lint` — run ESLint.
- `npm run format` — format TypeScript and TSX files.
- `npm run preview` — serve the production build locally.

## Architecture

- `src/experiments/` contains the individual experiments and the registry that powers gallery, detail, and mobile navigation.
- `src/components/gallery/` contains the desktop gallery shell and preview lifecycle.
- `src/components/backgrounds/` contains reusable visual surfaces used by experiments and `CardShell`.
- `src/pages/experiment-detail.tsx` renders an experiment alongside its exposed source files.
- `src/components/mobile-experiments.tsx` provides the compact mobile navigator.

Experiment components are lazy-loaded. Gallery previews mount only near the viewport, and the mobile and desktop application branches are split into separate chunks.

## Adding an experiment

1. Add the component under `src/experiments/` and keep experiment-specific CSS under `src/styles/`.
2. Register its id, title, description, lazy component, and source files in `src/experiments/index.ts`.
3. Include every shared component or stylesheet needed to understand the example in its `loadFiles` manifest.
4. Verify the experiment in the gallery, detail view, and mobile navigator.
5. Run `npm run build` before committing.

Registry ids and source filenames are validated for uniqueness. Source-file language is inferred from the filename extension.

## Deployment

The app uses `BrowserRouter`, so production hosting must route unknown paths back to `index.html`. Static assets are served from `public/`, while experiment modules and source files are bundled by Vite.
