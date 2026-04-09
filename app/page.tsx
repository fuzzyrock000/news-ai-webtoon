'use client';

import { useState, useCallback } from 'react';
import {
  Newspaper,
  RefreshCw,
  Filter,
  X,
  AlertCircle,
  SearchX,
  BookOpen,
  Loader2,
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';
import AnalysisPanel from '@/components/AnalysisPanel';
import { NewsCardSkeleton, AnalysisPanelSkeleton } from '@/components/LoadingSkeleton';
import WebtoonViewer from '@/components/WebtoonViewer';
import { NewsSearchResponse, ProcessedNewsItem } from '@/types/news';
import { WebtoonScript } from '@/types/webtoon';
import { cn } from '@/lib/utils';

const CATEGORY_FILTER_ALL = '전체';

export default function HomePage() {
  const [result, setResult] = useState<NewsSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_FILTER_ALL);
  const [lastQuery, setLastQuery] = useState('');
  const [lastPeriod, setLastPeriod] = useState<'today' | 'week' | 'all'>('all');

  // 웹툰
  const [webtoonScript, setWebtoonScript] = useState<WebtoonScript | null>(null);
  const [isWebtoonLoading, setIsWebtoonLoading] = useState(false);

  const handleSearch = useCallback(async (query: string, period: 'today' | 'week' | 'all') => {
    setIsLoading(true);
    setError(null);
    setActiveCategory(CATEGORY_FILTER_ALL);
    setLastQuery(query);
    setLastPeriod(period);

    try {
      const params = new URLSearchParams({ query, period, display: '30' });
      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? '뉴스를 불러오는 데 실패했습니다.');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleKeywordClick = useCallback(
    (word: string) => {
      handleSearch(word, lastPeriod);
    },
    [handleSearch, lastPeriod]
  );

  const handleCategoryClick = useCallback((name: string) => {
    setActiveCategory((prev) => (prev === name ? CATEGORY_FILTER_ALL : name));
  }, []);

  const handleGenerateWebtoon = useCallback(async () => {
    if (!result?.analysis) return;
    setIsWebtoonLoading(true);
    try {
      const res = await fetch('/api/webtoon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: result.analysis, query: lastQuery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '웹툰 생성 실패');
      setWebtoonScript(data.script);
    } catch (err) {
      alert(err instanceof Error ? err.message : '웹툰 생성 중 오류가 발생했습니다.');
    } finally {
      setIsWebtoonLoading(false);
    }
  }, [result, lastQuery]);

  const filteredItems: ProcessedNewsItem[] =
    result?.items.filter(
      (item) => activeCategory === CATEGORY_FILTER_ALL || item.category === activeCategory
    ) ?? [];

  const PERIOD_LABEL: Record<string, string> = {
    today: '오늘',
    week: '이번 주',
    all: '전체',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Newspaper size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-gray-900 dark:text-white leading-none">
                NewsAI
              </h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">실시간 뉴스 분석</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 ml-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400">네이버 뉴스 연동 중</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 히어로 섹션 */}
        {!result && !isLoading && (
          <div className="text-center py-8 space-y-3 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              AI 기반 뉴스 분석 서비스
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              오늘의 뉴스를{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                AI로 분석
              </span>
              해드려요
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
              키워드를 입력하거나 오늘/이번 주 뉴스를 선택하면
              <br />
              키워드 추출, 감정 분석, 카테고리 분류, 트렌드 인사이트를 제공합니다.
            </p>
          </div>
        )}

        {/* 검색바 */}
        <div
          className={cn(
            'bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm',
            (result || isLoading) && 'sticky top-[61px] z-40'
          )}
        >
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* 에러 */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* 로딩 */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
            <AnalysisPanelSkeleton />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* 결과 없음 */}
        {!isLoading && result && result.total === 0 && (
          <div className="text-center py-20 space-y-3">
            <SearchX size={48} className="text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">
              &quot;{lastQuery}&quot;에 대한 뉴스를 찾지 못했습니다.
            </p>
            <p className="text-gray-400 text-sm">다른 키워드로 검색해보세요.</p>
          </div>
        )}

        {/* 결과 */}
        {!isLoading && result && result.total > 0 && (
          <div className="space-y-4 animate-fade-in-up">
            {/* 결과 헤더 */}
              <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  &quot;{lastQuery}&quot;
                </span>
                <span className="text-xs text-gray-500">
                  {PERIOD_LABEL[lastPeriod]} · {result.total}건
                </span>
                {activeCategory !== CATEGORY_FILTER_ALL && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-800">
                    <Filter size={11} />
                    {activeCategory}
                    <button
                      onClick={() => setActiveCategory(CATEGORY_FILTER_ALL)}
                      className="ml-0.5 hover:text-blue-800"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* 웹툰 만들기 버튼 */}
                <button
                  onClick={handleGenerateWebtoon}
                  disabled={isWebtoonLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:scale-100"
                >
                  {isWebtoonLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <BookOpen size={13} />
                  )}
                  {isWebtoonLoading ? '만화 생성 중...' : '📚 4컷 만화 만들기'}
                </button>

                <button
                  onClick={() => handleSearch(lastQuery, lastPeriod)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw size={13} />
                  새로고침
                </button>
              </div>
            </div>

            {/* 분석 패널 + 뉴스 목록 */}
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
              {/* 왼쪽: 분석 패널 */}
              <div className="lg:sticky lg:top-[140px]">
                <AnalysisPanel
                  analysis={result.analysis}
                  query={lastQuery}
                  period={lastPeriod}
                  onKeywordClick={handleKeywordClick}
                  onCategoryClick={handleCategoryClick}
                  activeCategory={activeCategory === CATEGORY_FILTER_ALL ? undefined : activeCategory}
                />
              </div>

              {/* 오른쪽: 뉴스 카드 목록 */}
              <div className="space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Filter size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">선택한 카테고리의 뉴스가 없습니다.</p>
                  </div>
                ) : (
                  filteredItems.map((item, i) => (
                    <NewsCard key={`${item.link}-${i}`} item={item} index={i} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-16 border-t border-gray-100 dark:border-gray-800 py-6 text-center">
        <p className="text-xs text-gray-400">
          Powered by{' '}
          <span className="font-semibold text-[#03C75A]">NAVER</span> Search API ·{' '}
          <span className="font-semibold text-blue-500">AI</span> Analysis Engine ·{' '}
          <span className="font-semibold text-purple-500">웹툰</span> 자동 생성
        </p>
      </footer>

      {/* 웹툰 뷰어 모달 */}
      {webtoonScript && (
        <WebtoonViewer
          script={webtoonScript}
          onClose={() => setWebtoonScript(null)}
        />
      )}
    </div>
  );
}
