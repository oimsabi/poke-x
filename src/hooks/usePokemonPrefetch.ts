import { useEffect } from 'react';
import type { PokemonListItem, CachedPokemon } from '../types/pokemon';
import { CAROUSEL_CONFIG } from '../config/constants';

interface UsePokemonPrefetchOptions {
  currentIndex: number;
  pokemonList: PokemonListItem[];
  pokemonCache: Map<string, CachedPokemon>;
  loadingPokemon: Set<number>;
  loadPokemonData: (pokemonItem: PokemonListItem, index: number, priority?: boolean) => Promise<any>;
  prefetchRange?: number;
}

export const usePokemonPrefetch = ({
  currentIndex,
  pokemonList,
  pokemonCache,
  loadingPokemon,
  loadPokemonData,
  prefetchRange = CAROUSEL_CONFIG.PREFETCH_RANGE,
}: UsePokemonPrefetchOptions) => {
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
    for (let i = -prefetchRange; i <= prefetchRange; i++) {
      if (i === 0) continue; // Skip center, already loading
      const index = (currentIndex + i + pokemonList.length) % pokemonList.length;
      indicesToLoad.push(index);
    }

    // Load adjacent cards with slight delay to prioritize center
    const timeoutId = setTimeout(() => {
      indicesToLoad.forEach((index) => {
        const pokemonItem = pokemonList[index];
        if (pokemonItem) {
          const cached = pokemonCache.get(pokemonItem.name);
          if (!cached?.loaded && !loadingPokemon.has(index)) {
            loadPokemonData(pokemonItem, index, false).catch(() => {});
          }
        }
      });
    }, CAROUSEL_CONFIG.PREFETCH_DELAY);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, pokemonList, pokemonCache, loadPokemonData, loadingPokemon, prefetchRange]);
};
