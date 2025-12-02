import type { PokemonType } from '../types/pokemon';
import { getTypeColorClasses } from '../utils/typeColors';

interface TypeClassificationTagProps {
  types: PokemonType[];
}

export const TypeClassificationTag = ({ types }: TypeClassificationTagProps) => {
  // Sort types by slot to show primary first
  const sortedTypes = [...types].sort((a, b) => a.slot - b.slot);

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {sortedTypes.map((type) => {
        const colors = getTypeColorClasses(type.type.name);
        const displayName = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
        
        return (
          <span
            key={type.type.name}
            className={`px-3 py-1 rounded-full text-sm font-bold ${colors.bg} ${colors.text} shadow-md`}
          >
            {displayName}
          </span>
        );
      })}
    </div>
  );
};
