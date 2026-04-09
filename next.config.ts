import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // FFmpeg.wasm이 SharedArrayBuffer를 사용하기 위해 필요한 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
};

export default nextConfig;
