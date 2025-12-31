import api from "./client";

export const listMoviesApi = async (params = {}) => {
  const { data } = await api.get("/api/movies/", { params });
  return data; // expect { results, page, total_pages }
};

export const getMovieApi = async (id) => {
  const { data } = await api.get(`/api/movies/${id}/`);
  return data;
};

export const toggleWatchlistApi = async (movieId) => {
  const { data } = await api.post(`/api/user/watchlist/`, { movieId });
  return data; // { inWatchlist: boolean }
};

export const getWatchlistApi = async () => {
  const { data } = await api.get(`/api/user/watchlist/`);
  return data; // array of movies
};
