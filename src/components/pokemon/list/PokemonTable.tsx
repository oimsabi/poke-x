import { Link } from 'react-router-dom';
import { getTypeColorClasses } from '../../../utils/typeColors';
import { formatPokemonName, extractPokemonId, getPokemonArtworkUrl } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../styles/theme';
import type { PokemonListItem } from '../../../types/pokemon';
import poke_ball_default from '../../../../public/assets/poke_ball_default.svg';

interface PokemonTableProps {
  results: PokemonListItem[];
}

export const PokemonTable = ({ results }: PokemonTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
        <thead className="bg-white dark:bg-gray-900/80">
          <tr>
            <th className={cn('px-4 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.text.secondary)}>
              
            </th>
            <th className={cn('px-4 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.text.secondary)}>
              Name
            </th>
            <th className={cn('px-4 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.text.secondary)}>
              Types
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {results.map((item) => {
            const id = extractPokemonId(item.url);
            const displayName = formatPokemonName(item.name);
            const artworkUrl = id ? getPokemonArtworkUrl(id) : undefined;

            return (
              <tr key={item.name} className="hover:bg-yellow-100/70 dark:hover:bg-gray-800/70">
                <td className={cn('px-4 py-3 text-sm', themeClasses.text.primary)}>
                  {artworkUrl && (
                    <img
                      src={artworkUrl}
                      alt={displayName}
                      onError={(e) => {
                        e.currentTarget.src = poke_ball_default;
                      }}
                      className="w-10 h-10 object-contain transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                      loading="lazy"
                    />
                  )}
                </td>
                
                <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <Link to={`/pokemon/${id}`} className="hover:text-blue-700">
                    {displayName} #{id}
                  </Link>
                </td>
                <td className={cn('px-4 py-3 text-sm', themeClasses.text.primary)}>
                  {item.types && item.types.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
