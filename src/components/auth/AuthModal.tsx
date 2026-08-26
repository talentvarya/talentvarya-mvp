import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, KeyRound, Mail, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { sendPasswordReset, signIn, signUp, updatePassword } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalRole, setAuthModalRole, setUserRole, setCurrentUserEmail, setCurrentPage, updateCandidateProfile, showToast } = useApp();
  const [action, setAction] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setIsAuthModalOpen(true);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [setIsAuthModalOpen]);

  useEffect(() => {
    if (authModalRole === 'admin') setAction('signin');
  }, [authModalRole]);

  if (!isAuthModalOpen) return null;

  const finishLogin = (account: { email: string; role: 'candidate' | 'employer' | 'admin'; fullName: string }) => {
    if (authModalRole === 'admin' && account.role !== 'admin') {
      void supabase.auth.signOut();
      throw new Error('This account does not have administrator permission.');
    }
    setCurrentUserEmail(account.email);
    setUserRole(account.role);
    if (account.role === 'candidate') {
      const nameParts = account.fullName.trim().split(/\s+/).filter(Boolean);
      updateCandidateProfile({
        firstName: nameParts[0] || account.email.split('@')[0],
        lastName: nameParts.slice(1).join(' '),
        email: account.email,
      });
    }
    setCurrentPage(account.role === 'admin' ? 'admin-centre' : account.role === 'employer' ? 'employer-dashboard' : 'candidate-dashboard');
    setIsAuthModalOpen(false);
    setPassword('');
    showToast('Signed In', `Welcome to your ${account.role} dashboard.`);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      showToast('Password Required', 'Use at least 8 characters.', 'alert');
      return;
    }
    try {
      setIsSubmitting(true);
      if (recoveryMode) {
        await updatePassword(password);
        setRecoveryMode(false);
        setPassword('');
        setIsAuthModalOpen(false);
        showToast('Password Updated', 'You can now sign in with your new password.');
      } else if (action === 'signup' && authModalRole !== 'admin') {
        const result = await signUp(email, password, authModalRole, fullName);
        if (result.confirmationRequired) {
          setAction('signin');
          setPassword('');
          showToast('Check Your Email', 'Open the confirmation email, then return and sign in.', 'info');
        } else if (result.profile) {
          finishLogin(result.profile);
        }
      } else {
        finishLogin(await signIn(email, password));
      }
    } catch (error) {
      showToast('Authentication Failed', error instanceof Error ? error.message : 'Please try again.', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      showToast('Email Required', 'Enter your registered email first.', 'alert');
      return;
    }
    try {
      setIsSubmitting(true);
      await sendPasswordReset(email);
      showToast('Reset Email Sent', 'Check your inbox and open the password-reset link.', 'info');
    } catch (error) {
      showToast('Reset Not Sent', error instanceof Error ? error.message : 'Please try again.', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden relative">
        <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <div className="pt-8 pb-4 px-8 text-center flex flex-col items-center">
          <BrandLogo size="lg" className="mb-2" />
          <p className="text-xs text-slate-500 mt-1">{recoveryMode ? 'Choose your new password' : 'Secure account access powered by Supabase'}</p>
          {!recoveryMode && (
            <div className="mt-5 grid grid-cols-3 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full">
              {(['candidate', 'employer', 'admin'] as const).map(role => (
                <button key={role} type="button" onClick={() => setAuthModalRole(role)} className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${authModalRole === role ? role === 'admin' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-8 pb-8 pt-2">
          {!recoveryMode && authModalRole !== 'admin' && (
            <div className="grid grid-cols-2 bg-slate-100 rounded-lg p-1 mb-5">
              <button type="button" onClick={() => setAction('signin')} className={`py-2 text-xs font-bold rounded-md ${action === 'signin' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500'}`}>Sign In</button>
              <button type="button" onClick={() => setAction('signup')} className={`py-2 text-xs font-bold rounded-md ${action === 'signup' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500'}`}>Create Account</button>
            </div>
          )}
          {authModalRole === 'admin' && !recoveryMode && (
            <div className="mb-4 rounded-xl bg-slate-900 text-slate-100 p-3 flex gap-2 text-xs">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Only an account assigned the database role <strong>admin</strong> can enter the Admin Centre.</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {action === 'signup' && !recoveryMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            )}
            {!recoveryMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input id="auth-email-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="name@example.com" className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{recoveryMode ? 'New Password' : 'Password'}</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={recoveryMode || action === 'signup' ? 'new-password' : 'current-password'} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Minimum 8 characters.</p>
            </div>
            <button disabled={isSubmitting} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
              {isSubmitting ? 'Please wait…' : recoveryMode ? 'Save New Password' : action === 'signup' ? 'Create Account' : 'Sign In'}
              {!isSubmitting && (recoveryMode ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
            </button>
          </form>
          {!recoveryMode && action === 'signin' && (
            <button type="button" onClick={handleReset} disabled={isSubmitting} className="w-full mt-3 text-xs font-semibold text-emerald-700 hover:underline">Forgot password? Send reset email</button>
          )}
        </div>
      </div>
    </div>
  );
};
