import { NewsAnalysis, Category } from '@/types/news';
import { WebtoonPanel, WebtoonScript } from '@/types/webtoon';

// ── 캐릭터 풀 ─────────────────────────────────────────────────────────────────
const CHARACTERS = {
  reporter: { emoji: '🎙️👩‍💼', name: '이슈 기자' },
  citizen: { emoji: '🧑', name: '시민 A' },
  expert: { emoji: '👨‍🔬', name: '전문가' },
  politician: { emoji: '👔', name: '정치인' },
  ceo: { emoji: '👨‍💼', name: '기업인' },
  ai: { emoji: '🤖', name: 'AI' },
  youth: { emoji: '🧑‍💻', name: '청년' },
  elder: { emoji: '👴', name: '어르신' },
  athlete: { emoji: '⚽🏃', name: '선수' },
  doctor: { emoji: '👨‍⚕️', name: '의사' },
};

// ── 배경 이모지 팔레트 ──────────────────────────────────────────────────────────
const BG_SCENES: Record<string, string> = {
  morning: '🌅 뉴스룸',
  office: '🏢 사무실',
  chaos: '😱 현장',
  resolution: '🌈 결말',
  dark: '🌃 밤거리',
  bright: '☀️ 거리',
  sunset: '🌇 저녁',
};

// ── 카테고리별 시나리오 템플릿 ──────────────────────────────────────────────────
type TemplateMap = Record<string, (kw: string, kw2: string, headline: string) => WebtoonPanel[]>;

