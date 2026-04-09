import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NewsAI - 실시간 뉴스 분석 서비스',
  description: '네이버 뉴스 검색 API 기반 AI 뉴스 요약 및 분석 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-gray-950">{children}</body>
    </html>
  );
}
