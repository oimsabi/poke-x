// Utility function to map Pokemon types to Tailwind color classes
export const getTypeColorClasses = (typeName: string): { bg: string; text: string } => {
  const normalizedType = typeName.toLowerCase();
  
  const typeColorMap: Record<string, { bg: string; text: string }> = {
    normal: { bg: 'bg-gray-600', text: 'text-gray-200' },
    fire: { bg: 'bg-red-600', text: 'text-red-200' },
    water: { bg: 'bg-blue-600', text: 'text-blue-200' },
    electric: { bg: 'bg-yellow-400', text: 'text-yellow-900' },
    grass: { bg: 'bg-green-600', text: 'text-green-200' },
    ice: { bg: 'bg-cyan-400', text: 'text-cyan-900' },
    fighting: { bg: 'bg-red-800', text: 'text-red-200' },
    poison: { bg: 'bg-purple-600', text: 'text-purple-200' },
    ground: { bg: 'bg-amber-700', text: 'text-amber-200' },
    flying: { bg: 'bg-indigo-400', text: 'text-indigo-900' },
    psychic: { bg: 'bg-pink-600', text: 'text-pink-200' },
    bug: { bg: 'bg-lime-600', text: 'text-lime-200' },
    rock: { bg: 'bg-stone-600', text: 'text-stone-200' },
    ghost: { bg: 'bg-violet-700', text: 'text-violet-200' },
    dragon: { bg: 'bg-indigo-700', text: 'text-indigo-200' },
    dark: { bg: 'bg-gray-800', text: 'text-gray-200' },
    steel: { bg: 'bg-slate-500', text: 'text-slate-200' },
    fairy: { bg: 'bg-pink-400', text: 'text-pink-900' },
  };

  return typeColorMap[normalizedType] || { bg: 'bg-gray-600', text: 'text-gray-200' };
};
