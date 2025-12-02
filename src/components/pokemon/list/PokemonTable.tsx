import { Link } from 'react-router-dom';
import { getTypeColorClasses } from '../../../utils/typeColors';
import type { PokemonListItem } from '../../../types/pokemon';

interface PokemonTableProps {
  results: PokemonListItem[];
}

export const PokemonTable = ({ results }: PokemonTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800 dark:border-gray-800 border-gray-200 dark:bg-gray-900/60 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-800 dark:divide-gray-800 divide-gray-100">
        <thead className="dark:bg-gray-900/80 bg-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-400 text-gray-700 uppercase tracking-wider">
              
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-400 text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-400 text-gray-700 uppercase tracking-wider">
              Types
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 dark:divide-gray-800 divide-gray-100">
          {results.map((item) => {
            const idMatch = item.url.match(/\/pokemon\/(\d+)/);
            const id = idMatch ? idMatch[1] : undefined;
            const displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            const artworkUrl = id
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
              : undefined;

            return (
              <tr key={item.name} className="hover:bg-gray-800/70 dark:hover:bg-gray-800/70 hover:bg-yellow-100/70">
                <td className="px-4 py-3 text-sm text-gray-300 dark:text-gray-300 text-gray-800">
                  {artworkUrl && (
                    <img
                      src={artworkUrl}
                      alt={displayName}
                      className="w-10 h-10 object-contain transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                      loading="lazy"
                    />
                  )}
                </td>
                
                <td className="px-4 py-3 text-sm font-medium text-blue-400 dark:text-blue-400 text-blue-600">
                  <Link to={`/pokemon/${id}`} className="hover:text-blue-700">
                    {displayName} #{id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300 dark:text-gray-300 text-gray-800">
                  {item.types && item.types.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
