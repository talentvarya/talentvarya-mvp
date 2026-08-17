import React from 'react';
import { ArrowRight, Briefcase, CheckCircle2, Clock, CreditCard, ShieldCheck, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const employerPlans = [
  { name: 'Monthly', price: '₹49', period: '30 days', note: 'Flexible starter access' },
  { name: '6 Months', price: '₹399', period: '180 days', note: 'For regular hiring' },
  { name: '12 Months', price: '₹499', period: '365 days', note: 'Best value', featured: true },
];

export const PricingPage: React.FC = () => {
  const { setIsEmployerRegisterModalOpen, showToast } = useApp();

  const requestPayment = (planName: string) => {
    showToast(
      'Payment Integration Pending',
      `${planName} has been selected. Online payment can be activated later without adding a separate page.`,
      'info',
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-3">
            TalentVarya Access Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Start free, pay only after the free limit</h1>
          <p className="text-sm text-slate-600 mt-3">
            Employer registration includes 14 days, 3 job posts and 12 unique resume views. Candidate accounts include 5 job applications per day.
          </p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-slate-900 text-white rounded-3xl p-7 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-4 h-4" /> Employer Free Trial
            </div>
            <h2 className="text-2xl font-extrabold mt-3">₹0 for the first 14 days</h2>
            <div className="grid sm:grid-cols-3 gap-3 mt-6 text-xs">
              {['Up to 3 job posts', '12 unique resume views', 'Company document upload & Admin review'].map(feature => (
                <div key={feature} className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /><span>{feature}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsEmployerRegisterModalOpen(true)} className="mt-6 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold flex items-center gap-2">
              Register Employer <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
              <UserRound className="w-4 h-4" /> Candidate Access
            </div>
            <h2 className="text-xl font-extrabold mt-3">5 free applications/day</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Resume and supporting-document uploads are included. After the fifth application, the payment condition is shown for additional applications that day.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              Candidate paid add-on price is not configured yet; no payment will be collected until you approve it.
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-extrabold">Employer plans after trial</h2>
              <p className="text-xs text-slate-500 mt-1">The payment button can later open Razorpay, Stripe or another gateway on this same page.</p>
            </div>
            <CreditCard className="w-6 h-6 text-slate-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {employerPlans.map(plan => (
              <article key={plan.name} className={`rounded-3xl p-6 border shadow-sm relative ${plan.featured ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-slate-200'}`}>
                {plan.featured && <span className="absolute -top-3 right-5 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">BEST VALUE</span>}
                <h3 className="text-lg font-extrabold">{plan.name}</h3>
                <p className="text-3xl font-black mt-2">{plan.price}</p>
                <p className="text-xs text-slate-500">for {plan.period}</p>
                <p className="text-xs font-semibold text-emerald-700 mt-4">{plan.note}</p>
                <ul className="space-y-2 mt-4 text-xs text-slate-700">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />Employer dashboard & ATS access</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />Job posting and resume access after trial</li>
                  <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" />Admin-reviewed company account</li>
                </ul>
                <button onClick={() => requestPayment(`${plan.name} ${plan.price}`)} className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold ${plan.featured ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  Select {plan.name}
                </button>
              </article>
            ))}
          </div>
        </section>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>Payment gateway is intentionally disabled for now. Employer success-fee or pay-after-joining terms, if used, should remain a separate signed agreement and must not be charged to candidates.</p>
        </div>
      </div>
    </div>
  );
};
