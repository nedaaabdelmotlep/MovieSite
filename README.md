<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# MooNSine Frontend (React + Vite)

![CI](https://github.com/nedaaabdelmotlep/MovieSite/actions/workflows/ci.yml/badge.svg?branch=front-end)

Frontend for a movie site with authentication, browsing, search, details, and watchlist.

## Quick Start

1. Configure backend URL (Django assumed):

```
VITE_API_URL=http://127.0.0.1:8000
```

2. Install and run:

```cmd
npm install
npm run dev
```

Open the printed local URL in your browser.

## Features

- Auth (login/register) via API, stored in a lightweight global store (zustand)
- Layout with header navigation and protected routes (`/profile`, `/watchlist`)
- Browse movies with pagination, search page with debounce, movie details
- Watchlist page (requires auth)
- Centralized API client (axios) with token injection

## Expected Backend Endpoints

- `POST /api/auth/login/` → `{ user, token }`
- `POST /api/auth/register/` → `{ user, token }`
- `GET /api/movies/?page=&query=` → `{ results, total_pages }`
- `GET /api/movies/:id/` → movie object
- `GET /api/user/watchlist/` → array of movies
- `POST /api/user/watchlist/` body: `{ movieId }` → `{ inWatchlist: boolean }`

Adjust fields or add a small mapping in `src/api/movies.js` if your backend uses different keys, e.g. `poster_url` → `poster`.

## Structure

- `src/api/*` — axios client and endpoint modules
- `src/store/auth.js` — zustand store for auth
- `src/layouts/AppLayout.jsx` — layout + header + footer + toast container
- `src/pages/*` — pages (`MoviesList`, `MovieDetails`, `Search`, `Watchlist`, etc.)
- `src/components/*` — UI building blocks

## Testing (optional)

Install if you want tests:

```cmd
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

Run all tests:

```cmd
npm run test:all
```

CI subset (API tests only, used by GitHub Actions):

```cmd
npm run test:ci
```
>>>>>>> b06f674 (Temporary commit: my local frontend work)
