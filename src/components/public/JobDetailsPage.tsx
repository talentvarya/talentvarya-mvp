import React from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  Share2, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const JobDetailsPage: React.FC = () => {
  const { 
    selectedJobId, 
    jobs, 
    setCurrentPage, 
    setIsApplyModalOpen, 
    savedJobIds, 
    toggleSaveJob, 
    candidateProfile, 
    showToast 
  } = useApp();

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const isSaved = savedJobIds.includes(currentJob.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link Copied', 'Job link copied to clipboard.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Breadcrumbs & Back */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('jobs')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Jobs</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 shadow-xs"
              title="Share Job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveJob(currentJob.id)}
              className="p-2 text-slate-500 hover:text-emerald-600 bg-white rounded-lg border border-slate-200 shadow-xs"
              title={isSaved ? 'Remove from Saved' : 'Save Job'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Grid: Left Details (8 cols) + Right Sticky (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details Column (Screenshot 3) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={currentJob.companyLogo}
                    alt={currentJob.company}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {currentJob.title}
                    </h1>
                    <p className="text-sm font-medium text-slate-600 mt-1">
                      {currentJob.company} • {currentJob.location} ({currentJob.workMode})
                    </p>
                  </div>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                {currentJob.isVerified && (
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Employer
                  </span>
                )}
                <span className="bg-slate-100 text-slate-700 font-medium px-3 py-1 rounded-full">
                  {currentJob.jobType}
                </span>
                {currentJob.isActivelyHiring && (
                  <span className="bg-sky-50 text-sky-800 font-semibold px-3 py-1 rounded-full border border-sky-200">
                    Actively Hiring
                  </span>
                )}
              </div>

              {/* 4-Item Meta Grid (Screenshot 3) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left">
                <div>
                  <span className="text-[11px] text-slate-500 block">Salary (Annual)</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    ₹{currentJob.salaryMinLPA}L - ₹{currentJob.salaryMaxLPA}L
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Experience</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {currentJob.experienceMin} - {currentJob.experienceMax} Years
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Role Category</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {currentJob.roleCategory}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Posted</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {currentJob.postedDaysAgo === 0 ? 'Today' : `${currentJob.postedDaysAgo} days ago`}
                  </span>
                </div>
              </div>
            </div>

            {/* About Role */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">About the Role</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentJob.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Key Responsibilities</h2>
              <ul className="space-y-2.5 text-sm text-slate-600 list-disc pl-5 leading-relaxed">
                {currentJob.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Required Skills & Tools</h2>
              <div className="flex flex-wrap gap-2">
                {currentJob.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-emerald-50/70 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* About Company Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">About {currentJob.company}</h2>
                <button 
                  onClick={() => showToast('Company Profile', `Navigating to ${currentJob.company} verified profile...`, 'info')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>View Company Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentJob.companyAbout || `${currentJob.company} is an active technology leader in India delivering modern high-scale solutions.`}
              </p>
            </div>

          </div>

          {/* Right Sticky Column (Screenshot 3) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Application Quota Widget (Screenshot 3) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Application Quota
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  {candidateProfile.dailyApplicationsMax - candidateProfile.dailyApplicationsUsed} Remaining
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Today's Applications</span>
                  <span className="font-bold text-slate-900">
                    {candidateProfile.dailyApplicationsUsed} of {candidateProfile.dailyApplicationsMax} used
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(candidateProfile.dailyApplicationsUsed / candidateProfile.dailyApplicationsMax) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Resets every midnight at 12:00 AM IST
                </span>
              </div>

              <button
                id="details-apply-cta"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply Now</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>5 free applications/day • Direct recruiter queue</span>
              </div>
            </div>

            {/* Safety Tip Alert Box (Screenshot 3) */}
            <div className="bg-rose-50/90 p-5 rounded-3xl border border-rose-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Safety Tip</span>
              </div>
              <p className="text-[11px] text-rose-950 leading-relaxed">
                TalentVarya and its verified employers will never ask you for payment to process an application, conduct tests, or schedule an interview. Report any suspicious requests immediately.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