const TEMPLATES: TemplateMap = {
  경제: (kw, kw2, headline) => [
    {
      panelNumber: 1,
      title: '속보 발생!',
      bgTheme: 'morning',
      characters: [
        { emoji: '📺', name: '뉴스 앵커', position: 'left' },
        { emoji: '😮', name: '시청자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `속보입니다!\n"${kw}" 관련\n대형 이슈 발생!`, style: 'shout' },
        { speaker: 'right', text: '어?!\n뭐야 뭐야?!', style: 'shout' },
      ],
      sfx: '!!!',
      caption: '오늘 아침',
    },
    {
      panelNumber: 2,
      title: '직장인의 반응',
      bgTheme: 'office',
      characters: [
        { emoji: '😱', name: '직장인', position: 'left' },
        { emoji: '💻', name: '동료', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `${kw} 주가가\n이렇게 움직이면\n어떡하지...`, style: 'normal' },
        { speaker: 'right', text: `${kw2}도\n같이 흔들리고 있어!`, style: 'shout' },
      ],
      sfx: '두근두근',
    },
    {
      panelNumber: 3,
      title: '전문가 등장',
      bgTheme: 'chaos',
      characters: [
        { emoji: '👨‍🔬', name: '경제 전문가', position: 'left' },
        { emoji: '🎙️', name: '기자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'right', text: '전문가님!\n지금 상황을\n어떻게 보시나요?', style: 'normal' },
        { speaker: 'left', text: `"${headline.slice(0, 15)}..."\n이건 좀 두고\n봐야 합니다 😅`, style: 'normal' },
      ],
      sfx: '술렁술렁',
    },
    {
      panelNumber: 4,
      title: '오늘의 교훈',
      bgTheme: 'resolution',
      characters: [{ emoji: '🤔', name: '나', position: 'center' }],
      bubbles: [
        { speaker: 'narrator', text: '결국 뉴스는 보는 것이지\n내 통장엔 변화가 없다...' },
        { speaker: 'left', text: '오늘도\n열심히 살아야지!', style: 'thought' },
      ],
      sfx: '현실',
    },
  ],

  정치: (kw, kw2, headline) => [
    {
      panelNumber: 1,
      title: '국회에서 무슨 일이?',
      bgTheme: 'morning',
      characters: [
        { emoji: '🏛️', name: '국회', position: 'left' },
        { emoji: '📰', name: '기자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'narrator', text: '오늘 국회에서\n또 사건이!' },
        { speaker: 'right', text: `"${kw}" 관련\n논란 확산 중!`, style: 'shout' },
      ],
      sfx: '속보!',
    },
    {
      panelNumber: 2,
      title: '여야 격돌',
      bgTheme: 'chaos',
      characters: [
        { emoji: '👔', name: '여당', position: 'left' },
        { emoji: '👔', name: '야당', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `${kw}는 우리\n정책의 핵심입니다!`, style: 'shout' },
        { speaker: 'right', text: '그건 말이 안 됩니다!\n${kw2}를 보세요!', style: 'shout' },
      ],
      sfx: '설전!',
    },
    {
      panelNumber: 3,
      title: '국민의 한마디',
      bgTheme: 'bright',
      characters: [
        { emoji: '🧑', name: '시민 A', position: 'left' },
        { emoji: '👵', name: '시민 B', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: '저 사람들\n또 싸우네요...', style: 'whisper' },
        { speaker: 'right', text: '내 밥상 물가나\n좀 잡아줘요...', style: 'normal' },
      ],
      sfx: '한숨',
    },
    {
      panelNumber: 4,
      title: '뉴스의 끝',
      bgTheme: 'sunset',
      characters: [{ emoji: '📺', name: 'TV', position: 'center' }],
      bubbles: [
        { speaker: 'narrator', text: '다음 이 시간에\n또 만나요...' },
        { speaker: 'left', text: '내일도\n뉴스는 계속된다', style: 'thought' },
      ],
      sfx: '계속...',
    },
  ],

  기술: (kw, kw2, headline) => [
    {
      panelNumber: 1,
      title: 'AI 시대 도래!',
      bgTheme: 'morning',
      characters: [
        { emoji: '🤖', name: 'AI', position: 'left' },
        { emoji: '😮', name: '인간', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `"${kw}" 기술로\n세상이 바뀝니다!`, style: 'shout' },
        { speaker: 'right', text: '이, 이게 현실이야?!', style: 'shout' },
      ],
      sfx: '쾅!',
      caption: '기술 혁명의 날',
    },
    {
      panelNumber: 2,
      title: '기업들의 반응',
      bgTheme: 'office',
      characters: [
        { emoji: '👨‍💼', name: 'CEO', position: 'left' },
        { emoji: '💡', name: '개발자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `${kw} 도입!\n전 직원 의무!`, style: 'shout' },
        { speaker: 'right', text: '...그럼 저는요?', style: 'whisper' },
      ],
      sfx: '결재!',
    },
    {
      panelNumber: 3,
      title: '개발자의 고민',
      bgTheme: 'dark',
      characters: [
        { emoji: '🧑‍💻', name: '개발자', position: 'center' },
      ],
      bubbles: [
        { speaker: 'narrator', text: `"${kw2}"가 내 일을\n대신할 수도...` },
        { speaker: 'left', text: '그래도 나는\n포기 안 해!', style: 'thought' },
      ],
      sfx: '두근두근',
    },
    {
      panelNumber: 4,
      title: '미래는?',
      bgTheme: 'bright',
      characters: [
        { emoji: '🤖', name: 'AI', position: 'left' },
        { emoji: '🤝', name: '인간', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: '같이 일해요!', style: 'normal' },
        { speaker: 'right', text: '...일단은 그래야겠지?', style: 'thought' },
      ],
      sfx: '협력!',
    },
  ],

  사회: (kw, kw2, _headline) => [
    {
      panelNumber: 1,
      title: '오늘의 사회 이슈',
      bgTheme: 'morning',
      characters: [
        { emoji: '📰', name: '기자', position: 'left' },
        { emoji: '😯', name: '시민', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `"${kw}" 문제\n다시 불거졌습니다!`, style: 'shout' },
        { speaker: 'right', text: '또요?!\n이번엔 얼마나...', style: 'normal' },
      ],
      sfx: '충격',
    },
    {
      panelNumber: 2,
      title: 'SNS 폭발',
      bgTheme: 'chaos',
      characters: [
        { emoji: '📱', name: '누리꾼', position: 'left' },
        { emoji: '💬', name: '댓글', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: '이거 실화냐?\n#지금당장공유', style: 'shout' },
        { speaker: 'right', text: `${kw2} 관련\n댓글 10만개 돌파!`, style: 'shout' },
      ],
      sfx: '바이럴!',
    },
    {
      panelNumber: 3,
      title: '전문가 의견',
      bgTheme: 'office',
      characters: [
        { emoji: '👨‍🏫', name: '교수', position: 'left' },
        { emoji: '🎙️', name: '기자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'right', text: '교수님, 이 문제\n근본 원인이 뭔가요?', style: 'normal' },
        { speaker: 'left', text: '복잡한 문제입니다.\n많은 요소가...', style: 'normal' },
      ],
      sfx: '음...',
    },
    {
      panelNumber: 4,
      title: '우리의 다짐',
      bgTheme: 'resolution',
      characters: [{ emoji: '💪', name: '우리 모두', position: 'center' }],
      bubbles: [
        { speaker: 'narrator', text: '이 문제는 우리 모두가\n함께 풀어야 합니다.' },
        { speaker: 'left', text: '더 나은 사회를\n위하여!', style: 'shout' },
      ],
      sfx: '화이팅!',
    },
  ],

  스포츠: (kw, kw2, _headline) => [
    {
      panelNumber: 1,
      title: '경기 전날 밤',
      bgTheme: 'dark',
      characters: [
        { emoji: '⚽🏃', name: '선수', position: 'left' },
        { emoji: '😴', name: '팬', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: '내일은 반드시\n이긴다!', style: 'thought' },
        { speaker: 'right', text: '알람 5개 맞춰놨어!\n${kw} 파이팅!', style: 'shout' },
      ],
      sfx: '두근',
      caption: '경기 전날',
    },
    {
      panelNumber: 2,
      title: '경기 시작!',
      bgTheme: 'chaos',
      characters: [
        { emoji: '🏟️', name: '경기장', position: 'left' },
        { emoji: '🎺📣', name: '응원단', position: 'right' },
      ],
      bubbles: [
        { speaker: 'narrator', text: `${kw} vs ${kw2}\n드디어 킥오프!` },
        { speaker: 'right', text: '우리 팀\n가즈아아!!', style: 'shout' },
      ],
      sfx: '와아아!',
    },
    {
      panelNumber: 3,
      title: '극적인 순간',
      bgTheme: 'bright',
      characters: [
        { emoji: '⚽', name: '공', position: 'center' },
        { emoji: '😭😆', name: '선수들', position: 'right' },
      ],
      bubbles: [
        { speaker: 'narrator', text: '후반 90+3분!\n극적 역전골!!!' },
        { speaker: 'left', text: '이게 무슨\n일이야!!', style: 'shout' },
      ],
      sfx: 'GOAL!!!',
    },
    {
      panelNumber: 4,
      title: '끝나고 나서',
      bgTheme: 'sunset',
      characters: [
        { emoji: '😭', name: '패배팀 팬', position: 'left' },
        { emoji: '🏆', name: '승리팀 팬', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: '다음엔 꼭...\n꼭 이긴다...', style: 'whisper' },
        { speaker: 'right', text: '역시 우리가\n최고야!!!', style: 'shout' },
      ],
      sfx: '감동',
    },
  ],

  문화: (kw, kw2, _headline) => [
    {
      panelNumber: 1,
      title: 'K-콘텐츠 열풍',
      bgTheme: 'bright',
      characters: [
        { emoji: '🌏', name: '세계', position: 'left' },
        { emoji: '🎤', name: 'K-스타', position: 'right' },
      ],
      bubbles: [
        { speaker: 'narrator', text: `"${kw}" 전 세계\n동시 1위 달성!` },
        { speaker: 'left', text: '오, 또 한국이야?!\nIncredible!', style: 'shout' },
      ],
      sfx: '대박!',
      caption: '글로벌 K-웨이브',
    },
    {
      panelNumber: 2,
      title: '팬들의 반응',
      bgTheme: 'chaos',
      characters: [
        { emoji: '📱💜', name: '팬', position: 'left' },
        { emoji: '🖥️', name: '스트리밍', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `${kw} 신곡\n1억뷰 돌파!!!`, style: 'shout' },
        { speaker: 'right', text: '서버가 터질 것 같아...', style: 'whisper' },
      ],
      sfx: '터짐!',
    },
    {
      panelNumber: 3,
      title: '해외 반응',
      bgTheme: 'morning',
      characters: [
        { emoji: '🌍', name: '외국인', position: 'left' },
        { emoji: '😭', name: '팬 A', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `${kw2} is\nAMAZING!!!`, style: 'shout' },
        { speaker: 'right', text: '한국인이어서\n뿌듯해요ㅠㅠ', style: 'normal' },
      ],
      sfx: '자랑스럽다',
    },
    {
      panelNumber: 4,
      title: 'K-문화의 힘',
      bgTheme: 'resolution',
      characters: [{ emoji: '🇰🇷✨', name: 'K-문화', position: 'center' }],
      bubbles: [
        { speaker: 'narrator', text: '한류는 계속됩니다!\n세계가 한국을 주목합니다.' },
        { speaker: 'left', text: '다음 목표는\n전 우주 1위!', style: 'thought' },
      ],
      sfx: '계속!',
    },
  ],

  국제: (kw, kw2, headline) => [
    {
      panelNumber: 1,
      title: '세계가 술렁인다',
      bgTheme: 'morning',
      characters: [
        { emoji: '🌍', name: '세계', position: 'left' },
        { emoji: '📡', name: '외신', position: 'right' },
      ],
      bubbles: [
        { speaker: 'right', text: `BREAKING:\n"${headline.slice(0, 18)}..."`, style: 'shout' },
        { speaker: 'left', text: '이게 무슨\n소리야!!', style: 'shout' },
      ],
      sfx: 'BREAKING!',
    },
    {
      panelNumber: 2,
      title: '각국의 반응',
      bgTheme: 'chaos',
      characters: [
        { emoji: '🇺🇸', name: '미국', position: 'left' },
        { emoji: '🇨🇳', name: '중국', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `${kw}에 대해\n강력 규탄합니다!`, style: 'shout' },
        { speaker: 'right', text: '내정 간섭하지\n마십시오!', style: 'shout' },
      ],
      sfx: '팽팽!',
    },
    {
      panelNumber: 3,
      title: '한국의 입장은?',
      bgTheme: 'office',
      characters: [
        { emoji: '🇰🇷', name: '한국', position: 'left' },
        { emoji: '🎙️', name: '기자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'right', text: `${kw2} 관련\n한국 정부 입장은?`, style: 'normal' },
        { speaker: 'left', text: '상황 예의주시하며\n신중히 대응하겠습니다.', style: 'normal' },
      ],
      sfx: '외교',
    },
    {
      panelNumber: 4,
      title: '세계는 하나?',
      bgTheme: 'resolution',
      characters: [{ emoji: '🌏🕊️', name: '평화', position: 'center' }],
      bubbles: [
        { speaker: 'narrator', text: '복잡한 국제 정세...\n평화로운 해결을 기원합니다.' },
        { speaker: 'left', text: '세계 평화!\n얼른 와라...', style: 'thought' },
      ],
      sfx: '바람',
    },
  ],

  건강: (kw, kw2, _headline) => [
    {
      panelNumber: 1,
      title: '건강 경보!',
      bgTheme: 'morning',
      characters: [
        { emoji: '👨‍⚕️', name: '의사', position: 'left' },
        { emoji: '😰', name: '환자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `"${kw}" 관련\n주의보 발령!`, style: 'shout' },
        { speaker: 'right', text: '헉... 저 증상이\n그건 아니겠죠?', style: 'normal' },
      ],
      sfx: '주의!',
    },
    {
      panelNumber: 2,
      title: '병원 앞 풍경',
      bgTheme: 'bright',
      characters: [
        { emoji: '🏥', name: '병원', position: 'left' },
        { emoji: '😷😷😷', name: '대기자들', position: 'right' },
      ],
      bubbles: [
        { speaker: 'narrator', text: `${kw2} 검사 수요\n폭발적 증가` },
        { speaker: 'right', text: '3시간째\n대기 중...', style: 'whisper' },
      ],
      sfx: '줄줄줄',
    },
    {
      panelNumber: 3,
      title: '전문가 조언',
      bgTheme: 'office',
      characters: [
        { emoji: '👨‍⚕️', name: '전문가', position: 'left' },
        { emoji: '📱', name: '시청자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: '손 씻기,\n규칙적 운동,\n충분한 수면!', style: 'normal' },
        { speaker: 'right', text: '그걸 못 해서\n이 지경인 건데...', style: 'thought' },
      ],
      sfx: '알면서...',
    },
    {
      panelNumber: 4,
      title: '건강제일!',
      bgTheme: 'resolution',
      characters: [{ emoji: '💪🏃', name: '건강한 나', position: 'center' }],
      bubbles: [
        { speaker: 'narrator', text: '건강이 최고의 재산입니다!' },
        { speaker: 'left', text: '오늘부터\n운동 시작!\n(진짜로)', style: 'shout' },
      ],
      sfx: '파이팅!',
    },
  ],
};

// ── 기본 템플릿 (기타 카테고리) ──────────────────────────────────────────────────
function defaultTemplate(kw: string, kw2: string, headline: string): WebtoonPanel[] {
  return [
    {
      panelNumber: 1,
      title: '오늘의 이슈',
      bgTheme: 'morning',
      characters: [
        { emoji: '📰', name: '기자', position: 'left' },
        { emoji: '😯', name: '독자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `오늘의 핫이슈!\n"${kw}"`, style: 'shout' },
        { speaker: 'right', text: '이게 무슨 일이야!', style: 'shout' },
      ],
      sfx: '속보!',
      caption: '뉴스 현장',
    },
    {
      panelNumber: 2,
      title: '사람들의 반응',
      bgTheme: 'chaos',
      characters: [
        { emoji: '🧑', name: '시민 A', position: 'left' },
        { emoji: '👩', name: '시민 B', position: 'right' },
      ],
      bubbles: [
        { speaker: 'left', text: `${kw2}도 난리래요!`, style: 'normal' },
        { speaker: 'right', text: `"${headline.slice(0, 15)}..." 이게 진짜야?!`, style: 'shout' },
      ],
      sfx: '술렁술렁',
    },
    {
      panelNumber: 3,
      title: '전문가 한마디',
      bgTheme: 'office',
      characters: [
        { emoji: '👨‍🔬', name: '전문가', position: 'left' },
        { emoji: '🎙️', name: '기자', position: 'right' },
      ],
      bubbles: [
        { speaker: 'right', text: '이 이슈 어떻게\n보세요?', style: 'normal' },
        { speaker: 'left', text: '복합적 요인이 있어\n단순히 보면 안 됩니다.', style: 'normal' },
      ],
      sfx: '음...',
    },
    {
      panelNumber: 4,
      title: '오늘의 결론',
      bgTheme: 'resolution',
      characters: [{ emoji: '🤔', name: '우리', position: 'center' }],
      bubbles: [
        { speaker: 'narrator', text: '세상은 참 복잡하다...' },
        { speaker: 'left', text: '그래도 오늘\n하루도 파이팅!', style: 'shout' },
      ],
      sfx: '계속!',
    },
  ];
}

// ── 메인 생성 함수 ─────────────────────────────────────────────────────────────
export function generateWebtoonScript(
  analysis: NewsAnalysis,
  query: string
): WebtoonScript {
  const topKeyword = analysis.topKeywords[0]?.word ?? query;
  const secondKeyword = analysis.topKeywords[1]?.word ?? analysis.topKeywords[0]?.word ?? '이슈';
  const topCategory = (analysis.categories[0]?.name ?? '기타') as Category;
  const topHeadline = analysis.bulletPoints[0] ?? `${topKeyword} 관련 뉴스`;
  const cleanHeadline = topHeadline.replace(/^•\s*/, '');

  const templateFn = TEMPLATES[topCategory];
  const panels: WebtoonPanel[] = templateFn
    ? templateFn(topKeyword, secondKeyword, cleanHeadline)
    : defaultTemplate(topKeyword, secondKeyword, cleanHeadline);

  const sentimentEmoji =
    analysis.sentiment.overall === 'positive'
      ? '😊'
      : analysis.sentiment.overall === 'negative'
        ? '😟'
        : '😐';

  return {
    title: `[4컷 만화] ${topKeyword} 이야기`,
    subtitle: `${sentimentEmoji} ${topCategory} · 오늘의 핫이슈 웹툰`,
    keyword: topKeyword,
    category: topCategory,
    panels,
    createdAt: new Date().toISOString(),
  };
}
