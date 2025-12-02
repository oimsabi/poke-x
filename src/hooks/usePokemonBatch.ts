import { useState, useEffect, useRef } from 'react';
import { pokemonApi } from '../api/pokemon';
import type { PokemonListItem } from '../types/pokemon';
import { CAROUSEL_CONFIG } from '../config/constants';

interface UsePokemonBatchOptions {
  batchSize?: number;
  startRandom?: boolean;
}

export const usePokemonBatch = ({ 
  batchSize = CAROUSEL_CONFIG.BATCH_SIZE,
  startRandom = true
}: UsePokemonBatchOptions = {}) => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [batchOffset, setBatchOffset] = useState(0);
  const hasLoadedInitialRef = useRef(false);

  // Load initial Pokemon list
  useEffect(() => {
    if (hasLoadedInitialRef.current) return;
    hasLoadedInitialRef.current = true;

    const loadInitialList = async () => {
      try {
        setLoadingList(true);
        setError(null);
        
        // Get the total count
        const countResponse = await pokemonApi.getList(1, 0);
        const total = countResponse.count;
        setTotalCount(total);
        
        let offset = 0;
        let randomIndex = 0;
        
        if (startRandom) {
          // Generate random index
          randomIndex = Math.floor(Math.random() * total);
          // Calculate the offset to load a batch containing the random Pokemon
          offset = Math.max(0, randomIndex - Math.floor(batchSize / 2));
          offset = Math.min(offset, Math.max(0, total - batchSize));
        }
        
        setBatchOffset(offset);
        
        // Load the batch
        const response = await pokemonApi.getList(batchSize, offset);
        setPokemonList(response.results);
        
        // Return the index in batch for carousel to use
        return startRandom ? randomIndex - offset : 0;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pokemon list');
      } finally {
        setLoadingList(false);
      }
    };

    loadInitialList();
  }, [batchSize, startRandom]);

  const loadMore = async () => {
    if (!totalCount || loadingList) return;
    
    const remaining = totalCount - pokemonList.length;
    if (remaining === 0) return;

    try {
      const nextBatch = Math.min(batchSize, remaining);
      const response = await pokemonApi.getList(nextBatch, batchOffset + pokemonList.length);
      setPokemonList((prev) => [...prev, ...response.results]);
    } catch (err) {
      console.error('Failed to load more Pokemon:', err);
    }
  };

  return {
    pokemonList,
    loadMore,
    totalCount,
    batchOffset,
    loading: loadingList,
    error,
  };
};
