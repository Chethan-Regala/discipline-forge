import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.trim() !== '' && SUPABASE_ANON_KEY.trim() !== '');
};

// Create Supabase client only if configured
let supabaseClient: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    supabaseClient = null;
  }
}

// Helper to get Supabase client
export const getSupabase = (): SupabaseClient<Database> | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return supabaseClient;
};

// Export the client for direct access (will be null if not configured)
export const supabase = supabaseClient;
