import { NextRequest, NextResponse } from 'next/server';
import { fetchNaverNews } from '@/lib/naver-api';
import { analyzeNews } from '@/lib/text-analyzer';
import { generateWebtoonScript } from '@/lib/webtoon-generator';
import { generateAIWebtoon } from '@/lib/openai-client';
import { NewsAnalysis } from '@/types/news';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let analysis: NewsAnalysis;
    let query: string;

    if (body.analysis && body.query) {
      // 이미 분석된 데이터가 전달된 경우
      analysis = body.analysis as NewsAnalysis;
      query = body.query as string;
    } else if (body.query) {
      // 쿼리만 전달된 경우 — 직접 검색 후 분석
      query = body.query;
      const period = body.period ?? 'all';
      const rawItems = await fetchNaverNews({ query, period, display: 30 });
      if (rawItems.length === 0) {
        return NextResponse.json({ error: '관련 뉴스를 찾을 수 없습니다.' }, { status: 404 });
      }
      const result = analyzeNews(rawItems);
      analysis = result.analysis;
    } else {
      return NextResponse.json({ error: '검색어가 필요합니다.' }, { status: 400 });
    }

    // OpenAI로 창의적인 웹툰 생성 시도
    const aiScript = await generateAIWebtoon(analysis, query);

    // OpenAI 실패 시 rule-based 폴백
    const script = aiScript ?? generateWebtoonScript(analysis, query);

    return NextResponse.json({ script, usedAI: !!aiScript });
  } catch (error) {
    const message = error instanceof Error ? error.message : '웹툰 생성 중 오류가 발생했습니다.';
    console.error('[API /webtoon]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
