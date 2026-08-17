import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { setCurrentPage, setIsEmployerRegisterModalOpen, setIsAuthModalOpen, setAuthModalRole } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 py-8 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">
                <span className="text-blue-400 font-bold">Talent</span><span className="text-emerald-400 font-bold">varya</span> Candidate Safety Shield
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Candidates receive 5 free applications per day. We never charge for interviews or offer letters. Report fraudulent listings instantly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsEmployerRegisterModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              Claim Founding Employer Offer
            </button>
            <button
              onClick={() => setCurrentPage('help-center')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              Safety Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" theme="dark" />
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Empowering the Indian workforce with verified opportunities and empowering fast-growing enterprises with streamlined, pay-after-joining hiring solutions.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Koramangala 4th Block, Bengaluru, Karnataka 560034</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>support@talentvarya.in</span>
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">For Candidates</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('jobs')} className="hover:text-emerald-400 transition-colors">
                  Explore Verified Jobs
                </button>
              </li>
              <li>
                <button onClick={() => { setAuthModalRole('candidate'); setIsAuthModalOpen(true); }} className="hover:text-emerald-400 transition-colors">
                  Candidate Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('help-center')} className="hover:text-emerald-400 transition-colors">
                  Daily Quota FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('salary-insights')} className="hover:text-emerald-400 transition-colors">
                  Salary Insights (LPA)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('jobs')} className="hover:text-emerald-400 transition-colors">
                  Remote Tech Jobs
                </button>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">For Employers</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('pricing')} className="hover:text-emerald-400 transition-colors">
                  Founding Employer Offer
                </button>
              </li>
              <li>
                <button onClick={() => { setAuthModalRole('employer'); setIsAuthModalOpen(true); }} className="hover:text-emerald-400 transition-colors">
                  HireStream ATS
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('pricing')} className="hover:text-emerald-400 transition-colors">
                  Pay-After-Joining Model
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('pricing')} className="hover:text-emerald-400 transition-colors">
                  Employer Plans from ₹49
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('pricing')} className="hover:text-emerald-400 transition-colors">
                  Enterprise Solutions
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Safety */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Trust & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('help-center')} className="hover:text-emerald-400 transition-colors">
                  Candidate Fee & Safety Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('help-center')} className="hover:text-emerald-400 transition-colors">
                  Report Suspicious Listing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('help-center')} className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('help-center')} className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('help-center')} className="hover:text-emerald-400 transition-colors">
                  Grievance Redressal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} <span className="text-blue-400 font-bold">Talent</span><span className="text-emerald-400 font-bold">varya</span> Technologies India Pvt Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with precision for India's growing economy
          </p>
        </div>
      </div>
    </footer>
  );
};
