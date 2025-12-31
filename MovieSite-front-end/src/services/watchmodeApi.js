export const wmStatus = () => fetch("/api/status").then(r => r.json());

export const wmSearch = (q, types = "movie") =>
  fetch(`/api/search?q=${encodeURIComponent(q)}&types=${encodeURIComponent(types)}`)
    .then(r => r.json());
