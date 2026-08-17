import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Briefcase, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const JobSearchPage: React.FC = () => {
  const { 
    jobs, 
    searchQuery, 
    setSearchQuery, 
    locationFilter, 
    setLocationFilter, 
    jobTypeFilter, 
    setJobTypeFilter, 
    expFilter, 
    setExpFilter, 
    minSalaryLPA, 
    setMinSalaryLPA, 
    verifiedOnly, 
    setVerifiedOnly,
    savedJobIds, 
    toggleSaveJob, 
    setSelectedJobId, 
    setCurrentPage, 
    setIsApplyModalOpen,
    candidateProfile
  } = useApp();

  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [selectedExpLevels, setSelectedExpLevels] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

  // Clear all filters
  const handleClearAll = () => {
    setSearchQuery('');
    setLocationFilter('All');
    setJobTypeFilter('All');
    setExpFilter('All');
    setMinSalaryLPA(0);
    setVerifiedOnly(false);
    setSelectedExpLevels([]);
    setSelectedJobTypes([]);
    setSelectedWorkModes([]);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Title / Skills query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkills = job.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }

      // Location
      if (locationFilter !== 'All' && locationFilter.trim()) {
        if (!job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }

      // Salary
      if (job.salaryMaxLPA < minSalaryLPA) return false;

      // Active listings only
      if (job.status !== 'active' || job.validityDaysLeft <= 0) return false;

      // Verified
      if (verifiedOnly && !job.isVerified) return false;

      // Job Types
      if (selectedJobTypes.length > 0) {
        if (!selectedJobTypes.includes(job.jobType)) return false;
      }

      if (jobTypeFilter !== 'All' && job.jobType !== jobTypeFilter) return false;

      // Work mode
      if (selectedWorkModes.length > 0 && !selectedWorkModes.includes(job.workMode)) return false;

      // Experience overlap
      const matchesExperience = (level: string) => {
        if (level === 'entry') return job.experienceMin <= 2;
        if (level === 'mid') return job.experienceMin <= 5 && job.experienceMax >= 3;
        if (level === 'senior') return job.experienceMax >= 5;
        return true;
      };
      if (selectedExpLevels.length > 0 && !selectedExpLevels.some(matchesExperience)) return false;
      if (expFilter !== 'All' && !matchesExperience(expFilter)) return false;

      return true;
    });
  }, [jobs, searchQuery, locationFilter, minSalaryLPA, verifiedOnly, selectedJobTypes, selectedWorkModes, selectedExpLevels, jobTypeFilter, expFilter]);

  const toggleExpLevel = (level: string) => {
    setSelectedExpLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleJobType = (type: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleWorkMode = (mode: string) => {
    setSelectedWorkModes(prev =>
      prev.includes(mode) ? prev.filter(item => item !== mode) : [...prev, mode]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 mb-6 flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              id="job-search-query-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, technology (React, Python), or company..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full md:w-64 flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              id="job-search-location-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none font-medium cursor-pointer"
            >
              <option value="All">All Locations in India</option>
              <option value="Bangalore">Bangalore, Karnataka</option>
              <option value="Mumbai">Mumbai, Maharashtra</option>
              <option value="Delhi">Delhi NCR / Gurgaon</option>
              <option value="Hyderabad">Hyderabad, Telangana</option>
              <option value="Pune">Pune, Maharashtra</option>
              <option value="Remote">Remote Only</option>
            </select>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filters Sidebar (Screenshot 2) */}
          <aside className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Filters</h3>
              </div>
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Job Type (Full-time, Part-time, Contract, Internship) */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wider">
                Job Type
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                {[
                  { label: 'Full-time', val: 'Full-Time', count: 1245 },
                  { label: 'Part-time', val: 'Part-Time', count: 180 },
                  { label: 'Contract', val: 'Contract', count: 320 },
                  { label: 'Internship', val: 'Internship', count: 95 }
                ].map(item => (
                  <label key={item.val} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedJobTypes.includes(item.val)}
                        onChange={() => toggleJobType(item.val)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                      />
                      <span className="group-hover:text-slate-900">{item.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({item.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level (Entry Level 0-2 Yrs, Mid Level 3-5 Yrs, Senior Level 5+ Yrs) */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wider">
                Experience Level
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                {[
                  { label: 'Entry Level (0-2 Yrs)', val: 'entry', count: 410 },
                  { label: 'Mid Level (3-5 Yrs)', val: 'mid', count: 850 },
                  { label: 'Senior Level (5+ Yrs)', val: 'senior', count: 520 }
                ].map(item => (
                  <label key={item.val} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedExpLevels.includes(item.val)}
                        onChange={() => toggleExpLevel(item.val)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                      />
                      <span className="group-hover:text-slate-900">{item.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({item.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range (₹ LPA) Slider */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wider">
                Work Mode
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                {['On-site', 'Hybrid', 'Remote'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedWorkModes.includes(mode)}
                      onChange={() => toggleWorkMode(mode)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range (₹ LPA) Slider */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Salary Range (₹ LPA)
                </h4>
                <span className="text-xs font-bold text-emerald-700">
                  {minSalaryLPA > 0 ? `₹${minSalaryLPA}L+ LPA` : 'Any'}
                </span>
              </div>
              <input
                id="salary-slider"
                type="range"
                min="0"
                max="40"
                step="2"
                value={minSalaryLPA}
                onChange={(e) => setMinSalaryLPA(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                <span>₹0</span>
                <span>₹12L+</span>
                <span>₹50L+</span>
              </div>
            </div>

            {/* Verified Employer Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Employers Only
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">100% MCA & GSTIN audited</span>
                </div>
              </label>
            </div>
          </aside>

          {/* Right Column: Search Results List (Screenshot 2) */}
          <main className="lg:col-span-8 space-y-4 text-left">
            {/* Results Header + Daily Applications Quota Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {searchQuery ? `"${searchQuery}" Jobs` : 'Software & Tech Jobs in India'}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredJobs.length} verified results
                </p>
              </div>

              {/* Quota Badge (Screenshot 2) */}
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
                <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Today's Applications: <strong>{candidateProfile.dailyApplicationsUsed} of {candidateProfile.dailyApplicationsMax} used</strong>
                </span>
              </div>
            </div>

            {/* Results List */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No matching jobs found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria, salary range slider, or clearing active filters.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-left group"
                  >
                    {/* Top Row: Company & Title */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setCurrentPage('job-details');
                              }}
                              className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              {job.title}
                            </h3>
                            {job.isVerified && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{job.company}</p>
                        </div>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        title={isSaved ? 'Remove from Saved' : 'Save Job'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Meta Highlights Row */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 mb-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1 font-semibold text-slate-900">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>₹{job.salaryMinLPA}L - ₹{job.salaryMaxLPA}L LPA</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location} ({job.workMode})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.experienceMin}-{job.experienceMax} Yrs</span>
                      </div>
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.postedHoursAgo ? `Posted ${job.postedHoursAgo}h ago` : `Posted ${job.postedDaysAgo}d ago`}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setCurrentPage('job-details');
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setIsApplyModalOpen(true);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination Controls (Screenshot 2) */}
            <div className="pt-6 flex items-center justify-center gap-2">
              <button 
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPageNum(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                    currentPageNum === num 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}

              <span className="px-1 text-slate-400 text-xs">...</span>

              <button
                onClick={() => setCurrentPageNum(12)}
                className="w-8 h-8 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                12
              </button>

              <button 
                onClick={() => setCurrentPageNum(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};
