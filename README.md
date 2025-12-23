# MooNSine Frontend (React + Vite)

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

Run:

```cmd
npm run test
```
