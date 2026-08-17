import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Bookmark, 
  Sparkles, 
  MessageSquare, 
  FileUp, 
  HelpCircle, 
  LogOut, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Clock, 
  MapPin, 
  DollarSign,
  ShieldCheck,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CandidateDashboard: React.FC = () => {
  const { 
    candidateProfile, 
    currentPage, 
    setCurrentPage, 
    jobs, 
    savedJobIds, 
    toggleSaveJob, 
    setSelectedJobId, 
    setIsApplyModalOpen, 
    setIsProfileSetupModalOpen, 
    setUserRole,
    showToast 
  } = useApp();

  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));
  const recommendedJobs = jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex text-left">
      
      {/* Left Candidate Sidebar (Screenshot 4) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          {/* User Profile Mini Banner */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center gap-3">
            <img 
              src={candidateProfile.avatarUrl} 
              alt={candidateProfile.firstName} 
              className="w-10 h-10 rounded-full object-cover border border-emerald-500"
            />
            <div className="overflow-hidden">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Candidate Portal
              </span>
              <h4 className="text-xs font-bold text-white truncate">
                {candidateProfile.firstName} {candidateProfile.lastName}
              </h4>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setCurrentPage('candidate-dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                currentPage === 'candidate-dashboard' 
                  ? 'bg-emerald-600 text-white font-bold shadow-xs' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('candidate-applications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                currentPage === 'candidate-applications' 
                  ? 'bg-emerald-600 text-white font-bold shadow-xs' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>My Applications</span>
              </div>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                3
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('jobs')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Verified Jobs</span>
            </button>

            <button
              onClick={() => {
                showToast('Messages', 'You have no unread recruiter messages.', 'info');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </button>
          </nav>

          {/* Action Button: Upload Resume */}
          <div className="pt-2">
            <button
              onClick={() => setIsProfileSetupModalOpen(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-emerald-400" />
              <span>Update Resume</span>
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

      {/* Main Candidate Content Area */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl">
        
        {/* Top Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {candidateProfile.firstName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here is an overview of your verified career progress today.
            </p>
          </div>

          <button
            onClick={() => setIsProfileSetupModalOpen(true)}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* 2 Top Key Stats Cards (Screenshot 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Today's Applications Quota Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Today's Applications</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {candidateProfile.dailyApplicationsMax - candidateProfile.dailyApplicationsUsed} Remaining
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {candidateProfile.dailyApplicationsUsed}
                  <span className="text-base font-medium text-slate-400"> of {candidateProfile.dailyApplicationsMax} used</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">60% Used</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(candidateProfile.dailyApplicationsUsed / candidateProfile.dailyApplicationsMax) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Resets tonight at 12:00 AM IST • Verified safe application quota
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('jobs')}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Verified Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Profile Strength Widget (85% Ring) (Screenshot 4) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Profile Strength</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                85% Strong
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* Circular Gauge Simulation */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="85, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-slate-900">85%</span>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 text-xs text-slate-600 flex-1">
                <div className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resume Uploaded</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Skills Tagged</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                  <span>Add GitHub / Portfolio Link</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsProfileSetupModalOpen(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Update Profile Details
            </button>
          </div>

        </div>

        {/* Recommended Jobs Section (Screenshot 4) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
            <button
              onClick={() => setCurrentPage('jobs')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map(job => (
              <div 
                key={job.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-xl object-cover border" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">₹{job.salaryMinLPA}L - ₹{job.salaryMaxLPA}L</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{job.workMode}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setCurrentPage('job-details');
                      }}
                      className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setIsApplyModalOpen(true);
                      }}
                      className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Saved Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recently Saved ({savedJobs.length})</h2>
            <button
              onClick={() => setCurrentPage('jobs')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Browse More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.slice(0, 2).map(job => (
              <div key={job.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={job.companyLogo} alt={job.company} className="w-9 h-9 rounded-lg object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{job.title}</h5>
                    <p className="text-[11px] text-slate-500">{job.company} • ₹{job.salaryMinLPA}L - ₹{job.salaryMaxLPA}L</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setIsApplyModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
