export interface NaverNewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

export type Sentiment = 'positive' | 'negative' | 'neutral';

export type Category =
  | '경제'
  | '정치'
  | '사회'
  | '기술'
  | '스포츠'
  | '문화'
  | '국제'
  | '건강'
  | '환경'
  | '기타';

export interface ProcessedNewsItem {
  title: string;
  link: string;
  originallink: string;
  description: string;
  pubDate: string;
  cleanTitle: string;
  cleanDescription: string;
  category: Category;
  sentiment: Sentiment;
  sentimentScore: number;
  keywords: string[];
}

export interface KeywordStat {
  word: string;
  count: number;
  score: number;
}

export interface SentimentStat {
  overall: Sentiment;
  positiveRatio: number;
  negativeRatio: number;
  neutralRatio: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
}

export interface CategoryStat {
  name: Category;
  count: number;
  percentage: number;
}

export interface TrendInsight {
  type: 'hot' | 'rising' | 'sentiment' | 'category';
  title: string;
  description: string;
  value?: string | number;
}

export interface NewsAnalysis {
  summary: string;
  bulletPoints: string[];
  topKeywords: KeywordStat[];
  sentiment: SentimentStat;
  categories: CategoryStat[];
  trendInsights: TrendInsight[];
  totalArticles: number;
  dateRange: string;
  processedAt: string;
}

export interface NewsSearchRequest {
  query: string;
  period?: 'today' | 'week' | 'all';
  display?: number;
  sort?: 'sim' | 'date';
}

export interface NewsSearchResponse {
  items: ProcessedNewsItem[];
  analysis: NewsAnalysis;
  query: string;
  period: string;
  total: number;
}
