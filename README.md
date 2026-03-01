# AlgoWiki

Interactive algorithm visualization wiki — step through sorting algorithms with animated bar charts and synchronized pseudocode highlighting.

## Features

- Step-by-step animation with play/pause, speed control, and a scrubber
- Pseudocode panel that highlights the active line on each frame
- Responsive two-column layout (pseudocode left, visualization right)

## Implemented Algorithms

| Algorithm | Route |
|-----------|-------|
| Bubble Sort | `/algorithms/bubble-sort` |

## Getting Started

```bash
npm install
npm run dev       # Start dev server (http://localhost:5173)
```

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check (tsc) then build for production
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [react-router-dom](https://reactrouter.com/) for client-side routing
- SVG for bar chart visualization

## Adding a New Algorithm

1. Create `src/algorithms/<name>.ts` — export `generateFrames(input: number[]): Frame[]`
2. Register it in `src/algorithms/registry.ts`
3. Create `src/pages/<Name>Page.tsx` using `<Player>` + `<ArrayBars>`
4. Add a `<Route>` in `src/router.tsx` and a card on the home page
