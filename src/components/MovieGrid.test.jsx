import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MovieGrid from './MovieGrid';

describe('MovieGrid', () => {
  it('shows empty state when no movies', () => {
    render(<MovieGrid movies={[]} />);
    expect(screen.getByText(/no movies found/i)).toBeInTheDocument();
  });

  it('renders movie cards and triggers watchlist toggle', async () => {
    const movies = [
      { id: 'tt1', title: 'A', poster: '', year: '2000', rating: 7.1, inWatchlist: false },
      { id: 'tt2', title: 'B', poster: '', year: '2001', rating: 8.0, inWatchlist: true },
    ];
    const onToggleWatchlist = vi.fn();
    render(
      <MemoryRouter>
        <MovieGrid movies={movies} onToggleWatchlist={onToggleWatchlist} />
      </MemoryRouter>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    await userEvent.click(buttons[0]);
    expect(onToggleWatchlist).toHaveBeenCalledWith('tt1');
  });
});
