// This component displays a single Pokemon's information
import type { Pokemon } from '../../../types/pokemon';
import { PokemonProfileHeader } from './PokemonProfileHeader';
import { TypeClassificationTag } from './TypeClassificationTag';
import { BaseStatsBlock } from './BaseStatsBlock';
import { AbilityRoleTag } from './AbilityRoleTag';
import { LoreDetailsCard } from './LoreDetailsCard';
import { usePokemonSpecies } from '../../../hooks/usePokemonSpecies';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  // Fetch species data for flavor text
  const { species } = usePokemonSpecies(pokemon.id);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Mobile: Vertical stack */}
      <div className="flex flex-col space-y-4 p-4 
                      md:grid md:grid-cols-2 md:gap-4 md:p-8 
                      lg:grid lg:grid-cols-3 lg:gap-6 lg:p-12">
        
        {/* Column 1: Header and Image (spans 2 columns on desktop) */}
        <div className="lg:col-span-2">
          <PokemonProfileHeader pokemon={pokemon} />
          <TypeClassificationTag types={pokemon.types} />
          <LoreDetailsCard species={species} />
        </div>

        {/* Column 2: Stats and Abilities (1 column on desktop) */}
        <div className="lg:col-span-1">
          <BaseStatsBlock stats={pokemon.stats} />
          <AbilityRoleTag abilities={pokemon.abilities} />
        </div>
      </div>
    </div>
  );
};