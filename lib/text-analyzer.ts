import {
  Category,
  CategoryStat,
  KeywordStat,
  NaverNewsItem,
  NewsAnalysis,
  ProcessedNewsItem,
  Sentiment,
  SentimentStat,
  TrendInsight,
} from '@/types/news';
import { stripHtml } from './utils';

// ── 불용어 ──────────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  '이', '가', '을', '를', '은', '는', '의', '에', '에서', '로', '으로', '과', '와', '도', '만',
  '이다', '있다', '없다', '하다', '되다', '것', '수', '등', '및', '또', '또한', '그리고',
  '하지만', '그러나', '그래서', '따라서', '때문에', '위해', '위한', '대한', '대해', '통해',
  '관련', '관한', '한', '한다', '했다', '했으며', '했고', '라고', '이라고', '라며', '이라며',
  '라는', '이라는', '지난', '오늘', '어제', '내일', '현재', '올해', '작년', '올', '지금',
  '더', '가장', '매우', '아주', '정말', '많이', '조금', '약', '각', '전', '후', '중',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'of', 'in', 'on', 'at',
]);

// ── 감정 사전 ─────────────────────────────────────────────────────────────────
const POSITIVE_WORDS: Record<string, number> = {
  성장: 2, 호조: 2, 상승: 2, 개선: 2, 혁신: 2, 성공: 3, 발전: 2, 확대: 2, 증가: 1,
  강화: 2, 호황: 3, 흑자: 3, 회복: 2, 돌파: 2, 달성: 2, 선정: 1, 수상: 2, 긍정: 2,
  기대: 1, 희망: 2, 활성화: 2, 도약: 2, 신기록: 3, 최고: 2, 우수: 2, 합격: 2,
  승리: 3, 우승: 3, 완료: 1, 출시: 1, 개통: 1, 협력: 1, 타결: 2, 합의: 2,
  지원: 1, 투자: 1, 유치: 2, 호평: 2, 인기: 1, 급등: 2, 반등: 2,
};

const NEGATIVE_WORDS: Record<string, number> = {
  하락: 2, 감소: 1, 위기: 3, 실패: 3, 손실: 2, 악화: 2, 충돌: 2, 사고: 2, 피해: 2,
  위험: 2, 적자: 3, 폭락: 3, 논란: 2, 비판: 2, 반발: 2, 거부: 1, 취소: 1,
  지연: 1, 차질: 2, 실망: 2, 우려: 2, 경고: 2, 제재: 2, 갈등: 2, 분쟁: 3,
  패배: 3, 탈락: 2, 부도: 3, 파산: 3, 폐업: 2, 해고: 2, 침체: 2, 불안: 2,
  급락: 3, 폭등: 1, 사망: 3, 부상: 2, 실종: 2, 체포: 2, 기소: 2,
};

// ── 카테고리 사전 ──────────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  경제: ['주가', '경제', '기업', '투자', '금리', '환율', '주식', '코스피', '코스닥', '증권', '무역', '수출', '수입', '물가', '인플레', '금융', '은행', '대출', '부동산', '매출', '이익', '적자', '흑자', '펀드', 'ETF', '비트코인', '코인', '가상자산'],
  정치: ['대통령', '국회', '선거', '정부', '외교', '법안', '여당', '야당', '총리', '장관', '의원', '정책', '법원', '헌재', '청와대', '민주당', '국민의힘', '정치', '투표', '입법'],
  사회: ['사회', '복지', '교육', '환경', '범죄', '사건', '사고', '화재', '재난', '경찰', '검찰', '법원', '시민', '주민', '학교', '대학교', '취업', '실업', '인구', '출산', '고령화'],
  기술: ['AI', 'IT', '기술', '개발', '소프트웨어', '앱', '플랫폼', '데이터', '클라우드', '반도체', '스마트폰', '인공지능', '로봇', '자율주행', '전기차', '배터리', '메타버스', '블록체인', '빅데이터', '사이버', '해킹', '보안'],
  스포츠: ['축구', '야구', '농구', '배구', '골프', '올림픽', '선수', '경기', '리그', '챔피언', '토너먼트', '월드컵', '국가대표', '감독', '코치', '훈련', '스포츠', 'EPL', 'NBA', 'MLB'],
  문화: ['영화', '음악', '예술', 'K팝', 'K-팝', '드라마', '공연', '전시', '문화', '연예', '가수', '배우', '감독', '앨범', '음반', '콘서트', '뮤지컬', '작가', '소설', '웹툰'],
  국제: ['미국', '중국', '일본', '유럽', 'UN', '세계', '글로벌', '국제', '외국', '해외', '러시아', '북한', '한반도', '우크라이나', '이스라엘', '전쟁', '분쟁', 'G7', 'G20', 'WTO', 'IMF'],
  건강: ['의료', '병원', '질병', '건강', '백신', '의약품', '치료', '환자', '의사', '수술', '코로나', '독감', '암', '당뇨', '고혈압', '복지부', '식약처', '임상', '신약', '바이오'],
  환경: ['기후', '환경', '탄소', '온난화', '재생에너지', '태양광', '풍력', '미세먼지', '오염', '생태계', '자연재해', '홍수', '가뭄', '산불', '녹색', '친환경', 'ESG'],
  기타: [],
};

