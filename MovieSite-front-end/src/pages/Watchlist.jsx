import { useEffect, useState } from "react";
import { getWatchlistApi } from "../api/movies";
import MovieGrid from "../components/MovieGrid";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getWatchlistApi()
      .then((data) => {
        if (!mounted) return;
        setMovies(data || []);
      })
      .catch((err) => setError(err.message || "Failed to load watchlist"))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <section className="watchlist-page">
      <h2>Your Watchlist</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && <MovieGrid movies={movies} />}
    </section>
  );
}
