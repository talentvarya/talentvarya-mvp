import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Clock, 
  Calendar, 
  DollarSign, 
  Award, 
  ChevronRight, 
  FileText, 
  ArrowRight, 
  UserCheck, 
  AlertCircle,
  Mail,
  Video,
  Send,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CandidateReviewDrawer: React.FC = () => {
  const { 
    isCandidateReviewDrawerOpen, 
    setIsCandidateReviewDrawerOpen, 
    activeCandidateForReview, 
    issueOffer, 
    moveCandidateStage,
    openEmailModal,
    showToast 
  } = useApp();

  const [isOfferDrawerOpenLocal, setIsOfferDrawerOpenLocal] = useState(false);
  const [offerSalaryLPA, setOfferSalaryLPA] = useState(24);
  const [offerBonusLPA, setOfferBonusLPA] = useState(2);
  const [joiningDate, setJoiningDate] = useState('2025-04-15');
  const [offerStatusTab, setOfferStatusTab] = useState<'selected' | 'issued' | 'joined'>('selected');

  // Interview Schedule Dialog state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [interviewRound, setInterviewRound] = useState('Technical Round 2: Architecture & Live Coding');
  const [scheduledDateTime, setScheduledDateTime] = useState('Tomorrow at 2:30 PM IST');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/tv-live-interview');

  // Rejection Dialog state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('While qualifications are impressive, we decided to advance candidates with deeper hands-on experience in large-scale distributed architectures.');

  if (!isCandidateReviewDrawerOpen || !activeCandidateForReview) return null;

  const cand = activeCandidateForReview;

  const handleIssueOffer = () => {
    issueOffer(cand.id, {
      status: 'issued',
      offeredBaseSalaryLPA: offerSalaryLPA,
      joiningBonusLPA: offerBonusLPA,
      proposedJoiningDate: joiningDate
    });
    setOfferStatusTab('issued');
    setIsOfferDrawerOpenLocal(false);
  };

  const handleConfirmScheduleInterview = () => {
    moveCandidateStage(cand.id, 'interview', {
      round: interviewRound,
      scheduledTime: scheduledDateTime,
      meetingLink: meetingUrl
    });
    setIsScheduleModalOpen(false);
  };

  const handleConfirmRejection = () => {
    moveCandidateStage(cand.id, 'rejected', {
      feedbackReason: rejectionReason
    });
    setIsRejectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white max-w-4xl w-full h-full shadow-2xl overflow-y-auto flex flex-col text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Breadcrumb & Close */}
        <div className="p-4 sm:px-6 bg-slate-900 text-slate-300 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span>Candidates</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">{cand.jobTitle || 'Role Review'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-emerald-400 font-semibold">Review: {cand.name}</span>
          </div>
          <button
            onClick={() => setIsCandidateReviewDrawerOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Header Summary */}
        <div className="p-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={cand.avatarUrl} 
              alt={cand.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{cand.name}</h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  {cand.matchScore}% Match
                </span>
                {cand.isFirstHirePromo && (
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                    ★ First Hire Promo Eligible
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {cand.role} • {cand.location} • {cand.yearsOfExperience}+ Years Experience
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View dispatched emails button */}
            <button
              onClick={() => openEmailModal()}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              title="View simulated email notification alerts dispatched to this candidate"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email Inbox</span>
            </button>

            {/* Reject button */}
            <button
              onClick={() => setIsRejectModalOpen(true)}
              className="px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Reject</span>
            </button>

            {/* Schedule Interview button */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Interview</span>
            </button>

            {/* Offer button */}
            <button
              id="offer-actions-btn"
              onClick={() => setIsOfferDrawerOpenLocal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Offer Actions</span>
            </button>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Current Stage:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
              cand.stage === 'interview' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
              cand.stage === 'rejected' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
              cand.stage === 'offer' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
              'bg-slate-200 text-slate-800'
            }`}>
              {cand.stage}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Automated mock email alerts trigger on Interview & Rejection
          </span>
        </div>

        {/* Main Review Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-slate-50">
          {/* Left 2 Cols: Interview Scorecard & Experience */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Scorecard (Screenshot 14) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Interview Scorecard & Signals</h3>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>{cand.interviewDetails?.overallScore || 4.2} / 5.0 Strong Fit</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Technical Proficiency & Architecture</span>
                    <span className="font-bold text-slate-900">{cand.interviewDetails?.techScore || 4.5} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(cand.interviewDetails?.techScore || 4.5) * 20}%` }} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Role Collaboration & Communication</span>
                    <span className="font-bold text-slate-900">{cand.interviewDetails?.cultureScore || 4.0} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(cand.interviewDetails?.cultureScore || 4.0) * 20}%` }} />
                  </div>
                </div>

                {/* Evidence notes */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-800 block mb-1">Evaluation & Feedback Notes</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {cand.interviewDetails?.feedbackNotes || 'Candidate performed exceptionally well during the live coding and system design rounds. Demonstrated mastery in state normalization, WebSockets handling, and micro-frontend federation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills & Experience Overview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Skills & Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {cand.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Candidate Background Card */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Candidate Profile
              </h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex justify-between">
                  <span>Current Notice:</span>
                  <span className="font-bold text-slate-900">15 Days (Immediate)</span>
                </div>
                <div className="flex justify-between">
                  <span>Current CTC:</span>
                  <span className="font-bold text-slate-900">₹18 LPA</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected CTC:</span>
                  <span className="font-bold text-slate-900">₹24 - 28 LPA</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferred Location:</span>
                  <span className="font-bold text-slate-900">{cand.location}</span>
                </div>
              </div>

              {/* Verified Trust Badge */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>TalentVarya Verified Identity</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Identity, background credential checks, and PAN verification completed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULE INTERVIEW MODAL */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Schedule Interview Round</h3>
                    <p className="text-[11px] text-slate-500">For {cand.name} ({cand.role})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Round Title</label>
                  <input 
                    type="text"
                    value={interviewRound}
                    onChange={e => setInterviewRound(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                  <input 
                    type="text"
                    value={scheduledDateTime}
                    onChange={e => setScheduledDateTime(e.target.value)}
                    placeholder="e.g. Tomorrow at 2:30 PM IST"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-medium">
                      <Video className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="text"
                      value={meetingUrl}
                      onChange={e => setMeetingUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Automated Notification Alert:</strong> A mock interview email invitation with Google Calendar invite & meeting link will be dispatched immediately.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmScheduleInterview}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm & Send Email</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REJECT CANDIDATE MODAL */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Application Status: Reject</h3>
                    <p className="text-[11px] text-slate-500">For {cand.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Constructive Feedback Note for Candidate
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white text-xs leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 text-[11px] space-y-1">
                  <p className="font-semibold text-slate-900">Talent Retention Protocol:</p>
                  <p>
                    Candidate's verified status will be retained in your company's Priority Talent Network for future requisitions.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejection}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Confirm & Dispatch Email</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OFFER DRAWER (SUB DRAWER) */}
        {isOfferDrawerOpenLocal && (
          <div className="fixed inset-0 z-60 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white max-w-lg w-full h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">HireStream ATS</span>
                    <h3 className="text-lg font-bold text-slate-900">Offer Management - {cand.name}</h3>
                  </div>
                  <button
                    onClick={() => setIsOfferDrawerOpenLocal(false)}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Tabs: Selected | Offer Issued | Joined */}
                <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-semibold">
                  <button 
                    onClick={() => setOfferStatusTab('selected')}
                    className={`py-2 rounded-lg transition-all ${offerStatusTab === 'selected' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    1. Selected
                  </button>
                  <button 
                    onClick={() => setOfferStatusTab('issued')}
                    className={`py-2 rounded-lg transition-all ${offerStatusTab === 'issued' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    2. Offer Issued
                  </button>
                  <button 
                    onClick={() => setOfferStatusTab('joined')}
                    className={`py-2 rounded-lg transition-all ${offerStatusTab === 'joined' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    3. Joined
                  </button>
                </div>

                {/* Offer Form */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Offered Base Salary (INR ₹ LPA)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={offerSalaryLPA}
                        onChange={e => setOfferSalaryLPA(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Joining Bonus (Optional INR ₹ LPA)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={offerBonusLPA}
                        onChange={e => setOfferBonusLPA(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Proposed Joining Date
                    </label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={e => setJoiningDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-semibold text-slate-800">Automated Offer Letter Template</p>
                        <p className="text-[10px] text-slate-500">Standard Indian Employment Contract v4.2</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => showToast('Offer Preview', `Previewing offer of ₹${offerSalaryLPA} LPA for ${cand.name}`, 'info')}
                      className="text-emerald-700 font-bold hover:underline text-[11px]"
                    >
                      Preview Letter
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOfferDrawerOpenLocal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  id="issue-offer-btn"
                  type="button"
                  onClick={handleIssueOffer}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue Formal Offer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
