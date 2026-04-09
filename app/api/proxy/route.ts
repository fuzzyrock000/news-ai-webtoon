import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL이 필요합니다.' }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: '유효하지 않은 URL입니다.' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
        Referer: new URL(url).origin,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `영상을 가져오지 못했습니다. (${response.status})` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') ?? 'video/mp4';
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '네트워크 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
