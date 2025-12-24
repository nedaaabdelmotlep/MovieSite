import api from "./client";

const OMDB_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = "bed48618"; // Provided by user

// ---- Local Watchlist (client-side) ----
const WATCHLIST_KEY = "watchlist";

const readWatchlist = () => {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const writeWatchlist = (list) => {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list || []));
  } catch {
    // ignore write errors
  }
};

const isInWatchlist = (id) => {
  return readWatchlist().some((m) => m?.id === id);
};

const upsertToWatchlist = (movie) => {
  const list = readWatchlist();
  const idx = list.findIndex((m) => m?.id === movie.id);
  if (idx >= 0) {
    list[idx] = movie;
  } else {
    list.unshift(movie);
  }
  writeWatchlist(list);
};

const removeFromWatchlist = (id) => {
  const list = readWatchlist().filter((m) => m?.id !== id);
  writeWatchlist(list);
};

// Map OMDb search item to app's movie shape
const mapSearchItem = (item) => ({
  id: item?.imdbID,
  title: item?.Title || "Untitled",
  poster: item?.Poster && item.Poster !== "N/A" ? item.Poster : "",
  year: item?.Year || "",
  rating: null,
  inWatchlist: isInWatchlist(item?.imdbID),
});

// Map OMDb full details to app's movie shape
const mapDetails = (m) => ({
  id: m?.imdbID,
  title: m?.Title || "Untitled",
  poster: m?.Poster && m.Poster !== "N/A" ? m.Poster : "",
  year: m?.Year || "",
  duration: m?.Runtime && m.Runtime !== "N/A" ? m.Runtime : "",
  rating: m?.imdbRating && m.imdbRating !== "N/A" ? Number(m.imdbRating) : null,
  overview: m?.Plot && m.Plot !== "N/A" ? m.Plot : "",
  inWatchlist: isInWatchlist(m?.imdbID),
});

export const listMoviesApi = async (params = {}) => {
  const { query, page = 1 } = params;
  const s = (query && query.trim()) || "movie"; // default search term to populate list
  const { data } = await api.get(OMDB_URL, {
    params: {
      apikey: OMDB_API_KEY,
      s,
      type: "movie",
      page,
    },
  });

  if (data?.Response === "True") {
    const results = (data.Search || []).map(mapSearchItem);
    const totalResults = Number(data.totalResults || 0);
    const total_pages = Math.max(1, Math.ceil(totalResults / 10));
    return { results, page, total_pages };
  }

  // When OMDb returns an error, surface a friendly message
  const message = data?.Error || "No results found";
  throw new Error(message);
};

export const getMovieApi = async (id) => {
  const { data } = await api.get(OMDB_URL, {
    params: {
      apikey: OMDB_API_KEY,
      i: id,
      plot: "full",
    },
  });
  if (data?.Response === "True") {
    return mapDetails(data);
  }
  throw new Error(data?.Error || "Movie not found");
};

// Watchlist implemented client-side with localStorage
export const toggleWatchlistApi = async (movieId) => {
  // If currently in watchlist, remove. Otherwise, fetch details and add.
  const currentlyIn = isInWatchlist(movieId);
  if (currentlyIn) {
    removeFromWatchlist(movieId);
    return { inWatchlist: false };
  }

  // Fetch details to store a rich item in watchlist
  const detailsRes = await api.get(OMDB_URL, {
    params: {
      apikey: OMDB_API_KEY,
      i: movieId,
      plot: "short",
    },
  });
  const d = detailsRes?.data;
  if (d?.Response === "True") {
    const movie = mapDetails(d);
    upsertToWatchlist(movie);
    return { inWatchlist: true };
  }
  throw new Error(d?.Error || "Unable to update watchlist");
};

export const getWatchlistApi = async () => {
  // Return as-is; items already normalized to UI shape
  return readWatchlist();
};
