# 📰 NewsAI — 실시간 뉴스 AI 분석 + 4컷 웹툰 자동 생성

> 네이버 뉴스 Search API로 최신 뉴스를 검색하고,  
> **OpenAI GPT-4o-mini**가 뉴스를 요약·분석하여 트렌드 인사이트를 제공하며  
> 가장 핫한 이슈를 **4컷 만화 웹툰**으로 자동 생성하는 서비스입니다.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ 주요 기능

| 기능 | 설명 |
|---|---|
| 🔍 **키워드 검색** | 원하는 키워드로 최신 뉴스 최대 30건 검색 |
| 📅 **기간 필터** | 오늘 / 이번 주 / 전체 기간 선택 |
| 🤖 **AI 뉴스 요약** | OpenAI GPT-4o-mini가 뉴스 흐름을 2~3문장으로 요약 + 핵심 포인트 5개 추출 |
| 🏷️ **키워드 추출** | TF-IDF 알고리즘 기반 중요도 순위 키워드 클라우드 (클릭 시 재검색) |
| 😊 **감정 분석** | 한국어 감정 사전 기반 긍정 / 부정 / 중립 비율 분석 |
| 📂 **카테고리 분류** | 경제 · 정치 · 사회 · 기술 · 스포츠 · 문화 · 국제 · 건강 · 환경 자동 분류 |
| 📈 **트렌드 인사이트** | 핫 키워드, 감정 흐름, 주요 분야 자동 도출 |
| 📚 **4컷 웹툰 생성** | OpenAI가 뉴스 이슈를 기승전결 4컷 만화 대본으로 창작 |

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
│  └──────────┘    │  │ [기술] 😟 2시간 전          │  │
│                  │  └────────────────────────────┘  │
├──────────────────┴──────────────────────────────────┤
│  [📚 4컷 만화 만들기]  ← OpenAI가 실시간 창작!     │
└─────────────────────────────────────────────────────┘
         ↓ 클릭 시 웹툰 뷰어 모달 팝업
┌─────────────────────────────────────────────────────┐
│  [1] 속보 발생!     │  [2] 직장인의 반응            │
│  📺 😮             │  😱 💻                        │
│  "오늘의 이슈!"     │  "주가가 또..."               │
├─────────────────────┼───────────────────────────────┤
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

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 API 키를 입력합니다.

```env
# 네이버 검색 API
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# OpenAI API (뉴스 요약 + 웹툰 생성)
OPENAI_API_KEY=your_openai_api_key
```

