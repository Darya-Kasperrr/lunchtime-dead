/* ══════════════════════════════════════════════════════════════
   LUNCHTIME DEAD — shared app: theme, i18n, chrome, tape deck
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ─────────── i18n ─────────── */
  const DICT = {
    en: {
      'intro.enter': 'PRESS PLAY ▶',
      'nav.player': 'PLAYER', 'nav.clips': 'CLIPS', 'nav.bar': 'THE BAR', 'nav.members': 'MEMBERS',
      'hero.channel': 'MIDNIGHT BROADCAST',
      'hero.tag': 'City pop for the hour the city forgets.',
      'hero.tag2': 'Punk hearts, neon veins, one long last order.',
      'hero.scroll': 'INSERT TAPE',
      'player.title': 'Only the music speaks',
      'player.sub': '— 音楽だけが語りかける —',
      'player.now': 'NOW PLAYING', 'player.add': 'ADD TRACKS',
      'player.note': 'Tracks you add are saved in this browser and play for everyone who opens the site here. Publish the site to share them with the world.',
      'clips.title': 'Video archive', 'clips.sub': '— 映像記録 ・ オンエア —',
      'clips.c1': 'Tsubame big joy — A city with Green', 'clips.c1sub': 'OFFICIAL VIDEO ・ 2026',
      'clips.slot': 'The next tape is still rewinding. New clips land here.',
      'bar.title': 'The bar past midnight', 'bar.sub': '— 深夜のバー —',
      'bar.quote': 'Smoke drifts through a dim room. Someone drinks in silence. Only the music speaks.',
      'bar.quoteEn': '煙草の煙が漂う薄暗い部屋で、誰かが静かに酒を飲んでいる。音楽だけが語りかける。',
      'bar.f1': 'FORMED', 'bar.f2': 'SOUND', 'bar.f2v': 'City Pop × Punk × Nocturne Jazz',
      'bar.f3': 'LAST ORDER', 'bar.f3v': 'Never',
      'cast.title': 'Cast', 'cast.sub': '— キャスト ・ 出演 —',
      'cast.role': 'ROLE', 'cast.origin': 'ORIGIN', 'cast.style': 'STYLE', 'cast.band': 'BAND',
      'cast.m1.role': 'Lead Vocals', 'cast.m1.origin': 'Hiroshima', 'cast.m1.style': 'City Pop ・ Nocturne Jazz',
      'cast.m1.quote': 'There is a night inside the voice that never fades.',
      'cast.m2.role': 'Composer ・ Arranger', 'cast.m2.origin': 'Tokyo', 'cast.m2.style': 'Jazz Harmony ・ Nocturne',
      'cast.m2.quote': 'He places silence in the gaps between the notes.',
      'cast.back': '◀ BACK TO THE BAR',
      'cast.open': 'LINER NOTES',
      'pl.empty': 'No tapes on the shelf yet. Add the first track.',
      'deck.stop': 'STOP ■', 'deck.play': 'PLAY ▶', 'deck.pause': 'PAUSE ❚❚'
    },
    ja: {
      'intro.enter': '再生 ▶',
      'nav.player': 'プレイヤー', 'nav.clips': 'クリップ', 'nav.bar': 'バー', 'nav.members': 'メンバー',
      'hero.channel': '深夜放送',
      'hero.tag': '街が忘れる時間のためのシティ・ポップ。',
      'hero.tag2': 'パンクの心、ネオンの血管、終わらないラストオーダー。',
      'hero.scroll': 'テープを挿入',
      'player.title': '音楽だけが語りかける',
      'player.sub': '— only the music speaks —',
      'player.now': '再生中', 'player.add': '曲を追加',
      'player.note': '追加した曲はこのブラウザに保存され、ここでサイトを開く全員に再生されます。世界と共有するにはサイトを公開してください。',
      'clips.title': '映像記録', 'clips.sub': '— video archive ・ on air —',
      'clips.c1': 'ツバメ・ビッグ・ジョイ — 緑のある街', 'clips.c1sub': '公式ビデオ ・ 2026',
      'clips.slot': '次のテープは巻き戻し中。新しいクリップはここに届く。',
      'bar.title': '深夜のバー', 'bar.sub': '— the bar past midnight —',
      'bar.quote': '煙草の煙が漂う薄暗い部屋で、誰かが静かに酒を飲んでいる。音楽だけが語りかける。',
      'bar.quoteEn': 'Smoke drifts through a dim room. Someone drinks in silence. Only the music speaks.',
      'bar.f1': '結成', 'bar.f2': 'サウンド', 'bar.f2v': 'シティ・ポップ × パンク × 夜想ジャズ',
      'bar.f3': 'ラストオーダー', 'bar.f3v': '永遠にない',
      'cast.title': 'キャスト', 'cast.sub': '— cast ・ starring —',
      'cast.role': '役割', 'cast.origin': '出身', 'cast.style': 'スタイル', 'cast.band': 'バンド',
      'cast.m1.role': 'リードボーカル', 'cast.m1.origin': '広島', 'cast.m1.style': 'シティ・ポップ ・ 夜想ジャズ',
      'cast.m1.quote': '声の中に消えない夜がある。',
      'cast.m2.role': '作曲 ・ 編曲', 'cast.m2.origin': '東京', 'cast.m2.style': 'ジャズ・ハーモニー ・ ノクターン',
      'cast.m2.quote': '音符の隙間に沈黙を置く。',
      'cast.back': '◀ バーに戻る',
      'cast.open': 'ライナーノーツ',
      'pl.empty': '棚にテープがまだない。最初の曲を追加して。',
      'deck.stop': '停止 ■', 'deck.play': '再生 ▶', 'deck.pause': '一時停止 ❚❚'
    }
  };
  let lang = localStorage.getItem('ltd-lang') || 'en';
  const t = k => (DICT[lang] && DICT[lang][k]) || DICT.en[k] || '';

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (t(k)) el.textContent = t(k); });
    const lb = $('#langBtn'); if (lb) lb.textContent = lang === 'en' ? 'EN / 日本語' : '日本語 / EN';
    if (window.renderPlaylist) window.renderPlaylist();
  }
  $('#langBtn') && $('#langBtn').addEventListener('click', () => {
    lang = lang === 'en' ? 'ja' : 'en';
    localStorage.setItem('ltd-lang', lang);
    glitch(); applyLang();
  });

  /* ─────────── theme: 夜 DEAD / 昼 LUNCH ─────────── */
  const root = document.documentElement;
  let theme = localStorage.getItem('ltd-theme') || 'dead';
  function applyTheme() {
    root.dataset.theme = theme;
    const tb = $('#themeBtn'); if (tb) tb.textContent = theme === 'dead' ? '夜 DEAD' : '昼 LUNCH';
  }
  $('#themeBtn') && $('#themeBtn').addEventListener('click', () => {
    theme = theme === 'dead' ? 'lunch' : 'dead';
    localStorage.setItem('ltd-theme', theme);
    glitch(); applyTheme();
  });
  applyTheme();

  /* ─────────── chrome: glitch bar, clock, nav ─────────── */
  function glitch() {
    const bar = $('#trackingBar'); if (!bar) return;
    bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
  }
  const clock = $('#clockOsd');
  if (clock) {
    const tickClock = () => {
      try {
        clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Tokyo', hour12: false }) + ' JST';
      } catch (e) {
        const d = new Date();
        clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
      }
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  const nav = $('#siteNav');
  addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
  const burger = $('#burger'), navLinks = $('#navLinks');
  if (burger) burger.addEventListener('click', () => {
    burger.classList.toggle('open'); navLinks.classList.toggle('open');
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    burger && burger.classList.remove('open'); navLinks && navLinks.classList.remove('open');
  }));

  /* cast cards — open the record sleeve, with a vinyl "shhk" sound */
  let sfxCtx = null;
  function sleeveSound(open) {
    try {
      sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (sfxCtx.state === 'suspended') sfxCtx.resume();
      const t0 = sfxCtx.currentTime;

      // 1) cardboard slide: filtered noise burst
      const dur = 0.28;
      const buf = sfxCtx.createBuffer(1, sfxCtx.sampleRate * dur, sfxCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        const p = i / d.length;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - p, 1.6) * (0.4 + 0.6 * Math.sin(p * 9));
      }
      const noise = sfxCtx.createBufferSource(); noise.buffer = buf;
      const bp = sfxCtx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(open ? 900 : 1400, t0);
      bp.frequency.exponentialRampToValueAtTime(open ? 2400 : 600, t0 + dur);
      bp.Q.value = 0.8;
      const ng = sfxCtx.createGain();
      ng.gain.setValueAtTime(0.16, t0);
      ng.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      noise.connect(bp).connect(ng).connect(sfxCtx.destination);
      noise.start(t0);

      // 2) soft vinyl thump
      const osc = sfxCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(open ? 110 : 80, t0);
      osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.16);
      const og = sfxCtx.createGain();
      og.gain.setValueAtTime(0.0001, t0);
      og.gain.exponentialRampToValueAtTime(0.22, t0 + 0.015);
      og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);
      osc.connect(og).connect(sfxCtx.destination);
      osc.start(t0); osc.stop(t0 + 0.22);

      // 3) a couple of dust crackles
      for (let i = 0; i < 3; i++) {
        const ct = t0 + 0.05 + Math.random() * 0.25;
        const co = sfxCtx.createOscillator();
        co.type = 'square'; co.frequency.value = 3000 + Math.random() * 4000;
        const cg = sfxCtx.createGain();
        cg.gain.setValueAtTime(0.03, ct);
        cg.gain.exponentialRampToValueAtTime(0.0001, ct + 0.012);
        co.connect(cg).connect(sfxCtx.destination);
        co.start(ct); co.stop(ct + 0.015);
      }
    } catch (e) { /* no sound — fine */ }
  }
  $$('.cast-toggle').forEach(btn => btn.addEventListener('click', () => {
    const card = btn.closest('.cast-card');
    const open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    sleeveSound(open);
    glitch();
  }));

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* rain canvas on hero (2D, cheap) */
  const rainC = $('#rain');
  if (rainC) {
    const ctx = rainC.getContext('2d');
    let W, H, drops;
    function initRain() {
      W = rainC.width = rainC.offsetWidth * devicePixelRatio;
      H = rainC.height = rainC.offsetHeight * devicePixelRatio;
      drops = Array.from({ length: 140 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        l: 30 + Math.random() * 70, s: 6 + Math.random() * 9
      }));
    }
    initRain(); addEventListener('resize', initRain);
    (function rainLoop() {
      requestAnimationFrame(rainLoop);
      if (!drops) return;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(156,198,201,.28)';
      ctx.lineWidth = devicePixelRatio;
      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 4, d.y + d.l);
        ctx.stroke();
        d.y += d.s * (1 + AMP * 1.5); d.x -= 0.6;
        if (d.y > H) { d.y = -d.l; d.x = Math.random() * W; }
      });
    })();
  }

  /* ══════════════════════════════════════════════════════════
     TAPE DECK — player, playlist (IndexedDB), audio-reactive bg
     ══════════════════════════════════════════════════════════ */
  const deck = $('#deck');
  let AMP = 0; // exported amplitude

  if (deck) {
    const audio = new Audio();
    audio.preload = 'metadata';

    const DEFAULT_TRACKS = [{
      id: 'default-tsubame',
      name: 'Tsubame big joy — A city with Green',
      url: 'assets/tsubame.mp3',
      builtin: true
    }];

    let tracks = [];
    let cur = 0, shuffle = false, repeat = false, playing = false;

    /* — IndexedDB for user uploads — */
    const DB = 'ltd-tapes';
    // some browsers stall IndexedDB on local files — never let it block the deck
    function withTimeout(p, ms) {
      return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('idb-timeout')), ms))]);
    }
    function idb() {
      return new Promise((res, rej) => {
        const r = indexedDB.open(DB, 1);
        r.onupgradeneeded = () => r.result.createObjectStore('tracks', { keyPath: 'id' });
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    }
    async function dbAll() {
      try {
        const d = await idb();
        return new Promise(res => {
          const q = d.transaction('tracks').objectStore('tracks').getAll();
          q.onsuccess = () => res(q.result || []);
          q.onerror = () => res([]);
        });
      } catch (e) { return []; }
    }
    async function dbPut(rec) {
      const d = await idb();
      d.transaction('tracks', 'readwrite').objectStore('tracks').put(rec);
    }
    async function dbDel(id) {
      const d = await idb();
      d.transaction('tracks', 'readwrite').objectStore('tracks').delete(id);
    }

    /* — web audio: analyser drives everything — */
    let actx, analyser, dataArr, srcNode;
    function ensureAudioGraph() {
      if (actx) { if (actx.state === 'suspended') actx.resume(); return; }
      actx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = actx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      dataArr = new Uint8Array(analyser.frequencyBinCount);
      srcNode = actx.createMediaElementSource(audio);
      srcNode.connect(analyser); analyser.connect(actx.destination);
    }

    /* — EQ canvas — */
    const eq = $('#eq'), eqx = eq.getContext('2d');
    function sizeEq() {
      eq.width = eq.offsetWidth * devicePixelRatio;
      eq.height = eq.offsetHeight * devicePixelRatio;
    }
    sizeEq(); addEventListener('resize', sizeEq);

    /* — shader FX stage (siri wave / fluid dots / classic bars) — */
    const fxStage = $('.fx-stage'), fxCanvas = $('#fx'), fxLabel = $('#fxLabel'), btnFx = $('#btnFx');
    const FXMODES = ['bars', 'wave', 'dots'];
    let fxMode = localStorage.getItem('ltd-fx') || 'wave';
    const deckFx = window.LTDFX ? LTDFX.create() : null;
    const fxReady = !!(deckFx && fxCanvas && deckFx.init(fxCanvas));
    /* fullscreen layer behind the whole page */
    const bgCanvas = $('#bgfx');
    const bgFx = window.LTDFX ? LTDFX.create({ scale: 0.35, speed: 0.3 }) : null;
    const bgReady = !!(bgFx && bgCanvas && bgFx.init(bgCanvas));
    function applyFx() {
      if (!fxReady || !FXMODES.includes(fxMode)) fxMode = 'bars';
      fxStage.classList.toggle('gl', fxMode !== 'bars');
      if (fxMode !== 'bars') { deckFx.setMode(fxMode); deckFx.resize(); }
      else if (typeof sizeEq === 'function') sizeEq();
      if (bgReady) { bgFx.setMode(fxMode === 'bars' ? 'wave' : fxMode); bgFx.resize(); }
      fxLabel.textContent = 'FX ・ ' + fxMode.toUpperCase();
      btnFx.classList.toggle('toggled', fxMode !== 'bars');
    }
    if (btnFx) btnFx.addEventListener('click', () => {
      fxMode = FXMODES[(FXMODES.indexOf(fxMode) + 1) % FXMODES.length];
      if (!fxReady) fxMode = 'bars';
      localStorage.setItem('ltd-fx', fxMode);
      glitch(); applyFx();
    });
    applyFx();
    addEventListener('resize', () => { fxReady && deckFx.resize(); bgReady && bgFx.resize(); });

    /* — analog VU meters — */
    const vuL = $('#vuL'), vuR = $('#vuR');
    const vus = [vuL, vuR].filter(Boolean).map(c => ({
      c, x: c.getContext('2d'), val: 0, vel: 0
    }));
    function sizeVu() {
      vus.forEach(v => {
        v.c.width = v.c.offsetWidth * devicePixelRatio;
        v.c.height = v.c.offsetHeight * devicePixelRatio;
      });
    }
    sizeVu(); addEventListener('resize', sizeVu);

    function drawVu(v, target) {
      // needle spring physics: overshoot like a real meter
      const stiff = 0.09, damp = 0.82;
      v.vel = (v.vel + (target - v.val) * stiff) * damp;
      v.val = Math.max(0, Math.min(1.08, v.val + v.vel));

      const W = v.c.width, H = v.c.height, x = v.x;
      x.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H * 1.62, R = H * 1.38;
      const a0 = -Math.PI / 2 - 0.62, a1 = -Math.PI / 2 + 0.62;

      // scale arc + ticks
      x.strokeStyle = 'rgba(255,190,110,.5)'; x.lineWidth = devicePixelRatio;
      x.beginPath(); x.arc(cx, cy, R, a0, a1); x.stroke();
      for (let i = 0; i <= 10; i++) {
        const a = a0 + (a1 - a0) * i / 10;
        const red = i >= 8;
        x.strokeStyle = red ? 'rgba(255,80,80,.85)' : 'rgba(255,190,110,.6)';
        x.lineWidth = devicePixelRatio * (i % 5 === 0 ? 1.6 : 1);
        const r1 = R, r2 = R - (i % 5 === 0 ? H * .13 : H * .08);
        x.beginPath();
        x.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        x.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        x.stroke();
      }
      // red zone arc
      x.strokeStyle = 'rgba(255,80,80,.8)'; x.lineWidth = devicePixelRatio * 2;
      x.beginPath(); x.arc(cx, cy, R + devicePixelRatio, a0 + (a1 - a0) * .8, a1); x.stroke();

      // needle
      const na = a0 + (a1 - a0) * Math.min(1, v.val);
      x.strokeStyle = '#ffd9a0'; x.lineWidth = devicePixelRatio * 1.4;
      x.shadowColor = 'rgba(255,190,110,.7)'; x.shadowBlur = 6 * devicePixelRatio;
      x.beginPath();
      x.moveTo(cx + Math.cos(na) * (R - H * .1), cy + Math.sin(na) * (R - H * .1));
      x.lineTo(cx + Math.cos(na) * (R - H * .95), cy + Math.sin(na) * (R - H * .95));
      x.stroke();
      x.shadowBlur = 0;
    }

    let beatCool = 0;
    (function vizLoop() {
      requestAnimationFrame(vizLoop);
      const W = eq.width, H = eq.height;
      eqx.clearRect(0, 0, W, H);
      const styles = getComputedStyle(root);
      const accent = styles.getPropertyValue('--accent').trim() || '#ff5c8a';
      const teal = styles.getPropertyValue('--accent-2').trim() || '#9cc6c9';

      /* frequency bands: low / mid / high (0..1) */
      let level = 0, lowB = 0, midB = 0, highB = 0;
      if (analyser && playing) {
        analyser.getByteFrequencyData(dataArr);
        for (let i = 0; i < 8; i++) lowB += dataArr[i];
        for (let i = 8; i < 40; i++) midB += dataArr[i];
        for (let i = 40; i < 104; i++) highB += dataArr[i];
        lowB /= 8 * 255; midB /= 32 * 255; highB = Math.min(1, highB / (64 * 255) * 2.4);
        level = lowB * 0.5 + midB * 0.35 + highB * 0.15;
      }

      /* fullscreen fx breathes behind the page while music plays */
      document.body.classList.toggle('fx-on', playing);
      if (bgReady && playing) bgFx.render(performance.now(), lowB, midB, highB, AMP);

      if (fxMode !== 'bars' && fxReady) {
        /* GLSL fx — driven by the real spectrum */
        deckFx.render(performance.now(), lowB, midB, highB, AMP);
      } else if (analyser && playing) {
        const N = 48;
        const bw = W / N;
        for (let i = 0; i < N; i++) {
          const v = dataArr[Math.floor(i * dataArr.length / N * 0.72)] / 255;
          const h = Math.max(2, v * H * 0.92);
          eqx.fillStyle = i % 6 === 0 ? teal : accent;
          eqx.globalAlpha = 0.28 + v * 0.72;
          eqx.fillRect(i * bw + bw * 0.18, H - h, bw * 0.64, h);
        }
        eqx.globalAlpha = 1;
      } else {
        // idle: sleepy flat line pulse
        const tNow = performance.now() / 1000;
        eqx.strokeStyle = accent; eqx.globalAlpha = .35; eqx.lineWidth = devicePixelRatio;
        eqx.beginPath();
        for (let x = 0; x < W; x += 4) {
          const y = H * .8 + Math.sin(x / 34 + tNow * 1.8) * H * .05;
          x === 0 ? eqx.moveTo(x, y) : eqx.lineTo(x, y);
        }
        eqx.stroke(); eqx.globalAlpha = 1;
      }

      // VU needles: L = lows, R = highs (idle: sleepy drift)
      if (analyser && playing) {
        const half = dataArr.length >> 1;
        let lo = 0, hi = 0;
        for (let i = 0; i < half; i++) { lo += dataArr[i]; hi += dataArr[half + i]; }
        drawVu(vus[0], (lo / half / 255) * 1.25);
        if (vus[1]) drawVu(vus[1], Math.min(1.05, (hi / half / 255) * 3.2 + level * .3));
      } else {
        const tNow = performance.now() / 1000;
        vus.forEach((v, i) => drawVu(v, 0.04 + Math.sin(tNow * (1.1 + i * .3)) * 0.02));
      }

      AMP += (level - AMP) * 0.25;
      root.style.setProperty('--amp', AMP.toFixed(3));

      // heavy beat → occasional tracking glitch
      if (level > 0.45 && beatCool <= 0) { glitch(); beatCool = 260; }
      beatCool--;
    })();

    /* — playlist UI — */
    const plEl = $('#playlist');
    window.renderPlaylist = renderPlaylist; // for i18n refresh
    function renderPlaylist() {
      if (!plEl) return;
      plEl.innerHTML = '';
      if (!tracks.length) {
        plEl.innerHTML = `<div class="pl-empty">${t('pl.empty')}</div>`;
        return;
      }
      tracks.forEach((tr, i) => {
        const row = document.createElement('div');
        row.className = 'pl-row' + (i === cur ? ' current' : '');
        row.innerHTML = `
          <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="pl-name">${esc(tr.name)}</span>
          <span class="pl-time">${tr.dur ? fmt(tr.dur) : '--:--'}</span>
          ${tr.builtin ? '' : '<button class="pl-del" title="remove">✕</button>'}`;
        row.addEventListener('click', e => {
          if (e.target.classList.contains('pl-del')) return;
          load(i, true);
        });
        const del = row.querySelector('.pl-del');
        if (del) del.addEventListener('click', async () => {
          try { await withTimeout(dbDel(tr.id), 1500); } catch (e) {}
          URL.revokeObjectURL(tr.url);
          const wasCur = i === cur;
          tracks.splice(i, 1);
          if (cur >= tracks.length) cur = 0; else if (i < cur) cur--;
          if (wasCur && tracks.length) load(cur, playing);
          if (!tracks.length) { audio.pause(); setPlaying(false); }
          renderPlaylist();
        });
        plEl.appendChild(row);
      });
    }
    function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function fmt(s) { s = Math.max(0, s | 0); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0'); }

    /* — transport — */
    const btnPlay = $('#btnPlay'), playIcon = $('#playIcon');
    const seekBar = $('#seekBar'), volBar = $('#volBar');
    const tCur = $('#tCur'), tDur = $('#tDur');
    const nowTitle = $('#nowTitle'), deckStatus = $('#deckStatus'), tapeCount = $('#tapeCount');

    function setPlaying(v) {
      playing = v;
      deck.classList.toggle('playing', v);
      playIcon.innerHTML = v ? '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
      deckStatus.textContent = v ? t('deck.play') : (audio.currentTime > 0 ? t('deck.pause') : t('deck.stop'));
    }
    function load(i, autoplay) {
      if (!tracks.length) return;
      cur = (i + tracks.length) % tracks.length;
      const tr = tracks[cur];
      audio.src = tr.url;
      nowTitle.textContent = tr.name;
      renderPlaylist();
      if (autoplay) play();
    }
    function play() {
      ensureAudioGraph();
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
    function next(auto) {
      if (shuffle && tracks.length > 1) {
        let n; do { n = Math.random() * tracks.length | 0 } while (n === cur);
        load(n, true);
      } else if (cur === tracks.length - 1 && !repeat && auto) {
        setPlaying(false);
      } else load(cur + 1, true);
    }

    btnPlay.addEventListener('click', () => playing ? (audio.pause(), setPlaying(false)) : play());
    $('#btnPrev').addEventListener('click', () => audio.currentTime > 3 ? audio.currentTime = 0 : load(cur - 1, playing));
    $('#btnNext').addEventListener('click', () => next(false));
    $('#btnShuffle').addEventListener('click', e => { shuffle = !shuffle; e.currentTarget.classList.toggle('toggled', shuffle); });
    $('#btnRepeat').addEventListener('click', e => { repeat = !repeat; e.currentTarget.classList.toggle('toggled', repeat); });

    audio.addEventListener('ended', () => next(true));
    audio.addEventListener('loadedmetadata', () => {
      tDur.textContent = fmt(audio.duration);
      const tr = tracks[cur];
      if (tr && !tr.dur) { tr.dur = audio.duration; renderPlaylist(); }
    });
    audio.addEventListener('timeupdate', () => {
      tCur.textContent = fmt(audio.currentTime);
      if (audio.duration) {
        const p = audio.currentTime / audio.duration * 1000;
        seekBar.value = p;
        seekBar.style.setProperty('--fill', (p / 10) + '%');
        tapeCount.textContent = String(Math.floor(audio.currentTime)).padStart(3, '0');
      }
    });
    seekBar.addEventListener('input', () => {
      if (audio.duration) audio.currentTime = seekBar.value / 1000 * audio.duration;
    });
    volBar.addEventListener('input', () => {
      audio.volume = volBar.value / 100;
      volBar.style.setProperty('--fill', volBar.value + '%');
    });
    audio.volume = 0.8; volBar.style.setProperty('--fill', '80%');

    /* — uploads — */
    $('#fileInput').addEventListener('change', async e => {
      const files = Array.from(e.target.files || []);
      let added = 0;
      for (const f of files) {
        const id = 'u-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        const rec = { id, name: f.name.replace(/\.[^.]+$/, ''), blob: f };
        // persistence is best-effort: even if IndexedDB is unavailable
        // (some browsers block it for local files), the track still plays now
        try { await withTimeout(dbPut(rec), 1500); } catch (err) { /* in-memory only */ }
        tracks.push({ id, name: rec.name, url: URL.createObjectURL(f) });
        added++;
      }
      e.target.value = '';
      if (added) {
        renderPlaylist();
        glitch();
        // jump to the first newly added tape and play it
        load(tracks.length - added, true);
      }
    });

    /* — boot: default tape first, storage merges in when (if) it answers — */
    (async function boot() {
      tracks = DEFAULT_TRACKS.slice();
      load(0, false);
      nowTitle.textContent = tracks[0].name;
      try {
        const saved = await withTimeout(dbAll(), 2500);
        saved.forEach(r => tracks.push({ id: r.id, name: r.name, url: URL.createObjectURL(r.blob) }));
        if (saved.length) renderPlaylist();
      } catch (e) { /* storage unavailable — deck works anyway */ }
    })();

    // start music softly after the intro if the user pressed play there
    document.addEventListener('intro:done', () => { /* user gesture happened — allow instant play on deck */ }, { once: true });
  }

  applyLang();
})();
