import React, { useState } from 'react';
import { X, ShieldCheck, User, Briefcase, GraduationCap, Sliders, ArrowRight, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { uploadDocument } from '../../services/databaseService';

export const ProfileSetupModal: React.FC = () => {
  const { 
    isProfileSetupModalOpen, 
    setIsProfileSetupModalOpen, 
    candidateProfile, 
    currentUserEmail,
    updateCandidateProfile, 
    showToast 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: candidateProfile.firstName,
    lastName: candidateProfile.lastName,
    email: candidateProfile.email,
    phone: candidateProfile.phone.replace('+91 ', ''),
    location: candidateProfile.location,
    headline: candidateProfile.headline,
    experienceYears: candidateProfile.experienceYears,
    skills: candidateProfile.skills.join(', '),
    expectedCTCLPA: candidateProfile.expectedCTCLPA,
    noticePeriodDays: candidateProfile.noticePeriodDays,
    portfolioUrl: candidateProfile.portfolioUrl || '',
    avatarUrl: candidateProfile.avatarUrl
  });

  if (!isProfileSetupModalOpen) return null;

  const handleNext = async () => {
    if (step < 4) {
      setStep(s => s + 1);
    } else {
      try {
        setIsUploading(true);
        const uploadedNames: string[] = [];
        if (resumeFile) {
          const uploadedResume = await uploadDocument(resumeFile, currentUserEmail || formData.email, 'resume');
          uploadedNames.push(uploadedResume.fileName);
        }
        for (const document of supportingDocuments) {
          const uploadedDocument = await uploadDocument(document, currentUserEmail || formData.email, 'supporting_document');
          uploadedNames.push(uploadedDocument.fileName);
        }

        updateCandidateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: `+91 ${formData.phone}`,
          location: formData.location,
          headline: formData.headline,
          experienceYears: Number(formData.experienceYears),
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
          expectedCTCLPA: Number(formData.expectedCTCLPA),
          noticePeriodDays: Number(formData.noticePeriodDays),
          portfolioUrl: formData.portfolioUrl,
          avatarUrl: formData.avatarUrl,
          resumeUploaded: Boolean(resumeFile) || candidateProfile.resumeUploaded,
          resumeFileName: resumeFile?.name || candidateProfile.resumeFileName,
          documentFileNames: [...(candidateProfile.documentFileNames || []), ...uploadedNames],
          profileStrengthPercent: 95
        });
        setIsProfileSetupModalOpen(false);
        showToast('Profile & Documents Updated', uploadedNames.length > 0 ? `${uploadedNames.length} document(s) uploaded securely.` : 'Your profile details were saved.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Document upload failed.';
        showToast('Upload Failed', message, 'alert');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const steps = [
    { num: 1, label: 'Personal', icon: <User className="w-3.5 h-3.5" /> },
    { num: 2, label: 'Experience', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { num: 3, label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { num: 4, label: 'Preferences', icon: <Sliders className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden text-left relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Set Up Your Profile</h3>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Free for Candidates
            </span>
          </div>
          <button
            onClick={() => setIsProfileSetupModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {steps.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                    step === s.num 
                      ? 'text-emerald-700 font-bold' 
                      : step > s.num 
                        ? 'text-emerald-600' 
                        : 'text-slate-400'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    step === s.num 
                      ? 'bg-emerald-600 text-white' 
                      : step > s.num 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form inputs */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (+91)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs">
                      +91
                    </span>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location (City, State)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bangalore, Karnataka, India"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Photo Upload & Pro tip */}
              <div className="space-y-4 flex flex-col items-center text-center">
                <div className="relative group">
                  <img
                    src={formData.avatarUrl}
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Enter image URL for avatar:', formData.avatarUrl);
                      if (newUrl) setFormData({ ...formData, avatarUrl: newUrl });
                    }}
                    className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full shadow-md hover:bg-emerald-700 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Upload professional headshot (JPG/PNG)</p>

                <div className="w-full bg-emerald-50/80 p-3 rounded-xl border border-emerald-100 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pro Tip</span>
                  </div>
                  <p className="text-[11px] text-emerald-950 leading-relaxed">
                    Profiles with verified mobile numbers and complete location data receive 3.5x faster responses from recruiters.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={e => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Senior UI/UX Designer | 5+ YOE in FinTech & Enterprise SaaS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Period (Days)</label>
                  <select
                    value={formData.noticePeriodDays}
                    onChange={e => setFormData({ ...formData, noticePeriodDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={0}>Immediate (0 Days)</option>
                    <option value={15}>15 Days</option>
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={60}>60 Days (2 Months)</option>
                    <option value={90}>90 Days (3 Months)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Top Skills (Comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Figma, Design Systems, React, TypeScript, Accessibility"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio / GitHub Link</label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://priyasharma.design"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Degree / Qualification</label>
                <input
                  type="text"
                  defaultValue="Bachelor of Technology (B.Tech) in Computer Science"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University / College</label>
                  <input
                    type="text"
                    defaultValue="National Institute of Technology (NIT) Karnataka"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    defaultValue={2020}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-600">Certifications & Accreditations (Optional)</p>
                <p className="text-[11px] text-slate-400 mt-1">AWS Certified Solutions Architect, Nielsen Norman Group UX Master</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="p-3 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/40 cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5 text-emerald-600" /> Upload Resume</span>
                  <span className="text-[10px] text-slate-500 block mt-1">PDF/DOC/DOCX, maximum 5 MB</span>
                  <span className="text-[10px] font-semibold text-emerald-700 block mt-1">{resumeFile?.name || candidateProfile.resumeFileName || 'Choose resume file'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                  />
                </label>
                <label className="p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5 text-slate-500" /> Supporting Documents</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Certificates, ID or qualification documents</span>
                  <span className="text-[10px] font-semibold text-slate-700 block mt-1">{supportingDocuments.length ? `${supportingDocuments.length} file(s) selected` : 'Choose files'}</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(event) => setSupportingDocuments(Array.from(event.target.files || []))}
                  />
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected CTC (₹ LPA)</label>
                <input
                  type="number"
                  value={formData.expectedCTCLPA}
                  onChange={e => setFormData({ ...formData, expectedCTCLPA: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Work Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Hybrid', 'Remote', 'On-site'].map(mode => (
                    <label key={mode} className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-emerald-50/50">
                      <input type="radio" name="workmode" defaultChecked={mode === 'Hybrid'} className="text-emerald-600" />
                      <span className="text-xs font-medium text-slate-800">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                <p className="font-semibold">Ready to get discovered!</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Verified recruiters from top Indian enterprises will be able to match your profile directly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            id="profile-stepper-next-btn"
            type="button"
            onClick={handleNext}
            disabled={isUploading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isUploading ? 'Uploading Documents...' : step === 4 ? 'Save & Complete Profile' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
