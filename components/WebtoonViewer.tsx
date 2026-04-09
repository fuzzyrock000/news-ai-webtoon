'use client';

import { useState } from 'react';
import { X, Share2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { WebtoonScript, WebtoonPanel, SpeechBubble } from '@/types/webtoon';
import { cn } from '@/lib/utils';

// ── 배경 테마 ──────────────────────────────────────────────────────────────────
const BG_THEMES: Record<WebtoonPanel['bgTheme'], string> = {
  morning: 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
  office: 'bg-gradient-to-br from-blue-100 via-slate-50 to-indigo-100',
  chaos: 'bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100',
  resolution: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100',
  dark: 'bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900',
  bright: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-lime-100',
  sunset: 'bg-gradient-to-br from-pink-100 via-orange-100 to-amber-100',
};

const BG_SCENE_EMOJIS: Record<WebtoonPanel['bgTheme'], string> = {
  morning: '🌅',
  office: '🏢',
  chaos: '⚡',
  resolution: '🌈',
  dark: '🌃',
  bright: '☀️',
  sunset: '🌇',
};

// ── 말풍선 컴포넌트 ───────────────────────────────────────────────────────────
function BubbleComponent({
  bubble,
  index,
}: {
  bubble: SpeechBubble;
  index: number;
}) {
  const isLeft = bubble.speaker === 'left';
  const isNarrator = bubble.speaker === 'narrator';

  if (isNarrator) {
    return (
      <div className="w-full">
        <div className="mx-auto max-w-[90%] bg-black/80 text-white text-center px-3 py-2 rounded-lg text-xs font-medium leading-snug tracking-wide">
          {bubble.text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < bubble.text.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const styleClasses = {
    normal: 'bg-white border-2 border-gray-800 text-gray-900',
    shout: 'bg-yellow-50 border-[3px] border-gray-900 text-gray-900 font-bold',
    thought: 'bg-blue-50 border-2 border-dashed border-blue-400 text-blue-900 italic',
    whisper: 'bg-gray-50 border border-gray-400 text-gray-500 text-[10px]',
  };
  const bubbleStyle = styleClasses[bubble.style ?? 'normal'];

  return (
    <div
      key={index}
      className={cn(
        'flex',
        isLeft ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={cn(
          'relative max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-snug shadow-sm',
          bubbleStyle,
          isLeft ? 'rounded-tl-sm' : 'rounded-tr-sm',
          bubble.style === 'shout' && 'shadow-md'
        )}
      >
        {bubble.text.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < bubble.text.split('\n').length - 1 && <br />}
          </span>
        ))}
        {/* 말풍선 꼬리 */}
        <div
          className={cn(
            'absolute bottom-0 w-3 h-3',
            isLeft
              ? '-left-2 border-r-8 border-r-gray-800 border-t-8 border-t-transparent'
              : '-right-2 border-l-8 border-l-gray-800 border-t-8 border-t-transparent'
          )}
        />
      </div>
    </div>
  );
}

// ── 단일 패널 컴포넌트 ─────────────────────────────────────────────────────────
function PanelComponent({
  panel,
  isActive,
  onClick,
}: {
  panel: WebtoonPanel;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const bgClass = BG_THEMES[panel.bgTheme];
  const sceneEmoji = BG_SCENE_EMOJIS[panel.bgTheme];

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative border-[3px] border-gray-900 rounded-lg overflow-hidden cursor-pointer transition-all duration-300',
        isActive ? 'border-blue-500 shadow-lg shadow-blue-200 scale-[1.01]' : 'hover:border-gray-600 hover:shadow-md',
        bgClass
      )}
      style={{ minHeight: '280px' }}
    >
      {/* 패널 번호 */}
      <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center shadow-sm">
        {panel.panelNumber}
      </div>

      {/* 효과음 */}
      {panel.sfx && (
        <div className="absolute top-2 right-2 z-10">
          <span
            className="text-xs font-black text-red-600 drop-shadow-md"
            style={{
              textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
              fontFamily: 'Impact, sans-serif',
              transform: 'rotate(-8deg)',
              display: 'inline-block',
            }}
          >
            {panel.sfx}
          </span>
        </div>
      )}

      {/* 배경 장면 이모지 (장식) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        <span style={{ fontSize: '80px' }}>{sceneEmoji}</span>
      </div>

      {/* 패널 제목 (상단 캡션) */}
      {panel.caption && (
        <div className="relative z-10 text-center text-xs font-bold text-gray-600 pt-2 pb-1 border-b border-gray-300/50 bg-white/50">
          {panel.caption}
        </div>
      )}

      {/* 패널 내용 */}
      <div className="relative z-10 flex flex-col justify-between p-3 h-full" style={{ minHeight: '240px' }}>
        {/* 상단 나레이터 또는 위쪽 말풍선 */}
        <div className="space-y-1.5">
          {panel.bubbles
            .filter((b) => b.speaker === 'narrator' || b.speaker === 'right')
            .slice(0, 1)
            .map((bubble, i) => (
              <BubbleComponent key={i} bubble={bubble} index={i} />
            ))}
        </div>

        {/* 캐릭터 영역 */}
        <div className="flex items-end justify-around py-4 my-2">
          {panel.characters.map((char, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span
                style={{ fontSize: '38px', lineHeight: 1 }}
                title={char.name}
                className="drop-shadow-sm"
              >
                {char.emoji}
              </span>
              <span className="text-[9px] font-semibold text-gray-500 bg-white/70 px-1 rounded">
                {char.name}
              </span>
            </div>
          ))}
        </div>

        {/* 하단 말풍선 */}
        <div className="space-y-1.5">
          {panel.bubbles
            .filter((b) => b.speaker !== 'narrator' && b.speaker !== 'right')
            .slice(0, 1)
            .map((bubble, i) => (
              <BubbleComponent key={i} bubble={bubble} index={i} />
            ))}
          {/* 두 번째 말풍선 */}
          {panel.bubbles.filter((b) => b.speaker === 'right').length > 0 &&
            panel.bubbles
              .filter((b) => b.speaker === 'right')
              .slice(1)
              .map((bubble, i) => (
                <BubbleComponent key={`r${i}`} bubble={bubble} index={i} />
              ))}
        </div>
      </div>

      {/* 패널 하단 제목 */}
      <div className="relative z-10 border-t border-gray-300/50 bg-white/60 text-center text-xs font-bold text-gray-700 py-1">
        {panel.title}
      </div>
    </div>
  );
}

// ── 전체 뷰어 ─────────────────────────────────────────────────────────────────
interface WebtoonViewerProps {
  script: WebtoonScript;
  onClose?: () => void;
}

export default function WebtoonViewer({ script, onClose }: WebtoonViewerProps) {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

  const handlePrev = () => {
    if (activePanel === null) return;
    if (activePanel > 0) setActivePanel(activePanel - 1);
  };

  const handleNext = () => {
    if (activePanel === null) return;
    if (activePanel < script.panels.length - 1) setActivePanel(activePanel + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-base leading-tight">{script.title}</h2>
              <p className="text-white/60 text-xs">{script.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 뷰 모드 토글 */}
            <button
              onClick={() => {
                setViewMode((v) => (v === 'grid' ? 'single' : 'grid'));
                setActivePanel(viewMode === 'grid' ? 0 : null);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              {viewMode === 'grid' ? '한 컷씩 보기' : '전체 보기'}
            </button>
            <button
              onClick={async () => {
                if (typeof window === 'undefined') return;
                const text = `[NewsAI 웹툰] ${script.title}\n${script.subtitle}\n\n오늘의 핫이슈를 4컷 만화로!`;
                if (navigator.share) {
                  await navigator.share({ text }).catch(() => {});
                } else {
                  await navigator.clipboard.writeText(text);
                }
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Share2 size={16} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/50 text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 만화 제목 배너 */}
        <div
          className="relative overflow-hidden px-6 py-5 text-center"
          style={{
            background: 'repeating-linear-gradient(45deg, #f8f8f8, #f8f8f8 10px, #fff 10px, #fff 20px)',
            borderBottom: '3px solid #111',
          }}
        >
          <div className="relative z-10">
            <span className="text-3xl font-black tracking-tight text-gray-900 drop-shadow-sm"
              style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              📰 {script.keyword} 4컷 만화
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-red-500 text-white text-xs font-bold">HOT</span>
              <span className="text-xs text-gray-500">{script.category} · NewsAI 웹툰</span>
            </div>
          </div>
        </div>

        {/* 4컷 패널 영역 */}
        <div className="p-5 bg-gray-50 dark:bg-gray-950">
          {viewMode === 'grid' ? (
            /* 2×2 그리드 */
            <div className="grid grid-cols-2 gap-3">
              {script.panels.map((panel, i) => (
                <PanelComponent
                  key={i}
                  panel={panel}
                  isActive={activePanel === i}
                  onClick={() => {
                    setActivePanel(i);
                    setViewMode('single');
                  }}
                />
              ))}
            </div>
          ) : (
            /* 단일 패널 뷰 */
            <div className="space-y-4">
              {activePanel !== null && (
                <>
                  <PanelComponent panel={script.panels[activePanel]} isActive />
                  {/* 네비게이션 */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrev}
                      disabled={activePanel === 0}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} /> 이전
                    </button>
                    <div className="flex gap-1.5">
                      {script.panels.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePanel(i)}
                          className={cn(
                            'w-7 h-7 rounded-full text-xs font-bold transition-all',
                            activePanel === i
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600'
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={activePanel === script.panels.length - 1}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      다음 <ChevronRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between bg-white dark:bg-gray-900">
          <p className="text-xs text-gray-400">
            AI가 뉴스를 분석하여 자동 생성한 웹툰입니다 🤖
          </p>
          <div className="flex items-center gap-1.5">
            {script.panels.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  activePanel === i ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