> **네이버 API 키 발급**
> 1. [네이버 개발자 센터](https://developers.naver.com) 접속
> 2. Application 등록 → 검색 API (뉴스) 선택
> 3. Client ID / Client Secret 복사

> **OpenAI API 키 발급**
> 1. [OpenAI Platform](https://platform.openai.com) 접속
> 2. API Keys 메뉴에서 새 키 생성
> 3. `sk-proj-...` 형태의 키 복사

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

---

## 📁 프로젝트 구조

```
news-ai-webtoon/
├── app/
│   ├── api/
│   │   ├── news/route.ts        # 뉴스 검색 + OpenAI 요약 API (GET)
│   │   └── webtoon/route.ts     # OpenAI 웹툰 생성 API (POST)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # 메인 페이지
│
├── components/
│   ├── SearchBar.tsx            # 검색창 + 빠른 버튼
│   ├── NewsCard.tsx             # 뉴스 카드 (카테고리/감정 배지)
│   ├── AnalysisPanel.tsx        # 탭형 AI 분석 패널 (5탭)
│   ├── KeywordCloud.tsx         # 인터랙티브 키워드 클라우드
│   ├── SentimentChart.tsx       # 감정 분석 막대 차트
│   ├── CategoryChart.tsx        # 카테고리 분류 차트
│   ├── TrendInsights.tsx        # 트렌드 인사이트 카드
│   ├── WebtoonViewer.tsx        # 4컷 웹툰 뷰어 (모달)
│   └── LoadingSkeleton.tsx      # 로딩 스켈레톤 UI
│
├── lib/
│   ├── openai-client.ts         # ✨ OpenAI 요약 + 웹툰 스크립트 생성
│   ├── naver-api.ts             # 네이버 뉴스 API 클라이언트
│   ├── text-analyzer.ts         # TF-IDF, 감정, 카테고리 분석 엔진
│   ├── webtoon-generator.ts     # 4컷 웹툰 템플릿 폴백 생성기
│   └── utils.ts                 # 공통 유틸리티
│
├── types/
│   ├── news.ts                  # 뉴스 TypeScript 타입
│   └── webtoon.ts               # 웹툰 TypeScript 타입
│
├── .env.local.example
└── .gitignore
```

---

## 🧠 AI 파이프라인

```
사용자 검색
    ↓
네이버 뉴스 API → 최대 30건 수집
    ↓
자체 분석 엔진 (서버사이드)
  ├─ TF-IDF 키워드 추출
  ├─ 한국어 감정 사전 분석
  ├─ 카테고리 키워드 매칭
  └─ 트렌드 인사이트 계산
    ↓
OpenAI GPT-4o-mini
  ├─ 뉴스 흐름 요약 (2~3문장 + 핵심 포인트 5개)
  └─ (웹툰 버튼 클릭 시) 4컷 만화 대본 창작
    ↓
결과 렌더링
```

### OpenAI 활용 상세

| 기능 | 입력 | 출력 |
|---|---|---|
| **뉴스 요약** | 상위 15개 기사 제목+내용, 검색어, 기간 | 2~3문장 요약 + 핵심 포인트 5개 |
| **웹툰 생성** | 상위 키워드, 카테고리, 감정, 헤드라인 5개 | 4컷 대본 (제목·캐릭터·대사·효과음) |

> OpenAI 호출 실패 시 자체 알고리즘으로 자동 폴백 → 서비스 중단 없음

### 자체 분석 엔진

| 기능 | 방식 |
|---|---|
| **키워드 추출** | TF-IDF (불용어 필터 + 중요도 상위 20개) |
| **감정 분석** | 긍정/부정 어휘 사전 + 가중치 스코어링 |
| **카테고리 분류** | 8개 분야 × 30+ 키워드 매칭 |
| **트렌드 인사이트** | 빈도·비율 통계 기반 자동 문장 생성 |

---

## 📚 4컷 웹툰 — OpenAI 창작 방식

뉴스 분석 결과를 GPT-4o-mini에 전달하면 **기승전결 구조**로 실시간 대본을 창작합니다.

| 컷 | 역할 | 배경 | 내용 |
|---|---|---|---|
| 1컷 | **기** (발단) | 🌅 아침 뉴스룸 | 속보 발생, 상황 설정 |
| 2컷 | **승** (전개) | 🏢 사무실/현장 | 사람들의 반응과 파장 |
| 3컷 | **전** (절정) | ⚡ 혼란 현장 | 전문가 등장, 갈등 심화 |
| 4컷 | **결** (결말) | 🌈 해소 | 반전 · 교훈 · 유머 마무리 |

**뷰어 기능:**
- 2×2 그리드 전체 보기
- 한 컷씩 넘겨보기 (◀ / ▶)
- Web Share API 공유

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| AI 모델 | OpenAI GPT-4o-mini |
| 뉴스 API | 네이버 뉴스 Search API |
| 분석 엔진 | 자체 구현 (TF-IDF, 감정 사전, 키워드 매칭) |
| 배포 | Vercel (권장) |

---

## 📦 스크립트

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

---

## 🌐 Vercel 배포

1. [Vercel](https://vercel.com)에서 이 레포지토리 Import
2. 환경변수 3개 설정:
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`
   - `OPENAI_API_KEY`
3. Deploy 클릭

---

## 🔒 보안

- `.env.local`은 `.gitignore`에 포함 → **GitHub에 API 키가 업로드되지 않습니다**
- 모든 API 호출은 서버사이드(Next.js API Route)에서만 실행
- 클라이언트 브라우저에 API 키 노출 없음

---

## 📄 라이선스

MIT License © 2026 fuzzyrock000
