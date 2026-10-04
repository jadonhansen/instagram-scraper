# instagram-scraper — Agent Context

A personal analytics tool that scrapes an Instagram account's followers, following, and post likes, then surfaces stats (ghost followers, fans, unfollowers, ordered followers) via a web UI.

## Monorepo Layout

```
instagram-scraper/
├── ig-scraplytics/   # React 18 + Vite + TypeScript frontend (port 5173)
├── server/           # Node.js + Express + TypeScript backend (port 3000), includes the scraper
└── db/               # Flat-file "database" — one folder per IG user
    └── <username>/
        ├── followers.txt   # newline-separated usernames
        ├── following.txt   # newline-separated usernames
        └── postLikes.txt   # newline-separated usernames (one per like event)
```

## Architecture

- **Frontend** (`ig-scraplytics`) calls the backend via `fetch` from `src/api/instagramServer.ts`. Uses React Context (`src/context/UserContext.tsx`) for selected-user state. Component structure: `NavBar`, `OverviewPanel`, `FansPanel`, `GhostsPanel`, `UnfollowersPanel`, modals.
- **Backend** (`server`) is a thin Express API over the flat-file DB. Routes live in `src/index.ts`, business logic in `src/methods.ts`, file/dir IO in `src/queries.ts`, shared types in `src/types.ts`, db paths and file names in `src/db.ts`. All responses use the `QueryResponse<T>` discriminated union (`{ data, error }`).
- **Scraper** (`server/src/scraper/`) drives the installed Google Chrome through `playwright-core` with a persistent profile in `server/.ig-session/` (gitignored, holds session cookies). The first run opens Chrome on the Instagram login page and waits for a manual login, unless the caller passes the `sessionid` cookie from another browser (`sessionId` in `POST /scrape`, `IG_SESSIONID` for the CLI), which is added to the profile. The logged-in account is looked up by id (`/api/v1/users/<id>/info/`); other accounts use `web_profile_info`. It pages through the Instagram web app's `friendships/<id>/followers` and `following` JSON endpoints from inside the page, 2 to 5 seconds apart, with backoff on rate limits (1, 2, 5 and 10 minutes, then the job fails). It writes `followers.txt` and `following.txt` atomically (temp file plus rename, no trailing newline) and creates an empty `postLikes.txt` if missing. Post likes are not scraped yet.
- **Scrape jobs**: `POST /scrape { user, sessionId? }` starts a background job and returns it, `GET /scrape/:id` returns its progress, and `POST /scrape/:id/stop` cancels it (status `cancelled`). Lists are written only after every list is collected, so a stopped or failed run leaves existing files untouched. Rate-limit responses are logged to the server console with the endpoint and response body. Only one job runs at a time (409 otherwise). The UI's Scrape modal (`ScrapeModal.tsx`) polls the job and bumps `dataVersion` in `UserContext` so panels refetch.
- **DB folder** (`db/`) is read from the server at runtime using `path.join(__dirname, "../../db")`. New users are created by making a new subfolder or by scraping them.

## Core Domain Concepts

- **Ghost followers**: follow you but never liked a post.
- **Fans**: like your posts but don't follow you.
- **Unfollowers**: you follow them, they don't follow back.
- **Ordered followers**: followers ranked by number of posts liked.

## Tech Stack

| Area | Stack |
|---|---|
| Frontend | React 18, Vite 5, TypeScript 5, react-icons, plain CSS |
| Backend | Node.js (ESM), Express 4, fs-extra, playwright-core (drives installed Chrome), TypeScript 5 |
| Tooling | ESLint (`@typescript-eslint`), Prettier, nodemon, tsx, Vitest (server) |
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
cd server && npm test                  # vitest
[IG_SESSIONID=<cookie>] npm run scrape -- <username> [--only followers|following] [--headless]  # from server/
```

## Known Gaps / Roadmap

- Implement Turborepo.
- Scrape post likes (last N posts and their likers) into `postLikes.txt`, with N as a Scrape modal field persisted to `localStorage`.
