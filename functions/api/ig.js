// 인스타그램 공개 수치(팔로워·게시물)를 Cloudflare 쪽에서 읽어 옵니다. GitHub Actions에서 막힐 때 대신 사용.
const USER = 'hayul2050';
const UA_WEB = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const UA_APP = 'Instagram 269.0.0.18.75 Android (30/11; 420dpi; 1080x2220; samsung; SM-G973F; beyond1; exynos9820; ko_KR; 443569434)';

export async function onRequestGet() {
  const tries = [
    ['https://www.instagram.com/api/v1/users/web_profile_info/?username=' + USER, { 'user-agent': UA_WEB, 'x-ig-app-id': '936619743392459' }],
    ['https://i.instagram.com/api/v1/users/web_profile_info/?username=' + USER, { 'user-agent': UA_APP, 'x-ig-app-id': '567067343352427' }],
  ];
  const log = [];
  for (const [url, headers] of tries) {
    try {
      const r = await fetch(url, { headers: { ...headers, accept: 'application/json' } });
      if (!r.ok) { log.push(r.status); continue; }
      const u = (await r.json()).data.user;
      return out({ followers: u.edge_followed_by.count, posts: u.edge_owner_to_timeline_media.count });
    } catch (e) { log.push(String(e.message || e)); }
  }
  try {
    const r = await fetch('https://www.instagram.com/' + USER + '/', { headers: { 'user-agent': UA_WEB, 'accept-language': 'en-US' } });
    const h = await r.text();
    const m = h.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/);
    if (m) {
      const n = m[1].replace(/&#x([0-9a-f]+);/gi, (_, x) => String.fromCodePoint(parseInt(x, 16))).match(/[\d][\d,.]*\s*[KM만천]?/gi) || [];
      const v = (s) => { const k = /K|천/i.test(s) ? 1e3 : /M/i.test(s) ? 1e6 : /만/.test(s) ? 1e4 : 1; return Math.round(parseFloat(s.replace(/,/g, '')) * k); };
      if (n.length >= 3) return out({ followers: v(n[0]), posts: v(n[2]) });
    }
    log.push('page ' + r.status);
  } catch (e) { log.push(String(e.message || e)); }
  return out({ error: log.join(', ') }, 502);
}

function out(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
