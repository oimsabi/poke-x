import { Link, useParams } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import { PokemonCard } from '../components/pokemon/detail/PokemonCard';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';

export const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { pokemon, loading, error } = usePokemon(id ?? '');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <Navigation />
      <div className="max-w-6xl mx-auto py-8 px-4 flex-1">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-gray-100 dark:text-gray-100 text-gray-900">Pokemon Detail</h1>
            {pokemon && (
              <p className="text-gray-400 dark:text-gray-400 text-gray-700">
                Viewing details for{' '}
                <span className="font-semibold">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </span>
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {id && !isNaN(Number(id)) && Number(id) > 1 && (
              <Link
                to={`/pokemon/${Number(id) - 1}`}
                className="px-4 py-2 rounded-md bg-gray-900 dark:bg-gray-900 bg-white border border-gray-700 dark:border-gray-700 border-gray-200 text-sm font-medium text-gray-200 dark:text-gray-200 text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm hover:shadow-md"
              >
                ←
              </Link>
            )}
            {id && !isNaN(Number(id)) && (
              <Link
                to={`/pokemon/${Number(id) + 1}`}
                className="px-4 py-2 rounded-md bg-gray-900 dark:bg-gray-900 bg-white border border-gray-700 dark:border-gray-700 border-gray-200 text-sm font-medium text-gray-200 dark:text-gray-200 text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm hover:shadow-md"
              >
                →
              </Link>
            )}
          </div>
        </header>

        {loading && <p className="text-gray-300 dark:text-gray-300 text-gray-800">Loading Pokemon...</p>}
        {error && <p className="text-red-400 dark:text-red-400 text-red-600">Error: {error}</p>}

        {!loading && !error && !pokemon && (
          <p className="text-gray-400 dark:text-gray-400 text-gray-500">Pokemon not found.</p>
        )}

        {pokemon && <PokemonCard pokemon={pokemon} />}
      </div>
      <Footer />
    </div>
  );
};
