import { useState, useCallback } from 'react';
import { pokemonApi } from '../api/pokemon';
import type { Pokemon, PokemonListItem, CachedPokemon } from '../types/pokemon';

export const usePokemonCache = () => {
  const [pokemonCache, setPokemonCache] = useState<Map<string, CachedPokemon>>(new Map());
  const [loadingPokemon, setLoadingPokemon] = useState<Set<number>>(new Set());

  const loadPokemonData = useCallback(async (
    pokemonItem: PokemonListItem, 
    index: number, 
    _priority: boolean = false
  ): Promise<Pokemon | undefined> => {
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
      console.error(`Failed to load Pokemon ${pokemonItem.name}:`, err);
      throw err;
    } finally {
      setLoadingPokemon((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  }, [pokemonCache]);

  return {
    pokemonCache,
    loadPokemonData,
    loadingPokemon,
  };
};
