import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock API module used by MoviesList
vi.mock('../api/movies', () => {
  let callCount = 0;
  const listMoviesApi = vi.fn(async ({ page = 1 }) => {
    callCount++;
    const base = (page - 1) * 2;
    return {
      results: [
        { id: `tt${base + 1}`, title: `Movie ${base + 1}`, poster: '', year: '2000', rating: 7.0, inWatchlist: false },
        { id: `tt${base + 2}`, title: `Movie ${base + 2}`, poster: '', year: '2001', rating: 7.5, inWatchlist: false },
      ],
      total_pages: 3,
    };
  });
  const toggleWatchlistApi = vi.fn(async (id) => ({ inWatchlist: true }));
  return { listMoviesApi, toggleWatchlistApi, __callCount: () => callCount };
});

import MoviesList from './MoviesList';
import { listMoviesApi, toggleWatchlistApi, __callCount } from '../api/movies';

describe('MoviesList page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads movies and paginates', async () => {
    render(
      <MemoryRouter>
        <MoviesList />
      </MemoryRouter>
    );

    // Shows loading skeleton initially
    expect(screen.getByText(/browse movies/i)).toBeInTheDocument();
    expect(screen.queryByText(/no movies found/i)).not.toBeInTheDocument();

    // Wait for first load
    await waitFor(() => {
      expect(screen.getByText(/Page 1 \/ 3/)).toBeInTheDocument();
      expect(screen.getByText(/Movie 1/)).toBeInTheDocument();
      expect(screen.getByText(/Movie 2/)).toBeInTheDocument();
    });
    expect(listMoviesApi).toHaveBeenCalledWith({ page: 1 });

    // Go to next page
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText(/Page 2 \/ 3/)).toBeInTheDocument();
      expect(screen.getByText(/Movie 3/)).toBeInTheDocument();
      expect(screen.getByText(/Movie 4/)).toBeInTheDocument();
    });
    expect(listMoviesApi).toHaveBeenCalledWith({ page: 2 });
  });

  it('toggles watchlist status for a movie', async () => {
    render(
      <MemoryRouter>
        <MoviesList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Movie 1/)).toBeInTheDocument();
    });
    const toggleBtn = screen.getAllByRole('button', { name: /add to watchlist/i })[0];
    await userEvent.click(toggleBtn);
    expect(toggleWatchlistApi).toHaveBeenCalled();
    // After toggling, label should change to remove
    const updatedBtn = screen.getAllByRole('button')[0];
    expect(updatedBtn).toHaveTextContent(/remove from watchlist/i);
  });
});
