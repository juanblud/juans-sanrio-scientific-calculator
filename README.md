# Juan's Sanrio Scientific Calculator

A themed scientific calculator built with React, TypeScript, and Vite. The first-use screen lets people choose a Sanrio character theme, and the selection is saved locally for future visits.

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production validation

Run the combined lint and production-build check:

```bash
npm run check
```

The production output is generated in `dist/` by `npm run build`. To preview that output locally, run `npm run preview`.

## Deployment

This is a static Vite site. Use `npm run build` as the build command and `dist` as the publish/output directory. The included `netlify.toml` and `vercel.json` files configure those defaults and preserve the single-page app entry point.

The app uses browser `localStorage` for the selected theme; no server or environment variables are required.
