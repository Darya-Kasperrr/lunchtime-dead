/* ══════════════════════════════════════════════════════════════
   LUNCHTIME DEAD — shared app: theme, i18n, chrome, tape deck
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  // some networks/browsers stall — never let a Supabase call block the page
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  /* ─────────── i18n ─────────── */
  const DICT = {
    en: {
      'intro.enter': 'PRESS PLAY ▶',
      'nav.player': 'PLAYER', 'nav.clips': 'CLIPS', 'nav.bar': 'THE BAR', 'nav.members': 'MEMBERS',
      'hero.channel': 'MIDNIGHT BROADCAST',
      'hero.tag': 'City pop for the hour the city forgets.',
      'hero.tag2': 'Punk hearts, neon veins, one long last order.',
      'hero.scroll': 'INSERT TAPE',
      'hero.neon': 'NEON',
      'player.title': 'Only the music speaks',
      'player.sub': '— 音楽だけが語りかける —',
      'player.now': 'NOW PLAYING',
      'clips.title': 'Video archive', 'clips.sub': '— 映像記録 ・ オンエア —',
      'clips.slot': 'The next tape is still rewinding. New clips land here.',
      'nav.live': 'LIVE',
      'live.title': 'Live schedule', 'live.sub': '— ライブ日程 —',
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
      'deck.stop': 'STOP ■', 'deck.play': 'PLAY ▶', 'deck.pause': 'PAUSE ❚❚',
      'nav.wall': 'WALL',
      'wall.title': 'On-air postcards', 'wall.sub': '— messages from listeners —',
      'wall.empty': 'No postcards yet — be the first to write in.',
      'wall.cta': 'LEAVE A POSTCARD',
      'wall.formTitle': 'Leave a postcard',
      'wall.messagePh': 'Say something to the band…',
      'wall.photoLabel': 'Were you at a show? Attach a photo (optional — goes through a quick review)',
      'wall.submit': 'SEND',
      'wall.unavailable': 'Not available right now — try again later.',
      'wall.sending': 'Sending…',
      'wall.pending': 'Thanks — it’ll appear once reviewed.',
      'wall.posted': 'Posted!'
    },
    ja: {
      'intro.enter': '再生 ▶',
      'nav.player': 'プレイヤー', 'nav.clips': 'クリップ', 'nav.bar': 'バー', 'nav.members': 'メンバー',
      'hero.channel': '深夜放送',
      'hero.tag': '街が忘れる時間のためのシティ・ポップ。',
      'hero.tag2': 'パンクの心、ネオンの血管、終わらないラストオーダー。',
      'hero.scroll': 'テープを挿入',
      'hero.neon': 'ネオン',
      'player.title': '音楽だけが語りかける',
      'player.sub': '— only the music speaks —',
      'player.now': '再生中',
      'clips.title': '映像記録', 'clips.sub': '— video archive ・ on air —',
      'clips.slot': '次のテープは巻き戻し中。新しいクリップはここに届く。',
      'nav.live': 'ライブ',
      'live.title': 'ライブ日程', 'live.sub': '— live schedule —',
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
      'deck.stop': '停止 ■', 'deck.play': '再生 ▶', 'deck.pause': '一時停止 ❚❚',
      'nav.wall': 'ウォール',
      'wall.title': 'リスナーからの絵はがき', 'wall.sub': '— on-air postcards —',
      'wall.empty': 'まだ絵はがきはありません。最初の一枚を書いてみて。',
      'wall.cta': '絵はがきを送る',
      'wall.formTitle': '絵はがきを送る',
      'wall.messagePh': 'バンドへのメッセージ…',
      'wall.photoLabel': 'ライブに参加した？写真を添付できます（任意・簡単な確認後に公開）',
      'wall.submit': '送信',
      'wall.unavailable': '現在ご利用いただけません。後でもう一度お試しください。',
      'wall.sending': '送信中…',
      'wall.pending': 'ありがとうございます — 確認後に公開されます。',
      'wall.posted': '投稿しました！'
    }
  };
  let lang = localStorage.getItem('ltd-lang') || 'en';
  const t = k => (DICT[lang] && DICT[lang][k]) || DICT.en[k] || '';

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (!t(k)) return;
      const attr = el.dataset.i18nAttr;
      if (attr) el.setAttribute(attr, t(k)); else el.textContent = t(k);
    });
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

  /* respect reduced-motion: freeze the hero background video on its poster */
  const heroVideo = $('.hero-bgvideo');
  if (heroVideo) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroVideo.pause(); heroVideo.currentTime = 0;
    } else {
      /* loop: when video ends, restart from the beginning */
      heroVideo.addEventListener('ended', () => { heroVideo.currentTime = 0; heroVideo.play().catch(() => {}); });
    }
  }

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
  // iOS/Android: a fixed full-screen menu opened mid-momentum-scroll can render
  // half-painted and "stick" until the scroll settles — lock the body in place instead.
  let navScrollY = 0;
  function lockScroll() {
    navScrollY = scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -navScrollY + 'px';
    document.body.style.width = '100%';
  }
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    scrollTo(0, navScrollY);
  }
  function setNavOpen(open) {
    burger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll(); else unlockScroll();
  }
  if (burger) burger.addEventListener('click', () => {
    setNavOpen(!burger.classList.contains('open'));
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    burger && setNavOpen(false);
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
  function toggleCastCard(card) {
    const btn = card.querySelector('.cast-toggle');
    const open = card.classList.toggle('open');
    if (btn) btn.setAttribute('aria-expanded', open);
    sleeveSound(open);
    glitch();
  }
  $$('.cast-toggle').forEach(btn => btn.addEventListener('click', () => toggleCastCard(btn.closest('.cast-card'))));
  // the photo itself is also a big, obvious click target
  $$('.cast-photo').forEach(photo => photo.addEventListener('click', () => toggleCastCard(photo.closest('.cast-card'))));

  /* cast cards: cursor-follow tilt, like flipping a record sleeve in your hands */
  $$('.cast-card').forEach(card => {
    let tx = 0, ty = 0, sx = 0, sy = 0, hovering = false, raf = null;
    function step() {
      sx += (tx - sx) * 0.15; sy += (ty - sy) * 0.15;
      if (hovering || Math.abs(sx) > 0.001 || Math.abs(sy) > 0.001) {
        const lift = hovering ? -6 : 0;
        card.style.transform = `perspective(900px) translateY(${lift}px) rotateY(${sx * 7}deg) rotateX(${sy * -6}deg)`;
        raf = requestAnimationFrame(step);
      } else {
        card.style.transform = '';
        raf = null;
      }
    }
    card.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      hovering = true;
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(step);
    });
    card.addEventListener('pointerleave', () => {
      hovering = false; tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(step);
    });
  });

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ─────────── CMS-backed content: gigs, clips, hero video ───────────
     Reads straight from Supabase (public, RLS-protected). Falls back to
     today's static content if Supabase isn't configured or unreachable,
     so the site never goes blank. Writes happen only from admin.html. */
  (function cms() {
    async function fetchRows(table, order, opts) {
      if (!window.LTDSupabase || !window.LTDSupabase.client) return null;
      try {
        const { data, error } = await withTimeout(
          window.LTDSupabase.client.from(table).select('*').order(order, opts), 2500);
        return (!error && data && data.length) ? data : null;
      } catch (e) { return null; }
    }

    /* — gigs — */
    const gigList = $('#gigList');
    if (gigList) {
      const FALLBACK_GIGS = [{
        date: '2026-08-15', venue: 'U.F.O.CLUB', city: 'TOKYO ・ 東高円寺',
        note: '【MELTING AWAY】 with サマーウーフ ・ OrbisSoundscape ・ Galapagos ・ 赤い花\nOPEN 18:30 ・ START 19:00 ・ ¥3,000 ADV / ¥3,500 DOOR (+1D)',
        ticket_url: 'https://www.instagram.com/lunchtimedead/', ticket_label: 'TICKETS ▸ DM', is_past: false
      }];
      function renderGigs(rows) {
        gigList.innerHTML = rows.map(g => {
          const d = new Date(g.date + 'T00:00:00');
          const chip = g.ticket_url
            ? `<a class="chip gig-status" href="${esc(g.ticket_url)}" target="_blank" rel="noopener">${esc(g.ticket_label)}</a>`
            : `<span class="chip gig-status">${esc(g.ticket_label)}</span>`;
          return `
            <article class="gig reveal${g.is_past ? ' past' : ''}">
              <div class="gig-date"><span class="d">${String(d.getDate()).padStart(2, '0')}</span><span class="m">${MONTHS[d.getMonth()]} ${d.getFullYear()}</span></div>
              <div class="gig-info">
                <h3>${esc(g.venue)}</h3>
                <span class="gig-city osd">${esc(g.city)}</span>
                <p class="gig-note">${esc(g.note).replace(/\n/g, '<br>')}</p>
              </div>
              ${chip}
            </article>`;
        }).join('');
        $$('.gig.reveal', gigList).forEach(el => io.observe(el));
      }
      fetchRows('gigs', 'position').then(rows => renderGigs(rows || FALLBACK_GIGS));
    }

    /* — clips — */
    const clipsGrid = $('#clipsGrid');
    if (clipsGrid) {
      const FALLBACK_CLIPS = [{
        title: 'Tsubame big joy — A city with Green',
        youtube_url: 'https://www.youtube.com/embed/mLlyXlstjaM',
        watch_label: 'WATCH ON YOUTUBE ↗'
      }];
      function watchUrl(embedUrl) {
        const m = embedUrl.match(/embed\/([^?&]+)/);
        return m ? `https://www.youtube.com/watch?v=${m[1]}` : embedUrl;
      }
      function renderClips(rows) {
        const figures = rows.map(c => `
          <figure class="tv reveal">
            <div class="tv-screen">
              <div class="tv-osd"><span class="rec">● REC</span> &nbsp;CH-04 ・ SP 0:00:00</div>
              <iframe src="${esc(c.youtube_url)}" title="${esc(c.title)}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen loading="lazy"></iframe>
            </div>
            <figcaption class="tv-caption">
              <h3>${esc(c.title)}</h3>
              <span class="osd"><a href="${esc(watchUrl(c.youtube_url))}" target="_blank" rel="noopener" style="color:inherit">${esc(c.watch_label)}</a></span>
            </figcaption>
          </figure>`).join('');
        clipsGrid.insertAdjacentHTML('afterbegin', figures);
        $$('.tv.reveal', clipsGrid).forEach(el => io.observe(el));
      }
      fetchRows('clips', 'position').then(rows => renderClips(rows || FALLBACK_CLIPS));
    }

    /* — hero video override — */
    const heroVideo = $('.hero-bgvideo');
    if (heroVideo && window.LTDSupabase && window.LTDSupabase.client) {
      withTimeout(
        window.LTDSupabase.client.from('site_settings').select('hero_video_url,hero_poster_url').eq('id', 1).maybeSingle(),
        2500
      ).then(({ data, error }) => {
        if (error || !data) return;
        if (data.hero_video_url) {
          const src = document.createElement('source');
          src.src = data.hero_video_url; src.type = 'video/mp4';
          heroVideo.prepend(src);
          heroVideo.load();
        }
        if (data.hero_poster_url) heroVideo.poster = data.hero_poster_url;
      }).catch(() => {});
    }

    /* — wall: approved postcards (public read; no fallback content, it's UGC) — */
    const wallGrid = $('#wallGrid');
    if (wallGrid) {
      function renderWall(rows) {
        const empty = $('#wallEmpty');
        wallGrid.querySelectorAll('.postcard').forEach(el => el.remove());
        if (!rows || !rows.length) { if (empty) empty.style.display = ''; return; }
        if (empty) empty.style.display = 'none';
        wallGrid.insertAdjacentHTML('beforeend', rows.map(p => {
          const d = new Date(p.created_at);
          const dateStr = `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
          return `
          <article class="postcard reveal">
            ${p.photo_url ? `<img class="postcard-photo" src="${esc(p.photo_url)}" alt="">` : ''}
            <p class="postcard-msg">${esc(p.message)}</p>
            <div class="postcard-foot">
              <span class="postcard-name osd">— ${esc(p.name || 'Anonymous')}</span>
              <span class="postcard-date osd">${dateStr}</span>
            </div>
          </article>`;
        }).join(''));
        $$('.postcard.reveal', wallGrid).forEach(el => io.observe(el));
      }
      const loadWall = () => fetchRows('postcards', 'created_at', { ascending: false }).then(renderWall);
      loadWall();
      window.LTDLoadWall = loadWall;
    }
  })();

  /* ─────────── postcard submission modal ─────────── */
  (function postcardForm() {
    const fab = $('#postcardFab'), modal = $('#postcardModal');
    if (!fab || !modal) return;
    const backdrop = $('#postcardBackdrop'), closeBtn = $('#postcardClose');
    const msgEl = $('#pcMessage'), countEl = $('#pcCount'), statusEl = $('#pcStatus');

    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      msgEl.focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    fab.addEventListener('click', openModal);
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
    msgEl.addEventListener('input', () => { countEl.textContent = msgEl.value.length; });

    $('#postcardForm').addEventListener('submit', async e => {
      e.preventDefault();
      if ($('#pcWebsite').value) return; // honeypot tripped — silently drop
      const message = msgEl.value.trim();
      if (!message) return;
      if (!window.LTDSupabase || !window.LTDSupabase.client) {
        statusEl.textContent = t('wall.unavailable');
        return;
      }
      const client = window.LTDSupabase.client;
      const photoFile = $('#pcPhoto').files[0];
      statusEl.textContent = t('wall.sending');
      try {
        let photo_url = null, status = 'approved';
        if (photoFile) {
          const path = Date.now() + '-' + photoFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
          const { error: upErr } = await client.storage.from('postcard-photos').upload(path, photoFile);
          if (upErr) throw upErr;
          photo_url = client.storage.from('postcard-photos').getPublicUrl(path).data.publicUrl;
          status = 'pending';
        }
        const { error } = await client.from('postcards').insert({
          name: $('#pcName').value.trim() || null, message, photo_url, status
        });
        if (error) throw error;
        statusEl.textContent = status === 'pending' ? t('wall.pending') : t('wall.posted');
        e.target.reset();
        countEl.textContent = '0';
        if (status === 'approved' && window.LTDLoadWall) window.LTDLoadWall();
        setTimeout(closeModal, 1800);
      } catch (err) { statusEl.textContent = 'Error: ' + err.message; }
    });
  })();

  /* interactive hero: parallax stage + neon lantern following the cursor */
  (function heroInteractive() {
    const hero = $('.hero'), avant = $('.hero-avant'),
          signWrap = $('.sign-wrap'), heroGlow = $('#heroGlow');
    if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0, ty = 0, sx = 0, sy = 0;
    let gx = 0, gy = 0, gtx = 0, gty = 0, glowSeen = false;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      gtx = e.clientX - r.left; gty = e.clientY - r.top;
      if (!glowSeen) { gx = gtx; gy = gty; glowSeen = true; }
    });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
    (function heroLoop() {
      requestAnimationFrame(heroLoop);
      sx += (tx - sx) * 0.05; sy += (ty - sy) * 0.05;
      gx += (gtx - gx) * 0.1; gy += (gty - gy) * 0.1;
      if (avant) avant.style.transform = `translate(${sx * -16}px, ${sy * -9}px)`;
      if (signWrap) signWrap.style.transform =
        `perspective(900px) rotateY(${sx * 5}deg) rotateX(${sy * -3.5}deg) translate(${sx * 9}px, ${sy * 5}px)`;
      if (heroGlow && glowSeen) {
        heroGlow.style.left = gx + 'px';
        heroGlow.style.top = gy + 'px';
      }
    })();
  })();

  /* ─────────── hero ambient track: Flying Girl (loop, toggle, ducks for the deck) ─────────── */
  (function heroAmbient() {
    const btn = $('#ambientSwitch');
    if (!btn) return;
    const track = new Audio('assets/Lunchtime%20Dead%20-%20Flying%20Girl.mp3');
    track.loop = true;
    track.volume = 0;
    track.preload = 'none';
    const TARGET_VOL = 0.35;

    let on = localStorage.getItem('ltd-hero-music') !== 'off';
    let duckedByDeck = false;
    let fadeRaf = null;
    function reflect() {
      btn.setAttribute('aria-pressed', String(on));
    }
    reflect();

    function fadeTo(vol, ms, done) {
      if (fadeRaf) cancelAnimationFrame(fadeRaf);
      const start = track.volume, t0 = performance.now();
      (function step(now) {
        const p = Math.min(1, (now - t0) / ms);
        track.volume = Math.max(0, Math.min(1, start + (vol - start) * p));
        if (p < 1) fadeRaf = requestAnimationFrame(step);
        else { fadeRaf = null; if (done) done(); }
      })(t0);
    }
    function tryPlay() {
      if (!on || duckedByDeck) return;
      track.play().then(() => fadeTo(TARGET_VOL, 1400)).catch(() => {});
    }
    function pause() { fadeTo(0, 400, () => track.pause()); }

    btn.addEventListener('click', () => {
      on = !on;
      localStorage.setItem('ltd-hero-music', on ? 'on' : 'off');
      reflect();
      if (on) tryPlay(); else pause();
    });

    // browsers only allow playback after a user gesture
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
      addEventListener(ev, tryPlay, { once: true, capture: true, passive: true }));

    // duck out whenever the main deck is playing something, resume after
    document.addEventListener('ltd:deck', e => {
      duckedByDeck = !!e.detail.playing;
      if (duckedByDeck) pause(); else tryPlay();
    });

    /* ── lyrics: cycle Flying Girl verses, timed to the real vocal track ── */
    const LYRIC_LINES = [
      { at: 36.5, text: '教えてくれるのかい？' },
      { at: 42.0, text: 'この星のルールを' },
      { at: 47.5, text: '連れ去ってくれるのかい？' },
      { at: 53.0, text: 'この僕でも' },
      { at: 58.5, text: '遠い雲、ビルの隙間' },
      { at: 64.0, text: '40年前と同じ匂いに' },
      { at: 69.5, text: 'むせかえる' },
      { at: 75.0, text: '楔はもう外れた' },
      { at: 80.5, text: '穴が空いた体で' },
      { at: 86.0, text: '歩き回る' },
      // repeated hook, matches the real vocal — 1:45–2:17, alternating slots
      { at: 105.0, text: 'Flying Girl' },
      { at: 109.5, text: 'Flying Girl' },
      { at: 114.0, text: 'Flying Girl' },
      { at: 118.5, text: 'Flying Girl' },
      { at: 123.0, text: 'Flying Girl' },
      { at: 127.5, text: 'Flying Girl' },
      { at: 132.0, text: 'Flying Girl' },
      { at: 137.0, text: null } // hook ends — clear
    ];

    const lyricEls = [0, 1, 2].map(i => $('#avLyric' + i));
    let lastLyricIdx = -1;

    function clearLyrics() {
      lyricEls.forEach(el => el && el.classList.remove('show'));
      lastLyricIdx = -1;
    }

    track.addEventListener('timeupdate', () => {
      const t = track.currentTime;
      if (t < LYRIC_LINES[0].at) { if (lastLyricIdx !== -1) clearLyrics(); return; }
      let idx = -1;
      for (let i = 0; i < LYRIC_LINES.length; i++) if (t >= LYRIC_LINES[i].at) idx = i; else break;
      if (idx === lastLyricIdx) return;
      // hide outgoing slot
      if (lastLyricIdx >= 0) {
        const prev = lyricEls[lastLyricIdx % 3];
        if (prev) prev.classList.remove('show');
      }
      // show incoming slot (unless this marks the end of a section)
      const line = LYRIC_LINES[idx];
      if (line.text) {
        const slot = lyricEls[idx % 3];
        if (slot) {
          slot.textContent = line.text;
          slot.classList.toggle('is-latin', /^[a-z\s]+$/i.test(line.text));
          void slot.offsetWidth; // force reflow so fade re-triggers
          slot.classList.add('show');
        }
      }
      lastLyricIdx = idx;
    });

    // reset on seek or stop
    track.addEventListener('seeked', clearLyrics);
  })();

  let AMP = 0; // exported amplitude — used by rain canvas below and the deck's audio-reactive FX

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
  // opened as a local file? browsers then mute WebAudio-routed media and block
  // YouTube embeds — degrade gracefully so sound always comes first
  const LOCAL_FILE = location.protocol === 'file:';

  if (deck) {
    const audio = new Audio();
    audio.preload = 'metadata';

    // used if Supabase is unreachable/unconfigured — the deck should never be silent
    const FALLBACK_TRACKS = [{
      id: 'default-tsubame',
      name: 'Tsubame big joy — A city with Green',
      url: 'assets/tsubame.mp3'
    }, {
      id: 'default-flying-girl',
      name: 'Flying Girl',
      url: 'assets/Lunchtime%20Dead%20-%20Flying%20Girl.mp3',
      art: 'assets/unnamed.png'
    }];

    let tracks = [];
    let cur = 0, shuffle = false, repeat = false, playing = false;

    async function fetchTracks() {
      if (!window.LTDSupabase || !window.LTDSupabase.client) return FALLBACK_TRACKS;
      try {
        const { data, error } = await withTimeout(
          window.LTDSupabase.client.from('tracks').select('*').order('position'), 2500);
        if (error || !data || !data.length) return FALLBACK_TRACKS;
        return data.map(r => ({ id: r.id, name: r.name, url: r.audio_url, art: r.art_url || undefined }));
      } catch (e) { return FALLBACK_TRACKS; }
    }

    /* — web audio: analyser drives everything — */
    let actx, analyser, dataArr, srcNode;
    function ensureAudioGraph() {
      if (LOCAL_FILE) return; // keep audio direct — sound beats visuals
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
          <span class="pl-time">${tr.dur ? fmt(tr.dur) : '--:--'}</span>`;
        row.addEventListener('click', () => load(i, true));
        plEl.appendChild(row);
      });
    }
    function fmt(s) { s = Math.max(0, s | 0); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0'); }

    /* — transport — */
    const btnPlay = $('#btnPlay'), playIcon = $('#playIcon');
    const seekBar = $('#seekBar'), volBar = $('#volBar');
    const tCur = $('#tCur'), tDur = $('#tDur');
    const nowTitle = $('#nowTitle'), deckStatus = $('#deckStatus'), tapeCount = $('#tapeCount'), nowArt = $('#nowArt');

    /* — mini player: stays reachable while the user scrolls away from the deck — */
    const miniPlayer = $('#miniPlayer'), miniPlayBtn = $('#miniPlayBtn'), miniPlayIcon = $('#miniPlayIcon'),
          miniTitle = $('#miniTitle'), miniArt = $('#miniArt'), miniSeekFill = $('#miniSeekFill');
    let deckVisible = true;
    function updateMini() {
      if (!miniPlayer) return;
      const show = playing && !deckVisible;
      miniPlayer.classList.toggle('show', show);
      miniPlayer.setAttribute('aria-hidden', String(!show));
      if (miniPlayIcon) miniPlayIcon.innerHTML = playing ? '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
    }
    if (miniPlayer && 'IntersectionObserver' in window) {
      new IntersectionObserver(es => { deckVisible = es[0].isIntersecting; updateMini(); }, { threshold: 0.01 }).observe(deck);
    }
    if (miniPlayBtn) miniPlayBtn.addEventListener('click', () => playing ? (audio.pause(), setPlaying(false)) : play());

    /* — Media Session API: OS / browser media controls work even from other tabs — */
    function updateMediaSession() {
      if (!('mediaSession' in navigator) || !tracks.length) return;
      const tr = tracks[cur];
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: tr.name,
          artist: 'Lunchtime Dead',
          artwork: [{ src: tr.art || 'assets/cover.jpg', sizes: '512x512', type: 'image/jpeg' }]
        });
      } catch (e) {}
    }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play',  () => play());
      navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); setPlaying(false); });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        audio.currentTime > 3 ? (audio.currentTime = 0) : load(cur - 1, playing);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => next(false));
      try {
        navigator.mediaSession.setActionHandler('seekto', e => {
          if (audio.duration && e.seekTime != null) audio.currentTime = e.seekTime;
        });
        navigator.mediaSession.setActionHandler('seekforward',  e => {
          audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (e.seekOffset || 10));
        });
        navigator.mediaSession.setActionHandler('seekbackward', e => {
          audio.currentTime = Math.max(0, audio.currentTime - (e.seekOffset || 10));
        });
      } catch (e) {}
    }

    function setPlaying(v) {
      playing = v;
      deck.classList.toggle('playing', v);
      playIcon.innerHTML = v ? '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
      deckStatus.textContent = v ? t('deck.play') : (audio.currentTime > 0 ? t('deck.pause') : t('deck.stop'));
      updateMini();
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = v ? 'playing' : 'paused';
      document.dispatchEvent(new CustomEvent('ltd:deck', { detail: { playing: v, title: tracks[cur] && tracks[cur].name } }));
    }
    function load(i, autoplay) {
      if (!tracks.length) return;
      cur = (i + tracks.length) % tracks.length;
      const tr = tracks[cur];
      audio.src = tr.url;
      nowTitle.textContent = tr.name;
      if (nowArt) nowArt.src = tr.art || 'assets/cover.jpg';
      if (miniTitle) miniTitle.textContent = tr.name;
      if (miniArt) miniArt.src = tr.art || 'assets/cover.jpg';
      renderPlaylist();
      updateMediaSession();
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
        if (miniSeekFill) miniSeekFill.style.width = (p / 10) + '%';
        if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
          try {
            navigator.mediaSession.setPositionState({
              duration: audio.duration,
              playbackRate: audio.playbackRate,
              position: audio.currentTime
            });
          } catch (e) {}
        }
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

    /* — boot: play the fallback tape immediately, swap in the shared playlist once Supabase answers — */
    (async function boot() {
      tracks = FALLBACK_TRACKS.slice();
      load(0, false);
      nowTitle.textContent = tracks[0].name;
      const fetched = await fetchTracks();
      if (fetched !== FALLBACK_TRACKS) {
        tracks = fetched;
        renderPlaylist();
      }
    })();

    // start music softly after the intro if the user pressed play there
    document.addEventListener('intro:done', () => { /* user gesture happened — allow instant play on deck */ }, { once: true });
  }

  /* local-file mode: YouTube embed can't work (error 153) — show a poster instead */
  if (location.protocol === 'file:') {
    $$('.tv-screen iframe').forEach(fr => {
      const link = document.createElement('a');
      link.className = 'tv-poster';
      link.href = 'https://www.youtube.com/watch?v=mLlyXlstjaM';
      link.target = '_blank'; link.rel = 'noopener';
      link.innerHTML = '<img src="https://img.youtube.com/vi/mLlyXlstjaM/hqdefault.jpg" alt="clip">' +
        '<span class="tv-play">▶ WATCH ON YOUTUBE ・ 再生</span>';
      fr.replaceWith(link);
    });
    const note = $('.deck-note');
    if (note) note.textContent = 'Local preview: открой сайт через «Открыть сайт.command» или опубликуй его — тогда включатся визуализации и встроенный YouTube.';
  }

  applyLang();
})();
