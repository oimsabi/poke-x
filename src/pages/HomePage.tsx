import { useState, useEffect, useCallback } from 'react';
import { pokemonApi } from '../api/pokemon';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { PokemonCarousel3D } from '../components/pokemon/PokemonCarousel3D';
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
  const PREFETCH_RANGE = 4; // Show 2 cards on each side

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

  const globalIndex = getGlobalIndex();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden flex flex-col">
      <Navigation />

      <div className="max-w-7xl mx-auto py-8 px-4 flex-1 w-full">
        {/* Pokemon Count Display */}
        {totalCount && (
          <div className="text-center mb-8">
            <p className="text-gray-500 dark:text-gray-500 text-gray-700 text-sm">
              Showing {globalIndex + 1} of {totalCount} Pokemon
            </p>
          </div>
        )}

        {/* 3D Carousel */}
        <PokemonCarousel3D
          currentIndex={currentIndex}
          pokemonList={pokemonList}
          pokemonCache={pokemonCache}
          loadingPokemon={loadingPokemon}
          goToPrevious={goToPrevious}
          goToNext={goToNext}
          goToIndex={goToIndex}
          prefetchRange={PREFETCH_RANGE}
        />
      </div>

      <Footer />
    </div>
  );
};
