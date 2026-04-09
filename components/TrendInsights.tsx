'use client';

import { TrendInsight } from '@/types/news';
import { cn } from '@/lib/utils';

interface TrendInsightsProps {
  insights: TrendInsight[];
}

const TYPE_STYLES: Record<TrendInsight['type'], string> = {
  hot: 'border-l-orange-400 bg-orange-50 dark:bg-orange-900/10',
  rising: 'border-l-blue-400 bg-blue-50 dark:bg-blue-900/10',
  sentiment: 'border-l-purple-400 bg-purple-50 dark:bg-purple-900/10',
  category: 'border-l-emerald-400 bg-emerald-50 dark:bg-emerald-900/10',
};

export default function TrendInsights({ insights }: TrendInsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={cn(
            'border-l-4 rounded-r-xl p-3.5 transition-all duration-300',
            TYPE_STYLES[insight.type]
          )}
        >
          <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
            {insight.title}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {insight.description}
          </p>
          {insight.value && (
            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-600">
              {insight.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
