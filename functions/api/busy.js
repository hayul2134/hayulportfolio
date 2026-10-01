// 하율 구글 캘린더(공개 ICS)를 읽어 '일정 있는 날짜'만 돌려줍니다. 일정 제목·내용은 내보내지 않습니다.
const ICS = 'https://calendar.google.com/calendar/ical/officialhayul%40gmail.com/public/basic.ics';
const KST = 9 * 3600e3;

export async function onRequestGet(ctx) {
  const cache = caches.default, key = new Request(new URL('/api/busy', ctx.request.url));
  const hit = await cache.match(key);
  if (hit) return hit;
  try {
    const r = await fetch(ICS, { cf: { cacheTtl: 300, cacheEverything: true } });
    if (!r.ok) throw new Error('ics ' + r.status);
    const busy = parse(await r.text());
    const res = json({ busy, updated: new Date().toISOString() }, 200, 300);
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  } catch (e) {
    return json({ busy: [], error: String(e.message || e) }, 502, 30);
  }
}

function json(obj, status, maxAge) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${maxAge}` },
  });
}

const dayKey = (t) => new Date(t).toISOString().slice(0, 10); // t = KST 기준 ms(UTC로 취급)

function toMs(prop) {
  if (!prop) return null;
  const v = prop.value;
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);
  if (!m) return null;
  const base = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  return { ms: m[7] ? base + KST : base, allDay: !m[4] }; // Z(UTC)면 KST로 변환, 그 외는 현지(KST) 시각으로 간주
}

function parse(text) {
  const lines = text.replace(/\r\n[ \t]/g, '').split(/\r?\n/);
  const events = []; let ev = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { ev = { ex: [] }; continue; }
    if (line === 'END:VEVENT') { if (ev) events.push(ev); ev = null; continue; }
    if (!ev) continue;
    const i = line.indexOf(':'); if (i < 0) continue;
    const name = line.slice(0, i).split(';')[0].toUpperCase(), value = line.slice(i + 1);
    if (name === 'EXDATE') value.split(',').forEach((x) => { const t = toMs({ value: x }); if (t) ev.ex.push(dayKey(t.ms)); });
    else ev[name] = { value };
  }

  const now = Date.now() + KST;
  const winStart = Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), 1);
  const winEnd = winStart + 200 * 864e5;
  const out = new Set();

  for (const e of events) {
    if ((e.STATUS && e.STATUS.value === 'CANCELLED') || (e.TRANSP && e.TRANSP.value === 'TRANSPARENT')) continue;
    const s = toMs(e.DTSTART); if (!s) continue;
    const en = toMs(e.DTEND);
    let dur = en ? en.ms - s.ms : (s.allDay ? 864e5 : 0);
    if (dur < 0) dur = 0;
    const mark = (start) => {
      if (start + dur < winStart || start > winEnd) return;
      // 종일 일정은 종료일 제외, 시간 일정은 자정에 끝나면 그날 제외
      const last = s.allDay || dur === 0 ? start + Math.max(dur, 1) - 1 : start + dur - 1;
      for (let t = Date.UTC(...ymd(start)); t <= last; t += 864e5) {
        const k = dayKey(t); if (!e.ex.includes(k)) out.add(k);
      }
    };
    if (e.RRULE) expand(e.RRULE.value, s.ms, winEnd, mark); else mark(s.ms);
  }
  return [...out].sort();
}

function ymd(t) { const d = new Date(t); return [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()]; }

function expand(rule, start, winEnd, mark) {
  const r = Object.fromEntries(rule.split(';').map((p) => p.split('=')));
  const freq = r.FREQ, step = +(r.INTERVAL || 1), max = r.COUNT ? +r.COUNT : Infinity;
  const until = r.UNTIL ? toMs({ value: r.UNTIL }).ms : Infinity;
  const days = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
  const byday = r.BYDAY ? r.BYDAY.split(',').map((x) => days[x.slice(-2)]).filter((x) => x !== undefined) : null;
  let n = 0;
  const emit = (t) => { if (t < start || t > until || n >= max) return false; n++; mark(t); return true; };
  if (freq === 'WEEKLY' && byday) {
    const tod = start - Date.UTC(...ymd(start));
    let wk = Date.UTC(...ymd(start)) - new Date(start).getUTCDay() * 864e5;
    for (let w = 0; w < 600 && wk <= winEnd && n < max; w++, wk += 7 * step * 864e5) {
      for (const dow of [...byday].sort()) { const t = wk + dow * 864e5 + tod; if (t > until || t > winEnd) break; emit(t); }
    }
    return;
  }
  for (let i = 0, t = start; i < 2000 && t <= winEnd && t <= until && n < max; i++) {
    emit(t);
    const d = new Date(start);
    if (freq === 'DAILY') t = start + (i + 1) * step * 864e5;
    else if (freq === 'WEEKLY') t = start + (i + 1) * step * 7 * 864e5;
    else if (freq === 'MONTHLY') t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + (i + 1) * step, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
    else if (freq === 'YEARLY') t = Date.UTC(d.getUTCFullYear() + (i + 1) * step, d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
    else break;
  }
}
