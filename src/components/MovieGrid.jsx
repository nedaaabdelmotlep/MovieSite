import MovieCard from "./MovieCard";

export default function MovieGrid({ movies = [], onToggleWatchlist }) {
  if (!movies.length) return <p style={{ opacity: 0.8 }}>No movies found.</p>;
  return (
    <div className="movie-grid">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onToggleWatchlist={onToggleWatchlist} />
      ))}
    </div>
  );
}
