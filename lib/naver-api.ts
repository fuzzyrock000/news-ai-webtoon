import { NaverNewsItem, NaverNewsResponse, NewsSearchRequest } from '@/types/news';

const NAVER_API_BASE = 'https://openapi.naver.com/v1/search/news.json';
const CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

function buildDateQuery(period: string | undefined, baseQuery: string): string {
  if (!period || period === 'all') return baseQuery;

  const now = new Date();
  if (period === 'today') {
    const todayStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    return `${baseQuery} after:${todayStr}`;
  }
  if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekStr = weekAgo.toISOString().slice(0, 10).replace(/-/g, '');
    return `${baseQuery} after:${weekStr}`;
  }
  return baseQuery;
}

export async function fetchNaverNews(req: NewsSearchRequest): Promise<NaverNewsItem[]> {
  const { query, period, display = 30, sort = 'date' } = req;

  const searchQuery = buildDateQuery(period, query);

  const params = new URLSearchParams({
    query: searchQuery,
    display: String(Math.min(display, 100)),
    start: '1',
    sort,
  });

  const response = await fetch(`${NAVER_API_BASE}?${params.toString()}`, {
    headers: {
      'X-Naver-Client-Id': CLIENT_ID,
      'X-Naver-Client-Secret': CLIENT_SECRET,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Naver API error ${response.status}: ${errorText}`);
  }

  const data: NaverNewsResponse = await response.json();
  return data.items ?? [];
}
