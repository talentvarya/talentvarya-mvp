import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Check, 
  Bookmark,
  BookmarkCheck,
  Zap,
  Megaphone,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HomeBannerSlider } from './HomeBannerSlider';
import { LiveHiringTicker } from './LiveHiringTicker';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentPage, 
    setSelectedJobId, 
    setIsApplyModalOpen, 
    jobs, 
    savedJobIds, 
    toggleSaveJob,
    setIsEmployerRegisterModalOpen,
    searchQuery,
    setSearchQuery,
    locationFilter,
    setLocationFilter
  } = useApp();

  const [localTitle, setLocalTitle] = useState('');
  const [localLoc, setLocalLoc] = useState('');
  const [showTopAlert, setShowTopAlert] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localTitle) setSearchQuery(localTitle);
    if (localLoc) setLocationFilter(localLoc);
    setCurrentPage('jobs');
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setCurrentPage('jobs');
  };

  const popularTags = [
    'Data Scientist',
    'Product Manager',
    'Java Developer',
    'React Developer',
    'UI/UX Designer',
    'DevOps Engineer'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Interactive Announcement Banner Bar */}
      {showTopAlert && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white px-4 py-2 text-xs font-medium relative flex items-center justify-between border-b border-emerald-600/40 shadow-xs animate-in fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Megaphone className="w-3 h-3" />
              <span>Special Drive</span>
            </span>
            <span className="text-slate-100 font-semibold">
              Mega Tech Hiring Drive 2025: 500+ Verified Companies Hiring Immediate Joiners Across India!
            </span>
            <button
              onClick={() => {
                setSearchQuery('React Developer');
                setCurrentPage('jobs');
              }}
              className="underline hover:text-amber-300 font-bold ml-1 transition-colors flex items-center gap-0.5"
            >
              <span>Explore Roles</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={() => setShowTopAlert(false)}
            className="text-emerald-200 hover:text-white p-1 rounded-md hover:bg-white/10 shrink-0"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Live Continuous Scrolling Hiring Updates Ticker */}
      <LiveHiringTicker />

      {/* Hero Section (Matches Screenshot 1) */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden pt-10 pb-16">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Hero Text & Search (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>India's 100% Verified Candidate Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Find Your Next Big <br />
                <span className="text-emerald-600">Opportunity in India</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Connect with thousands of verified employers actively seeking talent across IT, Finance, Healthcare, and emerging sectors.
              </p>

              {/* Search Bar (Screenshot 1) */}
              <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:bg-white focus-within:border-emerald-500">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    placeholder="Job Title, Skills, or..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:bg-white focus-within:border-emerald-500">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={localLoc}
                    onChange={(e) => setLocalLoc(e.target.value)}
                    placeholder="City or Remote"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    id="hero-search-btn"
                    type="submit"
                    className="w-full h-full min-h-[42px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Search Jobs</span>
                  </button>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-500 font-medium">Popular:</span>
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition-colors text-xs font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Founding Employer Offer Card (Screenshot 1) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden text-left">
                {/* Accent design badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    ★ For Employers
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                    Limited Time Offer
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                  Founding Employer Offer
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  Start with 14 days of free employer access, up to 3 job posts and 12 unique resume views. Upgrade only after the trial limit.
                </p>

                <div className="space-y-2.5 mb-6 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3 Free Job Posts for 14 Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free Business & GSTIN Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>HireStream ATS Access Included</span>
                  </div>
                </div>

                <button
                  id="claim-offer-landing-btn"
                  onClick={() => {
                    setIsEmployerRegisterModalOpen(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Claim Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Stats Row (Screenshot 1) */}
      <section className="bg-slate-900 text-white py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:divide-x sm:divide-slate-800">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">50,000+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Active Verified Jobs</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">12,000+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Verified Companies</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Safety Checked & Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section with Interactive Banner Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        {/* Dynamic Interactive Banner Carousel */}
        <HomeBannerSlider />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Featured Opportunities in Top Tech Hubs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hand-verified roles in Bangalore, Mumbai, Delhi NCR, Hyderabad, and Remote
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('jobs')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All 1,245 Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 6).map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            return (
              <div 
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Top company logo & save */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={job.companyLogo} 
                        alt={job.company} 
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      title={isSaved ? 'Remove from Saved' : 'Save Job'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                      Verified
                    </span>
                    <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                      {job.workMode}
                    </span>
                    <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                      {job.jobType}
                    </span>
                  </div>

                  {/* Meta details */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-900">₹{job.salaryMinLPA}L - ₹{job.salaryMaxLPA}L LPA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.experienceMin}-{job.experienceMax} Years Exp</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded border border-slate-200 font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {job.postedHoursAgo ? `${job.postedHoursAgo}h ago` : `${job.postedDaysAgo}d ago`}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setCurrentPage('job-details');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setIsApplyModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Talentvarya Banner */}
      <section className="bg-emerald-950 text-white py-14 border-t border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Engineered for Trust
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Zero Scam Jobs. 100% Direct Recruiter Connections.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Unlike generic job boards that flood you with unpaid spam, <span className="text-blue-400 font-bold">Talent</span><span className="text-emerald-400 font-bold">varya</span> guarantees genuine corporate opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Daily Quota Protection</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                5 targeted applications per day ensure hiring managers carefully read every resume instead of filtering out thousands of bot submissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">GSTIN Verified Employers</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every business passes MCA database cross-checking, corporate domain verification, and PAN authentication.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Pay-After-Joining for Hiring</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Employers only pay success fees after the candidate finishes 7 full days of successful onboarding.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
