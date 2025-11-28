// This is a custom hook - it's like a reusable function for fetching Pokemon
import { useState, useEffect } from 'react';
import { pokemonApi } from '../api/pokemon';
import type { Pokemon } from '../types/pokemon';

export const usePokemon = (id: number | string) => {
  // useState creates "state" - data that can change
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);  // The Pokemon data
  const [loading, setLoading] = useState(true);                  // Is it loading?
  const [error, setError] = useState<string | null>(null);       // Any errors?

  // useEffect runs code when the component loads or when 'id' changes
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);    // Start loading
        setError(null);      // Clear any previous errors
        
        // Fetch the Pokemon data
        const data = typeof id === 'number' 
          ? await pokemonApi.getById(id)
          : await pokemonApi.getByName(id);
        
        setPokemon(data);    // Save the Pokemon data
      } catch (err) {
        // If something goes wrong, save the error message
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
      } finally {
        setLoading(false);   // Stop loading (whether success or error)
      }
    };

    fetchPokemon();
  }, [id]); // Run this whenever 'id' changes

  // Return the Pokemon data, loading state, and any errors
  return { pokemon, loading, error };
};