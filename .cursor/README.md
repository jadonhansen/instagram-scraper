# instagram-scraper — Agent Context

A personal analytics tool that scrapes an Instagram account's followers, following, and post likes, then surfaces stats (ghost followers, fans, unfollowers, ordered followers) via a web UI.

## Monorepo Layout

```
instagram-scraper/
├── ig-scraplytics/   # React 18 + Vite + TypeScript frontend (port 5173)
├── server/           # Node.js + Express + TypeScript backend (port 3000)
└── db/               # Flat-file "database" — one folder per IG user
    └── <username>/
        ├── followers.txt   # newline-separated usernames
        ├── following.txt   # newline-separated usernames
        └── postLikes.txt   # newline-separated usernames (one per like event)
```

## Architecture

- **Frontend** (`ig-scraplytics`) calls the backend via `fetch` from `src/api/instagramServer.ts`. Uses React Context (`src/context/UserContext.tsx`) for selected-user state. Component structure: `NavBar`, `OverviewPanel`, `FansPanel`, `GhostsPanel`, `UnfollowersPanel`, modals.
- **Backend** (`server`) is a thin Express API over the flat-file DB. Routes live in `src/index.ts`, business logic in `src/methods.ts`, file/dir IO in `src/queries.ts`, shared types in `src/types.ts`. All responses use the `QueryResponse<T>` discriminated union (`{ data, error }`).
- **DB folder** (`db/`) is read from the server at runtime using `path.join(__dirname, "../../db")`. New users are created by making a new subfolder.

## Core Domain Concepts

- **Ghost followers**: follow you but never liked a post.
- **Fans**: like your posts but don't follow you.
- **Unfollowers**: you follow them, they don't follow back.
- **Ordered followers**: followers ranked by number of posts liked.

## Tech Stack

| Area | Stack |
|---|---|
| Frontend | React 18, Vite 5, TypeScript 5, react-icons, plain CSS |
| Backend | Node.js (ESM), Express 4, fs-extra, TypeScript 5 |
| Tooling | ESLint (`@typescript-eslint`), Prettier, nodemon, tsx |
| Runtime | NPM, Node |

## Conventions

- **Formatting**: tabs (width 4), double quotes, `printWidth: 120`, `useTabs: true`. Enforced via Prettier configs in each package.
- **TypeScript**: `strict: true` everywhere. Frontend also enables `noUnusedLocals` and `noUnusedParameters`.
- **Module system**: both packages are ESM (`"type": "module"`). Relative imports on the server must include extensions when compiled.
- **API responses**: always return the `QueryResponse<T>` / `ApiResponse<T>` shape — never throw across the boundary.
- **No secrets in repo**: the `db/` folder contains personal usernames; treat as PII and never commit new fixtures without scrubbing.

## Scripts

```bash
# Frontend
cd ig-scraplytics && npm run dev       # vite dev server
cd ig-scraplytics && npm run build     # tsc -b && vite build
cd ig-scraplytics && npm run lint      # eslint

# Server
cd server && npm run dev               # nodemon + tsx
cd server && npm run build             # tsc
cd server && npm start                 # node dist/index.js
```

## Known Gaps / Roadmap

- Implement Turborepo.
- Implement the actual scraper as an Express service that writes to `db/<user>/`.
- Add a "scrape" modal in the UI (username + post count) that triggers the scraper and reloads app data on completion.
- Persist last-used username + post count to `localStorage`.
