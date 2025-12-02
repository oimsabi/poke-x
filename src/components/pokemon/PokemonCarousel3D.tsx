import { Link } from 'react-router-dom';
import { getTypeColorClasses } from '../../utils/typeColors';
import { formatPokemonName, extractPokemonId, getPokemonArtworkUrl } from '../../utils/format';
import { cn } from '../../utils/cn';
import { useTheme } from '../../hooks/useTheme';
import type { CachedPokemon, PokemonListItem } from '../../types/pokemon';
import poke_ball_default from '../../../public/assets/poke_ball_default.svg';

interface PokemonCarousel3DProps {
  currentIndex: number;
  pokemonList: PokemonListItem[];
  pokemonCache: Map<string, CachedPokemon>;
  loadingPokemon: Set<number>;
  goToPrevious: () => void;
  goToNext: () => void;
  goToIndex: (index: number) => void;
  prefetchRange?: number;
}

export const PokemonCarousel3D = ({
  currentIndex,
  pokemonList,
  pokemonCache,
  loadingPokemon,
  goToPrevious,
  goToNext,
  goToIndex,
  prefetchRange = 4,
}: PokemonCarousel3DProps) => {
  const { theme } = useTheme();
  
  // Get visible card indices
  const getVisibleIndices = () => {
    const indices: number[] = [];
    for (let i = -prefetchRange; i <= prefetchRange; i++) {
      const index = (currentIndex + i + pokemonList.length) % pokemonList.length;
      indices.push(index);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <>
      {/* 3D Carousel Container */}
      <div className="relative h-[600px] flex items-center justify-center perspective-1000">
        <div className="relative w-full h-full">
          {visibleIndices.map((index, position) => {
            const pokemonItem = pokemonList[index];
            const cachedPokemon = pokemonCache.get(pokemonItem.name);
            const pokemon = cachedPokemon?.pokemon;
            const isLoaded = cachedPokemon?.loaded ?? false;
            const isLoading = loadingPokemon.has(index);

            const id = extractPokemonId(pokemonItem.url);
            const displayName = formatPokemonName(pokemonItem.name);
            
            const primaryType = pokemon?.types?.[0]?.type?.name || 'normal';
            const colors = getTypeColorClasses(primaryType);
            const artworkUrl = id ? getPokemonArtworkUrl(id) : poke_ball_default;

            // Calculate position and scale
            const offset = position - prefetchRange;
            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);
            
            // Transform calculations
            const scale = isCenter ? 1 : Math.max(0.6, 1 - absOffset * 0.15);
            const translateX = offset * 120;
            const translateZ = isCenter ? 0 : -absOffset * 50;
            const opacity = isCenter ? 1 : Math.max(0.4, 1 - absOffset * 0.2);
            const zIndex = isCenter ? 10 : 5 - absOffset;

            return (
              <div
                key={`${pokemonItem.name}-${index}`}
                className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => isCenter && goToIndex(index)}
              >
                <div
                  className={cn(
                    'border-4 border-yellow-500 dark:border-gray-800 rounded-lg shadow-2xl w-[280px] transition-all duration-300 overflow-hidden',
                    isCenter && 'shadow-yellow-500/50 hover:shadow-yellow-500/70 dark:shadow-gray-800/50 dark:hover:shadow-gray-800/70'
                  )}
                >
                  {isLoading || !isLoaded ? null : pokemon ? (
                    <Link to={`/pokemon/${id}`} className="block group">
                      <div className="flex flex-col">
                        {/* Header Section */}
                        <div className={cn(
                          'px-4 pt-2 pb-2 flex flex-col',
                          colors.bg,
                          'dark:bg-gray-900'
                        )}>
                          <span className="text-gray-700 dark:text-gray-400 text-xs font-medium ml-auto">
                            #{id}
                          </span>
                          <h3 className={cn(
                            'text-yellow-500 dark:text-gray-100 font-bold',
                            isCenter ? 'text-2xl' : 'text-xl'
                          )}>
                            {displayName}
                          </h3>
                        </div>

                        {/* Image Section */}
                        <div className={cn(
                          colors.bg,
                          'dark:bg-gray-900 px-4 py-4 flex items-center justify-center'
                        )}>
                          {artworkUrl && (
                            <div className={cn(
                              'bg-gray-900 w-48 h-48 border-4 border-yellow-500 dark:border-gray-800',
                              isCenter && 'shadow-yellow-500/50 hover:shadow-yellow-500/70 dark:shadow-gray-800/50 dark:hover:shadow-gray-800/70'
                            )}>
                              <img
                                src={artworkUrl}
                                alt={displayName}
                                onError={(e) => {
                                  e.currentTarget.src = poke_ball_default;
                                }}
                                className={cn(
                                  'w-48 h-48 object-contain transition-transform duration-300',
                                  isCenter && 'group-hover:scale-110'

                                )}
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>

                        {/* Type Tags Section */}
                        <div className={cn(colors.bg, 'dark:bg-gray-900 px-4 py-3')}>
                          {pokemon.types && pokemon.types.length > 0 && (
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              {pokemon.types.slice(0, 2).map((type, idx) => {
                                const typeColors = getTypeColorClasses(type.type.name);
                                return (
                                  <span
                                    key={idx}
                                    className={cn(
                                      'px-2 py-1 rounded-full text-xs font-semibold',
                                      typeColors.bg,
                                      typeColors.text
                                    )}
                                  >
                                    {formatPokemonName(type.type.name)}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2',
            'bg-white dark:bg-gray-900/90',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-900 dark:text-white',
            'p-4 rounded-full shadow-lg transition-all hover:scale-110',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'z-20 border border-gray-100'
          )}
          aria-label="Previous Pokemon"
        >
          <svg className="w-6 h-6" fill="none" stroke={theme === 'dark' ? 'white' : 'black'} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2',
            'bg-white dark:bg-gray-900/90',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-900 dark:text-white',
            'p-4 rounded-full shadow-lg transition-all hover:scale-110',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'z-20 border border-gray-100'
          )}
          aria-label="Next Pokemon"
        >
          <svg className="w-6 h-6" fill="none" stroke={theme === 'dark' ? 'white' : 'black'} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </>
  );
};
