'use client';

import { ExternalLink, Tag } from 'lucide-react';
import { ProcessedNewsItem } from '@/types/news';
import { formatDate, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  경제: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  정치: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  사회: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  기술: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  스포츠: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  문화: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  국제: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  건강: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  환경: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  기타: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const SENTIMENT_CONFIG = {
  positive: {
    emoji: '😊',
    label: '긍정',
    className: 'text-emerald-500',
    barColor: 'bg-emerald-400',
  },
  negative: {
    emoji: '😟',
    label: '부정',
    className: 'text-red-500',
    barColor: 'bg-red-400',
  },
  neutral: {
    emoji: '😐',
    label: '중립',
    className: 'text-gray-400',
    barColor: 'bg-gray-400',
  },
};

interface NewsCardProps {
  item: ProcessedNewsItem;
  index: number;
}

export default function NewsCard({ item, index }: NewsCardProps) {
  const sentimentCfg = SENTIMENT_CONFIG[item.sentiment];
  const catColor = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS['기타'];

  return (
    <article
      className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', catColor)}>
            {item.category}
          </span>
          <span className={cn('text-xs font-medium', sentimentCfg.className)}>
            {sentimentCfg.emoji} {sentimentCfg.label}
          </span>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
          {formatDate(item.pubDate)}
        </span>
      </div>

      {/* 제목 */}
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
          {item.cleanTitle}
        </h3>
      </a>

      {/* 설명 */}
      {item.cleanDescription && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {truncateText(item.cleanDescription, 120)}
        </p>
      )}

      {/* 키워드 태그 */}
      {item.keywords.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          <Tag size={11} className="text-gray-300" />
          {item.keywords.slice(0, 4).map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 rounded-full text-xs bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-600"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* 링크 버튼 */}
      <div className="flex justify-end mt-3">
        <a
          href={item.originallink || item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
        >
          원문 보기 <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
}
