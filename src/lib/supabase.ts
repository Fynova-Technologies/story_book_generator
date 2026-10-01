import { createClient } from '@supabase/supabase-js';

// "Remember me" off keeps the session in sessionStorage, so it ends with the browser tab.
const REMEMBER_KEY = 'storybook_remember_me';
export const setRememberMe = (remember: boolean) => localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');

const sessionStore = {
  getItem:    (key: string) => localStorage.getItem(key) ?? sessionStorage.getItem(key),
  setItem:    (key: string, value: string) =>
    (localStorage.getItem(REMEMBER_KEY) === '0' ? sessionStorage : localStorage).setItem(key, value),
  removeItem: (key: string) => { localStorage.removeItem(key); sessionStorage.removeItem(key); },
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { storage: sessionStore } },
);

export const BUCKET = 'stories';
