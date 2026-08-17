import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  MoreVertical, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Star,
  ArrowRight,
  MoveRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployerCandidate } from '../../types';

export const CandidatesPipeline: React.FC = () => {
  const { 
    employerCandidates, 
    moveCandidateStage, 
    openCandidateReview,
    openEmailModal,
    showToast 
  } = useApp();

  const [selectedRoleFilter, setSelectedRoleFilter] = useState('Senior Frontend Developer');

  const columns = [
    { key: 'new', label: 'New Applications', color: 'border-t-slate-400' },
    { key: 'interview', label: 'Interview', color: 'border-t-amber-500' },
    { key: 'offer', label: 'Offer', color: 'border-t-sky-500' },
    { key: 'seven_day_completed', label: '7 Days Completed', color: 'border-t-emerald-500' },
    { key: 'hired', label: 'Hired', color: 'border-t-purple-500' }
  ];

  const handleCardClick = (cand: EmployerCandidate) => {
    openCandidateReview(cand);
  };

  const handleQuickAdvance = (e: React.MouseEvent, cand: EmployerCandidate) => {
    e.stopPropagation();
    let nextStage: EmployerCandidate['stage'] = 'interview';
    if (cand.stage === 'new') nextStage = 'interview';
    else if (cand.stage === 'interview') nextStage = 'offer';
    else if (cand.stage === 'offer') nextStage = 'seven_day_completed';
    else if (cand.stage === 'seven_day_completed') nextStage = 'hired';

    moveCandidateStage(cand.id, nextStage);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-6 sm:p-8 text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Controls (Screenshot 13) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                HireStream ATS Pipeline
              </span>
              <span className="text-xs text-slate-400">• 7 Candidates Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Senior Frontend Developer
            </h1>
            <p className="text-xs text-slate-500">
              Bangalore, India • Hybrid Options Available • 14 Days Active
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showToast('Filters', 'Filtering candidate pipeline by skills and match score...', 'info')}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button
              onClick={() => showToast('Add Candidate', 'Upload manual referral or direct candidate resume', 'info')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>

        {/* Kanban Board Columns (Screenshot 13) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
          {columns.map((col) => {
            const colCandidates = employerCandidates.filter(c => c.stage === col.key);

            return (
              <div
                key={col.key}
                className={`bg-slate-200/60 p-3 rounded-2xl border-t-4 ${col.color} border-slate-300 min-h-[500px] flex flex-col`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 py-2 mb-2">
                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    {col.label}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {colCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards in this Column */}
                <div className="space-y-3 flex-1">
                  {colCandidates.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs mt-2">
                      No candidates in this stage
                    </div>
                  ) : (
                    colCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => handleCardClick(cand)}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
                      >
                        {/* Avatar & Match */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={cand.avatarUrl}
                              alt={cand.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {cand.name}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium">
                                {cand.yearsOfExperience} Yrs Exp • {cand.location}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {cand.matchScore}%
                          </span>
                        </div>

                        {/* Badges / Promo / First Hire */}
                        <div className="flex flex-wrap gap-1 text-[9px]">
                          {cand.isFirstHirePromo && (
                            <span className="bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                              ★ First Hire Free
                            </span>
                          )}
                          {cand.skills.slice(0, 2).map(sk => (
                            <span key={sk} className="bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">
                              {sk}
                            </span>
                          ))}
                        </div>

                        {/* Interview / Note Meta */}
                        {cand.interviewTime && (
                          <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[10px] text-amber-900 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                            <span className="font-semibold">{cand.interviewTime}</span>
                          </div>
                        )}

                        {cand.joiningDate && (
                          <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-[10px] text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span className="font-semibold">Joined: {cand.joiningDate}</span>
                          </div>
                        )}

                        {/* Quick Advance Footer */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] text-slate-400">Click to review</span>
                          
                          {cand.stage !== 'hired' && (
                            <button
                              onClick={(e) => handleQuickAdvance(e, cand)}
                              title="Advance to next pipeline stage"
                              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 p-1 rounded hover:bg-emerald-50"
                            >
                              <span>Next</span>
                              <MoveRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
