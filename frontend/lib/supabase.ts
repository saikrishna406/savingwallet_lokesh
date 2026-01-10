import { createClient } from '@supabase/supabase-js';

// Ideally these should be in .env.local, but for now we'll place them here to avoid gitignore issues during this session.
// Note: These are publishable keys, so they are safe to be on the client side, but generally better in env vars.
const supabaseUrl = 'https://thvckjqlweaezpabksgx.supabase.co';
const supabaseAnonKey = 'sb_publishable_tLiGqVInEfr0XilKSxK45A_rvZB929-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
