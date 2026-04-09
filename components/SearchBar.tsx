'use client';

import { useState, KeyboardEvent } from 'react';
import { Search, Calendar, CalendarDays, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string, period: 'today' | 'week' | 'all') => void;
  isLoading?: boolean;
}

const PERIOD_OPTIONS = [
  { value: 'today' as const, label: '오늘', icon: Calendar },
  { value: 'week' as const, label: '이번 주', icon: CalendarDays },
  { value: 'all' as const, label: '전체', icon: Globe },
];

const QUICK_KEYWORDS = ['AI', '경제', '주식', '부동산', '정치', '스포츠', '날씨', '코스피'];

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState<'today' | 'week' | 'all'>('all');

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed, period);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleQuickPeriod = (p: 'today' | 'week') => {
    setPeriod(p);
    const kw = query.trim() || '주요 뉴스';
    onSearch(kw, p);
  };

  return (
    <div className="w-full space-y-4">
      {/* 빠른 기간 버튼 */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => handleQuickPeriod('today')}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calendar size={16} />
          오늘 뉴스 요약
        </button>
        <button
          onClick={() => handleQuickPeriod('week')}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CalendarDays size={16} />
          이번 주 뉴스 요약
        </button>
      </div>

      {/* 검색 입력창 */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="키워드를 입력하세요 (예: AI, 반도체, 주가)"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        {/* 기간 선택 */}
        <div className="flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          {PERIOD_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                disabled={isLoading}
                className={cn(
                  'px-3 py-3.5 text-sm font-medium flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap disabled:opacity-50',
                  period === opt.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                <Icon size={14} />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* 검색 버튼 */}
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          검색
        </button>
      </div>

      {/* 빠른 키워드 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 font-medium">빠른 검색:</span>
        {QUICK_KEYWORDS.map((kw) => (
          <button
            key={kw}
            onClick={() => {
              setQuery(kw);
              onSearch(kw, period);
            }}
            disabled={isLoading}
            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 disabled:opacity-50"
          >
            {kw}
          </button>
        ))}
      </div>
    </div>
  );
}
