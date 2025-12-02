import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { pokemonApi } from '../api/pokemon';
import { getTypeColorClasses } from '../utils/typeColors';
import { Navigation } from '../components/Navigation';
import type { Pokemon, PokemonListItem } from '../types/pokemon';

interface CachedPokemon {
  pokemon: Pokemon;
  loaded: boolean;
}

export const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [pokemonCache, setPokemonCache] = useState<Map<string, CachedPokemon>>(new Map());
  const [loadingList, setLoadingList] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [batchOffset, setBatchOffset] = useState(0); // Track the offset of the first batch

  const BATCH_SIZE = 50;
  const PREFETCH_RANGE = 2; // Show 2 cards on each side

  // Load initial Pokemon list with random start
  useEffect(() => {
    const loadInitialList = async () => {
      try {
        setLoadingList(true);
        setError(null);
        
        // First, get the total count with a small request
        const countResponse = await pokemonApi.getList(1, 0);
        const total = countResponse.count;
        setTotalCount(total);
        
        // Generate random index
        const randomIndex = Math.floor(Math.random() * total);
        
        // Calculate the offset to load a batch containing the random Pokemon
        const offset = Math.max(0, randomIndex - Math.floor(BATCH_SIZE / 2));
        const adjustedOffset = Math.min(offset, Math.max(0, total - BATCH_SIZE));
        setBatchOffset(adjustedOffset);
        
        // Load the batch containing the random Pokemon
        const response = await pokemonApi.getList(BATCH_SIZE, adjustedOffset);
        setPokemonList(response.results);
        
        // Set currentIndex to the position of random Pokemon in the loaded batch
        const indexInBatch = randomIndex - adjustedOffset;
        setCurrentIndex(indexInBatch);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pokemon list');
      } finally {
        setLoadingList(false);
      }
    };

    loadInitialList();
  }, []);

  // Load more Pokemon when approaching end of list
  useEffect(() => {
    if (loadingList || !totalCount) return;
    
    const remaining = totalCount - pokemonList.length;
    if (remaining === 0) return;

    if (currentIndex >= pokemonList.length - 10) {
      const loadMore = async () => {
        try {
          const nextBatch = Math.min(BATCH_SIZE, remaining);
          const response = await pokemonApi.getList(nextBatch, batchOffset + pokemonList.length);
          setPokemonList((prev) => [...prev, ...response.results]);
        } catch (err) {
          console.error('Failed to load more Pokemon:', err);
        }
      };
      loadMore();
    }
  }, [currentIndex, pokemonList.length, totalCount, loadingList, batchOffset]);

  // Lazy load Pokemon data
  const loadPokemonData = useCallback(async (pokemonItem: PokemonListItem, index: number, priority: boolean = false) => {
    const cacheKey = pokemonItem.name;
    
    if (pokemonCache.has(cacheKey)) {
      const cached = pokemonCache.get(cacheKey)!;
      if (cached.loaded) {
        return cached.pokemon;
      }
    }

    setLoadingPokemon((prev) => new Set(prev).add(index));
    setPokemonCache((prev) => {
      const newCache = new Map(prev);
      newCache.set(cacheKey, { pokemon: {} as Pokemon, loaded: false });
      return newCache;
    });

    try {
      const pokemon = await pokemonApi.getByName(pokemonItem.name);
      
      setPokemonCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, { pokemon, loaded: true });
        return newCache;
      });

      return pokemon;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pokemon');
      throw err;
    } finally {
      setLoadingPokemon((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  }, [pokemonCache]);

  // Load visible Pokemon - prioritize center card
  useEffect(() => {
    if (pokemonList.length === 0) return;

    // First, load center card with priority
    const centerPokemonItem = pokemonList[currentIndex];
    if (centerPokemonItem) {
      const cached = pokemonCache.get(centerPokemonItem.name);
      if (!cached?.loaded && !loadingPokemon.has(currentIndex)) {
        loadPokemonData(centerPokemonItem, currentIndex, true).catch(() => {});
      }
    }

    // Then load adjacent cards
    const indicesToLoad: number[] = [];
    for (let i = -PREFETCH_RANGE; i <= PREFETCH_RANGE; i++) {
      if (i === 0) continue; // Skip center, already loading
      const index = (currentIndex + i + pokemonList.length) % pokemonList.length;
      indicesToLoad.push(index);
    }

    // Load adjacent cards with slight delay to prioritize center
    setTimeout(() => {
      indicesToLoad.forEach((index) => {
        const pokemonItem = pokemonList[index];
        if (pokemonItem) {
          const cached = pokemonCache.get(pokemonItem.name);
          if (!cached?.loaded && !loadingPokemon.has(index)) {
            loadPokemonData(pokemonItem, index, false).catch(() => {});
          }
        }
      });
    }, 100);
  }, [currentIndex, pokemonList, pokemonCache, loadPokemonData, loadingPokemon]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || pokemonList.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pokemonList.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, pokemonList.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pokemonList.length) % pokemonList.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pokemonList.length);
    setIsAutoPlaying(false);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Get visible card indices
  const getVisibleIndices = () => {
    const indices: number[] = [];
    for (let i = -PREFETCH_RANGE; i <= PREFETCH_RANGE; i++) {
      const index = (currentIndex + i + pokemonList.length) % pokemonList.length;
      indices.push(index);
    }
    return indices;
  };

  // Calculate global index correctly
  const getGlobalIndex = () => {
    return batchOffset + currentIndex;
  };

  if (loadingList) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 dark:text-gray-300 text-gray-800 text-xl">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  if (error && pokemonList.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <p className="text-red-400 dark:text-red-400 text-red-600 text-xl">Error: {error}</p>
      </div>
    );
  }

  if (pokemonList.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-400 text-gray-500 text-xl">No Pokemon found.</p>
      </div>
    );
  }

  const visibleIndices = getVisibleIndices();
  const globalIndex = getGlobalIndex();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      <Navigation />

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Pokemon Count Display */}
        {totalCount && (
          <div className="text-center mb-8">
            <p className="text-gray-500 dark:text-gray-500 text-gray-700 text-sm">
              Showing {globalIndex + 1} of {totalCount} Pokemon
            </p>
          </div>
        )}

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
              const offset = position - PREFETCH_RANGE; // -2, -1, 0, 1, 2
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
                    className={`border-4 border-yellow-500 rounded-lg shadow-2xl w-[280px] transition-all duration-300 overflow-hidden ${
                      isCenter ? 'shadow-yellow-500/50 hover:shadow-yellow-500/70' : ''
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
                          <div className="px-4 pt-3 pb-2 border-b-2 border-yellow-500 bg-white dark:bg-gray-900">
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
                        to={`/pokemon/${pokemonItem.name}`}
                        className="block group"
                      >
                        <div className="flex flex-col">
                          {/* Header Section */}
                          <div className="px-4 pt-3 pb-2 border-yellow-500 bg-white dark:bg-gray-900">
                            <span className="text-gray-500 dark:text-gray-400 text-gray-700 text-xs font-medium">#{id}</span>
                            <h3 className={`text-yellow-500 dark:text-yellow-500 font-bold ${isCenter ? 'text-2xl' : 'text-xl'}`}>
                              {displayName}
                            </h3>
                          </div>

                          {/* Image Section with primaryType background */}
                          <div className={`bg-white dark:bg-gray-900 px-4 py-4 border-yellow-500 flex items-center justify-center`}>
                            {artworkUrl && (
                            <div className={`${colors.bg} w-48 h-48 border-4 border-yellow-500 ${isCenter ? 'shadow-yellow-500/50 hover:shadow-yellow-500/70' : ''}`}>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/90 dark:bg-gray-900/90 bg-white hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 text-white dark:text-white text-gray-900 p-4 rounded-full shadow-xl dark:shadow-xl shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 z-20 border border-gray-100"
            aria-label="Previous Pokemon"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/90 dark:bg-gray-900/90 bg-white hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-blue-50 text-white dark:text-white text-gray-900 p-4 rounded-full shadow-xl dark:shadow-xl shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 z-20 border border-gray-100"
            aria-label="Next Pokemon"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};
