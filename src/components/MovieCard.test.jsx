import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
  it('links to details page', () => {
    const movie = { id: 'tt123', title: 'Sample', poster: '', year: '2010', rating: 6.5, inWatchlist: false };
    render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    );
    const link = screen.getAllByRole('link')[0];
    expect(link).toHaveAttribute('href', '/movies/tt123');
  });

  it('toggles watchlist via button', async () => {
    const movie = { id: 'tt123', title: 'Sample', poster: '', year: '2010', rating: 6.5, inWatchlist: false };
    const onToggle = vi.fn();
    render(
      <MemoryRouter>
        <MovieCard movie={movie} onToggleWatchlist={onToggle} />
      </MemoryRouter>
    );
    const btn = screen.getByRole('button', { name: /add to watchlist/i });
    await userEvent.click(btn);
    expect(onToggle).toHaveBeenCalledWith('tt123');
  });
});
