import OpenAI from 'openai';
import { NewsAnalysis, ProcessedNewsItem } from '@/types/news';
import { WebtoonScript, WebtoonPanel, WebtoonCharacter, SpeechBubble } from '@/types/webtoon';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = 'gpt-4o-mini';

// ── 공통 JSON 파싱 헬퍼 ─────────────────────────────────────────────────────
function parseJSON<T>(text: string): T | null {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

// ── 1. AI 뉴스 요약 생성 ─────────────────────────────────────────────────────
interface AISummaryResult {
  summary: string;
  bulletPoints: string[];
}

export async function generateAISummary(
  items: ProcessedNewsItem[],
  query: string,
  period: string
): Promise<AISummaryResult | null> {
  if (!process.env.OPENAI_API_KEY || items.length === 0) return null;

  const periodLabel: Record<string, string> = { today: '오늘', week: '이번 주', all: '전체' };

  const articleList = items
    .slice(0, 15)
    .map((item, i) => `${i + 1}. ${item.cleanTitle}\n   ${item.cleanDescription.slice(0, 80)}`)
    .join('\n');

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            '당신은 한국어 뉴스 분석 전문가입니다. 뉴스를 읽기 쉽고 핵심만 담아 요약합니다. 반드시 JSON 형식으로만 응답하세요.',
        },
        {
          role: 'user',
          content: `검색어: "${query}" / 기간: ${periodLabel[period] ?? period} / 총 ${items.length}건

뉴스 목록:
${articleList}

다음 JSON 형식으로 응답하세요:
{
  "summary": "전체 뉴스 흐름을 2~3문장으로 자연스럽게 요약 (핵심 트렌드와 맥락 포함)",
  "bulletPoints": [
    "• 핵심 포인트 1 (한 줄, 구체적으로)",
    "• 핵심 포인트 2",
    "• 핵심 포인트 3",
    "• 핵심 포인트 4",
    "• 핵심 포인트 5"
  ]
}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? '';
    return parseJSON<AISummaryResult>(content);
  } catch (err) {
    console.error('[OpenAI] 요약 생성 실패:', err);
    return null;
  }
}

// ── 2. AI 웹툰 스크립트 생성 ─────────────────────────────────────────────────

interface RawPanel {
  panelTitle?: string;
  caption?: string;
  sfx?: string;
  characters?: Array<{ emoji?: string; name?: string; position?: string }>;
  bubbles?: Array<{ speaker?: string; text?: string; style?: string }>;
}

interface RawWebtoon {
  title?: string;
  subtitle?: string;
  panels?: RawPanel[];
}

const PANEL_BG_THEMES: WebtoonPanel['bgTheme'][] = [
  'morning',
  'office',
  'chaos',
  'resolution',
];

function sanitizePosition(p?: string): WebtoonCharacter['position'] {
  if (p === 'left' || p === 'right' || p === 'center') return p;
  return 'left';
}

function sanitizeSpeaker(s?: string): SpeechBubble['speaker'] {
  if (s === 'left' || s === 'right' || s === 'narrator') return s;
  return 'left';
}

function sanitizeStyle(s?: string): SpeechBubble['style'] {
  if (s === 'normal' || s === 'shout' || s === 'thought' || s === 'whisper') return s;
  return 'normal';
}

export async function generateAIWebtoon(
  analysis: NewsAnalysis,
  query: string
): Promise<WebtoonScript | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const topKeyword = analysis.topKeywords[0]?.word ?? query;
  const keywords = analysis.topKeywords
    .slice(0, 5)
    .map((k) => k.word)
    .join(', ');
  const category = analysis.categories[0]?.name ?? '기타';
  const sentimentLabel =
    analysis.sentiment.overall === 'positive'
      ? '긍정적'
      : analysis.sentiment.overall === 'negative'
        ? '부정적'
        : '중립적';
  const headlines = analysis.bulletPoints.slice(0, 5).join('\n');

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.9,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `당신은 재치 있는 한국 시사 4컷 만화 작가입니다.
뉴스 이슈를 기반으로 공감되고 유머러스한 4컷 만화 대본을 작성합니다.
기승전결 구조로, 마지막 컷은 반전·교훈·유머로 마무리하세요.
반드시 JSON 형식으로만 응답하세요.`,
        },
        {
          role: 'user',
          content: `다음 뉴스 데이터를 기반으로 4컷 만화 대본을 작성해주세요.

핵심 키워드: ${keywords}
카테고리: ${category}
감정 분위기: ${sentimentLabel}
주요 기사:
${headlines}

다음 JSON 형식으로 정확히 응답하세요:
{
  "title": "만화 제목 (예: [4컷] ${topKeyword} 이야기)",
  "subtitle": "부제목 (카테고리와 감정 포함, 20자 이내)",
  "panels": [
    {
      "panelTitle": "1컷 제목 (8자 이내)",
      "caption": "상황 설명 (선택사항, 10자 이내, 없으면 null)",
      "sfx": "효과음 (선택사항, 5자 이내, 없으면 null)",
      "characters": [
        { "emoji": "이모지 1개", "name": "캐릭터명 (5자 이내)", "position": "left" },
        { "emoji": "이모지 1개", "name": "캐릭터명 (5자 이내)", "position": "right" }
      ],
      "bubbles": [
        { "speaker": "left", "text": "대사 (줄바꿈은 \\n, 한 줄 최대 12자)", "style": "shout" },
        { "speaker": "right", "text": "대사", "style": "normal" }
      ]
    },
    { ... 2컷 ... },
    { ... 3컷 ... },
    { ... 4컷 (반전/유머 결말) ... }
  ]
}

규칙:
- 각 패널 캐릭터는 2명 이하
- speaker는 "left", "right", "narrator" 중 하나
- style은 "normal", "shout", "thought", "whisper" 중 하나
- 대사는 짧고 임팩트 있게
- 한국 인터넷 밈/신조어 활용 가능
- 마지막 컷은 반드시 웃음/공감 포인트로 마무리`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? '';
    const raw = parseJSON<RawWebtoon>(content);
    if (!raw?.panels || raw.panels.length < 4) return null;

    const panels: WebtoonPanel[] = raw.panels.slice(0, 4).map((p, i) => ({
      panelNumber: (i + 1) as 1 | 2 | 3 | 4,
      title: p.panelTitle ?? `${i + 1}컷`,
      bgTheme: PANEL_BG_THEMES[i],
      caption: p.caption ?? undefined,
      sfx: p.sfx ?? undefined,
      characters: (p.characters ?? []).map((c) => ({
        emoji: c.emoji ?? '🧑',
        name: c.name ?? '등장인물',
        position: sanitizePosition(c.position),
      })),
      bubbles: (p.bubbles ?? []).map((b) => ({
        speaker: sanitizeSpeaker(b.speaker),
        text: b.text ?? '',
        style: sanitizeStyle(b.style),
      })),
    }));

    const sentimentEmoji =
      analysis.sentiment.overall === 'positive'
        ? '😊'
        : analysis.sentiment.overall === 'negative'
          ? '😟'
          : '😐';

    return {
      title: raw.title ?? `[4컷] ${topKeyword} 이야기`,
      subtitle: raw.subtitle ?? `${sentimentEmoji} ${category} · 오늘의 핫이슈 웹툰`,
      keyword: topKeyword,
      category,
      panels,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[OpenAI] 웹툰 생성 실패:', err);
    return null;
  }
}
