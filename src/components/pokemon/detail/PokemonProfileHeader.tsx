import type { Pokemon } from '../../../types/pokemon';
import { formatPokemonName } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../styles/theme';
import poke_ball_default from '../../../../public/assets/poke_ball_default.svg';

interface PokemonProfileHeaderProps {
  pokemon: Pokemon;
}

export const PokemonProfileHeader = ({ pokemon }: PokemonProfileHeaderProps) => {
  // Get official artwork, fallback to front_default
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default 
    || '';

  const displayName = formatPokemonName(pokemon.name);

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-full max-w-md mb-4">
        <img 
          src={imageUrl} 
          alt={displayName}
          onError={(e) => {
            e.currentTarget.src = poke_ball_default;
          }}
          className="w-full h-auto object-contain"
        />
      </div>
      <h1 className={cn('text-4xl font-bold mb-2', themeClasses.text.primary)}>
        {displayName}
      </h1>
      <p className={cn('text-lg', themeClasses.text.secondary)}>
        #{String(pokemon.id).padStart(3, '0')}
      </p>
    </div>
  );
};
