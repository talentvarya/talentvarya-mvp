import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Settings, 
  PlusCircle, 
  HelpCircle, 
  LogOut, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  Edit3, 
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ManageJobsPage: React.FC = () => {
  const { 
    jobs, 
    currentPage, 
    setCurrentPage, 
    setIsPostJobModalOpen, 
    setUserRole,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'archived'>('active');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex text-left">
      
      {/* Left Employer ATS Sidebar (Screenshot 11) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              TV
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Employer Portal
              </span>
              <h4 className="text-xs font-bold text-white truncate">
                TechNova Solutions
              </h4>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setCurrentPage('employer-dashboard')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('employer-jobs')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Manage Jobs</span>
              </div>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('employer-candidates')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Candidates Pipeline</span>
              </div>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                7
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('pricing')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span>Hiring Fees & Billing</span>
            </button>
          </nav>

          <div className="pt-2">
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 px-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a New Job</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-1 text-xs">
          <button
            onClick={() => setCurrentPage('help-center')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Center</span>
          </button>
          <button
            onClick={() => {
              setUserRole('guest');
              setCurrentPage('home');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Jobs Management Content */}
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        
        {/* Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Jobs &gt; Manage Active Jobs
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Active Job Listings
            </h1>
          </div>

          <button
            id="manage-jobs-post-btn"
            onClick={() => setIsPostJobModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Job</span>
          </button>
        </div>

        {/* Search & Tabs Row (Screenshot 11) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            {[
              { key: 'active', label: 'Active', count: filteredJobs.length },
              { key: 'drafts', label: 'Drafts', count: 1 },
              { key: 'archived', label: 'Archived', count: 12 }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === tab.key 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.key ? 'bg-slate-700 text-emerald-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search active jobs..."
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Job Cards Grid (Screenshot 11) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Active Job Cards */}
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Active Listing
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    9 of 14 Days Left
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{job.location} • ₹{job.salaryMinLPA}L - ₹{job.salaryMaxLPA}L LPA</p>

                {/* Performance Stats */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      Views:
                    </span>
                    <span className="font-bold text-slate-900">245</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Applications:</span>
                      <span className="font-bold text-slate-900">8 of 12</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '66%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => showToast('Edit Job', 'Opening job editor in modal...', 'info')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setCurrentPage('employer-candidates')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Applicants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Create New Listing Card */}
          <div 
            onClick={() => setIsPostJobModalOpen(true)}
            className="rounded-3xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center space-y-3 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-emerald-100 text-slate-500 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Create New Listing</h4>
              <p className="text-xs text-slate-500 mt-0.5">Post an opening to verified talent pool</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
