import { useEffect } from 'react';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { PokemonCarousel3D } from '../components/pokemon/PokemonCarousel3D';
import { LoadingSpinner, ErrorMessage, EmptyState, PageContainer } from '../components/ui';
import { usePokemonBatch } from '../hooks/usePokemonBatch';
import { usePokemonCarousel } from '../hooks/usePokemonCarousel';
import { usePokemonCache } from '../hooks/usePokemonCache';
import { usePokemonPrefetch } from '../hooks/usePokemonPrefetch';
import { CAROUSEL_CONFIG } from '../config/constants';

export const HomePage = () => {
  // Use extracted hooks for state management
  const { pokemonList, loadMore, totalCount, batchOffset, loading, error } = usePokemonBatch({
    batchSize: CAROUSEL_CONFIG.BATCH_SIZE,
    startRandom: true,
  });

  const { currentIndex, goToNext, goToPrevious, goToIndex } = usePokemonCarousel({
    listLength: pokemonList.length,
    autoPlay: true,
    interval: CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL,
  });

  const { pokemonCache, loadingPokemon, loadPokemonData } = usePokemonCache();

  // Prefetch Pokemon data for visible cards
  usePokemonPrefetch({
    currentIndex,
    pokemonList,
    pokemonCache,
    loadingPokemon,
    loadPokemonData,
    prefetchRange: CAROUSEL_CONFIG.PREFETCH_RANGE,
  });

  // Load more Pokemon when approaching end of list
  useEffect(() => {
    if (loading || !totalCount) return;
    
    const remaining = totalCount - pokemonList.length;
    if (remaining === 0) return;

    if (currentIndex >= pokemonList.length - 10) {
      loadMore();
    }
  }, [currentIndex, pokemonList.length, totalCount, loading, loadMore]);

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center flex-1">
          <LoadingSpinner size="large" message="Loading Pokemon..." />
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error && pokemonList.length === 0) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center flex-1">
          <ErrorMessage message={error} />
        </div>
      </PageContainer>
    );
  }

  // Empty state
  if (pokemonList.length === 0) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center flex-1">
          <EmptyState message="No Pokemon found." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navigation />

      <div className="max-w-7xl mx-auto py-8 px-4 flex-1 w-full">
        {/* 3D Carousel */}
        <PokemonCarousel3D
          currentIndex={currentIndex}
          pokemonList={pokemonList}
          pokemonCache={pokemonCache}
          loadingPokemon={loadingPokemon}
          goToPrevious={goToPrevious}
          goToNext={goToNext}
          goToIndex={goToIndex}
          prefetchRange={CAROUSEL_CONFIG.PREFETCH_RANGE}
        />
      </div>

      <Footer />
    </PageContainer>
  );
};
