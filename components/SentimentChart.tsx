'use client';

import { SentimentStat } from '@/types/news';

interface SentimentChartProps {
  sentiment: SentimentStat;
}

export default function SentimentChart({ sentiment }: SentimentChartProps) {
  const bars = [
    {
      label: '긍정',
      emoji: '😊',
      value: sentiment.positiveRatio,
      count: sentiment.positiveCount,
      color: 'bg-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: '부정',
      emoji: '😟',
      value: sentiment.negativeRatio,
      count: sentiment.negativeCount,
      color: 'bg-red-400',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: '중립',
      emoji: '😐',
      value: sentiment.neutralRatio,
      count: sentiment.neutralCount,
      color: 'bg-gray-300',
      textColor: 'text-gray-500 dark:text-gray-400',
    },
  ];

  return (
    <div className="space-y-3">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
              <span>{bar.emoji}</span>
              {bar.label}
            </span>
            <span className={`font-bold ${bar.textColor}`}>{bar.value}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${bar.color} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${bar.value}%` }}
            />
          </div>
          <div className="text-xs text-gray-400">{bar.count}건</div>
        </div>
      ))}
    </div>
  );
}
