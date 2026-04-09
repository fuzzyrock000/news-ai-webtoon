'use client';

import { useState } from 'react';
import {
  BarChart3,
  Hash,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp,
  Smile,
  LayoutGrid,
} from 'lucide-react';
import { NewsAnalysis } from '@/types/news';
import KeywordCloud from './KeywordCloud';
import SentimentChart from './SentimentChart';
import CategoryChart from './CategoryChart';
import TrendInsights from './TrendInsights';
import { cn } from '@/lib/utils';

interface AnalysisPanelProps {
  analysis: NewsAnalysis;
  query: string;
  period: string;
  onKeywordClick?: (word: string) => void;
  onCategoryClick?: (name: string) => void;
  activeCategory?: string;
}

type TabId = 'summary' | 'keywords' | 'sentiment' | 'categories' | 'trends';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'summary', label: '요약', icon: FileText },
  { id: 'keywords', label: '키워드', icon: Hash },
  { id: 'sentiment', label: '감정', icon: Smile },
  { id: 'categories', label: '분류', icon: LayoutGrid },
  { id: 'trends', label: '트렌드', icon: TrendingUp },
];

const PERIOD_LABEL: Record<string, string> = {
  today: '오늘',
  week: '이번 주',
  all: '전체',
};

const SENTIMENT_LABEL: Record<string, string> = {
  positive: '😊 긍정적',
  negative: '😟 부정적',
  neutral: '😐 중립적',
};

export default function AnalysisPanel({
  analysis,
  query,
  period,
  onKeywordClick,
  onCategoryClick,
  activeCategory,
}: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [isBulletExpanded, setIsBulletExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-white/80" />
            <span className="text-white font-bold text-sm">AI 뉴스 분석</span>
          </div>
          <span className="text-white/70 text-xs">
            {PERIOD_LABEL[period] ?? period} · {analysis.totalArticles}건
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/90 text-xs">
            &quot;{query}&quot; 검색 결과 ·{' '}
            <span className="font-semibold">
              {SENTIMENT_LABEL[analysis.sentiment.overall]}
            </span>
          </span>
        </div>
        {analysis.dateRange && (
          <p className="text-white/60 text-xs mt-0.5">{analysis.dateRange}</p>
        )}
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all duration-200 border-b-2',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              )}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-5">
        {/* 요약 */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {analysis.bulletPoints.length > 0 && (
              <div>
                <button
                  onClick={() => setIsBulletExpanded(!isBulletExpanded)}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 hover:text-blue-500 transition-colors"
                >
                  주요 기사 헤드라인
                  {isBulletExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                <div
                  className={cn(
                    'space-y-1.5 overflow-hidden transition-all duration-300',
                    isBulletExpanded ? 'max-h-96' : 'max-h-28'
                  )}
                >
                  {analysis.bulletPoints.map((point, i) => (
                    <p
                      key={i}
                      className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pl-2 border-l-2 border-blue-200 dark:border-blue-800"
                    >
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* 간략 감정 스탯 */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                {
                  label: '긍정',
                  value: analysis.sentiment.positiveRatio,
                  emoji: '😊',
                  color: 'text-emerald-500',
                },
                {
                  label: '부정',
                  value: analysis.sentiment.negativeRatio,
                  emoji: '😟',
                  color: 'text-red-500',
                },
                {
                  label: '중립',
                  value: analysis.sentiment.neutralRatio,
                  emoji: '😐',
                  color: 'text-gray-400',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="text-xl mb-1">{stat.emoji}</div>
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}%</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 키워드 */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">키워드를 클릭하면 해당 키워드로 검색합니다.</p>
            <KeywordCloud keywords={analysis.topKeywords} onKeywordClick={onKeywordClick} />
            {/* 키워드 순위 목록 */}
            <div className="space-y-1.5 mt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                키워드 순위
              </p>
              {analysis.topKeywords.slice(0, 10).map((kw, i) => (
                <button
                  key={kw.word}
                  onClick={() => onKeywordClick?.(kw.word)}
                  className="flex items-center gap-3 w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                >
                  <span className="w-5 text-xs font-bold text-gray-400 text-right">{i + 1}</span>
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                    {kw.word}
                  </span>
                  <span className="text-xs text-gray-400">{kw.count}회</span>
                  <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{
                        width: `${(kw.count / (analysis.topKeywords[0]?.count || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 감정 분석 */}
        {activeTab === 'sentiment' && (
          <div className="space-y-4">
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <p className="text-3xl mb-1">
                {analysis.sentiment.overall === 'positive'
                  ? '😊'
                  : analysis.sentiment.overall === 'negative'
                    ? '😟'
                    : '😐'}
              </p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                전반적으로 {SENTIMENT_LABEL[analysis.sentiment.overall]} 뉴스
              </p>
              <p className="text-xs text-gray-400 mt-1">
                총 {analysis.totalArticles}건 분석
              </p>
            </div>
            <SentimentChart sentiment={analysis.sentiment} />
          </div>
        )}

        {/* 카테고리 분류 */}
        {activeTab === 'categories' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">카테고리를 클릭하면 필터링됩니다.</p>
            <CategoryChart
              categories={analysis.categories}
              onCategoryClick={onCategoryClick}
              activeCategory={activeCategory}
            />
          </div>
        )}

        {/* 트렌드 인사이트 */}
        {activeTab === 'trends' && (
          <div>
            <TrendInsights insights={analysis.trendInsights} />
          </div>
        )}
      </div>
    </div>
  );
}
