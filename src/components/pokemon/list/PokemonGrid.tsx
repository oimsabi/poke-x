import { Link } from 'react-router-dom';
import { getTypeColorClasses } from '../../../utils/typeColors';
import { formatPokemonName, extractPokemonId, getPokemonArtworkUrl } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../styles/theme';
import type { PokemonListItem } from '../../../types/pokemon';
import poke_ball_default from '../../../../public/assets/poke_ball_default.svg';

interface PokemonGridProps {
  results: PokemonListItem[];
}

export const PokemonGrid = ({ results }: PokemonGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {results.map((item) => {
        const id = extractPokemonId(item.url);
        const displayName = formatPokemonName(item.name);
        const artworkUrl = id ? getPokemonArtworkUrl(id) : undefined;

        return (
          <Link
            key={item.name}
            to={`/pokemon/${id}`}
            className={cn(
              'group bg-yellow-100/30 dark:bg-gray-900/70',
              'border border-gray-200 dark:border-gray-800',
              'rounded-lg p-3 flex flex-col items-center',
              'hover:border-yellow-500 dark:hover:border-blue-500',
              'hover:bg-white dark:hover:bg-gray-900',
              'transition-colors shadow-sm hover:shadow-md'
            )}
          >
            {artworkUrl && (
              <img
                src={artworkUrl}
                alt={displayName}
                onError={(e) => {
                  e.currentTarget.src = poke_ball_default;
                }}
                className="w-16 h-16 object-contain mb-2 transition-transform duration-300 ease-in-out group-hover:scale-150"
                loading="lazy"
              />
            )}
            <span className={cn('font-semibold text-center', themeClasses.text.primary)}>
              {displayName}
              <span className={cn('text-xs ml-1', themeClasses.text.muted)}>#{id}</span>
            </span>
            {item.types && item.types.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {item.types.map((type) => {
                  const colors = getTypeColorClasses(type.type.name);
                  return (
                    <span
                      key={type.type.name}
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-semibold',
                        colors.bg,
                        colors.text
                      )}
                    >
                      {formatPokemonName(type.type.name)}
                    </span>
                  );
                })}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};
