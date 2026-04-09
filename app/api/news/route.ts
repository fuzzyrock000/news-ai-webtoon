import { NextRequest, NextResponse } from 'next/server';
import { fetchNaverNews } from '@/lib/naver-api';
import { analyzeNews } from '@/lib/text-analyzer';
import { generateAISummary } from '@/lib/openai-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();
  const period = (searchParams.get('period') as 'today' | 'week' | 'all') ?? 'all';
  const display = Number(searchParams.get('display') ?? '30');

  if (!query) {
    return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
  }

  try {
    const rawItems = await fetchNaverNews({ query, period, display });

    if (rawItems.length === 0) {
      return NextResponse.json({ items: [], analysis: null, query, period, total: 0 });
    }

    const { items, analysis } = analyzeNews(rawItems);

    // OpenAI로 고품질 요약 생성 (실패 시 rule-based 요약 유지)
    const aiSummary = await generateAISummary(items, query, period);
    if (aiSummary) {
      analysis.summary = aiSummary.summary;
      analysis.bulletPoints = aiSummary.bulletPoints;
    }

    return NextResponse.json({ items, analysis, query, period, total: items.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[API /news]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
