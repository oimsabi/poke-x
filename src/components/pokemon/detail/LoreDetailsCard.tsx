import type { PokemonSpecies } from '../../../types/pokemon';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../styles/theme';

interface LoreDetailsCardProps {
  species: PokemonSpecies | null;
}

export const LoreDetailsCard = ({ species }: LoreDetailsCardProps) => {
  if (!species) {
    return (
      <div className={cn(themeClasses.card, 'rounded-lg p-4 mb-4 shadow-lg bg-gray-900/70')}>
        <h2 className={cn('text-xl font-bold mb-4', themeClasses.text.primary)}>
          Description
        </h2>
        <p className={cn('italic', themeClasses.text.secondary)}>
          Loading description...
        </p>
      </div>
    );
  }

  // Get English flavor text, prefer latest version
  const englishFlavorTexts = species.flavor_text_entries.filter(
    (entry) => entry.language.name === 'en'
  );

  // Sort by version (prefer newer games) and get the first one
  const latestFlavorText = englishFlavorTexts.length > 0 
    ? englishFlavorTexts[englishFlavorTexts.length - 1]
    : null;

  // Clean up flavor text (remove newlines, fix spacing)
  const cleanFlavorText = latestFlavorText
    ? latestFlavorText.flavor_text.replace(/\f/g, ' ').replace(/\s+/g, ' ').trim()
    : 'No description available.';

  return (
    <div className={cn(themeClasses.card, 'rounded-lg p-4 mb-4 shadow-lg bg-gray-900/70')}>
      <h2 className={cn('text-xl font-bold mb-4', themeClasses.text.primary)}>
        Description
      </h2>
      <p className={cn('leading-relaxed italic', themeClasses.text.secondary)}>
        "{cleanFlavorText}"
      </p>
    </div>
  );
};
