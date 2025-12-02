import { useState, useEffect } from 'react';
import { CAROUSEL_CONFIG } from '../config/constants';

interface UsePokemonCarouselOptions {
  listLength: number;
  autoPlay?: boolean;
  interval?: number;
}

export const usePokemonCarousel = ({ 
  listLength,
  autoPlay = true,
  interval = CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL
}: UsePokemonCarouselOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || listLength === 0) return;

    const autoPlayInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listLength);
    }, interval);

    return () => clearInterval(autoPlayInterval);
  }, [isAutoPlaying, listLength, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + listLength) % listLength);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % listLength);
    setIsAutoPlaying(false);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return {
    currentIndex,
    setCurrentIndex,
    goToPrevious,
    goToNext,
    goToIndex,
    isAutoPlaying,
    setIsAutoPlaying,
  };
};
