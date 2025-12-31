import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieApi, toggleWatchlistApi } from "../api/movies";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMovieApi(id)
      .then((data) => {
        if (!mounted) return;
        setMovie(data);
      })
      .catch((err) => setError(err.message || "Failed to load movie"))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const onToggleWatchlist = async () => {
    try {
      const res = await toggleWatchlistApi(movie.id);
      setMovie((m) => ({ ...m, inWatchlist: res?.inWatchlist }));
    } catch (err) {
      setError(err.message || "Failed to update watchlist");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!movie) return null;

  return (
    <section className="movie-details">
      <div className="hero">
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <div>
          <h2>{movie.title}</h2>
          <p>{movie.year} • {movie.duration} • ⭐ {movie.rating ?? "-"}</p>
          <p>{movie.overview}</p>
          <button onClick={onToggleWatchlist}>
            {movie.inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
        </div>
      </div>
    </section>
  );
}
