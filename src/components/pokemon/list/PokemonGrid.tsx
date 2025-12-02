import { Link } from 'react-router-dom';
import { getTypeColorClasses } from '../../../utils/typeColors';
import type { PokemonListItem } from '../../../types/pokemon';

interface PokemonGridProps {
  results: PokemonListItem[];
}

export const PokemonGrid = ({ results }: PokemonGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {results.map((item) => {
        const idMatch = item.url.match(/\/pokemon\/(\d+)/);
        const id = idMatch ? idMatch[1] : undefined;
        const displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        const artworkUrl = id
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          : undefined;

        return (
          <Link
            key={item.name}
            to={`/pokemon/${id}`}
            className="group bg-yellow-100/30 dark:bg-gray-900/70 border border-gray-800 dark:border-gray-800 border-gray-200 rounded-lg p-3 flex flex-col items-center hover:border-yellow-500 dark:hover:border-blue-500 hover:bg-gray-900 dark:hover:bg-gray-900 hover:bg-white transition-colors shadow-sm hover:shadow-md"
          >
            {artworkUrl && (
              <img
                src={artworkUrl}
                alt={displayName}
                className="w-16 h-16 object-contain mb-2 transition-transform duration-300 ease-in-out group-hover:scale-150"
                loading="lazy"
              />
            )}
            <span className="font-semibold text-center text-gray-100 dark:text-gray-100 text-gray-900">
              {displayName}
              <span className="text-xs text-gray-500 dark:text-gray-500 text-gray-500 mb-1 ml-1">#{id}</span>
            </span>
            {item.types && item.types.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {item.types.map((type) => {
                  const colors = getTypeColorClasses(type.type.name);
                  return (
                    <span
                      key={type.type.name}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
                    >
                      {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
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
