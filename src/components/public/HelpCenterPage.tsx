import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  Building2, 
  User, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Send,
  MessageSquare,
  Lock
} from 'lucide-react';
import { FAQS_DATA } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const HelpCenterPage: React.FC = () => {
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>('0-0');
  const [reportJobTitle, setReportJobTitle] = useState('');
  const [reportReason, setReportReason] = useState('');

  const handleReportFraud = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportJobTitle || !reportReason) return;
    showToast('Report Submitted', 'Our Trust & Safety Operations team is investigating this report.', 'alert');
    setReportJobTitle('');
    setReportReason('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Search Hero (Screenshot 16) */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl text-center space-y-5 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              <span className="text-blue-400">Talent</span><span className="text-emerald-400">varya</span> Support & Trust Centre
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How can we help you?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Search our comprehensive guides, safety protocols, and legal policies.
            </p>
          </div>

          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. Quotas, Founding offer, Scam report)..."
              className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 text-xs sm:text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Popular:</span>
            {['Profile Verification', 'Founding Offer', 'Report Fake Job', 'Pay-After-Joining'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Category Cards (Screenshot 16) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Candidate FAQs',
              desc: 'Quota resets, applying, interviews & safety guidelines',
              icon: <User className="w-5 h-5 text-emerald-600" />,
              cat: 'Candidate FAQs'
            },
            {
              title: 'Employer FAQs',
              desc: 'HireStream ATS, posting jobs, applicant screening',
              icon: <Building2 className="w-5 h-5 text-sky-600" />,
              cat: 'Employer FAQs'
            },
            {
              title: 'Safety Guide',
              desc: 'Zero-fee candidate policy, scam prevention protocols',
              icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
              cat: 'Safety & Security'
            },
            {
              title: 'Legal Policies',
              desc: 'Terms of service, privacy protocols & GST compliance',
              icon: <FileText className="w-5 h-5 text-amber-600" />,
              cat: 'Legal Policies'
            }
          ].map((card, i) => (
            <div
              key={i}
              onClick={() => setActiveCategory(card.cat)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">Everything you need to know about using TalentVarya</p>
            </div>
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="space-y-6">
            {FAQS_DATA.filter(group => activeCategory === 'All' || group.category === activeCategory).map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {group.category}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => {
                    const id = `${groupIdx}-${itemIdx}`;
                    const isOpen = openFaqIndex === id;
                    return (
                      <div
                        key={itemIdx}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : id)}
                          className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-100/60 transition-colors"
                        >
                          <span>{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Suspicious Activity Form */}
        <div className="bg-rose-50/70 p-6 sm:p-8 rounded-3xl border border-rose-200 space-y-4">
          <div className="flex items-center gap-2 text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold">Report a Fake Job or Payment Request</h3>
          </div>
          <p className="text-xs text-rose-950 max-w-2xl leading-relaxed">
            TalentVarya strictly prohibits recruiters from charging any fee for job applications, interview tests, or registration. Help us keep India's workforce protected by reporting violations.
          </p>

          <form onSubmit={handleReportFraud} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Company / Job Name</label>
              <input
                type="text"
                value={reportJobTitle}
                onChange={e => setReportJobTitle(e.target.value)}
                placeholder="e.g. ABC Tech Solutions - React Developer"
                className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Description of Violation</label>
              <input
                type="text"
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                placeholder="e.g. Recruiter asked for ₹500 document verification fee"
                className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Confidential Report</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
