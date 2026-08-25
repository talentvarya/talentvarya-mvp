import React, { useEffect, useMemo, useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Building2, 
  Eye, 
  Download,
  Calendar,
  Users,
  Briefcase,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Job, PlacementRecord, UploadedDocumentRecord } from '../../types';
import { loadAdminOverview } from '../../services/databaseService';

export const AdminCentre: React.FC = () => {
  const { 
    adminPlacements: placements, 
    setSelectedPlacement, 
    setIsPlacementDrawerOpen, 
    generateInvoice, 
    candidateProfile,
    employerCandidates,
    promotionalBanners,
    setIsBannerManagerModalOpen,
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [adminOverview, setAdminOverview] = useState<{
    users: Array<{ id: string; email: string; role: 'candidate' | 'employer'; emailVerified: number; createdAt: string }>;
    jobs: Job[];
    documents: UploadedDocumentRecord[];
  }>({ users: [], jobs: [], documents: [] });

  useEffect(() => {
    loadAdminOverview()
      .then(setAdminOverview)
      .catch(error => showToast('Admin Data Not Loaded', error instanceof Error ? error.message : 'Could not load protected records.', 'alert'));
  }, []);

  const employerDirectory = useMemo(() => {
    const companies = new Map<string, { company: string; jobCount: number; activeJobs: number }>();
    adminOverview.jobs.forEach(job => {
      const current = companies.get(job.company) || { company: job.company, jobCount: 0, activeJobs: 0 };
      current.jobCount += 1;
      if (job.status === 'active') current.activeJobs += 1;
      companies.set(job.company, current);
    });
    return [...companies.values()];
  }, [adminOverview.jobs]);

  const filteredPlacements = placements.filter(p => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.employerName.toLowerCase().includes(q) ||
        p.candidateName.toLowerCase().includes(q) ||
        p.candidateId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenPlacement = (plc: PlacementRecord) => {
    setSelectedPlacement(plc);
    setIsPlacementDrawerOpen(true);
  };

  const totalInvoicedINR = placements.reduce((acc, curr) => acc + curr.totalFeeINR, 0);

  return (
    <div className="min-h-screen bg-slate-100/70 p-6 sm:p-8 text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header (Screenshot 15) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                Admin Console
              </span>
              <span className="text-xs text-slate-500">• Pay-After-Joining Operations</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Placements & 7-Day Safety Escrow
            </h1>
            <p className="text-xs text-slate-500">
              Audit candidate retention milestones, dispute resolutions, and automated GST billing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Export Audit', 'Exporting placement ledger to CSV...', 'info')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Operations KPI Cards (Screenshot 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Active Placements</span>
            <p className="text-2xl font-extrabold text-slate-900">{placements.length}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Across 4 key tech hubs</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending 7-Day Window</span>
            <p className="text-2xl font-extrabold text-amber-600">
              {placements.filter(p => p.status === 'Pending 7-Day').length}
            </p>
            <span className="text-[11px] text-slate-400 font-semibold">Safety observation period</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Disputes / In-Review</span>
            <p className="text-2xl font-extrabold text-rose-600">
              {placements.filter(p => p.isDisputed).length}
            </p>
            <span className="text-[11px] text-rose-600 font-semibold">Requires arbitration</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Fee Realized (INR)</span>
            <p className="text-2xl font-extrabold text-emerald-700">₹{totalInvoicedINR.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-slate-400 font-semibold">Inclusive of 18% GST</span>
          </div>
        </div>

        {/* Protected candidate and employer account overview */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" /> Candidate Accounts
                </h2>
                <p className="text-[11px] text-slate-500">Protected contact, resume and application overview</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">
                {adminOverview.users.filter(user => user.role === 'candidate').length} registered
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Documents</th><th className="px-4 py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminOverview.users.filter(user => user.role === 'candidate').map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900">{user.email === candidateProfile.email ? `${candidateProfile.firstName} ${candidateProfile.lastName}` : 'Candidate'}</span>
                        <span className="block text-[10px] text-slate-500">{user.email}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {adminOverview.documents.filter(document => document.userEmail === user.email).length} file(s)
                      </td>
                      <td className="px-4 py-3"><span className={`text-[10px] font-bold border rounded-full px-2 py-1 ${user.emailVerified ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>{user.emailVerified ? 'Email verified' : 'Activation pending'}</span></td>
                    </tr>
                  ))}
                  {adminOverview.users.filter(user => user.role === 'candidate').length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-5 text-center text-slate-500">No registered candidate records yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-slate-50 text-[11px] text-slate-600">
              ATS preview pool: <strong>{employerCandidates.length}</strong> candidates • Main resume: <strong>{candidateProfile.resumeFileName || 'Not uploaded'}</strong>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-sky-600" /> Employer Accounts
                </h2>
                <p className="text-[11px] text-slate-500">Registration, posting and company activity</p>
              </div>
              <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-1 rounded-full border border-sky-200">
                {adminOverview.users.filter(user => user.role === 'employer').length} registered
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr><th className="px-4 py-3">Employer Email</th><th className="px-4 py-3">Company Jobs</th><th className="px-4 py-3">Review</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminOverview.users.filter(user => user.role === 'employer').map((user, index) => {
                    const company = employerDirectory[index];
                    const documentCount = adminOverview.documents.filter(document => document.userEmail === user.email).length;
                    return (
                      <tr key={user.id}>
                        <td className="px-4 py-3"><span className="font-bold text-slate-900">{user.email}</span><span className="block text-[10px] text-slate-500">Registered {new Date(user.createdAt).toLocaleDateString('en-IN')}</span></td>
                        <td className="px-4 py-3 text-slate-600">{company?.company || 'No company job yet'}<span className="block text-[10px]">{company?.jobCount || 0}/3 trial posts</span></td>
                        <td className="px-4 py-3"><span className={`text-[10px] font-bold border rounded-full px-2 py-1 ${documentCount ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>{documentCount ? `${documentCount} document(s)` : 'Document pending'}</span></td>
                      </tr>
                    );
                  })}
                  {adminOverview.users.filter(user => user.role === 'employer').length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-5 text-center text-slate-500">No registered employer records yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-600">{promotionalBanners.length} banners • Admin-only publishing</span>
              <button onClick={() => setIsBannerManagerModalOpen(true)} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Manage Banners
              </button>
            </div>
          </section>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search placement, company, candidate ID..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending 7-Day">Pending 7-Day</option>
              <option value="Disputed">Disputed</option>
              <option value="Invoiced">Invoiced</option>
            </select>
          </div>
        </div>

        {/* Placements Ledger Table (Screenshot 15) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Placement ID</th>
                  <th className="py-3.5 px-4">Employer</th>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Joining & 7-Day Mark</th>
                  <th className="py-3.5 px-4">Success Fee (INR)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlacements.map((plc) => (
                  <tr key={plc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {plc.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {plc.employerName}
                      <span className="block text-[10px] text-slate-400 font-normal">{plc.jobService}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{plc.candidateName}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{plc.candidateId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{plc.joiningDate}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                        Mark: {plc.sevenDayMarkDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{plc.totalFeeINR.toLocaleString('en-IN')}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        (Base ₹{plc.baseFeeINR.toLocaleString('en-IN')} + 18% GST)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${
                        plc.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        plc.status === 'Pending 7-Day' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        plc.status === 'Disputed' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                        'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        {plc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenPlacement(plc)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                        {plc.status !== 'Invoiced' && !plc.isDisputed && (
                          <button
                            onClick={() => generateInvoice(plc.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                            title="Generate Invoice"
                          >
                            <FileText className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
