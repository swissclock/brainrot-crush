# Brainrot Crush

**▶ Play it: [brainrot-crush.vercel.app](https://brainrot-crush.vercel.app)**

A match-3 puzzle game in the Candy Crush mold, played with Italian brainrot characters
instead of candy. 8×8 board, 100 procedurally generated levels, built for touch — it is
meant to be played on a phone.

![Built with React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![Vite](https://img.shields.io/badge/Vite-5-646cff)

## Deployment

The game is live on Vercel at **https://brainrot-crush.vercel.app**, built from this
repository. Vercel runs `npm run build` and serves the static `dist/` output — there is no
server, no API and no database, so the deploy is just the built bundle on a CDN. Player
progress lives in the browser's `localStorage`, not on any backend.

## Local development

Only needed if you want to change the game; to just play it, use the link above.

```bash
npm install
npm run dev
```

Open the URL Vite prints (default http://localhost:5173).

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` — same command Vercel runs |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the project |

## How the game works

**Swapping.** Tap two adjacent tiles, or drag a tile toward its neighbour. A swap that
produces no match is rejected and costs nothing; a swap that matches costs one move.

**Matching.** Three or more of the same character in a row or column clear. Tiles above
fall down and the board refills from the top; cascades keep resolving until the board is
stable, and each cascade step raises the combo multiplier.

**Special tiles.** Longer matches leave a powered-up tile behind:

| Match | Tile | Effect |
| --- | --- | --- |
| 4 in a row | Striped | Clears that entire row or column |
| 5 in a row | Bomb | Clears the surrounding 3×3 |
| 6+ in a row, or an L/T shape | Mega bomb | Clears the surrounding 5×5 |

Specials chain: clearing one that hits another sets that one off too.

**Special combos.** Swapping two specials together does something bigger:

- Bomb + bomb → **Supernova**, clears the whole board
- Striped + striped → **Cross blast**, clears both rows and both columns
- Striped + bomb → **Mega beam**, clears three rows and three columns

**Scoring.** A normal clear is `tiles × 10 × (1 + combo × 0.1)`; a special combo is
`tiles × 50`. Clear the level's target score before running out of moves.

**Deadlocks.** If the board has no legal move left, it reshuffles itself automatically.

## Levels

All 100 levels are generated in [src/types.ts](src/types.ts) rather than hand-authored:

- **Characters:** 4 to 6 distinct types per level, rotating through the 33-character roster
- **Target score:** `200 × 1.08^(level − 1)`
- **Moves:** `25 + ⌊(level − 1) / 1.5⌋`, capped at 60

Progress is stored in `localStorage` under `brainrot_level`. The trash button in the UI
resets it back to level 1.

## Project layout

```
src/
├── App.tsx                  Shell: header, HUD, level-complete and reset dialogs
├── types.ts                 Tile/level types, level generator, character roster
├── index.css                Tailwind entry + global resets
├── components/
│   ├── GameBoard.tsx        8×8 grid, mounts/unmounts tiles with AnimatePresence
│   ├── Tile.tsx             One tile: art, special overlay, tap + drag handling
│   └── Icons.tsx            Inline SVG icons
└── hooks/
    └── useGameLogic.ts      All game state: matching, gravity, specials, scoring, levels
```

## Characters

33 characters, each rendered from a background-removed PNG in `src/assets/` (the
`*_bg.png` files). To add one:

1. Drop `yourcharacter_bg.png` into `src/assets/`.
2. Add its key to `TileType` and `ALL_CHARACTERS` in [src/types.ts](src/types.ts), plus
   entries in `CHARACTER_NAMES` and `CHARACTER_EMOJI`.
3. Import the image in [src/components/Tile.tsx](src/components/Tile.tsx) and add it to
   the `CHARACTER_IMAGES` map.

The level generator picks it up automatically once it is in `ALL_CHARACTERS`.

## Stack

React 19 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion (tile animation and drag)

## Notes

The character images are fan art of internet memes, included here for a personal hobby
project. This repo is not affiliated with any rights holder.
