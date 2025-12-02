import type { PokemonSpecies } from '../types/pokemon';

interface LoreDetailsCardProps {
  species: PokemonSpecies | null;
}

export const LoreDetailsCard = ({ species }: LoreDetailsCardProps) => {
  if (!species) {
    return (
      <div className="bg-gray-900/70 rounded-lg p-4 mb-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Description</h2>
        <p className="text-gray-400 italic">Loading description...</p>
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
    <div className="bg-gray-900/70 rounded-lg p-4 mb-4 shadow-lg">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Description</h2>
      <p className="text-gray-300 leading-relaxed italic">
        "{cleanFlavorText}"
      </p>
    </div>
  );
};
