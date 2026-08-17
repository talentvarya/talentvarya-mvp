import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight, 
  Building2, 
  MapPin, 
  FileText, 
  Video, 
  LayoutDashboard, 
  Sparkles, 
  HelpCircle, 
  LogOut, 
  FileUp,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CandidateApplications: React.FC = () => {
  const { 
    candidateApplications, 
    candidateProfile, 
    currentPage, 
    setCurrentPage, 
    setIsProfileSetupModalOpen, 
    setUserRole,
    openEmailModal,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'interviews'>('active');
  const [selectedAppForModal, setSelectedAppForModal] = useState<any | null>(null);

  const stages = [
    { key: 'applied', label: 'Applied' },
    { key: 'review', label: 'In Review' },
    { key: 'interview', label: 'Interviewing' },
    { key: 'offer', label: 'Offer' }
  ];

  const getStageIndex = (stage: string) => {
    switch (stage) {
      case 'applied': return 0;
      case 'review': return 1;
      case 'interview': return 2;
      case 'offer': return 3;
      case 'hired': return 4;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-left">
      
      {/* Left Candidate Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          {/* Mini User Banner */}
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
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('candidate-applications')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>My Applications</span>
              </div>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                {candidateApplications.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('jobs')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Verified Jobs</span>
            </button>
          </nav>

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

      {/* Main Applications Content */}
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        
        {/* Header & Quota */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Job Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track your real-time recruitment pipeline across verified Indian companies.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold self-start sm:self-auto">
            <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Today's Applications: {candidateProfile.dailyApplicationsUsed} of {candidateProfile.dailyApplicationsMax} used
            </span>
          </div>
        </div>

        {/* Filter Tabs: Active Applications vs Interview Schedule (Screenshot 5) */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 mr-8 flex items-center gap-2 transition-all ${
              activeTab === 'active' 
                ? 'text-emerald-600 border-b-2 border-emerald-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Active Applications</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
              {candidateApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className={`pb-3 flex items-center gap-2 transition-all ${
              activeTab === 'interviews' 
                ? 'text-emerald-600 border-b-2 border-emerald-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Interview Schedule</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
              1 Upcoming
            </span>
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-5">
          {candidateApplications.map((app) => {
            const currentIdx = getStageIndex(app.stage);

            return (
              <div 
                key={app.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5"
              >
                {/* Top Role & Status Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={app.companyLogo} 
                      alt={app.company} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{app.jobTitle}</h3>
                      <p className="text-xs text-slate-500">{app.company} • {app.location}</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 text-xs font-bold rounded-full self-start sm:self-auto border ${
                    app.stage === 'interview' 
                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                      : app.stage === 'review'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {app.stage === 'interview' ? '★ Interviewing' : app.stage === 'review' ? 'In Review' : 'Applied'}
                  </span>
                </div>

                {/* Pipeline Stages Tracker (Screenshot 5) */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {stages.map((stg, sIdx) => {
                      const isCompleted = sIdx < currentIdx;
                      const isActive = sIdx === currentIdx;

                      return (
                        <div key={stg.key} className="space-y-1.5">
                          <div className={`h-1.5 rounded-full ${
                            isCompleted 
                              ? 'bg-emerald-500' 
                              : isActive 
                                ? app.stage === 'interview' ? 'bg-amber-500' : 'bg-slate-900' 
                                : 'bg-slate-200'
                          }`} />
                          <span className={`text-[11px] block font-medium ${
                            isCompleted 
                              ? 'text-emerald-700 font-bold' 
                              : isActive 
                                ? 'text-slate-900 font-bold' 
                                : 'text-slate-400'
                          }`}>
                            {stg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Step / Interview Note & Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 block">Status Update:</span>
                    <span className="text-slate-500">{app.stageNote || 'Awaiting recruiter feedback'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEmailModal()}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                      title="View Dispatched Email Notification"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Email Alerts</span>
                    </button>

                    {app.stage === 'interview' ? (
                      <button
                        onClick={() => {
                          showToast('Interview Prep Guide', 'Launching technical prep deck and company background overview...', 'success');
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Prepare for Round</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          showToast('Application Details', `Reviewing submitted details for ${app.jobTitle}`, 'info');
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};
