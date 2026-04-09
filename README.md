# 📰 NewsAI — 실시간 뉴스 AI 분석 + 4컷 웹툰 자동 생성

> 네이버 뉴스 Search API 기반으로 최신 뉴스를 검색하고,  
> AI가 키워드 추출 · 감정 분석 · 카테고리 분류 · 트렌드 인사이트를 제공하며  
> 가장 핫한 이슈를 **4컷 만화 웹툰**으로 자동 생성하는 서비스입니다.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ 주요 기능

| 기능 | 설명 |
|---|---|
| 🔍 **키워드 검색** | 원하는 키워드로 최신 뉴스 최대 30건 검색 |
| 📅 **기간 필터** | 오늘 / 이번 주 / 전체 기간 선택 |
| 🏷️ **키워드 추출** | TF-IDF 알고리즘 기반 중요도 순위 키워드 클라우드 |
| 😊 **감정 분석** | 한국어 감정 사전 기반 긍정 / 부정 / 중립 비율 분석 |
| 📂 **카테고리 분류** | 경제 · 정치 · 사회 · 기술 · 스포츠 · 문화 · 국제 · 건강 · 환경 자동 분류 |
| 📈 **트렌드 인사이트** | 핫 키워드, 감정 흐름, 주요 분야 자동 도출 |
| 📚 **4컷 웹툰 생성** | 핫이슈를 카테고리별 시나리오 템플릿으로 4컷 만화 자동 생성 |

---

## 🖼️ 화면 구성

```
┌─────────────────────────────────────────────────────┐
│  📰 NewsAI             [오늘 뉴스 요약] [이번 주]   │  ← 헤더
├─────────────────────────────────────────────────────┤
│  [ 키워드 입력... ]  [오늘|이번주|전체]  [검색]     │  ← 검색바
│  빠른 검색: AI  경제  주식  부동산  정치  스포츠    │
├──────────────────┬──────────────────────────────────┤
│  AI 뉴스 분석    │  뉴스 카드 목록                  │
│  ┌──────────┐    │  ┌────────────────────────────┐  │
│  │ 요약 탭  │    │  │ [경제] 😊 10분 전           │  │
│  │ 키워드   │    │  │ 제목 제목 제목...           │  │
│  │ 감정     │    │  │ 내용 내용...                │  │
│  │ 분류     │    │  └────────────────────────────┘  │
│  │ 트렌드   │    │  ┌────────────────────────────┐  │
│  └──────────┘    │  │ [기술] 😟 2시간 전          │  │  ← 분석 패널 + 뉴스 카드
│                  │  └────────────────────────────┘  │
├──────────────────┴──────────────────────────────────┤
│              [📚 4컷 만화 만들기] 버튼              │
└─────────────────────────────────────────────────────┘
         ↓ 클릭 시 웹툰 뷰어 모달 팝업
┌─────────────────────────────────────────────────────┐
│  [1] 속보 발생!     │  [2] 직장인의 반응            │
│  📺 😮             │  😱 💻                        │
│  "오늘의 이슈!"     │  "주가가 또..."               │
├─────────────────────┼─────────────────────────────  │
│  [3] 전문가 등장    │  [4] 오늘의 교훈              │
│  👨‍🔬 🎙️             │  🤔                           │
│  "복합적 요인..."   │  "오늘도 파이팅!"             │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 빠른 시작

### 1. 클론

```bash
git clone https://github.com/fuzzyrock000/news-ai-webtoon.git
cd news-ai-webtoon
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local.example`을 복사하여 `.env.local`을 생성하고 네이버 API 키를 입력합니다.

```bash
cp .env.local.example .env.local
```

```env
# .env.local
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

