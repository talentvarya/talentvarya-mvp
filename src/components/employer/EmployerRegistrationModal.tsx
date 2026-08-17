import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Building2, Upload, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { saveTemporaryUser, uploadDocument } from '../../services/databaseService';

export const EmployerRegistrationModal: React.FC = () => {
  const { 
    isEmployerRegisterModalOpen, 
    setIsEmployerRegisterModalOpen, 
    setUserRole, 
    setCurrentUserEmail,
    setCurrentPage, 
    showToast 
  } = useApp();

  const [step, setStep] = useState(1);
  const [companyDocument, setCompanyDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: 'TechNova Solutions India Pvt Ltd',
    industry: 'Information Technology & SaaS',
    companySize: '51-200 Employees',
    website: 'https://technova.io',
    gstin: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    signatoryName: 'Arun Kumar (HR Director)',
    officialEmail: 'arun.hr@technova.io'
  });

  if (!isEmployerRegisterModalOpen) return null;

  const handleFinish = async () => {
    if (!companyDocument) {
      showToast('Company Document Required', 'Upload a Certificate of Incorporation, GST certificate or equivalent business document.', 'alert');
      return;
    }
    try {
      setIsSubmitting(true);
      await saveTemporaryUser(formData.officialEmail, 'employer');
      await uploadDocument(companyDocument, formData.officialEmail, 'company_registration');
      setUserRole('employer');
      setCurrentUserEmail(formData.officialEmail.trim().toLowerCase());
      setCurrentPage('employer-dashboard');
      setIsEmployerRegisterModalOpen(false);
      showToast('Employer Registration Submitted', 'Your 14-day free access is ready. Company verification remains pending Admin review.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Employer registration failed.';
      showToast('Registration Not Completed', message, 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden text-left relative flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Founding Offer Banner */}
        <div className="md:w-5/12 bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="mb-4">
              <BrandLogo size="sm" theme="dark" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                ★ Founding Employer Offer
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
              Join India's Verified Talent Network
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Free registration with 14-day access, up to 3 job posts and 12 unique resume views before payment is required.
            </p>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero upfront costs or hidden charges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Company documents reviewed by Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pay-After-Joining 7-Day Safety Guarantee</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80" 
                alt="Office Team" 
                className="w-full h-32 object-cover"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Built for verified Indian employers and growing teams
            </p>
          </div>
        </div>

        {/* Right Stepper Form */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Header & Close */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  HireStream ATS Registration
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  {step === 1 && '1. Company Details'}
                  {step === 2 && '2. Verification Documents'}
                  {step === 3 && '3. Confirmation & Activation'}
                </h4>
              </div>
              <button
                onClick={() => setIsEmployerRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Legal Company Name (as per MCA)
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Industry Sector
                    </label>
                    <select
                      value={formData.industry}
                      onChange={e => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Information Technology & SaaS</option>
                      <option>Fintech & Banking</option>
                      <option>E-Commerce & D2C</option>
                      <option>Healthcare & Biotech</option>
                      <option>Manufacturing & Logistics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Size
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={e => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>1-10 Employees (Early Stage)</option>
                      <option>11-50 Employees</option>
                      <option>51-200 Employees</option>
                      <option>201-500 Employees</option>
                      <option>500+ Employees (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Corporate Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourcompany.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Work Email
                  </label>
                  <input
                    type="email"
                    value={formData.officialEmail}
                    onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                    placeholder="talent@yourcompany.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Docs */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GSTIN (15 Digits)
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company PAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={e => setFormData({ ...formData, panNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <label className="p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between cursor-pointer hover:border-emerald-300">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Certificate of Incorporation (CIN)</p>
                      <p className="text-[10px] text-slate-500">PDF / JPG / PNG up to 5MB (Admin-reviewed)</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 max-w-40 truncate">
                    {companyDocument?.name || 'Choose File'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(event) => setCompanyDocument(event.target.files?.[0] || null)}
                  />
                </label>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Application Ready for Review</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {formData.companyName} will receive 14-day trial access after submission. The verified employer badge remains pending until Admin reviews the uploaded company document.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan:</span>
                    <span className="font-semibold text-slate-900">Employer Free Trial</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platform Subscription:</span>
                    <span className="font-semibold text-emerald-600">FREE (14 Days)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">First Successful Placement:</span>
                    <span className="font-semibold text-slate-900">As per employer success-fee terms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification Status:</span>
                    <span className="font-semibold text-amber-600">Pending Admin Review</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <button
              id="employer-register-next-btn"
              type="button"
              onClick={() => {
                if (step < 3) setStep(s => s + 1);
                else handleFinish();
              }}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isSubmitting ? 'Uploading & Submitting...' : step === 3 ? 'Submit Employer Registration' : 'Continue to Documents'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
