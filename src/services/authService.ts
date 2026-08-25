import type { UserRole } from '../types';
import { supabase } from './supabaseClient';

export interface AuthenticatedTalentUser {
  id: string;
  email: string;
  role: Exclude<UserRole, 'guest'>;
}

async function loadProfile(userId: string): Promise<AuthenticatedTalentUser> {
  const { data, error } = await supabase
    .from('users')
    .select('id,email,role')
    .eq('id', userId)
    .single();

  if (error) throw new Error('Your account profile could not be loaded.');
  return data as AuthenticatedTalentUser;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.user) throw new Error(error?.message || 'Sign-in failed.');
  return loadProfile(data.user.id);
}

export async function signUp(
  email: string,
  password: string,
  role: 'candidate' | 'employer',
  fullName = '',
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { role, full_name: fullName.trim() } },
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Account could not be created.');
  if (!data.session) return { profile: null, confirmationRequired: true };
  return { profile: await loadProfile(data.user.id), confirmationRequired: false };
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: window.location.origin },
  );
  if (error) throw new Error(error.message);
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

export async function getCurrentTalentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return loadProfile(data.user.id);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

