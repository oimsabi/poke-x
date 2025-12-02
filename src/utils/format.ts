// Utility functions for formatting Pokemon data

export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const extractPokemonId = (url: string): string | undefined => {
  const match = url.match(/\/pokemon\/(\d+)/);
  return match?.[1];
};

export const getPokemonArtworkUrl = (id: string | number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};
