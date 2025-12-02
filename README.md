Prerequisites:
- Node.js 18+ (any LTS version is fine)
- npm (comes with Node)
__________________________________________________

Install and run:

# clone this repo
`git clone https://github.com/oimsabi/poke-x.git`

`cd poke-x`

- 'poke-x/Q1/' – Node/TypeScript implementation and tests for Question 1
- 
`cd Q1`                     # to question 1 files

# run the CLI
`node sum.ts 12 2`          # 12 + 2 = 14

`node --test sum.test.ts`   # run test units
__________________________________________________

- 'poke-x/' – main React + Vite app (Question 2)
# at root project folder
# run the React app (Question 2)
`npm install`         # if not already run in this folder

`npm run dev`         # Vite dev server on http://localhost:5173 


##################################################

## Poke X – Component Overview

This is a small React + TypeScript + Tailwind app that explores the PokeAPI.  
The goal was to keep the components simple, reusable, and easy to understand.

### Layout

- `Navigation` – Top bar with routing and a dark/light toggle. Clicking the logo sends you home.
- `Footer` – Small shared footer used across pages.

### Pages

- `HomePage` – Shows a 3D carousel of Pokemon. It picks a random starting point, preloads nearby Pokemon, and auto‑plays until the user interacts.
- `PokemonListPage` – Paginated list of Pokemon with two views: grid (cards) and table. Uses `usePokemonList` under the hood.
- `PokemonDetailPage` – Detail view for a single Pokemon, including stats, types, abilities and flavor text, plus simple prev/next navigation by id.

### List Components

- `PokemonGrid` – Card-style layout for browsing Pokemon visually.
- `PokemonTable` – Table layout that’s better for scanning many rows at once.

### Detail Components

- `PokemonCard` – Main wrapper that arranges the detail view into sections.
- `PokemonProfileHeader` – Name, id and main artwork.
- `TypeClassificationTag` – Type chips with colors based on the Pokemon’s types.
- `LoreDetailsCard` – Shows species flavor text pulled from the species endpoint.
- `BaseStatsBlock` – Simple bar visualization of base stats and total.
- `AbilityRoleTag` – Lists abilities and highlights hidden ones.

### Carousel

- `PokemonCarousel3D` – The home page carousel. It calculates which cards should be visible, adds a 3D transform, and falls back to a skeleton state while details are loading. It uses the theme context so the controls match dark/light mode.

### Hooks & Utils

- `useTheme` – Handles global theme state and persists it in `localStorage`.
- `usePokemonList` / `usePokemon` / `usePokemonSpecies` – Small hooks that wrap PokeAPI calls and expose loading/error state.
- `getTypeColorClasses` – Maps a Pokemon type name to a set of Tailwind classes so type colors stay consistent across the app.
