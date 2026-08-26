import React, { useState } from 'react';
import { ArrowRight, Briefcase, CheckCircle2, CreditCard, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type CandidatePlan = {
  id: 'candidate_30_days' | 'candidate_6_months' | 'candidate_12_months';
  name: string;
  price: number;
  period: string;
  note: string;
  featured?: boolean;
};

const candidatePlans: CandidatePlan[] = [
  { id: 'candidate_30_days', name: '30 Days', price: 49, period: '30 days', note: 'Short-term career access' },
  { id: 'candidate_6_months', name: '6 Months', price: 299, period: '180 days', note: 'Best for an active job search', featured: true },
  { id: 'candidate_12_months', name: '12 Months', price: 499, period: '365 days', note: 'Maximum value for one year' },
];

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const loadRazorpay = () => new Promise<boolean>((resolve) => {
  if (window.Razorpay) return resolve(true);
  const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
  if (existing) {
    existing.addEventListener('load', () => resolve(true), { once: true });
    existing.addEventListener('error', () => resolve(false), { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.dataset.razorpayCheckout = 'true';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export const PricingPage: React.FC = () => {
  const {
    currentUserEmail,
    userRole,
    setAuthModalRole,
    setIsAuthModalOpen,
    setIsEmployerRegisterModalOpen,
    showToast,
  } = useApp();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const startCandidatePayment = async (plan: CandidatePlan) => {
    if (userRole !== 'candidate' || !currentUserEmail) {
      setAuthModalRole('candidate');
      setIsAuthModalOpen(true);
      showToast('Candidate Login Required', 'Please sign in as a candidate before purchasing a plan.', 'info');
      return;
    }

    setProcessingPlan(plan.id);
    try {
      const checkoutReady = await loadRazorpay();
      if (!checkoutReady || !window.Razorpay) throw new Error('Razorpay Checkout could not be loaded.');

      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, candidateEmail: currentUserEmail }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || 'Payment order could not be created.');

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'TalentVarya',
        description: `Candidate plan: ${plan.name}`,
        order_id: order.orderId,
        prefill: { email: currentUserEmail },
        theme: { color: '#059669' },
        modal: { ondismiss: () => setProcessingPlan(null) },
        handler: async (payment: RazorpayResponse) => {
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payment, planId: plan.id, candidateEmail: currentUserEmail }),
            });
            const verification = await verifyResponse.json();
            if (!verifyResponse.ok || !verification.verified) throw new Error(verification.error || 'Payment verification failed.');
            localStorage.setItem('talentvarya_candidate_plan', JSON.stringify({
              planId: plan.id,
              planName: plan.name,
              validUntil: verification.validUntil,
              paymentId: payment.razorpay_payment_id,
            }));
            showToast('Payment Successful', `${plan.name} candidate plan is active until ${new Date(verification.validUntil).toLocaleDateString('en-IN')}.`, 'success');
          } catch (error) {
            showToast('Verification Failed', error instanceof Error ? error.message : 'Contact TalentVarya support with your payment ID.', 'alert');
          } finally {
            setProcessingPlan(null);
          }
        },
      });
      checkout.open();
    } catch (error) {
      setProcessingPlan(null);
      showToast('Payment Not Started', error instanceof Error ? error.message : 'Please try again.', 'alert');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-3">TalentVarya Candidate Plans</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Choose the right access plan for your job search</h1>
          <p className="text-sm text-slate-600 mt-3">Secure online payment powered by Razorpay. Prices are shown in Indian Rupees and include the complete plan duration.</p>
        </div>

        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2"><UserRound className="w-5 h-5 text-emerald-600" /> Candidate subscription plans</h2>
              <p className="text-xs text-slate-500 mt-1">Select a plan and complete payment securely through Razorpay Checkout.</p>
            </div>
            <CreditCard className="w-6 h-6 text-slate-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {candidatePlans.map(plan => (
              <article key={plan.id} className={`rounded-3xl p-6 border shadow-sm relative ${plan.featured ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-slate-200'}`}>
                {plan.featured && <span className="absolute -top-3 right-5 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                <h3 className="text-lg font-extrabold">{plan.name}</h3>
                <p className="text-3xl font-black mt-2">₹{plan.price}</p>
                <p className="text-xs text-slate-500">valid for {plan.period}</p>
                <p className="text-xs font-semibold text-emerald-700 mt-4">{plan.note}</p>
                <ul className="space-y-2 mt-4 text-xs text-slate-700">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />Candidate dashboard access</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />Resume and document management</li>
                  <li className="flex gap-2"><Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />Verified job discovery and applications</li>
                </ul>
                <button onClick={() => startCandidatePayment(plan)} disabled={processingPlan !== null} className={`w-full mt-6 py-3 rounded-xl text-xs font-bold disabled:opacity-60 disabled:cursor-wait ${plan.featured ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  {processingPlan === plan.id ? 'Opening secure payment…' : `Pay ₹${plan.price} with Razorpay`}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white rounded-3xl p-7 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider"><Briefcase className="w-4 h-4" /> Employer registration</div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mt-3">
            <div>
              <h2 className="text-2xl font-extrabold">Verified companies can register separately</h2>
              <p className="text-xs text-slate-300 mt-2">Company documents and authorised representative details are reviewed by the TalentVarya admin.</p>
            </div>
            <button onClick={() => setIsEmployerRegisterModalOpen(true)} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shrink-0">Register Employer <ArrowRight className="w-4 h-4" /></button>
          </div>
        </section>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>Payments open only in Razorpay's secure checkout. TalentVarya never asks candidates to share an OTP, UPI PIN, card PIN or Razorpay password.</p>
        </div>
      </div>
    </div>
  );
};
