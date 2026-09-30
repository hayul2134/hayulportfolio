[1차.html](https://github.com/user-attachments/files/32839209/1.html)
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>하율 | 편집자, SNS 마케터</title>
<meta name="description" content="편집도 기획입니다. 하율의 포트폴리오.">
<script>
  (function () {
    var d = document.documentElement, t = 'system';
    try { t = localStorage.getItem('theme') || 'system'; } catch (e) {}
    d.setAttribute('data-theme', t);
    d.classList.add('js');
  })();
</script>
<style>
  :root { --bg:#f6f5f2; --fg:#1c1c1a; --sub:#6b6a66; --line:#d9d7d1; --active:#1c1c1a; --active-fg:#f6f5f2;
          --accent:#2f5bff; --clip:rgba(28,28,26,.09); --clip2:rgba(28,28,26,.17); }
  :root[data-theme="dark"] { --bg:#141416; --fg:#eeeeea; --sub:#9a998f; --line:#302f33; --active:#eeeeea; --active-fg:#141416;
          --accent:#7f9cff; --clip:rgba(238,238,234,.10); --clip2:rgba(238,238,234,.20); }
  @media (prefers-color-scheme: dark) {
    :root[data-theme="system"] { --bg:#141416; --fg:#eeeeea; --sub:#9a998f; --line:#302f33; --active:#eeeeea; --active-fg:#141416;
          --accent:#7f9cff; --clip:rgba(238,238,234,.10); --clip2:rgba(238,238,234,.20); }
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); line-height:1.7;
         font-family:"Pretendard","Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif; transition:background .2s, color .2s; }
  .wrap { max-width:960px; margin:0 auto; padding:0 24px; }
  header { display:flex; justify-content:space-between; align-items:center; padding:20px 0; }
  .name { font-weight:700; letter-spacing:-0.01em; }
  .theme { display:flex; border:1px solid var(--line); border-radius:999px; overflow:hidden; }
  .theme button { font:inherit; font-size:.8rem; padding:6px 12px; border:0; background:transparent; color:var(--sub); cursor:pointer; }
  .theme button[aria-pressed="true"] { background:var(--active); color:var(--active-fg); }
  .theme button:focus-visible { outline:2px solid var(--accent); outline-offset:-2px; }

  .hero { padding:12vh 0 8vh; }
  .hero h1 { font-size:clamp(2.6rem,10vw,6.5rem); line-height:1.08; letter-spacing:-0.045em; font-weight:800; margin:0 0 32px; word-break:keep-all; }
  .hero p { font-size:clamp(1.05rem,2.4vw,1.35rem); color:var(--sub); margin:0; max-width:34em; word-break:keep-all; }

  /* 편집 타임라인: 화면의 핵심 시각 요소 */
  .timeline { position:relative; margin:0 0 72px; padding:10px 0 14px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); overflow:hidden; }
  .ruler { height:14px; margin-bottom:8px; background:repeating-linear-gradient(to right, var(--line) 0 1px, transparent 1px 4%); opacity:.9; }
  .track { display:flex; gap:4px; margin-bottom:6px; height:26px; }
  .track i { display:block; border-radius:4px; background:var(--clip); }
  .track i.s { background:var(--clip2); }
  .track i.a { background:var(--accent); }
  .playhead { position:absolute; top:0; bottom:0; width:2px; background:var(--accent); left:0; animation:play 16s linear infinite; }
  .playhead::before { content:""; position:absolute; top:0; left:-5px; border:6px solid transparent; border-top-color:var(--accent); border-bottom:0; }
  @keyframes play { from { left:0; } to { left:100%; } }

  section { border-top:1px solid var(--line); padding:56px 0; }
  section h2 { font-size:1rem; font-weight:600; color:var(--sub); margin:0 0 32px; }
  .items { display:grid; gap:36px; }
  .item h3 { font-size:1.35rem; letter-spacing:-0.02em; margin:0 0 6px; }
  .item p { margin:0; color:var(--sub); word-break:keep-all; }
  .item .q { display:block; font-size:.9rem; font-weight:600; color:var(--accent); margin-bottom:6px; }
  @media (min-width:720px) { .items { grid-template-columns:repeat(3,1fr); gap:32px; } }
  footer { border-top:1px solid var(--line); padding:32px 0 48px; color:var(--sub); font-size:.9rem; }

  /* 아래에서 위로 페이드인 */
  .js .reveal { opacity:0; transform:translateY(28px); transition:opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1); transition-delay:var(--d,0s); }
  .js .reveal.in { opacity:1; transform:none; }
  @media (prefers-reduced-motion: reduce) {
    .js .reveal { opacity:1; transform:none; transition:none; }
    .playhead { animation:none; left:38%; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <span class="name">하율</span>
    <div class="theme" role="group" aria-label="테마 선택">
      <button data-set="system">기기 설정</button>
      <button data-set="light">화이트</button>
      <button data-set="dark">다크</button>
    </div>
  </header>

  <div class="hero">
    <h1 class="reveal" style="--d:.1s">편집도 기획입니다.</h1>
    <p class="reveal" style="--d:.35s">좋은 편집은 잘 자르는 것에서 끝나지 않습니다.<br>무엇을 보여줄지, 언제 보여줄지, 어떻게 기억하게 할지까지 생각합니다.</p>
  </div>

  <div class="timeline reveal" style="--d:.6s" aria-hidden="true">
    <div class="ruler"></div>
    <div class="track"><i style="flex:3"></i><i class="a" style="flex:5"></i><i style="flex:2"></i><i class="s" style="flex:4"></i><i style="flex:3"></i></div>
    <div class="track"><i class="s" style="flex:2"></i><i style="flex:4"></i><i style="flex:4"></i><i class="a" style="flex:2"></i><i style="flex:3"></i><i class="s" style="flex:1"></i></div>
    <div class="track"><i style="flex:5"></i><i class="s" style="flex:2"></i><i style="flex:3"></i><i style="flex:4"></i></div>
    <div class="playhead"></div>
  </div>

  <section>
    <h2 class="reveal">편집을 기획으로 생각합니다</h2>
    <div class="items">
      <div class="item reveal" style="--d:0s">
        <span class="q">무엇을 보여줄지</span>
        <h3>구성과 기획</h3>
        <p>영상의 목적에 맞게 담을 것과 덜어낼 것을 정합니다.</p>
      </div>
      <div class="item reveal" style="--d:.15s">
        <span class="q">언제 보여줄지</span>
        <h3>흐름과 호흡</h3>
        <p>시청자가 머무는 순간과 넘기는 순간을 고려해 흐름을 설계합니다.</p>
      </div>
      <div class="item reveal" style="--d:.3s">
        <span class="q">어떻게 기억하게 할지</span>
        <h3>콘텐츠와 SNS 마케팅</h3>
        <p>한 편으로 끝나지 않고 채널에서 기억되는 콘텐츠를 만듭니다.</p>
      </div>
    </div>
  </section>

  <footer class="reveal">작업물과 연락처는 준비 중입니다.</footer>
</div>
<script>
  var root = document.documentElement;
  var buttons = document.querySelectorAll('.theme button');
  function apply(t) {
    root.setAttribute('data-theme', t);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.set === t); });
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.set); }); });
  apply(root.getAttribute('data-theme'));

  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
</script>
</body>
</html>
