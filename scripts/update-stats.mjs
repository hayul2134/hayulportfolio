// 매일 00:00(KST) GitHub Actions가 실행: 유튜브·인스타·틱톡 공개 수치를 읽어 stats.json에 저장합니다.
// 어느 한 곳을 못 읽으면 그 플랫폼은 이전 값을 그대로 유지합니다.
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../stats.json', import.meta.url);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const HEAD = { 'user-agent': UA, 'accept-language': 'ko-KR,ko;q=0.9,en;q=0.8', accept: 'text/html,application/json' };

// "232", "81,192", "1.2천", "3.4만", "1.2K", "3M" → 숫자
function num(s) {
  if (s == null) return null;
  const m = String(s).replace(/,/g, '').match(/([\d.]+)\s*(천|만|억|K|M|B)?/i);
  if (!m) return null;
  const mul = { '천': 1e3, '만': 1e4, '억': 1e8, k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1;
  return Math.round(parseFloat(m[1]) * mul);
}
const decode = (s) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, '&').replace(/&quot;/g, '"');

async function get(url, headers = {}) {
  const r = await fetch(url, { headers: { ...HEAD, ...headers }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.text();
}

async function youtube() {
  const h = await get('https://www.youtube.com/channel/UC598o8PwMdyg175uhoe0XvA/about?hl=ko&gl=KR');
  const t = (k) => (h.match(new RegExp(`"${k}":"([^"]+)"`)) || [])[1];
  const subs = num(t('subscriberCountText')), views = num(t('viewCountText')), videos = num(t('videoCountText'));
  if (subs == null || views == null) throw new Error('youtube: 값을 찾지 못함');
  return { subs, views, videos };
}

async function tiktok() {
  const h = await get('https://www.tiktok.com/@hayul_2134?lang=ko-KR');
  const n = (k) => { const m = h.match(new RegExp(`"${k}":(\\d+)`)); return m ? +m[1] : null; };
  const followers = n('followerCount'), likes = n('heartCount') ?? n('heart');
  if (followers == null) throw new Error('tiktok: 값을 찾지 못함');
  return { followers, likes };
}

async function instagram() {
  try { // 1순위: Cloudflare 함수(/api/ig) 경유 — GitHub 서버 IP는 인스타가 자주 차단함
    const j = JSON.parse(await get('https://hayulportfolio.pages.dev/api/ig', { accept: 'application/json' }));
    if (typeof j.followers === 'number') return { followers: j.followers, posts: j.posts };
    throw new Error(j.error || 'no data');
  } catch (e) { console.log('instagram (cloudflare) 실패:', e.message); }
  try { // 2순위: 공개 프로필 API
    const j = JSON.parse(await get('https://www.instagram.com/api/v1/users/web_profile_info/?username=hayul2050',
      { 'x-ig-app-id': '936619743392459', accept: 'application/json' }));
    const u = j.data.user;
    return { followers: u.edge_followed_by.count, posts: u.edge_owner_to_timeline_media.count };
  } catch (e) { console.log('instagram api 실패, 프로필 페이지로 재시도:', e.message); }
  const h = await get('https://www.instagram.com/hayul2050/');
  const m = h.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/);
  if (!m) throw new Error('instagram: og:description 없음');
  const nums = decode(m[1]).match(/[\d][\d,.]*\s*(천|만|K|M)?/gi) || [];
  if (nums.length < 3) throw new Error('instagram: 값 파싱 실패');
  return { followers: num(nums[0]), posts: num(nums[2]) }; // 팔로워, 팔로잉, 게시물 순
}

const prev = JSON.parse(await readFile(FILE, 'utf8').catch(() => '{}'));
const out = { ...prev };
for (const [key, fn] of [['youtube', youtube], ['instagram', instagram], ['tiktok', tiktok]]) {
  try { out[key] = { ...prev[key], ...(await fn()) }; console.log(key, out[key]); }
  catch (e) { console.log(`${key} 실패(이전 값 유지):`, e.message); }
}
const kst = new Date(Date.now() + 9 * 3600e3);
out.updated = kst.toISOString().slice(0, 10); // KST 날짜 (00:00 기준)
await writeFile(FILE, JSON.stringify(out, null, 2) + '\n');
