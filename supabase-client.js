/* ══════════════════════════════════════════════════════════════
   LUNCHTIME DEAD — shared Supabase client
   Public URL + anon key are safe to commit: they're protected by
   Row Level Security (see supabase/schema.sql), not by secrecy.
   Fill these in after creating the Supabase project (see plan/README).
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const SUPABASE_URL = '';       // e.g. 'https://xxxxxxxx.supabase.co'
  const SUPABASE_ANON_KEY = '';  // Project Settings → API → anon public key

  let client = null;
  if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async function isAdmin() {
    if (!client) return false;
    // calls the security-definer is_admin() function from schema.sql via RPC —
    // no read policy needed on the admins table itself (keeps the allowlist private).
    const { data, error } = await client.rpc('is_admin');
    return !error && data === true;
  }

  window.LTDSupabase = { client, isAdmin };
})();
