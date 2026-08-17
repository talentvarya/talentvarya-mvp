import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';

export const PostJobModal: React.FC = () => {
  const { 
    isPostJobModalOpen, 
    setIsPostJobModalOpen, 
    addJob,
    showToast,
  } = useApp();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    roleCategory: 'General',
    location: '',
    workMode: 'Hybrid' as 'Hybrid' | 'Remote' | 'On-site',
    experienceMin: 0,
    experienceMax: 0,
    salaryMinLPA: 0,
    salaryMaxLPA: 0,
    planType: 'self-service' as 'self-service' | 'assisted',
    payAfterJoiningAgreed: true,
    description: '',
    responsibilities: '',
    skills: ''
  });

  if (!isPostJobModalOpen) return null;

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.companyName.trim() || !formData.location.trim() || !formData.description.trim()) {
      showToast('Required Details Missing', 'Company name, job title, location and job description are required.', 'alert');
      setStep(formData.description.trim() ? 1 : 3);
      return;
    }
    if (formData.experienceMax < formData.experienceMin || formData.salaryMaxLPA < formData.salaryMinLPA) {
      showToast('Invalid Range', 'Maximum experience and salary must be equal to or greater than the minimum.', 'alert');
      setStep(2);
      return;
    }
    setIsSubmitting(true);
    const saved = await addJob({
      title: formData.title,
      company: formData.companyName.trim(),
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      companyAbout: `${formData.companyName.trim()} registered employer profile.`,
      location: formData.location,
      workMode: formData.workMode,
      experienceMin: formData.experienceMin,
      experienceMax: formData.experienceMax,
      salaryMinLPA: formData.salaryMinLPA,
      salaryMaxLPA: formData.salaryMaxLPA,
      jobType: 'Full-Time',
      roleCategory: formData.roleCategory,
      isVerified: true,
      isActivelyHiring: true,
      description: formData.description,
      responsibilities: formData.responsibilities.split('\n').filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      planType: formData.planType
    });
    setIsSubmitting(false);
    if (saved) setIsPostJobModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden text-left relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">HireStream ATS</span>
            <h3 className="text-lg font-bold text-slate-900">Post a New Verified Job</h3>
          </div>
          <button
            onClick={() => setIsPostJobModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 font-medium ${step >= 1 ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-600 text-white'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              Basics
            </button>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            
            <button 
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 font-medium ${step >= 2 ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > 2 ? 'bg-emerald-100 text-emerald-800' : step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              Compensation & Plan
            </button>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            <button 
              type="button"
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 font-medium ${step >= 3 ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                3
              </div>
              Description
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="As shown in employer registration"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role Category</label>
                  <select
                    value={formData.roleCategory}
                    onChange={e => setFormData({ ...formData, roleCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>General</option>
                    <option>Administration</option>
                    <option>Human Resources</option>
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Product Management</option>
                    <option>Data & AI</option>
                    <option>DevOps & Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={formData.workMode}
                    onChange={e => setFormData({ ...formData, workMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceMin}
                    onChange={e => setFormData({ ...formData, experienceMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceMax}
                    onChange={e => setFormData({ ...formData, experienceMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Compensation & Plan (Matches screenshot 12) */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Salary Range (₹ LPA)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Minimum (LPA)</span>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={formData.salaryMinLPA}
                        onChange={e => setFormData({ ...formData, salaryMinLPA: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Maximum (LPA)</span>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={formData.salaryMaxLPA}
                        onChange={e => setFormData({ ...formData, salaryMaxLPA: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Posting & Hiring Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Self-Service Card */}
                  <div 
                    onClick={() => setFormData({ ...formData, planType: 'self-service' })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.planType === 'self-service' 
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900">Free Trial Post</h4>
                      <span className="text-xs font-bold text-emerald-700">₹0 today</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">Included within the employer's 14-day trial limits.</p>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      <li>✓ 14-Day Verified Listing</li>
                      <li>✓ Up to 3 trial job posts</li>
                      <li>✓ Standard Candidate Filters</li>
                    </ul>
                  </div>

                  {/* Assisted Card */}
                  <div 
                    onClick={() => setFormData({ ...formData, planType: 'assisted' })}
                    className={`p-4 rounded-xl border-2 cursor-pointer relative transition-all ${
                      formData.planType === 'assisted' 
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Recommended
                    </span>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900">12-Month Employer Plan</h4>
                      <span className="text-xs font-bold text-emerald-700">₹499</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">Best-value subscription after the free trial ends.</p>
                    <ul className="space-y-1 text-[11px] text-slate-700 font-medium">
                      <li>✓ Employer dashboard & ATS access</li>
                      <li>✓ Continue job posting after trial</li>
                      <li>✓ Continue verified resume access</li>
                      <li>✓ Payment gateway can be enabled later</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Employer Agreement Checkbox (Screenshot 12) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.payAfterJoiningAgreed}
                    onChange={e => setFormData({ ...formData, payAfterJoiningAgreed: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block">Employer Trial & Subscription Agreement</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                      I understand that 3 job posts and 12 resume views are available for 14 days. A paid employer plan is required after the free limit or expiry.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">About the Role / Overview</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Responsibilities (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.responsibilities}
                  onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
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
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Step
          </button>
          
          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{step === 1 ? 'Next: Compensation' : 'Next: Description'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="post-job-submit-btn"
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? 'Saving to Database...' : 'Publish Job Listing'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
