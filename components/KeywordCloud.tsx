'use client';

import { KeywordStat } from '@/types/news';
import { cn } from '@/lib/utils';

interface KeywordCloudProps {
  keywords: KeywordStat[];
  onKeywordClick?: (word: string) => void;
}

const SIZE_CLASSES = [
  'text-xs px-2 py-1',
  'text-sm px-2.5 py-1',
  'text-base px-3 py-1.5 font-medium',
  'text-lg px-3.5 py-1.5 font-semibold',
  'text-xl px-4 py-2 font-bold',
];

const COLOR_CLASSES = [
  'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
  'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
  'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
  'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
];

export default function KeywordCloud({ keywords, onKeywordClick }: KeywordCloudProps) {
  if (!keywords || keywords.length === 0) return null;

  const maxScore = Math.max(...keywords.map((k) => k.score));
  const minScore = Math.min(...keywords.map((k) => k.score));
  const scoreRange = maxScore - minScore || 1;

  const getSize = (score: number) => {
    const normalized = (score - minScore) / scoreRange;
    return Math.min(Math.floor(normalized * SIZE_CLASSES.length), SIZE_CLASSES.length - 1);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      {keywords.map((kw, i) => {
        const sizeIdx = getSize(kw.score);
        const colorIdx = i % COLOR_CLASSES.length;
        return (
          <button
            key={kw.word}
            onClick={() => onKeywordClick?.(kw.word)}
            title={`${kw.word}: ${kw.count}회 언급`}
            className={cn(
              'rounded-full border transition-all duration-200 hover:scale-110 hover:shadow-sm',
              SIZE_CLASSES[sizeIdx],
              COLOR_CLASSES[colorIdx]
            )}
          >
            {kw.word}
            <span className="ml-1 opacity-60 text-xs">({kw.count})</span>
          </button>
        );
      })}
    </div>
  );
}
