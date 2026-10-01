import type { User } from '@supabase/supabase-js';
import { setRememberMe, supabase } from '../lib/supabase';
import { clearAuth, login, setAuthInitialized } from '../store/slices/authSlice';
import { store } from '../store/store';
import { startCredits } from './credits';

const toUserData = (user: User) => ({
  uid:         user.id,
  email:       user.email ?? null,
  displayName: (user.user_metadata.display_name as string | undefined) ?? null,
  photoURL:    null,
});

export const signUpWithEmailAndPassword = async (email: string, password: string, rememberMe: boolean, displayName?: string) => {
  setRememberMe(rememberMe);
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
  if (error) throw error;
  // With email confirmation on, sign-up returns no session until the link is clicked.
  if (!data.session || !data.user) throw new Error('Check your email to confirm your account, then log in.');
  return toUserData(data.user);
};

export const signInWithEmail = async (email: string, password: string, rememberMe: boolean) => {
  setRememberMe(rememberMe);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return toUserData(data.user);
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ponytail: Google needs an OAuth client in the Supabase dashboard; then this is
// supabase.auth.signInWithOAuth({ provider: 'google' }).
export const signInWithGoogle = async (_rememberMe: boolean): Promise<ReturnType<typeof toUserData>> => {
  throw new Error('Google sign-in is coming soon. Please use email and password.');
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
