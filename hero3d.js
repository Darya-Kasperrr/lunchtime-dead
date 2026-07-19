/* ══════════════════════════════════════════════════════════════
   HERO 3D LOGO — drag/touch to spin, neon on/off switch (+ sound)
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const signWrap = $('#signWrap');
  const switchBtn = $('#neonSwitch');
  const img = $('#neonLogoImg');
  const canvas = $('#heroLogo3d');
  if (!signWrap || !switchBtn) return;

  /* ---------- neon on/off state (shared by 3D + flat-image fallback) ---------- */
  let neonOn = localStorage.getItem('ltd-neon') !== 'off';
  function reflectNeonUI() {
    switchBtn.setAttribute('aria-pressed', String(neonOn));
    signWrap.classList.toggle('neon-off', !neonOn);
  }
  reflectNeonUI();

  /* ---------- synthesized neon-tube sound ---------- */
  let sfxCtx = null;
  function sfxContext() {
    if (!sfxCtx) {
      try { sfxCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    return sfxCtx;
  }
  function playNeonOn() {
    const ac = sfxContext(); if (!ac) return;
    const t0 = ac.currentTime;
    const master = ac.createGain();
    master.gain.setValueAtTime(0, t0);
    master.connect(ac.destination);

    /* crackle: short filtered noise burst — the tube striking */
    const len = Math.floor(ac.sampleRate * 0.22);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const noise = ac.createBufferSource(); noise.buffer = buf;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 0.7;
    const noiseGain = ac.createGain(); noiseGain.gain.value = 0.5;
    noise.connect(bp).connect(noiseGain).connect(master);
    noise.start(t0);

    /* hum: rising 55Hz-ish buzz that settles then fades */
    const hum = ac.createOscillator(); hum.type = 'sawtooth';
    hum.frequency.setValueAtTime(38, t0);
    hum.frequency.exponentialRampToValueAtTime(55, t0 + 0.18);
    const humLP = ac.createBiquadFilter(); humLP.type = 'lowpass'; humLP.frequency.value = 320;
    const humGain = ac.createGain(); humGain.gain.value = 0.22;
    hum.connect(humLP).connect(humGain).connect(master);
    hum.start(t0);
    hum.stop(t0 + 1.4);

    master.gain.linearRampToValueAtTime(0.5, t0 + 0.03);
    master.gain.linearRampToValueAtTime(0.16, t0 + 0.22);
    master.gain.linearRampToValueAtTime(0.0001, t0 + 1.3);
  }
  function playNeonOff() {
    const ac = sfxContext(); if (!ac) return;
    const t0 = ac.currentTime;
    const click = ac.createOscillator(); click.type = 'square';
    click.frequency.setValueAtTime(180, t0);
    click.frequency.exponentialRampToValueAtTime(60, t0 + 0.08);
    const g = ac.createGain(); g.gain.setValueAtTime(0.18, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
    click.connect(g).connect(ac.destination);
    click.start(t0); click.stop(t0 + 0.12);
  }

  switchBtn.addEventListener('click', () => {
    neonOn = !neonOn;
    localStorage.setItem('ltd-neon', neonOn ? 'on' : 'off');
    reflectNeonUI();
    if (neonOn) playNeonOn(); else playNeonOff();
  });

  /* ---------- 3D logo (progressive enhancement) ---------- */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.THREE || !window.THREE.SVGLoader || !window.LTD_LOGO_SVG || !canvas) return;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 15);

  function sizeRenderer() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function glowTex(r, g, b) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    const gr = x.createRadialGradient(128, 128, 8, 128, 128, 128);
    gr.addColorStop(0, `rgba(${r},${g},${b},.65)`);
    gr.addColorStop(.5, `rgba(${r},${g},${b},.18)`);
    gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  const logoGroup = new THREE.Group();
  scene.add(logoGroup);
  let logoMats = null, built = false;
  try {
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
    const k = 9.6 / sz.x;
    mesh.scale.set(-k, -k, k);
    logoGroup.add(mesh);
    built = true;
  } catch (e) { built = false; }

  if (!built) { try { renderer.dispose(); } catch (e) {} return; }

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(255, 92, 138), transparent: true, depthWrite: false }));
  halo.scale.set(15, 10, 1);
  halo.position.set(0, 0, -1);
  scene.add(halo);

  /* ---------- drag / touch to spin — horizontal only, so vertical page scroll still works ---------- */
  let dragging = false, lastX = 0;
  let rotY = Math.PI, velY = 0;
  let pointerId = null;
  // idle behaviour: sit still, gently sway left/right around wherever it was last left
  let swayBase = rotY, swaying = true, swayPhase = 0;
  const SWAY_AMP = 0.16, SWAY_SPEED = 0.35;
  canvas.addEventListener('pointerdown', e => {
    dragging = true; swaying = false; lastX = e.clientX;
    pointerId = e.pointerId;
    try { canvas.setPointerCapture(pointerId); } catch (er) {}
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    velY = dx * 0.008;
    rotY += velY;
    lastX = e.clientX;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { if (pointerId != null) canvas.releasePointerCapture(pointerId); } catch (er) {}
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { if (!canvas.hasPointerCapture || !dragging) return; });

  /* ---------- neon lit-state (materials + halo fade in/out) ---------- */
  let litT = 1; // eased toward 1 (on) or 0 (off)

  /* ---------- resize + visibility ---------- */
  sizeRenderer();
  addEventListener('resize', sizeRenderer);
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.01 }).observe(canvas);
  }

  canvas.classList.add('ready');
  if (img) img.classList.add('has-3d');

  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    if (!visible) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!dragging) {
      const coasting = Math.abs(velY) > 0.0008;
      if (coasting) {
        // flick momentum from the drag, decaying to a stop
        rotY += velY * dt * 4;
        velY *= 0.9;
        swaying = false;
      } else if (!reduced) {
        if (!swaying) { swayBase = rotY; swayPhase = 0; swaying = true; }
        swayPhase += dt * SWAY_SPEED;
        rotY = swayBase + Math.sin(swayPhase) * SWAY_AMP;
      }
    }
    logoGroup.rotation.y = rotY;

    litT += ((neonOn ? 1 : 0) - litT) * Math.min(1, dt * 5);
    const dim = 0.12 + litT * 0.88;
    if (logoMats) {
      logoMats[0].color.setRGB(dim, 0.94 * dim + 0.06 * (1 - dim) * 0.2, dim);
      logoMats[1].color.setRGB(1 * dim, (0.31 + 0.02) * dim, 0.51 * dim);
    }
    halo.material.opacity = litT * 0.85;
    halo.scale.set(15 * (0.9 + litT * 0.1), 10 * (0.9 + litT * 0.1), 1);
    canvas.style.opacity = (0.3 + litT * 0.7).toFixed(3); /* fade the whole 3D canvas with neon state */

    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
})();
