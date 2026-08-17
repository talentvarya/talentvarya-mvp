import React, { useState } from 'react';
import { X, ShieldCheck, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { uploadDocument } from '../../services/databaseService';

export const ApplyModal: React.FC = () => {
  const { 
    isApplyModalOpen, 
    setIsApplyModalOpen, 
    selectedJobId, 
    jobs, 
    candidateProfile, 
    currentUserEmail,
    applyToJob,
    userRole,
    setIsAuthModalOpen,
    setAuthModalRole,
    updateCandidateProfile,
    showToast
  } = useApp();

  const [coverNote, setCoverNote] = useState('I am excited to apply for this role. With 5+ years building high-performing web platforms and strong design systems in Figma/React, I am confident in delivering immediate impact.');
  const [selectedResume, setSelectedResume] = useState(candidateProfile.resumeFileName || 'No resume selected');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [phone, setPhone] = useState(candidateProfile.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isApplyModalOpen || !selectedJobId) return null;

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'candidate') {
      setIsApplyModalOpen(false);
      setAuthModalRole('candidate');
      setIsAuthModalOpen(true);
      showToast('Candidate Login Required', 'Please verify your candidate email before applying.', 'info');
      return;
    }

    if (!candidateProfile.resumeUploaded && !resumeFile) {
      showToast('Resume Required', 'Upload a PDF, DOC or DOCX resume before submitting the application.', 'alert');
      return;
    }

    try {
      setIsSubmitting(true);
      if (resumeFile) {
        const uploaded = await uploadDocument(resumeFile, currentUserEmail || candidateProfile.email, 'resume');
        setSelectedResume(uploaded.fileName);
        updateCandidateProfile({ resumeUploaded: true, resumeFileName: uploaded.fileName });
      }
      const applied = await applyToJob(currentJob.id, coverNote);
      if (applied) setIsApplyModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Resume upload failed.';
      showToast('Application Not Submitted', message, 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={currentJob.companyLogo} 
              alt={currentJob.company} 
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentJob.title}</h3>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentJob.company} • {currentJob.location}</p>
            </div>
          </div>
          <button
            onClick={() => setIsApplyModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Quota Banner */}
        <div className="bg-emerald-50/80 px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Today's Verified Applications: <strong>{candidateProfile.dailyApplicationsUsed} of {candidateProfile.dailyApplicationsMax} used</strong></span>
          </div>
          <span className="font-semibold text-emerald-700">
            {candidateProfile.dailyApplicationsMax - candidateProfile.dailyApplicationsUsed} left today
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Resume Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Resume for Application
            </label>
            <div className="p-3 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{selectedResume}</p>
                  <p className="text-[10px] text-slate-500">Uploaded to profile • Updated 2 days ago</p>
                </div>
              </div>
              <label
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-50"
              >
                Change
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setResumeFile(file);
                    if (file) setSelectedResume(file.name);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Contact Details Confirmation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={`${candidateProfile.firstName} ${candidateProfile.lastName}`}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Cover Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Pitch / Cover Note for Recruiter
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-none"
            />
          </div>

          {/* Safety disclaimer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>5 Free Candidate Applications Per Day</span>
            </div>
            <p className="text-slate-500">
              TalentVarya and {currentJob.company} will never charge you for test evaluations, interviews, or offer letters.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              id="apply-modal-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Verified Application'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
