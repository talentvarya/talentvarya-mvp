import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Globe, 
  Search, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Layers, 
  FileText,
  Mail,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { signOut } from '../../services/authService';

export const Header: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    currentPage, 
    setCurrentPage, 
    setIsAuthModalOpen, 
    setAuthModalRole,
    candidateProfile,
    notifications,
    setIsProfileSetupModalOpen,
    mockEmails,
    openEmailModal,
    setIsBannerManagerModalOpen,
    setIsPostJobModalOpen
  } = useApp();

  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadEmails = mockEmails.filter(e => !e.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Multi-Role Switcher / Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Verified Indian Job Network
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            Free for all candidates • No hidden placement fees
          </span>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'guest' && (
            <button
              id="secure-admin-login-btn"
              onClick={() => {
                setAuthModalRole('admin');
                setIsAuthModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800"
            >
              Secure Admin Login
            </button>
          )}
          {userRole !== 'guest' && (
            <>
              <span className="text-[11px] text-emerald-300 font-semibold capitalize">{userRole} session active</span>
              <button
                onClick={() => void signOut()}
                className="px-2 py-1 text-[11px] text-slate-300 hover:text-white border border-slate-700 rounded"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button 
            id="brand-logo-btn"
            onClick={() => {
              if (userRole === 'candidate') setCurrentPage('candidate-dashboard');
              else if (userRole === 'employer') setCurrentPage('employer-dashboard');
              else if (userRole === 'admin') setCurrentPage('admin-centre');
              else setCurrentPage('home');
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <BrandLogo size="md" />
            {userRole === 'employer' && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-1">
                HireStream ATS
              </span>
            )}
            {userRole === 'admin' && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 ml-1">
                Admin Ops
              </span>
            )}
          </button>

          {/* Public Nav Links (when in Public or Candidate mode) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <button 
              id="nav-home"
              onClick={() => setCurrentPage('home')}
              className={`hover:text-emerald-600 transition-colors ${currentPage === 'home' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Home
            </button>
            <button 
              id="nav-jobs"
              onClick={() => setCurrentPage('jobs')}
              className={`hover:text-emerald-600 transition-colors ${currentPage === 'jobs' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Jobs
            </button>
            <button 
              id="nav-pricing"
              onClick={() => setCurrentPage('pricing')}
              className={`hover:text-emerald-600 transition-colors ${currentPage === 'pricing' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Pricing
            </button>
            <button 
              id="nav-help"
              onClick={() => setCurrentPage('help-center')}
              className={`hover:text-emerald-600 transition-colors ${currentPage === 'help-center' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Career Resources
            </button>
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button 
            id="lang-toggle-btn"
            onClick={() => setLanguage(l => l === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language}</span>
          </button>

          {/* Guest Actions */}
          {userRole === 'guest' && (
            <div className="flex items-center gap-2">
              <button 
                id="header-login-btn"
                onClick={() => {
                  setAuthModalRole('candidate');
                  setIsAuthModalOpen(true);
                }}
                className="text-sm font-medium text-slate-700 hover:text-emerald-600 px-3 py-2 transition-colors"
              >
                Login
              </button>
              <button 
                id="header-register-btn"
                onClick={() => {
                  setAuthModalRole('candidate');
                  setIsAuthModalOpen(true);
                }}
                className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-xs transition-colors"
              >
                Register
              </button>
            </div>
          )}

          {/* Candidate Actions & Avatar */}
          {userRole === 'candidate' && (
            <div className="flex items-center gap-3">
              {/* Daily Quota Indicator */}
              <button 
                onClick={() => setCurrentPage('candidate-dashboard')}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800"
                title="Daily Verified Applications"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Quota: <strong>{candidateProfile.dailyApplicationsUsed}/{candidateProfile.dailyApplicationsMax}</strong>
                </span>
              </button>

              {/* Email Notification Button (Mock Email Service) */}
              <button
                id="header-email-inbox-btn"
                onClick={() => openEmailModal()}
                className="p-2 text-slate-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50 relative transition-colors"
                title="Mock Email Notification Center"
              >
                <Mail className="w-5 h-5" />
                {unreadEmails > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="notif-bell-candidate"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-800">Notifications</span>
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          openEmailModal();
                        }}
                        className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email Inbox ({mockEmails.length})</span>
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="py-2 text-xs">
                          <p className="font-medium text-slate-800">{n.title}</p>
                          <p className="text-slate-500 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  id="candidate-avatar-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-500 transition-all"
                >
                  <img 
                    src={candidateProfile.avatarUrl} 
                    alt={candidateProfile.firstName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden md:inline text-sm font-medium text-slate-800">
                    {candidateProfile.firstName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{candidateProfile.firstName} {candidateProfile.lastName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{candidateProfile.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage('candidate-dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Candidate Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('candidate-applications');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      My Applications (3)
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileSetupModalOpen(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Edit Profile (85%)
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        void signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Employer Actions */}
          {userRole === 'employer' && (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="header-email-inbox-employer-btn"
                onClick={() => openEmailModal()}
                className="p-2 text-slate-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50 relative transition-colors"
                title="Mock Email Notification Center"
              >
                <Mail className="w-5 h-5" />
                {unreadEmails > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>
              <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Founding Employer [Verified]
              </span>
              <button
                id="header-post-job-cta"
                onClick={() => setIsPostJobModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>+</span> Post a Job
              </button>
            </div>
          )}

          {/* Admin Actions */}
          {userRole === 'admin' && (
            <div className="flex items-center gap-2">
              <button
                id="header-banner-manager-admin-btn"
                onClick={() => setIsBannerManagerModalOpen(true)}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="Promotional Banners Control"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Manage Banners</span>
              </button>
              <span className="px-2.5 py-1 bg-slate-900 text-slate-100 text-xs font-semibold rounded-md border border-slate-700">
                Global Operations
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
