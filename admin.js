/* ══════════════════════════════════════════════════════════════
   LUNCHTIME DEAD — admin panel
   All writes rely on Supabase RLS (is_admin()) for real enforcement;
   this file only decides what to *show* to a given session.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = s => { const d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; };

  const sb = window.LTDSupabase;
  const client = sb && sb.client;

  const loginCard = $('#loginCard'), deniedCard = $('#deniedCard'), panel = $('#panel');

  if (!client) {
    loginCard.querySelector('.admin-note').textContent =
      'Supabase isn’t configured yet (supabase-client.js has no URL/key). Set those first.';
    $('#loginForm').hidden = true;
    return;
  }

  function show(el) { [loginCard, deniedCard, panel].forEach(e => e.hidden = e !== el); }

  async function refreshAuthState() {
    const { data: { session } } = await client.auth.getSession();
    if (!session) { show(loginCard); return; }
    const admin = await sb.isAdmin();
    if (!admin) { show(deniedCard); return; }
    $('#whoami').textContent = session.user.email;
    show(panel);
    loadTracks(); loadGigs(); loadClips(); loadHero(); loadPostcards();
  }

  client.auth.onAuthStateChange(() => refreshAuthState());
  refreshAuthState();

  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim();
    const status = $('#loginStatus');
    status.textContent = 'Sending…';
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href } });
    status.textContent = error ? ('Error: ' + error.message) : 'Check your email for the magic link.';
  });
  $('#denySignOut').addEventListener('click', () => client.auth.signOut());
  $('#signOut').addEventListener('click', () => client.auth.signOut());

  function publicUrl(bucket, path) {
    return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  async function uploadFile(bucket, file) {
    const path = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const { error } = await client.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return publicUrl(bucket, path);
  }

  /* ─────────── tracks ─────────── */
  async function loadTracks() {
    const list = $('#trackList');
    const { data, error } = await client.from('tracks').select('*').order('position');
    if (error || !data || !data.length) { list.innerHTML = '<div class="admin-empty">No tracks yet.</div>'; return; }
    list.innerHTML = data.map(tr => `
      <div class="admin-row" data-id="${tr.id}">
        <span class="name">${esc(tr.name)}</span>
        <button type="button" class="del">DELETE</button>
      </div>`).join('');
    list.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', async () => {
      const id = btn.closest('.admin-row').dataset.id;
      await client.from('tracks').delete().eq('id', id);
      loadTracks();
    }));
  }
  $('#trackForm').addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('#trackStatus');
    const name = $('#trackName').value.trim();
    const audioFile = $('#trackAudio').files[0];
    const artFile = $('#trackArt').files[0];
    if (!name || !audioFile) return;
    status.textContent = 'Uploading…';
    try {
      const audio_url = await uploadFile('tracks-audio', audioFile);
      const art_url = artFile ? await uploadFile('track-art', artFile) : null;
      const { count } = await client.from('tracks').select('id', { count: 'exact', head: true });
      await client.from('tracks').insert({ name, audio_url, art_url, position: count || 0 });
      e.target.reset();
      status.textContent = 'Added.';
      loadTracks();
    } catch (err) { status.textContent = 'Error: ' + err.message; }
  });

  /* ─────────── gigs ─────────── */
  function fillGigForm(g) {
    $('#gigId').value = g.id || '';
    $('#gigDate').value = g.date || '';
    $('#gigVenue').value = g.venue || '';
    $('#gigCity').value = g.city || '';
    $('#gigNote').value = g.note || '';
    $('#gigTicketUrl').value = g.ticket_url || '';
    $('#gigTicketLabel').value = g.ticket_label || 'TICKETS';
    $('#gigIsPast').checked = !!g.is_past;
    $('#gigPosition').value = g.position || 0;
  }
  async function loadGigs() {
    const list = $('#gigAdminList');
    const { data, error } = await client.from('gigs').select('*').order('position');
    if (error || !data || !data.length) { list.innerHTML = '<div class="admin-empty">No concerts yet.</div>'; return; }
    list.innerHTML = data.map(g => `
      <div class="admin-row" data-id="${g.id}">
        <span class="name">${esc(g.date)} — ${esc(g.venue)}</span>
        <button type="button" class="edit">EDIT</button>
        <button type="button" class="del">DELETE</button>
      </div>`).join('');
    list.querySelectorAll('.edit').forEach(btn => btn.addEventListener('click', () => {
      const g = data.find(x => x.id === btn.closest('.admin-row').dataset.id);
      fillGigForm(g);
    }));
    list.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', async () => {
      await client.from('gigs').delete().eq('id', btn.closest('.admin-row').dataset.id);
      loadGigs();
    }));
  }
  $('#gigCancel').addEventListener('click', () => fillGigForm({}));
  $('#gigForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = $('#gigId').value;
    const fields = {
      date: $('#gigDate').value,
      venue: $('#gigVenue').value.trim(),
      city: $('#gigCity').value.trim(),
      note: $('#gigNote').value,
      ticket_url: $('#gigTicketUrl').value.trim() || null,
      ticket_label: $('#gigTicketLabel').value.trim() || 'TICKETS',
      is_past: $('#gigIsPast').checked,
      position: Number($('#gigPosition').value) || 0
    };
    if (id) await client.from('gigs').update(fields).eq('id', id);
    else await client.from('gigs').insert(fields);
    fillGigForm({});
    loadGigs();
  });

  /* ─────────── clips ─────────── */
  function fillClipForm(c) {
    $('#clipId').value = c.id || '';
    $('#clipTitle').value = c.title || '';
    $('#clipUrl').value = c.youtube_url || '';
    $('#clipLabel').value = c.watch_label || 'WATCH ON YOUTUBE ↗';
    $('#clipPosition').value = c.position || 0;
  }
  async function loadClips() {
    const list = $('#clipAdminList');
    const { data, error } = await client.from('clips').select('*').order('position');
    if (error || !data || !data.length) { list.innerHTML = '<div class="admin-empty">No clips yet.</div>'; return; }
    list.innerHTML = data.map(c => `
      <div class="admin-row" data-id="${c.id}">
        <span class="name">${esc(c.title)}</span>
        <button type="button" class="edit">EDIT</button>
        <button type="button" class="del">DELETE</button>
      </div>`).join('');
    list.querySelectorAll('.edit').forEach(btn => btn.addEventListener('click', () => {
      const c = data.find(x => x.id === btn.closest('.admin-row').dataset.id);
      fillClipForm(c);
    }));
    list.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', async () => {
      await client.from('clips').delete().eq('id', btn.closest('.admin-row').dataset.id);
      loadClips();
    }));
  }
  $('#clipCancel').addEventListener('click', () => fillClipForm({}));
  $('#clipForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = $('#clipId').value;
    const fields = {
      title: $('#clipTitle').value.trim(),
      youtube_url: $('#clipUrl').value.trim(),
      watch_label: $('#clipLabel').value.trim() || 'WATCH ON YOUTUBE ↗',
      position: Number($('#clipPosition').value) || 0
    };
    if (id) await client.from('clips').update(fields).eq('id', id);
    else await client.from('clips').insert(fields);
    fillClipForm({});
    loadClips();
  });

  /* ─────────── hero video ─────────── */
  async function loadHero() {
    const { data } = await client.from('site_settings').select('*').eq('id', 1).maybeSingle();
    $('#heroCurrent').textContent = data && data.hero_video_url
      ? 'Current: ' + data.hero_video_url
      : 'No custom hero video set — using the committed default.';
  }
  $('#heroForm').addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('#heroStatus');
    const videoFile = $('#heroVideo').files[0];
    const posterFile = $('#heroPoster').files[0];
    if (!videoFile && !posterFile) return;
    status.textContent = 'Uploading…';
    try {
      const fields = { id: 1 };
      if (videoFile) fields.hero_video_url = await uploadFile('hero-media', videoFile);
      if (posterFile) fields.hero_poster_url = await uploadFile('hero-media', posterFile);
      await client.from('site_settings').upsert(fields);
      e.target.reset();
      status.textContent = 'Updated.';
      loadHero();
    } catch (err) { status.textContent = 'Error: ' + err.message; }
  });

  /* ─────────── postcards moderation ─────────── */
  async function loadPostcards() {
    const list = $('#postcardList');
    // pending first (needs a decision), then newest first within each group
    const { data, error } = await client.from('postcards').select('*')
      .order('status', { ascending: true }).order('created_at', { ascending: false });
    if (error || !data || !data.length) { list.innerHTML = '<div class="admin-empty">No postcards yet.</div>'; return; }
    list.innerHTML = data.map(p => `
      <div class="admin-row admin-row--postcard" data-id="${p.id}">
        ${p.photo_url ? `<img class="admin-thumb" src="${esc(p.photo_url)}" alt="">` : ''}
        <span class="name">[${esc(p.status)}] ${esc(p.message)} ${p.name ? '— ' + esc(p.name) : ''}</span>
        ${p.status === 'pending' ? '<button type="button" class="approve">APPROVE</button><button type="button" class="reject">REJECT</button>' : ''}
        <button type="button" class="del">DELETE</button>
      </div>`).join('');
    list.querySelectorAll('.approve').forEach(btn => btn.addEventListener('click', async () => {
      await client.from('postcards').update({ status: 'approved' }).eq('id', btn.closest('.admin-row').dataset.id);
      loadPostcards();
    }));
    list.querySelectorAll('.reject').forEach(btn => btn.addEventListener('click', async () => {
      await client.from('postcards').update({ status: 'rejected' }).eq('id', btn.closest('.admin-row').dataset.id);
      loadPostcards();
    }));
    list.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', async () => {
      await client.from('postcards').delete().eq('id', btn.closest('.admin-row').dataset.id);
      loadPostcards();
    }));
  }
})();
