import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {

  it('debounces onChange calls by 400ms', async () => {
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} />);
    const input = screen.getByRole('searchbox', { name: /search movies/i });
    await userEvent.type(input, 'guard');
    expect(onChange).not.toHaveBeenCalled();
    // Immediately after typing, debounce should not call
    expect(onChange).not.toHaveBeenCalled();
    // Wait for 400ms in real-time to allow debounce to fire
    await new Promise((r) => setTimeout(r, 401));
    expect(onChange).toHaveBeenCalledWith('guard');
  });

  it('autofocuses the input', () => {
    render(<SearchBar />);
    const input = screen.getByRole('searchbox', { name: /search movies/i });
    expect(document.activeElement).toBe(input);
  });
});
