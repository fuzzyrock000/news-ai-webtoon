import { NextRequest, NextResponse } from 'next/server';
import { fetchNaverNews } from '@/lib/naver-api';
import { analyzeNews } from '@/lib/text-analyzer';
import { generateWebtoonScript } from '@/lib/webtoon-generator';
import { NewsAnalysis } from '@/types/news';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 이미 분석된 데이터가 전달된 경우
    if (body.analysis && body.query) {
      const analysis = body.analysis as NewsAnalysis;
      const script = generateWebtoonScript(analysis, body.query);
      return NextResponse.json({ script });
    }

    // 쿼리만 전달된 경우 - 직접 검색 후 분석
    const { query, period = 'all' } = body;
    if (!query) {
      return NextResponse.json({ error: '검색어가 필요합니다.' }, { status: 400 });
    }

    const rawItems = await fetchNaverNews({ query, period, display: 30 });
    if (rawItems.length === 0) {
      return NextResponse.json({ error: '관련 뉴스를 찾을 수 없습니다.' }, { status: 404 });
    }

    const { analysis } = analyzeNews(rawItems);
    const script = generateWebtoonScript(analysis, query);

    return NextResponse.json({ script });
  } catch (error) {
    const message = error instanceof Error ? error.message : '웹툰 생성 중 오류가 발생했습니다.';
    console.error('[API /webtoon]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
