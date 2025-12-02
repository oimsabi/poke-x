// Hook for fetching Pokemon species data (flavor text)
import { useState, useEffect } from 'react';
import { pokemonApi } from '../api/pokemon';
import type { PokemonSpecies } from '../types/pokemon';

export const usePokemonSpecies = (id: number | string | null) => {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setSpecies(null);
      setLoading(false);
      return;
    }

    const fetchSpecies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = typeof id === 'number' 
          ? await pokemonApi.getSpeciesById(id)
          : await pokemonApi.getSpeciesByName(id);
        
        setSpecies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon species');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [id]);

  return { species, loading, error };
};
