import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders and disables prev on first page', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onChange={onChange} />);
    expect(screen.getByText(/Page 1 \/ 3/)).toBeInTheDocument();
    const prev = screen.getByRole('button', { name: /prev/i });
    const next = screen.getByRole('button', { name: /next/i });
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    await userEvent.click(next);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables next on last page', async () => {
    const onChange = vi.fn();
    render(<Pagination page={5} totalPages={5} onChange={onChange} />);
    const next = screen.getByRole('button', { name: /next/i });
    expect(next).toBeDisabled();
  });
});
