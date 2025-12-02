import type { Pokemon } from '../types/pokemon';

interface PokemonProfileHeaderProps {
  pokemon: Pokemon;
}

export const PokemonProfileHeader = ({ pokemon }: PokemonProfileHeaderProps) => {
  // Get official artwork, fallback to front_default
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default 
    || '';

  // Capitalize first letter of name
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-full max-w-md mb-4">
        <img 
          src={imageUrl} 
          alt={displayName}
          className="w-full h-auto object-contain"
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-100 mb-2">
        {displayName}
      </h1>
      <p className="text-gray-400 text-lg">
        #{String(pokemon.id).padStart(3, '0')}
      </p>
    </div>
  );
};
