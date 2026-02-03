import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, api_key } = body;

    if (!url || !api_key) {
      return NextResponse.json(
        { error: 'URL and API Key are required' },
        { status: 400 }
      );
    }

    // 处理 URL 格式，移除末尾斜杠
    const baseUrl = url.replace(/\/+$/, '');
    // 兼容 OpenAI 标准接口：GET /models
    const modelsUrl = `${baseUrl}/models`;

    console.log(`[Proxy] Fetching models from: ${modelsUrl}`);

    const response = await fetch(modelsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Proxy] Failed to fetch models: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { error: `Failed to fetch models: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // OpenAI 格式返回的是 { object: "list", data: [...] }
    let modelIds: string[] = [];

    if (data.data && Array.isArray(data.data)) {
      modelIds = data.data.map((m: any) => m.id);
    } else if (Array.isArray(data)) {
        // 某些非标准实现可能直接返回数组
        modelIds = data.map((m: any) => m.id || m.name || m);
    }

    console.log(`[Proxy] Successfully fetched ${modelIds.length} models`);
    return NextResponse.json(modelIds);
    
  } catch (error: any) {
    console.error('[Proxy] Error in proxy route:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
