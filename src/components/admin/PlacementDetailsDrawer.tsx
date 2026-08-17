import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Calendar, Building2, User, ArrowRight, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PlacementDetailsDrawer: React.FC = () => {
  const { 
    isPlacementDrawerOpen, 
    setIsPlacementDrawerOpen, 
    selectedPlacement, 
    generateInvoice, 
    raiseDispute 
  } = useApp();

  const [disputeReasonInput, setDisputeReasonInput] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  if (!isPlacementDrawerOpen || !selectedPlacement) return null;

  const plc = selectedPlacement;

  const handleGenerateInvoice = () => {
    generateInvoice(plc.id);
    setIsPlacementDrawerOpen(false);
  };

  const handleRaiseDispute = () => {
    if (!disputeReasonInput.trim()) return;
    raiseDispute(plc.id, disputeReasonInput);
    setShowDisputeForm(false);
    setIsPlacementDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white max-w-lg w-full h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Admin Centre Ops</span>
              <h3 className="text-lg font-bold text-slate-900">Placement Record Details</h3>
              <p className="text-xs text-slate-500">{plc.id} • {plc.employerName}</p>
            </div>
            <button
              onClick={() => setIsPlacementDrawerOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6 flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">Current Milestone Status</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                plc.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                plc.status === 'Pending 7-Day' ? 'bg-amber-100 text-amber-800' :
                plc.status === 'Disputed' ? 'bg-rose-100 text-rose-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {plc.status}
              </span>
            </div>
            {plc.invoiceNumber && (
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Invoice #</span>
                <span className="text-xs font-mono font-bold text-slate-800">{plc.invoiceNumber}</span>
              </div>
            )}
          </div>

          {/* Placement Info */}
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                Employer & Role
              </h4>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Employer Name:</span>
                <span className="font-semibold text-slate-900">{plc.employerName}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-semibold text-slate-900">{plc.candidateName} ({plc.candidateId})</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Role / Service:</span>
                <span className="font-semibold text-slate-900">{plc.jobService}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                7-Day Safety Timeline
              </h4>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Official Joining Date:</span>
                <span className="font-semibold text-slate-900">{plc.joiningDate}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">7-Day Completion Mark:</span>
                <span className="font-semibold text-emerald-700">{plc.sevenDayMarkDate}</span>
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-600" />
                Fee & Tax Breakdown (INR)
              </h4>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Base Success Fee:</span>
                <span className="font-semibold text-slate-900">₹{plc.baseFeeINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">GST (18%):</span>
                <span className="font-semibold text-slate-900">₹{plc.taxINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-200 font-bold text-sm">
                <span className="text-slate-900">Total Due Amount:</span>
                <span className="text-emerald-700">₹{plc.totalFeeINR.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Dispute details if any */}
            {plc.isDisputed && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Active Dispute Filed</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-700">{plc.disputeReason}</p>
              </div>
            )}

            {/* Raise Dispute Form */}
            {showDisputeForm && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                <label className="block text-xs font-bold text-rose-900">
                  Dispute Reason / Replacement Claim
                </label>
                <textarea
                  rows={3}
                  value={disputeReasonInput}
                  onChange={e => setDisputeReasonInput(e.target.value)}
                  placeholder="e.g. Candidate resigned within 7 days, requested replacement or fee refund..."
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDisputeForm(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRaiseDispute}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Confirm Dispute
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDisputeForm(true)}
            className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
          >
            Raise Dispute
          </button>
          
          <button
            id="admin-generate-invoice-btn"
            type="button"
            onClick={handleGenerateInvoice}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate & Send Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
