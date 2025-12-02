import { useState, useEffect } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { PokemonGrid } from '../components/pokemon/list/PokemonGrid';
import { PokemonTable } from '../components/pokemon/list/PokemonTable';

const GRID = 'grid';
const TABLE = 'table';

type ViewMode = typeof GRID | typeof TABLE;

export const PokemonListPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(GRID);
  const [isMobile, setIsMobile] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pageSize = isMobile ? 12 : 24;
  const { results, loading, error, total, next, previous } = usePokemonList({ limit: pageSize, offset });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <Navigation />
      <div className="max-w-6xl mx-auto py-8 px-4 flex-1 w-full">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-6">
          <div className="inline-flex rounded-md shadow-sm border border-gray-700 dark:border-gray-700 border-gray-200" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md border-r border-gray-700 dark:border-gray-700 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                viewMode === GRID ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-900 dark:bg-gray-900 bg-white text-gray-300 dark:text-gray-300 text-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setViewMode(GRID)}
            >
              Grid
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                viewMode === TABLE ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-900 dark:bg-gray-900 bg-white text-gray-300 dark:text-gray-300 text-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setViewMode(TABLE)}
            >
              Table
            </button>
          </div>
        </header>

        {loading && <p className="text-gray-300 dark:text-gray-300 text-gray-800">Loading Pokemon...</p>}
        {error && <p className="text-red-400 dark:text-red-400 text-red-600">Error: {error}</p>}

        {!loading && !error && results.length === 0 && (
          <p className="text-gray-400 dark:text-gray-400 text-gray-500">No Pokemon found.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-6">
            <div>
              {viewMode === GRID ? (
                <PokemonGrid results={results} />
              ) : (
                <PokemonTable results={results} />
              )}
            </div>

            {/* // Pagination controls */}
            <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400 dark:text-gray-400 text-gray-700">
              Showing{' '}
              <span className="font-semibold text-gray-200 dark:text-gray-200 text-gray-900">
                {offset + 1}-{Math.min(offset + pageSize, total || offset + results.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-200 dark:text-gray-200 text-gray-900">{total || 'many'}</span> Pokémon
            </div>

            <div className="inline-flex rounded-md shadow-sm border border-gray-700 dark:border-gray-700 border-gray-200 bg-gray-900/70 dark:bg-gray-900/70 bg-white" role="group">
              <button
                type="button"
                disabled={!previous || offset === 0 || loading}
                onClick={() => setOffset((prev) => Math.max(prev - pageSize, 0))}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border-r border-gray-700 dark:border-gray-700 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !previous || offset === 0 || loading
                    ? 'text-gray-500 dark:text-gray-500 text-gray-400 cursor-not-allowed'
                    : 'text-gray-200 dark:text-gray-200 text-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!next || offset + pageSize >= total || loading}
                onClick={() => setOffset((prev) => prev + pageSize)}
                className={`px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !next || offset + pageSize >= total || loading
                    ? 'text-gray-500 dark:text-gray-500 text-gray-400 cursor-not-allowed'
                    : 'text-gray-200 dark:text-gray-200 text-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Next
              </button>
            </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
