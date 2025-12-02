import type { PokemonAbility } from '../../../types/pokemon';

interface AbilityRoleTagProps {
  abilities: PokemonAbility[];
}

export const AbilityRoleTag = ({ abilities }: AbilityRoleTagProps) => {
  // Sort abilities: non-hidden first, then hidden
  const sortedAbilities = [...abilities].sort((a, b) => {
    if (a.is_hidden && !b.is_hidden) return 1;
    if (!a.is_hidden && b.is_hidden) return -1;
    return a.slot - b.slot;
  });

  return (
    <div className="bg-gray-900/70 rounded-lg p-4 mb-4 shadow-lg">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Abilities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedAbilities.map((ability) => {
          const displayName = ability.ability.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return (
            <div
              key={ability.ability.name}
              className={`p-3 rounded-lg ${
                ability.is_hidden
                  ? 'bg-purple-900/50 border border-purple-600/50'
                  : 'bg-gray-800/50 border border-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-100 font-semibold">{displayName}</span>
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