// ── 텍스트 토큰화 ───────────────────────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .split(/[\s\.,\!\?\;\:\"\'\(\)\[\]\{\}\/\|\\`~@#$%^&*+=<>·…\-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));
}

// ── 키워드 추출 ─────────────────────────────────────────────────────────────────
export function extractKeywords(texts: string[], topN = 20): KeywordStat[] {
  const tf: Record<string, number> = {};
  const df: Record<string, number> = {};
  const docCount = texts.length;

  texts.forEach((text) => {
    const tokens = tokenize(text);
    const seen = new Set<string>();
    tokens.forEach((t) => {
      tf[t] = (tf[t] || 0) + 1;
      if (!seen.has(t)) {
        df[t] = (df[t] || 0) + 1;
        seen.add(t);
      }
    });
  });

  const keywords = Object.entries(tf)
    .map(([word, count]) => {
      const idf = Math.log((docCount + 1) / ((df[word] || 1) + 1)) + 1;
      const score = (count / docCount) * idf;
      return { word, count, score };
    })
    .filter(({ count }) => count >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return keywords;
}

// ── 감정 분석 ─────────────────────────────────────────────────────────────────
function analyzeSentiment(text: string): { sentiment: Sentiment; score: number } {
  const tokens = tokenize(text);
  let positiveScore = 0;
  let negativeScore = 0;

  tokens.forEach((token) => {
    if (POSITIVE_WORDS[token]) positiveScore += POSITIVE_WORDS[token];
    if (NEGATIVE_WORDS[token]) negativeScore += NEGATIVE_WORDS[token];
  });

  // 부분 문자열 매칭
  const lowerText = text.toLowerCase();
  Object.entries(POSITIVE_WORDS).forEach(([word, score]) => {
    if (lowerText.includes(word)) positiveScore += score * 0.5;
  });
  Object.entries(NEGATIVE_WORDS).forEach(([word, score]) => {
    if (lowerText.includes(word)) negativeScore += score * 0.5;
  });

  const diff = positiveScore - negativeScore;
  const total = positiveScore + negativeScore + 0.001;
  const normalizedScore = diff / total;

  let sentiment: Sentiment = 'neutral';
  if (normalizedScore > 0.15) sentiment = 'positive';
  else if (normalizedScore < -0.15) sentiment = 'negative';

  return { sentiment, score: normalizedScore };
}

// ── 카테고리 분류 ──────────────────────────────────────────────────────────────
function classifyCategory(text: string): Category {
  const lowerText = text;
  const scores: Partial<Record<Category, number>> = {};

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    if (cat === '기타') continue;
    let score = 0;
    for (const kw of keywords) {
      if (lowerText.includes(kw)) score += 1;
    }
    if (score > 0) scores[cat] = score;
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  return sorted.length > 0 ? (sorted[0][0] as Category) : '기타';
}

// ── 요약 생성 ─────────────────────────────────────────────────────────────────
function generateSummary(
  items: ProcessedNewsItem[],
  topKeywords: KeywordStat[]
): { summary: string; bulletPoints: string[] } {
  if (items.length === 0) {
    return { summary: '분석할 뉴스가 없습니다.', bulletPoints: [] };
  }

  const topKw = topKeywords.slice(0, 5).map((k) => k.word).join(', ');

  const categoryCounts: Partial<Record<Category, number>> = {};
  items.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  const topCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];

  const positiveCount = items.filter((i) => i.sentiment === 'positive').length;
  const negativeCount = items.filter((i) => i.sentiment === 'negative').length;
  const overallSentiment =
    positiveCount > negativeCount
      ? '긍정적'
      : negativeCount > positiveCount
        ? '부정적'
        : '중립적';

  const summary =
    `총 ${items.length}건의 뉴스를 분석했습니다. ` +
    `주요 키워드는 ${topKw}이며, ` +
    `전반적인 뉴스 톤은 ${overallSentiment}입니다. ` +
    (topCategory
      ? `가장 많은 기사가 다루는 분야는 '${topCategory[0]}' (${topCategory[1]}건)입니다.`
      : '');

  // 대표 기사 제목으로 불릿 포인트 생성
  const bulletItems = items
    .slice(0, 5)
    .map((item) => item.cleanTitle);

  const bulletPoints = bulletItems.map((title) => `• ${title}`);

  return { summary, bulletPoints };
}

