import { Link } from "react-router-dom";

export default function MovieCard({ movie, onToggleWatchlist }) {
  const { id, title, poster, year, rating, inWatchlist } = movie;
  return (
    <div className="movie-card" data-id={id}>
      <Link to={`/movies/${id}`}>
        <img src={poster} alt={`${title} poster`} loading="lazy" />
      </Link>
      <div className="movie-meta">
        <h4>
          <Link to={`/movies/${id}`}>{title}</Link>
        </h4>
        <p>{year} • ⭐ {rating ?? "-"}</p>
        {onToggleWatchlist && (
          <button className="btn btn-secondary watchlist-btn" onClick={() => onToggleWatchlist(id)}>
            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
        )}
      </div>
    </div>
  );
}
