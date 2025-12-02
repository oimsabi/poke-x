import type { PokemonAbility } from '../../../types/pokemon';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../styles/theme';

interface AbilityRoleTagProps {
  abilities: PokemonAbility[];
}

const formatAbilityName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const AbilityRoleTag = ({ abilities }: AbilityRoleTagProps) => {
  // Sort abilities: non-hidden first, then hidden
  const sortedAbilities = [...abilities].sort((a, b) => {
    if (a.is_hidden && !b.is_hidden) return 1;
    if (!a.is_hidden && b.is_hidden) return -1;
    return a.slot - b.slot;
  });

  return (
    <div className={cn(themeClasses.card, 'rounded-lg p-4 mb-4 shadow-lg bg-gray-900/70')}>
      <h2 className={cn('text-xl font-bold mb-4', themeClasses.text.primary)}>
        Abilities
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedAbilities.map((ability) => {
          const displayName = formatAbilityName(ability.ability.name);

          return (
            <div
              key={ability.ability.name}
              className={cn(
                'p-3 rounded-lg',
                ability.is_hidden
                  ? 'bg-purple-900/50 border border-purple-600/50'
                  : 'bg-gray-800/50 border border-gray-700/50'
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn('font-semibold', themeClasses.text.primary)}>
                  {displayName}
                </span>
                {ability.is_hidden && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-600/30 text-purple-200 font-medium">
                    Hidden
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
