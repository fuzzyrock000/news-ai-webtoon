'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Film,
  X,
  Upload,
  Link2,
  Download,
  Loader2,
  Settings2,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type InputMode = 'url' | 'file';
type Quality = 'fast' | 'normal' | 'high' | 'custom';
type Status = 'idle' | 'loading-ffmpeg' | 'processing' | 'done' | 'error';

interface QualityPreset {
  label: string;
  fps: number;
  width: number;
  colors: number;
  description: string;
}

const QUALITY_PRESETS: Record<Quality, QualityPreset> = {
  fast: { label: '⚡ 빠른 변환', fps: 5, width: 320, colors: 64, description: '작은 파일, 빠른 속도' },
  normal: { label: '🎯 보통', fps: 10, width: 480, colors: 128, description: '균형잡힌 품질' },
  high: { label: '✨ 고화질', fps: 15, width: 640, colors: 256, description: '높은 품질, 큰 파일' },
  custom: { label: '⚙️ 커스텀', fps: 10, width: 480, colors: 128, description: '직접 설정' },
};

const FFMPEG_CORE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js';
const FFMPEG_WASM_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm';

export default function GifMaker() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>('normal');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 커스텀 옵션
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [colors, setColors] = useState(128);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState('');
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState<string>('');
  const [error, setError] = useState('');

  const ffmpegRef = useRef<import('@ffmpeg/ffmpeg').FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, [gifUrl]);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current?.loaded) return ffmpegRef.current;

    setStatus('loading-ffmpeg');
    setLog('FFmpeg 로딩 중... (첫 실행 시 약 25MB 다운로드)');

    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { toBlobURL } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }) => {
      if (isMounted.current) setLog(message);
    });
    ffmpeg.on('progress', ({ progress: p }) => {
      if (isMounted.current) setProgress(Math.round(p * 100));
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(FFMPEG_CORE_URL, 'text/javascript'),
      wasmURL: await toBlobURL(FFMPEG_WASM_URL, 'application/wasm'),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }, []);

  const getActivePreset = (): QualityPreset => {
    if (quality === 'custom') return { label: '', fps, width, colors, description: '' };
    return QUALITY_PRESETS[quality];
  };

  const handleConvert = useCallback(async () => {
    setError('');
    setGifUrl(null);
    setProgress(0);

    try {
      const ffmpeg = await loadFFmpeg();
      setStatus('processing');
      setLog('변환 시작...');

      const { fetchFile } = await import('@ffmpeg/util');
      const preset = getActivePreset();

      // 입력 소스 준비
      let inputData: Uint8Array;
      if (inputMode === 'file' && videoFile) {
        setLog('파일 읽는 중...');
        inputData = await fetchFile(videoFile);
      } else if (inputMode === 'url' && videoUrl.trim()) {
        setLog('영상 다운로드 중...');
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(videoUrl.trim())}`;
        inputData = await fetchFile(proxyUrl);
      } else {
        throw new Error('영상 파일 또는 URL을 입력해주세요.');
      }

      await ffmpeg.writeFile('input.mp4', inputData);

      // FFmpeg 명령어 구성
      const args: string[] = [];

      // 시작 시간
      if (startTime) args.push('-ss', startTime);
      args.push('-i', 'input.mp4');
      // 종료 시간
      if (endTime) args.push('-to', endTime);

      // 팔레트 최적화 GIF 변환 필터
      const vf = [
        `fps=${preset.fps}`,
        `scale=${preset.width}:-1:flags=lanczos`,
        `split[s0][s1]`,
        `[s0]palettegen=max_colors=${preset.colors}[p]`,
        `[s1][p]paletteuse=dither=bayer`,
      ].join(',');

      args.push('-vf', vf, '-loop', '0', 'output.gif');

      setLog('GIF 변환 중...');
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile('output.gif');
      const raw = data instanceof Uint8Array ? data : new Uint8Array(data as unknown as ArrayBuffer);
      const blob = new Blob([raw.buffer as ArrayBuffer], { type: 'image/gif' });

      // 파일 크기 포맷
      const mb = (blob.size / 1024 / 1024).toFixed(2);
      const kb = (blob.size / 1024).toFixed(0);
      setGifSize(blob.size > 1024 * 1024 ? `${mb} MB` : `${kb} KB`);

      const url = URL.createObjectURL(blob);
      if (isMounted.current) {
        setGifUrl(url);
        setStatus('done');
        setLog('변환 완료!');
      }

      // 임시 파일 정리
      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.gif');
    } catch (err) {
      const message = err instanceof Error ? err.message : '변환 중 오류가 발생했습니다.';
      if (isMounted.current) {
        setError(message);
        setStatus('error');
      }
    }
  }, [inputMode, videoFile, videoUrl, startTime, endTime, loadFFmpeg, quality, fps, width, colors]);

  const handleDownload = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = `newsai-gif-${Date.now()}.gif`;
    a.click();
  };

  const handleReset = () => {
    setStatus('idle');
    setGifUrl(null);
    setError('');
    setProgress(0);
    setLog('');
  };

  const isConverting = status === 'loading-ffmpeg' || status === 'processing';

  return (
    <>
      {/* 헤더 버튼 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200',
          isOpen
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30'
            : 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-800'
        )}
      >
        <Film size={16} />
        GIF 메이커
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* GIF 메이커 드로어 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* 백드롭 */}
          <div
            className="absolute inset-0 bg-black/30 pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />

          {/* 패널 */}
          <div className="absolute top-0 left-0 right-0 pointer-events-auto">
            <div className="bg-white dark:bg-gray-900 shadow-2xl border-b border-gray-200 dark:border-gray-700 animate-fade-in-up">
              {/* 패널 헤더 */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Film size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-extrabold text-base">🎬 GIF 메이커</h2>
                    <p className="text-white/70 text-xs">영상 링크 또는 파일로 GIF 생성</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 패널 본문 */}
              <div className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 왼쪽: 입력 */}
                  <div className="space-y-4">
                    {/* 입력 모드 탭 */}
                    <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      {(['url', 'file'] as InputMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setInputMode(mode)}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all',
                            inputMode === mode
                              ? 'bg-violet-500 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                        >
                          {mode === 'url' ? <Link2 size={14} /> : <Upload size={14} />}
                          {mode === 'url' ? 'URL 입력' : '파일 업로드'}
                        </button>
                      ))}
                    </div>

                    {/* URL 입력 */}
                    {inputMode === 'url' && (
                      <div>
                        <input
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://example.com/video.mp4"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        <p className="text-xs text-gray-400 mt-1.5">
                          직접 접근 가능한 mp4, webm, mov, avi 링크를 입력하세요.
                        </p>
                      </div>
                    )}

                    {/* 파일 업로드 */}
                    {inputMode === 'file' && (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all"
                        >
                          <Upload size={24} className="text-gray-400" />
                          {videoFile ? (
                            <span className="text-sm font-medium text-violet-600">{videoFile.name}</span>
                          ) : (
                            <span className="text-sm text-gray-500">클릭하여 영상 파일 선택</span>
                          )}
                          <span className="text-xs text-gray-400">mp4, webm, mov, avi 지원</span>
                        </button>
                      </div>
                    )}

                    {/* 시간 범위 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                          시작 시간 (선택)
                        </label>
                        <input
                          type="text"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          placeholder="00:00:05 또는 5"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                          종료 시간 (선택)
                        </label>
                        <input
                          type="text"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          placeholder="00:00:10 또는 10"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* 품질 선택 */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
                        품질 설정
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(QUALITY_PRESETS) as [Quality, QualityPreset][]).map(
                          ([key, preset]) => (
                            <button
                              key={key}
                              onClick={() => {
                                setQuality(key);
                                if (key !== 'custom') {
                                  setFps(preset.fps);
                                  setWidth(preset.width);
                                  setColors(preset.colors);
                                }
                              }}
                              className={cn(
                                'p-2.5 rounded-xl border text-left transition-all',
                                quality === key
                                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                              )}
                            >
                              <div className="text-xs font-bold text-gray-800 dark:text-white">
                                {preset.label}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">{preset.description}</div>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* 커스텀 고급 설정 */}
                    {quality === 'custom' && (
                      <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          <Settings2 size={12} />
                          커스텀 설정
                        </div>
                        {[
                          { label: `FPS: ${fps}`, value: fps, min: 1, max: 30, setter: setFps },
                          { label: `너비: ${width}px`, value: width, min: 160, max: 1280, step: 80, setter: setWidth },
                          { label: `색상 수: ${colors}`, value: colors, min: 16, max: 256, step: 16, setter: setColors },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{item.label}</span>
                            </div>
                            <input
                              type="range"
                              min={item.min}
                              max={item.max}
                              step={'step' in item ? item.step : 1}
                              value={item.value}
                              onChange={(e) => item.setter(Number(e.target.value))}
                              className="w-full accent-violet-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 변환 버튼 */}
                    <button
                      onClick={handleConvert}
                      disabled={isConverting || (!videoUrl.trim() && !videoFile)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isConverting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {status === 'loading-ffmpeg' ? 'FFmpeg 로딩 중...' : `변환 중... ${progress}%`}
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          GIF 변환 시작
                        </>
                      )}
                    </button>
                  </div>

                  {/* 오른쪽: 결과 */}
                  <div className="flex flex-col">
                    <div className="flex-1 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800/30 flex flex-col items-center justify-center min-h-[280px]">
                      {status === 'idle' && (
                        <div className="text-center p-6 space-y-2">
                          <ImageIcon size={40} className="text-gray-300 mx-auto" />
                          <p className="text-gray-400 text-sm font-medium">GIF가 여기에 표시됩니다</p>
                          <p className="text-gray-300 text-xs">영상 URL 또는 파일을 입력하고 변환하세요</p>
                        </div>
                      )}

                      {isConverting && (
                        <div className="w-full p-6 space-y-4">
                          <div className="flex items-center justify-center">
                            <Loader2 size={32} className="animate-spin text-violet-500" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                              <span>변환 진행률</span>
                              <span className="font-bold text-violet-600">{progress}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(progress, status === 'loading-ffmpeg' ? 10 : 0)}%` }}
                              />
                            </div>
                          </div>
                          {log && (
                            <div className="bg-gray-900 rounded-lg px-3 py-2">
                              <p className="text-xs text-green-400 font-mono truncate">{log}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {status === 'done' && gifUrl && (
                        <div className="w-full p-4 space-y-3">
                          {/* GIF 미리보기 */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={gifUrl}
                            alt="생성된 GIF"
                            className="w-full rounded-xl object-contain max-h-52"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              파일 크기: <span className="font-bold text-gray-600 dark:text-gray-300">{gifSize}</span>
                            </span>
                            <span className="text-xs text-emerald-500 font-bold">✅ 변환 완료!</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleDownload}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-bold transition-colors"
                            >
                              <Download size={15} />
                              GIF 다운로드
                            </button>
                            <button
                              onClick={handleReset}
                              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              다시 만들기
                            </button>
                          </div>
                        </div>
                      )}

                      {status === 'error' && (
                        <div className="p-6 text-center space-y-3">
                          <div className="text-3xl">❌</div>
                          <p className="text-red-500 text-sm font-medium">{error}</p>
                          <button
                            onClick={handleReset}
                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 transition-colors"
                          >
                            다시 시도
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 사용 팁 */}
                    <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">💡 사용 팁</p>
                      <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-0.5">
                        <li>• 첫 실행 시 FFmpeg (~25MB) 자동 다운로드</li>
                        <li>• 시간 범위 지정으로 원하는 구간만 변환</li>
                        <li>• 파일 직접 업로드가 URL보다 빠릅니다</li>
                        <li>• 모든 처리는 브라우저에서 실행됩니다</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
