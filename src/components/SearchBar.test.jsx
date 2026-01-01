import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces onChange calls by 400ms', async () => {
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} />);
    const input = screen.getByRole('searchbox', { name: /search movies/i });
    await userEvent.type(input, 'guard');
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(399);
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onChange).toHaveBeenCalledWith('guard');
  });

  it('autofocuses the input', () => {
    render(<SearchBar />);
    const input = screen.getByRole('searchbox', { name: /search movies/i });
    expect(document.activeElement).toBe(input);
  });
});
