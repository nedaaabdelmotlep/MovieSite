import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the API client before importing the module under test
vi.mock('./client', () => {
  // A simple programmable mock that uses handlers set by tests
  const handlers = {
    get: async (_url, _config) => ({ data: {} }),
    post: async (_url, _body) => ({ data: {} }),
  };
  const api = {
    get: (...args) => handlers.get(...args),
    post: (...args) => handlers.post(...args),
  };
  // expose to tests to override
  return {
    default: api,
    __handlers: handlers,
  };
});

import api, { __handlers as clientHandlers } from './client';
import { listMoviesApi, getMovieApi, toggleWatchlistApi, getWatchlistApi } from './movies';

const omdbSearchOk = {
  Response: 'True',
  totalResults: '12',
  Search: [
    { Title: 'Guardians of the Galaxy', Year: '2014', imdbID: 'tt2015381', Type: 'movie', Poster: 'https://img/2015381.jpg' },
    { Title: 'Some Movie', Year: '2001', imdbID: 'tt0000001', Type: 'movie', Poster: 'N/A' },
  ],
};

const omdbDetailsOk = (id) => ({
  Response: 'True',
  Title: id === 'tt2015381' ? 'Guardians of the Galaxy' : 'Some Movie',
  Year: id === 'tt2015381' ? '2014' : '2001',
  imdbID: id,
  Poster: id === 'tt2015381' ? 'https://img/2015381.jpg' : 'N/A',
  Runtime: '121 min',
  imdbRating: '7.8',
  Plot: 'Space misfits save the galaxy.',
});

// Route the mock client based on params used by movies.js
function installOmdbRouter() {
  clientHandlers.get = async (url, config = {}) => {
    const params = config.params || {};
    if (url.includes('omdbapi.com')) {
      if (params.s) {
        return { data: omdbSearchOk };
      }
      if (params.i) {
        return { data: omdbDetailsOk(params.i) };
      }
    }
    return { data: {} };
  };
  clientHandlers.post = async () => ({ data: {} });
}

describe('movies API (OMDb + watchlist)', () => {
  beforeEach(() => {
    // reset localStorage and reinstall router before each test
    localStorage.clear();
    installOmdbRouter();
  });

  it('lists movies via OMDb search and maps fields', async () => {
    const { results, page, total_pages } = await listMoviesApi({ query: 'guardians', page: 2 });
    expect(page).toBe(2);
    expect(total_pages).toBe(2); // 12 total -> 2 pages (ceil(12/10))
    expect(results).toHaveLength(2);
    const first = results[0];
    expect(first).toMatchObject({
      id: 'tt2015381',
      title: 'Guardians of the Galaxy',
      year: '2014',
      inWatchlist: false,
    });
    expect(first.poster).toContain('2015381.jpg');

    const second = results[1];
    expect(second.poster).toBe(''); // N/A poster mapped to empty string
  });

  it('fetches movie details and normalizes rating/duration/overview', async () => {
    const d = await getMovieApi('tt2015381');
    expect(d).toMatchObject({
      id: 'tt2015381',
      title: 'Guardians of the Galaxy',
      year: '2014',
      duration: '121 min',
      overview: 'Space misfits save the galaxy.',
    });
    expect(typeof d.rating).toBe('number');
  });

  it('toggles watchlist add/remove and persists to storage', async () => {
    // Initially not in watchlist
    let res = await toggleWatchlistApi('tt2015381');
    expect(res).toEqual({ inWatchlist: true });

    // After adding, getWatchlist should contain the item in normalized shape
    const listAfterAdd = await getWatchlistApi();
    expect(listAfterAdd.find((m) => m.id === 'tt2015381')).toBeTruthy();

    // Re-toggle removes
    res = await toggleWatchlistApi('tt2015381');
    expect(res).toEqual({ inWatchlist: false });
    const listAfterRemove = await getWatchlistApi();
    expect(listAfterRemove.find((m) => m.id === 'tt2015381')).toBeFalsy();
  });

  it('reflects inWatchlist=true for items already saved', async () => {
    // Seed by adding to watchlist
    await toggleWatchlistApi('tt2015381');
    const { results } = await listMoviesApi({ query: 'anything', page: 1 });
    const saved = results.find((m) => m.id === 'tt2015381');
    expect(saved?.inWatchlist).toBe(true);
  });
});
