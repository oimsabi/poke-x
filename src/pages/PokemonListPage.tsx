import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemonList';
import { getTypeColorClasses } from '../utils/typeColors';

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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-1">Poke X</h1>
            <p className="text-gray-400">Explore " Experience " Expert</p>
          </div>

          <div className="inline-flex rounded-md shadow-sm border border-gray-700" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md border-r border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                viewMode === GRID ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setViewMode(GRID)}
            >
              Grid
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                viewMode === TABLE ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setViewMode(TABLE)}
            >
              Table
            </button>
          </div>
        </header>

        {loading && <p className="text-gray-300">Loading Pokemon...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && results.length === 0 && (
          <p className="text-gray-400">No Pokemon found.</p>
        )}

        {!loading && !error && results.length > 0 && (
        <div className="space-y-6">
          <div>
            {viewMode === GRID ? (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {results.map((item) => {
                  const idMatch = item.url.match(/\/pokemon\/(\d+)/);
                  const id = idMatch ? idMatch[1] : undefined;
                  const displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
                  const colors = getTypeColorClasses(item.primaryType);
                  const artworkUrl = id
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                    : undefined;

                  return (
                    <Link
                      key={item.name}
                      to={`/pokemon/${item.name}`}
                      className="group bg-gray-900/70 border border-gray-800 rounded-lg p-3 flex flex-col items-center hover:border-blue-500 hover:bg-gray-900 transition-colors"
                    >
                      {artworkUrl && (
                        <img
                          src={artworkUrl}
                          alt={displayName}
                          className="w-16 h-16 object-contain mb-2 transition-transform duration-300 ease-in-out group-hover:scale-150"
                          loading="lazy"
                        />
                      )}
                      <span className="font-semibold text-center">{displayName}<span className="text-xs text-gray-500 mb-1 ml-1">#{id}</span></span>
                      {colors && <span className={`inline-block w-2 h-2 rounded-full ${colors.bg}`} />}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/60">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Thumb
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {results.map((item) => {
                      const idMatch = item.url.match(/\/pokemon\/(\d+)/);
                      const id = idMatch ? idMatch[1] : undefined;
                      const displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
                      const artworkUrl = id
                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                        : undefined;

                      return (
                        <tr key={item.name} className="hover:bg-gray-800/70">
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {artworkUrl && (
                              <img
                                src={artworkUrl}
                                alt={displayName}
                                className="w-10 h-10 object-contain transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                                loading="lazy"
                              />
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">{id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-blue-400">
                            <Link to={`/pokemon/${item.name}`}>{displayName}</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* // Pagination controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing{' '}
              <span className="font-semibold text-gray-200">
                {offset + 1}-{Math.min(offset + pageSize, total || offset + results.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-200">{total || 'many'}</span> Pokémon
            </div>

            <div className="inline-flex rounded-md shadow-sm border border-gray-700 bg-gray-900/70" role="group">
              <button
                type="button"
                disabled={!previous || offset === 0 || loading}
                onClick={() => setOffset((prev) => Math.max(prev - pageSize, 0))}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border-r border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !previous || offset === 0 || loading
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-200 hover:bg-gray-800'
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
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-200 hover:bg-gray-800'
                }`}
              >
                Next
              </button>
            </div>
          </div>
          </div>
        )}
        </div>
      </div>
  );
};
