import type { PokemonType } from '../../../types/pokemon';
import { getTypeColorClasses } from '../../../utils/typeColors';
import { formatPokemonName } from '../../../utils/format';
import { cn } from '../../../utils/cn';

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
        const displayName = formatPokemonName(type.type.name);
        
        return (
          <span
            key={type.type.name}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-bold shadow-md',
              colors.bg,
              colors.text
            )}
          >
            {displayName}
          </span>
        );
      })}
    </div>
  );
};
