import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Settings, 
  PlusCircle, 
  HelpCircle, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  DollarSign,
  ArrowRight,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmployerDashboard: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    setIsPostJobModalOpen, 
    setUserRole,
    jobs,
    employerCandidates,
    employerUsage,
    openCandidateReview,
    promotionalBanners,
    showToast 
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex text-left">
      
      {/* Left Employer ATS Sidebar (Screenshot 10) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          {/* Company Mini Banner */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              TV
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Employer Portal
              </span>
              <h4 className="text-xs font-bold text-white truncate">
                TechNova Solutions
              </h4>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setCurrentPage('employer-dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                currentPage === 'employer-dashboard' 
                  ? 'bg-emerald-600 text-white font-bold shadow-xs' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('employer-jobs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                currentPage === 'employer-jobs' 
                  ? 'bg-emerald-600 text-white font-bold shadow-xs' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Manage Jobs</span>
              </div>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('employer-candidates')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                currentPage === 'employer-candidates' 
                  ? 'bg-emerald-600 text-white font-bold shadow-xs' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Candidates Pipeline</span>
              </div>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                {employerCandidates.length}
              </span>
            </button>

            <button
              onClick={() => {
                showToast('Interviews', 'Navigating to interview calendar schedule...', 'info');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Interviews</span>
            </button>

            <button
              onClick={() => setCurrentPage('pricing')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span>Hiring Fees & Billing</span>
            </button>

            <button
              onClick={() => showToast('Admin-Managed Banners', 'Send your banner request to TalentVarya Admin for review and publishing.', 'info')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs">Banner Requests</span>
              </div>
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-black">
                Admin
              </span>
            </button>
          </nav>

          {/* Action Button: Post Job */}
          <div className="pt-2">
            <button
              id="employer-sidebar-post-btn"
              onClick={() => setIsPostJobModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 px-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a New Job</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-1 text-xs">
          <button
            onClick={() => setCurrentPage('help-center')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Center</span>
          </button>
          <button
            onClick={() => {
              setUserRole('guest');
              setCurrentPage('home');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Employer Dashboard Content */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl">
        
        {/* Top Header Row (Screenshot 10) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, TechNova
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here is an overview of your hiring progress and candidate pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('pricing')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs"
            >
              View Hiring Fees
            </button>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>
        </div>

        {/* Founding Employer Status & Quotas Card (Screenshot 10) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Founding Employer Status</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">14-day free access • 3 job posts • 12 unique resume views</p>
            </div>
            <button
              onClick={() => setCurrentPage('pricing')}
              className="text-xs font-bold text-emerald-700 hover:underline self-start sm:self-auto"
            >
              View Plan Details →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Jobs Quota */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Active Jobs Quota</span>
                <span className="font-bold text-slate-900">{employerUsage.jobPostsUsed} of {employerUsage.jobPostsMax} used</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (employerUsage.jobPostsUsed / employerUsage.jobPostsMax) * 100)}%` }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">{Math.max(0, employerUsage.jobPostsMax - employerUsage.jobPostsUsed)} free postings remaining</span>
            </div>

            {/* Resume View Quota */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Unique Resume Views</span>
                <span className="font-bold text-slate-900">{employerUsage.resumeViewsUsed} of {employerUsage.resumeViewsMax} used</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (employerUsage.resumeViewsUsed / employerUsage.resumeViewsMax) * 100)}%` }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">{Math.max(0, employerUsage.resumeViewsMax - employerUsage.resumeViewsUsed)} new resumes remaining before payment</span>
            </div>
          </div>
        </div>

        {/* Promo Card: Active Promo - First Hire Free (Screenshot 10) */}
        <div className="bg-emerald-950 text-white p-6 sm:p-7 rounded-3xl border border-emerald-900 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                ★ Active Promo
              </span>
              <h3 className="text-base font-bold text-white">First Hire Free (100% Waived)</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Your first successful placement fee is waived as a Founding Employer upon candidate completing 7 days.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-900/60 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-800">
              Status: Pending Hire
            </span>
          </div>
        </div>

        {/* Live Promotional Banners & Ad Campaign Hub */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Front Page Banners</span>
              </span>
              <span className="text-xs font-mono text-emerald-400">
                {promotionalBanners.filter(b => b.isActive).length} Active Campaigns Rotating
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Sponsor Your Company Logo & Mega Hiring Drive
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Showcase your brand with custom logos, live salary range tags, and direct fast-track candidate applications across our 50,000+ candidate audience.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => showToast('Banner Request Sent', 'TalentVarya Admin will review and create the banner. Employers cannot publish banners directly.', 'info')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Banner Placement</span>
            </button>
          </div>
        </div>

        {/* Bottom 3 Stat Metric Cards (Screenshot 10) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Successful Hires</span>
            <p className="text-3xl font-extrabold text-slate-900">14</p>
            <span className="text-xs font-semibold text-emerald-600">+2 this month</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending Confirmations</span>
            <p className="text-3xl font-extrabold text-slate-900">3</p>
            <span className="text-xs font-semibold text-amber-600">7-day safety window active</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Outstanding Fees</span>
            <p className="text-3xl font-extrabold text-slate-900">₹0</p>
            <span className="text-xs font-semibold text-emerald-600">No overdue balance</span>
          </div>
        </div>

        {/* Quick Candidates Preview */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Candidate Applications</h3>
              <p className="text-xs text-slate-500">Live feed of verified job seekers</p>
            </div>
            <button
              onClick={() => setCurrentPage('employer-candidates')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Go to Kanban Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {employerCandidates.slice(0, 3).map(cand => (
              <div key={cand.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={cand.avatarUrl} alt={cand.name} className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{cand.name}</h5>
                    <p className="text-[11px] text-slate-500">{cand.role} • {cand.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {cand.matchScore}% Match
                  </span>
                  <button
                    onClick={() => {
                      openCandidateReview(cand);
                    }}
                    className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                  >
                    Review Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
