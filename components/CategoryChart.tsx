'use client';

import { CategoryStat } from '@/types/news';
import { cn } from '@/lib/utils';

interface CategoryChartProps {
  categories: CategoryStat[];
  onCategoryClick?: (name: string) => void;
  activeCategory?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  경제: 'bg-emerald-400',
  정치: 'bg-red-400',
  사회: 'bg-orange-400',
  기술: 'bg-blue-400',
  스포츠: 'bg-yellow-400',
  문화: 'bg-pink-400',
  국제: 'bg-indigo-400',
  건강: 'bg-teal-400',
  환경: 'bg-lime-400',
  기타: 'bg-gray-400',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  경제: '💰',
  정치: '🏛️',
  사회: '👥',
  기술: '💻',
  스포츠: '⚽',
  문화: '🎭',
  국제: '🌍',
  건강: '🏥',
  환경: '🌿',
  기타: '📌',
};

export default function CategoryChart({
  categories,
  onCategoryClick,
  activeCategory,
}: CategoryChartProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="space-y-2">
      {categories.slice(0, 6).map((cat) => {
        const barColor = CATEGORY_COLORS[cat.name] ?? CATEGORY_COLORS['기타'];
        const emoji = CATEGORY_EMOJIS[cat.name] ?? '📌';
        const isActive = activeCategory === cat.name;

        return (
          <button
            key={cat.name}
            onClick={() => onCategoryClick?.(cat.name)}
            className={cn(
              'w-full text-left space-y-1 p-2 rounded-xl transition-all duration-200',
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            )}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                <span>{emoji}</span>
                {cat.name}
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {cat.count}건 ({cat.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-700 ease-out', barColor)}
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
