import { useEffect, useState } from "react";
import { listMoviesApi, toggleWatchlistApi } from "../api/movies";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import Skeleton from "../components/Skeleton";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    listMoviesApi({ page }).then((data) => {
      if (!mounted) return;
      const { results = [], total_pages = 1 } = data || {};
      setMovies(results);
      setTotalPages(total_pages);
    }).catch((err) => {
      setError(err.message || "Failed to load movies");
    }).finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [page]);

  const onToggleWatchlist = async (movieId) => {
    try {
      const res = await toggleWatchlistApi(movieId);
      setMovies((prev) => prev.map((m) => m.id === movieId ? { ...m, inWatchlist: res?.inWatchlist } : m));
    } catch (err) {
      setError(err.message || "Failed to update watchlist");
    }
  };

  return (
    <section className="movies-page">
      <h2>Browse Movies</h2>
      {loading && <Skeleton rows={80} />}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && (
        <>
          <MovieGrid movies={movies} onToggleWatchlist={onToggleWatchlist} />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </section>
  );
}
