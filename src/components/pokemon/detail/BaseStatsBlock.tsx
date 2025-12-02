import type { PokemonStat } from '../../../types/pokemon';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../styles/theme';

interface BaseStatsBlockProps {
  stats: PokemonStat[];
}

// Stat name mapping
const statNameMap: Record<string, string> = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed': 'Speed',
};

// Get color for stat bar based on stat type
const getStatColor = (statName: string): string => {
  const normalized = statName.toLowerCase();
  if (normalized === 'hp' || normalized.includes('defense')) {
    return 'bg-green-500';
  }
  if (normalized === 'attack' || normalized.includes('attack')) {
    return 'bg-red-500';
  }
  return 'bg-blue-500';
};

export const BaseStatsBlock = ({ stats }: BaseStatsBlockProps) => {
  // Calculate total BST
  const totalBST = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  // Max stat value for percentage calculation (255 is max for individual stats)
  const maxStatValue = 255;

  return (
    <div className={cn(themeClasses.card, 'rounded-lg p-4 mb-4 shadow-lg bg-gray-900/70')}>
      <h2 className={cn('text-xl font-bold mb-4', themeClasses.text.primary)}>
        Base Stats
      </h2>
      <div className="space-y-3">
        {stats.map((stat) => {
          const statName = statNameMap[stat.stat.name] || stat.stat.name;
          const percentage = (stat.base_stat / maxStatValue) * 100;
          const barColor = getStatColor(stat.stat.name);

          return (
            <div key={stat.stat.name} className="flex items-center gap-3">
              <div className={cn('w-20 text-sm font-semibold text-right', themeClasses.text.secondary)}>
                {statName}
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={cn('h-full transition-all duration-300', barColor)}
                  />
                </div>
              </div>
              <div className={cn('w-12 text-sm font-bold text-right', themeClasses.text.primary)}>
                {stat.base_stat}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className={cn('text-sm font-semibold', themeClasses.text.secondary)}>
            Total
          </span>
          <span className={cn('text-lg font-bold', themeClasses.text.primary)}>
            {totalBST}
          </span>
        </div>
      </div>
    </div>
  );
};
