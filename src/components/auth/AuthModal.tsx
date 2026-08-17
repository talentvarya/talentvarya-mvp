import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { authenticateAdmin, confirmEmailActivation, requestEmailActivation } from '../../services/databaseService';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalRole, 
    setAuthModalRole,
    setUserRole,
    setCurrentUserEmail,
    setCurrentPage,
    showToast
  } = useApp();

  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [emailInput, setEmailInput] = useState('temp.candidate@talentvarya.test');
  const [phoneInput, setPhoneInput] = useState('9876543210');
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [devActivationToken, setDevActivationToken] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode !== 'email') {
      showToast('Email Test Mode', 'For this local database test, please continue with a temporary email.', 'info');
      return;
    }

    try {
      setIsSubmitting(true);
      if (authModalRole === 'admin') {
        await authenticateAdmin(emailInput, adminAccessCode);
        setIsAuthModalOpen(false);
        setCurrentUserEmail(emailInput.trim().toLowerCase());
        setUserRole('admin');
        setCurrentPage('admin-centre');
        showToast('Secure Admin Session Started', 'Admin permissions are active for this session.');
      } else {
        const activation = await requestEmailActivation(emailInput, authModalRole);
        setDevActivationToken(activation.devActivationToken || '');
        showToast(
          'Activation Link Created',
          activation.devActivationToken
            ? 'Local test mode: use the Activate Account button below. Production email delivery can be connected later.'
            : `An activation link has been sent to ${emailInput}.`,
          'info',
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save the temporary email.';
      showToast('Sign-In Not Completed', `${message} Make sure npm run dev is running.`, 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateAccount = async () => {
    if (!devActivationToken || authModalRole === 'admin') return;
    try {
      setIsSubmitting(true);
      const result = await confirmEmailActivation(devActivationToken);
      setCurrentUserEmail(result.user.email);
      setUserRole(result.user.role);
      setCurrentPage(result.user.role === 'candidate' ? 'candidate-dashboard' : 'employer-dashboard');
      setIsAuthModalOpen(false);
      setDevActivationToken('');
      showToast('Email Verified', `${result.user.email} is now active.`);
    } catch (error) {
      showToast('Activation Failed', error instanceof Error ? error.message : 'The activation link could not be confirmed.', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    showToast('Email Activation Required', 'Google sign-in is disabled in this MVP. Use the email activation flow above.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-8 text-center flex flex-col items-center">
          <BrandLogo size="lg" className="mb-2" />
          <p className="text-xs text-slate-500 mt-1">Sign in or create your verified account</p>

          {/* Primary Role Selector Tabs */}
          <div className="mt-5 grid grid-cols-3 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              id="auth-tab-candidate"
              type="button"
              onClick={() => {
                setAuthModalRole('candidate');
                setEmailInput('temp.candidate@talentvarya.test');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalRole === 'candidate' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Candidate (Job Seeker)
            </button>
            <button
              id="auth-tab-employer"
              type="button"
              onClick={() => {
                setAuthModalRole('employer');
                setEmailInput('temp.employer@talentvarya.test');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalRole === 'employer' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Employer (HireStream ATS)
            </button>
            <button
              id="auth-tab-admin"
              type="button"
              onClick={() => {
                setAuthModalRole('admin');
                setEmailInput('admin@talentvarya.test');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Secure Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 pt-2">
          {/* Sub Tab: Email vs Phone */}
          <div className="flex border-b border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => setAuthMode('email')}
              className={`pb-2 text-xs font-medium mr-6 transition-colors flex items-center gap-1.5 ${
                authMode === 'email' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('phone')}
              className={`pb-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                authMode === 'phone' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Mobile OTP
            </button>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {authMode === 'email' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work / Personal Email
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setDevActivationToken('');
                  }}
                  placeholder={authModalRole === 'employer' ? 'hr@company.com' : 'name@example.com'}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number (India)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-medium">
                    +91
                  </span>
                  <input
                    id="auth-phone-input"
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="98765 43210"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-r-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {authModalRole === 'admin' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Access Code
                </label>
                <input
                  type="password"
                  value={adminAccessCode}
                  onChange={(e) => setAdminAccessCode(e.target.value)}
                  placeholder="Configured in the server .env file"
                  required
                  autoComplete="one-time-code"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-700"
                />
                <p className="text-[10px] text-slate-500 mt-1">Only emails listed in TV_ADMIN_EMAILS are accepted.</p>
              </div>
            )}

            {/* Checkbox for marketing / notifications */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
              />
              <span className="text-[11px] text-slate-500 leading-tight">
                I agree to receive verified job alerts and WhatsApp updates from TalentVarya.
              </span>
            </label>

            {/* Submit Button */}
            {devActivationToken && authModalRole !== 'admin' && (
              <button
                type="button"
                onClick={handleActivateAccount}
                disabled={isSubmitting}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-75 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Activate Account (Local Test)
              </button>
            )}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white text-sm font-semibold py-2.5 rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{authModalRole === 'admin' ? 'Enter Admin Centre' : authMode === 'email' ? 'Send Email Activation Link' : 'Use Email Activation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 text-[10px] font-medium tracking-wider">
                OR
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            id="auth-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center gap-3 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Sign-In (Connect Later)</span>
          </button>

          {/* Safety Notice */}
          <div className="mt-5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-2 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Safety:</strong> Interview and offer-letter fees are never charged. The fifth daily application is the free limit; any paid add-on must be clearly shown by TalentVarya.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