> **네이버 API 키 발급 방법**  
> 1. [네이버 개발자 센터](https://developers.naver.com) 접속  
> 2. **Application 등록** → 검색 API (뉴스) 선택  
> 3. Client ID / Client Secret 발급

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📁 프로젝트 구조

```
news-ai-webtoon/
├── app/
│   ├── api/
│   │   ├── news/route.ts        # 뉴스 검색 API (GET)
│   │   └── webtoon/route.ts     # 웹툰 생성 API (POST)
│   ├── globals.css              # 글로벌 스타일
│   ├── layout.tsx               # 루트 레이아웃
│   └── page.tsx                 # 메인 페이지 (클라이언트)
│
├── components/
│   ├── SearchBar.tsx            # 검색창 + 빠른 버튼
│   ├── NewsCard.tsx             # 뉴스 카드 (카테고리/감정 배지)
│   ├── AnalysisPanel.tsx        # 탭형 AI 분석 패널
│   ├── KeywordCloud.tsx         # 인터랙티브 키워드 클라우드
│   ├── SentimentChart.tsx       # 감정 분석 막대 차트
│   ├── CategoryChart.tsx        # 카테고리 분류 차트
│   ├── TrendInsights.tsx        # 트렌드 인사이트 카드
│   ├── WebtoonViewer.tsx        # 4컷 웹툰 뷰어 (모달)
│   └── LoadingSkeleton.tsx      # 로딩 스켈레톤 UI
│
├── lib/
│   ├── naver-api.ts             # 네이버 뉴스 API 클라이언트
│   ├── text-analyzer.ts         # AI 분석 엔진 (TF-IDF, 감정, 카테고리)
│   ├── webtoon-generator.ts     # 4컷 웹툰 스크립트 생성기
│   └── utils.ts                 # 공통 유틸리티
│
├── types/
│   ├── news.ts                  # 뉴스 관련 TypeScript 타입
│   └── webtoon.ts               # 웹툰 관련 TypeScript 타입
│
├── .env.local.example           # 환경변수 예시
└── .gitignore
```

---

## 🧠 AI 분석 엔진

외부 AI API 없이 **순수 서버사이드 알고리즘**으로 구현되어 있습니다.

### 키워드 추출 — TF-IDF
- 전체 뉴스 텍스트를 토큰화 (한국어 불용어 필터링)
- Term Frequency × Inverse Document Frequency 계산
- 중요도 상위 20개 키워드 추출
- 클릭 시 해당 키워드로 자동 재검색

### 감정 분석 — 한국어 감정 사전
- 긍정 어휘 (성장, 호조, 혁신, 성공 등) / 부정 어휘 (하락, 위기, 손실 등) 사전 내장
- 단어 단위 + 부분 문자열 매칭으로 스코어 계산
- 뉴스별 긍정 / 부정 / 중립 판정 후 전체 비율 집계

### 카테고리 분류 — 키워드 매칭
| 카테고리 | 대표 키워드 |
|---|---|
| 💰 경제 | 주가, 코스피, 금리, 환율, 투자, 비트코인 |
| 🏛️ 정치 | 대통령, 국회, 선거, 여당, 야당, 법원 |
| 💻 기술 | AI, 반도체, 클라우드, 자율주행, 메타버스 |
| ⚽ 스포츠 | 축구, 야구, 올림픽, 월드컵, EPL, NBA |
| 🎭 문화 | K팝, 드라마, 영화, 콘서트, 웹툰 |
| 🌍 국제 | 미국, 중국, 일본, UN, G7, 전쟁 |
| 🏥 건강 | 의료, 백신, 신약, 코로나, 바이오 |
| 🌿 환경 | 기후, 탄소, 재생에너지, 미세먼지, ESG |

### 트렌드 인사이트
- 가장 많이 언급된 핫 키워드 자동 도출
- 전체 감정 분위기 해석 (긍정적 / 부정적 / 혼재)
- 주요 카테고리 분포 분석

---

## 📚 4컷 웹툰 생성

분석된 뉴스의 **상위 카테고리**와 **핫 키워드**를 기반으로 시나리오를 자동 선택합니다.

### 스토리 구조 (기승전결)

| 컷 | 역할 | 내용 |
|---|---|---|
| 1컷 | **기** (발단) | 뉴스 속보 발생, 상황 설정 |
| 2컷 | **승** (전개) | 사람들의 반응, 파장 |
| 3컷 | **전** (절정) | 전문가 등장, 갈등 심화 |
| 4컷 | **결** (결말) | 교훈 / 반전 / 유머 마무리 |

### 카테고리별 시나리오 템플릿 (8종)
경제 · 정치 · 기술 · 사회 · 스포츠 · 문화 · 국제 · 건강

### 뷰어 기능
- **2×2 그리드** 전체 보기
- **한 컷씩** 넘겨보기 (이전 / 다음 버튼)
- **공유** 버튼 (Web Share API)

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| API | 네이버 뉴스 Search API |
| 분석 엔진 | 자체 구현 (TF-IDF, 감정 사전, 키워드 매칭) |
| 배포 | Vercel (권장) |

---

## 📦 스크립트

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

---

## 🌐 배포 (Vercel)

1. [Vercel](https://vercel.com)에서 이 레포지토리를 Import
2. 환경변수 설정:
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`
3. Deploy 클릭

---

## 🔒 보안 주의사항

- `.env.local` 파일은 `.gitignore`에 포함되어 **GitHub에 업로드되지 않습니다**
- 네이버 API 키는 반드시 환경변수로 관리하세요
- API 키를 코드에 하드코딩하지 마세요

---

## 📄 라이선스

MIT License © 2026 fuzzyrock000
