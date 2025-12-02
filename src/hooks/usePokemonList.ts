import { useEffect, useState } from 'react';
import { pokemonApi } from '../api/pokemon';
import type { PokemonListItem, PokemonListResponse } from '../types/pokemon';

interface UsePokemonListOptions {
  limit?: number;
  offset?: number;
}

interface UsePokemonListResult {
  data: PokemonListResponse | null;
  results: PokemonListItem[];
  loading: boolean;
  primaryTypes: string[];
  error: string | null;
  total: number;
  next: string | null;
  previous: string | null;
}

export const usePokemonList = (
  { limit = 60, offset = 0 }: UsePokemonListOptions = {},
): UsePokemonListResult => {
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [results, setResults] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pokemonApi.getList(limit, offset);

        // Batch fetch types for all Pokemon in parallel
      const pokemonWithTypes = await Promise.all(
        response.results.map(async (item) => {
          try {
            const pokemon = await pokemonApi.getByName(item.name);
            return {
              ...item,
              primaryType: pokemon.types[0]?.type.name || 'normal'
            };
          } catch {
            return { ...item, primaryType: 'normal' };
          }
        })
      );

        
        setData(response);
        setResults(pokemonWithTypes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon list');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [limit, offset]);

  return {
    data,
    results,
    loading,
    error,
    primaryTypes: results.map((item) => item.primary_type),
    total: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  };
};
