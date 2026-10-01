// 저장소 내부 파일(수집 스크립트·워크플로)이 웹에 노출되지 않도록 차단하고, API 응답에도 보안 헤더를 붙입니다.
export async function onRequest({ request, next }) {
  const path = new URL(request.url).pathname;
  if (path.startsWith('/scripts/') || path.startsWith('/.github/')) {
    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  const res = await next();
  const h = new Headers(res.headers);
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('X-Frame-Options', 'DENY');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.delete('access-control-allow-origin'); // 다른 사이트가 API를 가져다 쓰지 못하게
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}
