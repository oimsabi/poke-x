import { Link, useParams } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import { PokemonCard } from '../components/pokemon/detail/PokemonCard';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { LoadingSpinner, ErrorMessage, EmptyState, PageContainer, Button } from '../components/ui';
import { formatPokemonName } from '../utils/format';
import { cn } from '../utils/cn';
import { themeClasses } from '../styles/theme';

export const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { pokemon, loading, error } = usePokemon(id ?? '');

  return (
    <PageContainer>
      <Navigation />
      <div className="max-w-6xl mx-auto py-8 px-4 flex-1">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className={cn('text-3xl font-bold mb-1', themeClasses.text.primary)}>
              Pokemon Detail
            </h1>
            {pokemon && (
              <p className={themeClasses.text.secondary}>
                Viewing details for{' '}
                <span className="font-semibold">
                  {formatPokemonName(pokemon.name)}
                </span>
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {id && !isNaN(Number(id)) && Number(id) > 1 && (
              <Link to={`/pokemon/${Number(id) - 1}`}>
                <Button variant="secondary" size="medium">
                  ←
                </Button>
              </Link>
            )}
            {id && !isNaN(Number(id)) && (
              <Link to={`/pokemon/${Number(id) + 1}`}>
                <Button variant="secondary" size="medium">
                  →
                </Button>
              </Link>
            )}
          </div>
        </header>

        {loading && <LoadingSpinner size="medium" message="Loading Pokemon..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && !pokemon && (
          <EmptyState message="Pokemon not found." />
        )}

        {pokemon && <PokemonCard pokemon={pokemon} />}
      </div>
      <Footer />
    </PageContainer>
  );
};
