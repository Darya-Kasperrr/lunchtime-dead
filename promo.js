/* ══════════════════════════════════════════════════════════════
   LUNCHTIME DEAD — interactive promo reel
   3D logo ・ auto-cinematography ・ drag to spin ・ music-reactive
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (!window.THREE) { document.getElementById('gate').innerHTML = '<span class="osd">WEBGL UNAVAILABLE</span>'; return; }

  /* ---------- renderer / scene ---------- */
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050409);
  scene.fog = new THREE.FogExp2(0x0a0714, 0.045);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);

  function size() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  size(); addEventListener('resize', size);

  /* ---------- glow sprite helper ---------- */
  function glowTex(r, g, b) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    const gr = x.createRadialGradient(128, 128, 8, 128, 128, 128);
    gr.addColorStop(0, `rgba(${r},${g},${b},.6)`);
    gr.addColorStop(.5, `rgba(${r},${g},${b},.16)`);
    gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  /* ---------- 3D logo (same recipe as the intro) ---------- */
  const logoGroup = new THREE.Group();
  scene.add(logoGroup);
  let logoMats = null;
  (function buildLogo() {
    try {
      if (!window.LTD_LOGO_SVG || !THREE.SVGLoader) throw 0;
      const data = new THREE.SVGLoader().parse(window.LTD_LOGO_SVG);
      const shapes = [], holePts = [];
      data.paths.forEach(p => {
        const fill = String((p.userData.style || {}).fill || '').toLowerCase();
        const isWhite = fill.includes('100%') || fill === '#ffffff' || fill === '#fff' || fill === 'white' || fill.includes('255');
        if (isWhite) p.subPaths.forEach(sp => holePts.push(sp.getPoints(24)));
        else THREE.SVGLoader.createShapes(p).forEach(s => shapes.push(s));
      });
      holePts.forEach(pts => {
        const c = new THREE.Box2().setFromPoints(pts).getCenter(new THREE.Vector2());
        for (const s of shapes) {
          const sp = s.getPoints(24);
          if (new THREE.Box2().setFromPoints(sp).containsPoint(c)) {
            const rev = THREE.ShapeUtils.isClockWise(sp) === THREE.ShapeUtils.isClockWise(pts) ? pts.slice().reverse() : pts;
            s.holes.push(new THREE.Path(rev));
            break;
          }
        }
      });
      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth: 110, bevelEnabled: true, bevelThickness: 12, bevelSize: 9,
        bevelSegments: 2, curveSegments: 10
      });
      geo.computeBoundingBox();
      const sz = new THREE.Vector3(); geo.boundingBox.getSize(sz);
      const ctr = geo.boundingBox.getCenter(new THREE.Vector3());
      geo.translate(-ctr.x, -ctr.y, -ctr.z);
      logoMats = [
        new THREE.MeshBasicMaterial({ color: 0xfff1f6, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ color: 0xff4f83, side: THREE.DoubleSide })
      ];
      const mesh = new THREE.Mesh(geo, logoMats);
      const k = 8.0 / sz.x;
      mesh.scale.set(k, -k, k);
      logoGroup.add(mesh);
    } catch (e) { // fallback: flat glowing billboard
      const tex = new THREE.TextureLoader().load('assets/logo-white.png');
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 7.4),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
      );
      logoGroup.add(m);
    }
  })();
  logoGroup.position.set(0, 0.6, 0);

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(255, 92, 138), transparent: true, depthWrite: false }));
  halo.scale.set(22, 14, 1);
  halo.position.set(0, 0.6, -1.2);
  scene.add(halo);

  /* teal counter-light behind, like a bar doorway */
  const backGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(156, 198, 201), transparent: true, depthWrite: false, opacity: .5 }));
  backGlow.scale.set(30, 18, 1);
  backGlow.position.set(-4, -1, -8);
  scene.add(backGlow);

  /* retro grid floor */
  const grid = new THREE.GridHelper(160, 80, 0x4c8a90, 0x1a2a30);
  grid.position.y = -3.6;
  scene.add(grid);

  /* rain */
  const RAIN = 1800;
  const rainGeo = new THREE.BufferGeometry();
  const rp = new Float32Array(RAIN * 3);
  for (let i = 0; i < RAIN; i++) {
    rp[i * 3] = (Math.random() - 0.5) * 70;
    rp[i * 3 + 1] = Math.random() * 34 - 4;
    rp[i * 3 + 2] = Math.random() * 60 - 30;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const rain = new THREE.Points(rainGeo, new THREE.PointsMaterial({ color: 0x9cc6c9, size: 0.05, transparent: true, opacity: 0.5 }));
  scene.add(rain);

  /* ---------- audio ---------- */
  const audio = new Audio('assets/tsubame.mp3');
  audio.loop = true;
  let actx = null, analyser = null, dataArr = null, AMP = 0;
  function initAudio() {
    if (location.protocol === 'file:') return; // keep sound audible in local preview
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = actx.createAnalyser();
      analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.82;
      dataArr = new Uint8Array(analyser.frequencyBinCount);
      actx.createMediaElementSource(audio).connect(analyser);
      analyser.connect(actx.destination);
    } catch (e) {}
  }

  /* ---------- captions (the "trailer" script) ---------- */
  const CAPS = [
    { at: 1.0, jp: 'ランチタイム・デッド', en: 'LUNCHTIME DEAD' },
    { at: 7.0, jp: 'シティ・ポップ × パンク', en: 'CITY POP × PUNK ・ TOKYO' },
    { at: 13.0, jp: '街が忘れる時間のための音楽', en: 'MUSIC FOR THE HOUR THE CITY FORGETS' },
    { at: 19.0, jp: '新曲「ツバメ・ビッグ・ジョイ」', en: 'NEW SINGLE ・ TSUBAME BIG JOY' },
    { at: 25.0, jp: '8.14 下北沢 SHELTER', en: 'LIVE ・ AUG 14 ・ SHIMOKITAZAWA SHELTER' },
    { at: 31.0, jp: '深夜のバーで会いましょう', en: 'SEE YOU AT THE MIDNIGHT BAR' }
  ];
  const LOOP = 37;
  const cap = document.getElementById('cap');
  const capJp = document.getElementById('capJp');
  const capEn = document.getElementById('capEn');
  let capIdx = -1;
  function updateCaption(tt) {
    const tl = tt % LOOP;
    let idx = -1;
    for (let i = 0; i < CAPS.length; i++) if (tl >= CAPS[i].at && tl < CAPS[i].at + 5) idx = i;
    if (idx !== capIdx) {
      capIdx = idx;
      if (idx < 0) cap.classList.remove('show');
      else {
        cap.classList.remove('show');
        setTimeout(() => {
          capJp.textContent = CAPS[idx].jp;
          capEn.textContent = CAPS[idx].en;
          cap.classList.add('show');
        }, 180);
      }
    }
  }

  /* ---------- interaction: drag to spin ---------- */
  let dragging = false, lastX = 0, lastY = 0;
  let userRotY = 0, userRotX = 0, velY = 0, velX = 0, lastInteract = -10;
  canvas.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  addEventListener('pointerup', () => dragging = false);
  addEventListener('pointermove', e => {
    if (!dragging) return;
    velY = (e.clientX - lastX) * 0.006;
    velX = (e.clientY - lastY) * 0.004;
    userRotY += velY; userRotX += velX;
    lastX = e.clientX; lastY = e.clientY;
    lastInteract = clockT;
  });
  addEventListener('wheel', e => {
    camDist = Math.max(8, Math.min(26, camDist + e.deltaY * 0.01));
    lastInteract = clockT;
  }, { passive: true });

  /* ---------- start gate ---------- */
  const gate = document.getElementById('gate');
  document.getElementById('gateBtn').addEventListener('click', () => {
    initAudio();
    if (actx && actx.state === 'suspended') actx.resume();
    audio.play().catch(() => {});
    gate.classList.add('gone');
    setTimeout(() => gate.remove(), 700);
  });

  /* ---------- loop ---------- */
  const tc = document.getElementById('tc');
  let clockT = 0, camDist = 17, shot = -1;
  const t0 = performance.now();

  function loop(now) {
    requestAnimationFrame(loop);
    const t = (now - t0) / 1000;
    const dt = Math.min(0.05, t - clockT);
    clockT = t;

    /* audio level */
    let level = 0;
    if (analyser && !audio.paused) {
      analyser.getByteFrequencyData(dataArr);
      let s = 0; const n = dataArr.length >> 1;
      for (let i = 0; i < n; i++) s += dataArr[i];
      level = s / n / 255;
    }
    AMP += (level - AMP) * 0.2;

    /* cinematography: numbered shots, auto unless the user grabbed it */
    const mt = audio.paused ? t : audio.currentTime;
    const shotIdx = Math.floor((mt % LOOP) / 6.2);
    const auto = (t - lastInteract) > 4;
    if (auto) {
      // ease user rotation back home
      userRotY *= 0.985; userRotX *= 0.985;
      const st = (mt % LOOP) / LOOP * Math.PI * 2;
      const presets = [
        { a: Math.sin(st) * 0.5, h: 0.6, d: 17 },
        { a: 0.9, h: 2.4, d: 13 },
        { a: -0.8, h: -0.6, d: 12 },
        { a: Math.sin(st * 2) * 0.25, h: 0.2, d: 9.5 },
        { a: 0.4, h: 1.4, d: 20 },
        { a: 0, h: 0.4, d: 15 }
      ];
      const p = presets[shotIdx % presets.length];
      camDist += (p.d - camDist) * dt * 0.8;
      camTargA += (p.a - camTargA) * dt * 0.8;
      camTargH += (p.h - camTargH) * dt * 0.8;
    }
    camera.position.x = Math.sin(camTargA) * camDist;
    camera.position.z = Math.cos(camTargA) * camDist;
    camera.position.y = camTargH + Math.sin(t * 0.4) * 0.3 + AMP * 0.5;
    camera.lookAt(0, 0.6, 0);

    /* logo: user spin + idle drift + music pulse */
    logoGroup.rotation.y = userRotY + (auto ? Math.sin(t * 0.22) * 0.14 : 0);
    logoGroup.rotation.x = Math.max(-0.6, Math.min(0.6, userRotX));
    const pulse = 1 + AMP * 0.06;
    logoGroup.scale.set(pulse, pulse, pulse);
    if (logoMats) {
      logoMats[1].color.setHSL(0.93, 0.85, 0.55 + AMP * 0.25);
    }
    halo.material.opacity = 0.75 + AMP * 0.5 + (Math.random() > 0.985 ? -0.4 : 0);
    halo.scale.set(22 * (1 + AMP * 0.5), 14 * (1 + AMP * 0.5), 1);
    backGlow.material.opacity = 0.35 + AMP * 0.3;

    /* rain fall, faster with the beat */
    const arr = rainGeo.attributes.position.array;
    for (let i = 0; i < RAIN; i++) {
      arr[i * 3 + 1] -= (0.3 + (i % 7) * 0.02) * (1 + AMP);
      if (arr[i * 3 + 1] < -4) arr[i * 3 + 1] = 30;
    }
    rainGeo.attributes.position.needsUpdate = true;

    /* chrome */
    updateCaption(mt);
    const fr = Math.floor((mt % 1) * 24);
    const ss = Math.floor(mt % 60), mm = Math.floor(mt / 60) % 60;
    tc.textContent = `00:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;

    renderer.render(scene, camera);
  }
  let camTargA = 0, camTargH = 0.6;
  requestAnimationFrame(loop);
})();
