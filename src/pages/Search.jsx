import { useEffect, useState } from "react";
import { listMoviesApi } from "../api/movies";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    listMoviesApi({ query, page: 1 })
      .then((data) => {
        if (!mounted) return;
        setResults(data?.results || []);
      })
      .catch((err) => setError(err.message || "Search failed"))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [query]);

  return (
    <section className="search-page">
      <h2>Search</h2>
      <div className="search-card">
        <SearchBar onChange={setQuery} />
      </div>
      {loading && <p className="search-status">Searching</p>}
      {error && <p style={{ color: "#ff4d4d" }}>{error}</p>}
      {!loading && !error && <MovieGrid movies={results} />}
    </section>
  );
}
