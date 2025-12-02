import { Link } from 'react-router-dom';
import { getTypeColorClasses } from '../../utils/typeColors';
import { useTheme } from '../../hooks/useTheme';
import type { Pokemon, PokemonListItem } from '../../types/pokemon';

interface CachedPokemon {
  pokemon: Pokemon;
  loaded: boolean;
}

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

            const idMatch = pokemonItem.url.match(/\/pokemon\/(\d+)/);
            const id = idMatch ? idMatch[1] : undefined;
            const displayName = pokemonItem.name.charAt(0).toUpperCase() + pokemonItem.name.slice(1);
            
            const primaryType = pokemon?.types?.[0]?.type?.name || 'normal';
            const colors = getTypeColorClasses(primaryType);
            const artworkUrl = id
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
              : undefined;

            // Calculate position and scale
            const offset = position - prefetchRange; // -2, -1, 0, 1, 2
            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);
            
            // Transform calculations
            const scale = isCenter ? 1 : Math.max(0.6, 1 - absOffset * 0.15);
            const translateX = offset * 120; // Horizontal spacing
            const translateZ = isCenter ? 0 : -absOffset * 50; // Depth
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
                  className={`border-4 border-yellow-500 dark:border-gray-800 rounded-lg shadow-2xl w-[280px] transition-all duration-300 overflow-hidden ${
                    isCenter ? 'shadow-yellow-500/50 hover:shadow-yellow-500/70 dark:shadow-gray-800/50 dark:hover:shadow-gray-800/70' : ''
                  }`}
                >
                  {/* Show basic info immediately, then enhance with full data */}
                  {isLoading || !isLoaded ? (
                    <Link
                      to={`/pokemon/${pokemonItem.name}`}
                      className="block group"
                    >
                      <div className="flex flex-col">
                        {/* Header Section */}
                        <div className="px-4 pt-3 pb-2 border-b-2 border-yellow-500 bg-white dark:bg-gray-900 dark:border-gray-800">
                          <span className="text-gray-500 dark:text-gray-400 text-gray-700 text-xs font-medium">#{id}</span>
                          <h3 className={`font-bold text-gray-900 dark:text-gray-100 ${isCenter ? 'text-2xl' : 'text-xl'}`}>
                            {displayName}
                          </h3>
                        </div>

                        {/* Image Section with primaryType background */}
                        <div className={`bg-white dark:bg-gray-900 px-4 py-4 border-b-2 flex items-center justify-center`}>
                          {artworkUrl && (
                          <div className={`${colors.bg} w-48 h-48`}>
                            <img
                              src={artworkUrl}
                              alt={displayName}
                              className={`w-48 h-48 object-contain transition-transform duration-300 ${
                                isCenter ? 'group-hover:scale-110' : ''
                              }`}
                              loading="lazy"
                            />
                            </div>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className="px-4 py-3 bg-white dark:bg-gray-900">
                          {/* Show loading indicator for types */}
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-4 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : pokemon ? (
                    <Link
                      to={`/pokemon/${id}`}
                      className="block group"
                    >
                      <div className="flex flex-col">
                        {/* Header Section */}
                        <div className={`px-4 pt-3 pb-2 border-yellow-500 dark:border-gray-800 ${colors.bg} dark:bg-gray-900`}>
                          <span className="text-gray-500 dark:text-gray-400 text-gray-700 text-xs font-medium">#{id}</span>
                          <h3 className={`text-yellow-500 dark:text-gray-100 font-bold ${isCenter ? 'text-2xl' : 'text-xl'}`}>
                            {displayName}
                          </h3>
                        </div>

                        {/* Image Section with primaryType background */}
                        <div className={`${colors.bg} dark:bg-gray-900 px-4 py-4 border-yellow-500 dark:border-gray-800 flex items-center justify-center`}>
                          {artworkUrl && (
                          <div className={`bg-gray-900 dark:${colors.bg} w-48 h-48 border-4 border-yellow-500 dark:border-gray-800 ${isCenter ? 'shadow-yellow-500/50 hover:shadow-yellow-500/70 dark:shadow-gray-800/50 dark:hover:shadow-gray-800/70' : ''}`}>
                            <img
                              src={artworkUrl}
                              alt={displayName}
                              className={`w-48 h-48 object-contain transition-transform duration-300 ${
                                isCenter ? 'group-hover:scale-110' : ''
                              }`}
                              loading="lazy"
                            />
                            </div>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className={`px-4 py-3 ${colors.bg} dark:bg-gray-900`}>
                          {pokemon.types && pokemon.types.length > 0 && (
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              {pokemon.types.slice(0, 2).map((type, idx) => {
                                const typeColors = getTypeColorClasses(type.type.name);
                                return (
                                  <span
                                    key={idx}
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColors.bg} ${typeColors.text}`}
                                  >
                                    {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900/90 hover:bg-gray-100 dark:hover:bg-gray-800 hover:bg-blue-50 text-white dark:text-white text-gray-900 p-4 rounded-full shadow-xl dark:shadow-xl shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 z-20 border border-gray-100"
          aria-label="Previous Pokemon"
        >
          <svg className="w-6 h-6" fill="none" stroke={theme === 'dark' ? 'white' : 'black'} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900/90 hover:bg-gray-100 dark:hover:bg-gray-800 hover:bg-blue-50 text-white dark:text-white text-gray-900 p-4 rounded-full shadow-xl dark:shadow-xl shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 z-20 border border-gray-100"
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
