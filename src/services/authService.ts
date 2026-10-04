import type { User } from '@supabase/supabase-js';
import { setRememberMe, supabase } from '../lib/supabase';
import { clearAuth, login, setAuthInitialized } from '../store/slices/authSlice';
import { store } from '../store/store';
import { startCredits } from './credits';

const toUserData = (user: User) => ({
  uid:         user.id,
  email:       user.email ?? null,
  displayName: (user.user_metadata.display_name ?? user.user_metadata.full_name ?? null) as string | null,
  photoURL:    null,
});

export const signUpWithEmailAndPassword = async (email: string, password: string, rememberMe: boolean, displayName?: string) => {
  setRememberMe(rememberMe);
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
  if (error) throw error;
  // With email confirmation on, sign-up returns no session until the link is clicked.
  if (!data.session || !data.user) return { needsConfirmation: true as const };
  return { needsConfirmation: false as const, user: toUserData(data.user) };
};

export const signInWithEmail = async (email: string, password: string, rememberMe: boolean) => {
  setRememberMe(rememberMe);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return toUserData(data.user);
};

// Leaves the page; on return the client picks the session out of the URL and initAuthListener logs the user in.
export const signInWithGoogle = async () => {
  setRememberMe(true);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/dashboard` },
  });
  if (error) throw error;
};

export const sendPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const initAuthListener = () => {
  let currentUserId: string | null = null;
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      store.dispatch(login({ userData: toUserData(session.user) }));
      if (currentUserId !== session.user.id) startCredits(session.user.id);
      currentUserId = session.user.id;
    } else {
      store.dispatch(clearAuth());
      currentUserId = null;
    }
    store.dispatch(setAuthInitialized());
  });
};
