// This component displays a single Pokemon's information
import type { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;  // This component needs a Pokemon object
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <div className="pokemon-card">
      <img 
        src={pokemon.sprites.front_default ?? undefined} 
        alt={pokemon.name} 
      />
      <h2>{pokemon.name}</h2>
      <p>ID: #{pokemon.id}</p>
      <p>Height: {pokemon.height / 10}m</p>
      <p>Weight: {pokemon.weight / 10}kg</p>
      <div className="types">
        <strong>Types:</strong>
        {pokemon.types.map((type) => (
          <span key={type.type.name} className="type-badge">
            {type.type.name}
          </span>
        ))}
      </div>
    </div>
  );
};