// ── 트렌드 인사이트 ──────────────────────────────────────────────────────────────
function generateTrendInsights(
  items: ProcessedNewsItem[],
  topKeywords: KeywordStat[]
): TrendInsight[] {
  const insights: TrendInsight[] = [];

  // 가장 많이 언급된 키워드
  if (topKeywords[0]) {
    insights.push({
      type: 'hot',
      title: '🔥 핫 키워드',
      description: `"${topKeywords[0].word}"가 ${topKeywords[0].count}번 언급되며 가장 화제입니다.`,
      value: topKeywords[0].word,
    });
  }

  // 두 번째 키워드
  if (topKeywords[1]) {
    insights.push({
      type: 'rising',
      title: '📈 주목 키워드',
      description: `"${topKeywords[1].word}"와 "${topKeywords[2]?.word || ''}" 관련 뉴스가 급부상 중입니다.`,
      value: topKeywords[1].word,
    });
  }

  // 감정 인사이트
  const posRatio = items.filter((i) => i.sentiment === 'positive').length / items.length;
  const negRatio = items.filter((i) => i.sentiment === 'negative').length / items.length;

  if (posRatio > 0.5) {
    insights.push({
      type: 'sentiment',
      title: '😊 긍정적 분위기',
      description: `전체 뉴스의 ${Math.round(posRatio * 100)}%가 긍정적 톤으로 작성되어 있습니다.`,
      value: `${Math.round(posRatio * 100)}%`,
    });
  } else if (negRatio > 0.5) {
    insights.push({
      type: 'sentiment',
      title: '😟 부정적 분위기',
      description: `전체 뉴스의 ${Math.round(negRatio * 100)}%가 부정적 톤으로 작성되어 있습니다.`,
      value: `${Math.round(negRatio * 100)}%`,
    });
  } else {
    insights.push({
      type: 'sentiment',
      title: '😐 혼재된 분위기',
      description: `긍정 ${Math.round(posRatio * 100)}%, 부정 ${Math.round(negRatio * 100)}%로 의견이 혼재합니다.`,
    });
  }

  // 카테고리 인사이트
  const categoryCounts: Partial<Record<Category, number>> = {};
  items.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  const sortedCats = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);
  if (sortedCats.length >= 2) {
    insights.push({
      type: 'category',
      title: '📂 주요 분야',
      description: `'${sortedCats[0][0]}' (${sortedCats[0][1]}건)와 '${sortedCats[1][0]}' (${sortedCats[1][1]}건) 기사가 가장 많습니다.`,
      value: sortedCats[0][0],
    });
  }

  return insights;
}

// ── 날짜 범위 계산 ──────────────────────────────────────────────────────────────
function getDateRange(items: ProcessedNewsItem[]): string {
  if (items.length === 0) return '';
  const dates = items.map((i) => new Date(i.pubDate)).filter((d) => !isNaN(d.getTime()));
  if (dates.length === 0) return '';
  const min = new Date(Math.min(...dates.map((d) => d.getTime())));
  const max = new Date(Math.max(...dates.map((d) => d.getTime())));
  const fmt = (d: Date) =>
    d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  if (min.toDateString() === max.toDateString()) return fmt(max);
  return `${fmt(min)} ~ ${fmt(max)}`;
}

// ── 메인 분석 함수 ─────────────────────────────────────────────────────────────
export function analyzeNews(rawItems: NaverNewsItem[]): {
  items: ProcessedNewsItem[];
  analysis: NewsAnalysis;
} {
  const items: ProcessedNewsItem[] = rawItems.map((raw) => {
    const cleanTitle = stripHtml(raw.title);
    const cleanDescription = stripHtml(raw.description);
    const fullText = `${cleanTitle} ${cleanDescription}`;

    const { sentiment, score } = analyzeSentiment(fullText);
    const category = classifyCategory(fullText);
    const keywords = extractKeywords([fullText], 5).map((k) => k.word);

    return {
      title: raw.title,
      link: raw.link,
      originallink: raw.originallink,
      description: raw.description,
      pubDate: raw.pubDate,
      cleanTitle,
      cleanDescription,
      category,
      sentiment,
      sentimentScore: score,
      keywords,
    };
  });

  // 전체 텍스트로 키워드 추출
  const allTexts = items.map((i) => `${i.cleanTitle} ${i.cleanDescription}`);
  const topKeywords = extractKeywords(allTexts, 20);

  // 감정 통계
  const positiveCount = items.filter((i) => i.sentiment === 'positive').length;
  const negativeCount = items.filter((i) => i.sentiment === 'negative').length;
  const neutralCount = items.filter((i) => i.sentiment === 'neutral').length;
  const total = items.length || 1;

  let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (positiveCount > negativeCount && positiveCount > neutralCount) overallSentiment = 'positive';
  else if (negativeCount > positiveCount && negativeCount > neutralCount) overallSentiment = 'negative';

  const sentiment: SentimentStat = {
    overall: overallSentiment,
    positiveRatio: Math.round((positiveCount / total) * 100),
    negativeRatio: Math.round((negativeCount / total) * 100),
    neutralRatio: Math.round((neutralCount / total) * 100),
    positiveCount,
    negativeCount,
    neutralCount,
  };

  // 카테고리 통계
  const categoryCounts: Partial<Record<Category, number>> = {};
  items.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  const categories: CategoryStat[] = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name: name as Category,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const trendInsights = generateTrendInsights(items, topKeywords);
  const { summary, bulletPoints } = generateSummary(items, topKeywords);
  const dateRange = getDateRange(items);

  return {
    items,
    analysis: {
      summary,
      bulletPoints,
      topKeywords,
      sentiment,
      categories,
      trendInsights,
      totalArticles: items.length,
      dateRange,
      processedAt: new Date().toISOString(),
    },
  };
}
