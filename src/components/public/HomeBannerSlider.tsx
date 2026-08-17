import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Gift,
  Flame,
  Award,
  Clock,
  Settings,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromotionalBanner } from '../../types';

export const HomeBannerSlider: React.FC = () => {
  const { 
    promotionalBanners,
    setCurrentPage, 
    setIsEmployerRegisterModalOpen, 
    setSearchQuery,
    setLocationFilter,
    setIsBannerManagerModalOpen,
    userRole
  } = useApp();

  const activeBanners = promotionalBanners.filter(b => b.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Safeguard index if banners array changes
  useEffect(() => {
    if (currentIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  // Auto-rotating timer every 5 seconds
  useEffect(() => {
    if (!isAutoPlay || activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleAction = (banner: PromotionalBanner) => {
    if (banner.ctaAction === 'jobs') {
      if (banner.ctaParam) setSearchQuery(banner.ctaParam);
      setCurrentPage('jobs');
    } else if (banner.ctaAction === 'search_tag') {
      if (banner.ctaParam === 'Remote') {
        setLocationFilter('Remote');
      } else if (banner.ctaParam) {
        setSearchQuery(banner.ctaParam);
      }
      setCurrentPage('jobs');
    } else if (banner.ctaAction === 'employer_reg') {
      setIsEmployerRegisterModalOpen(true);
    } else if (banner.ctaAction === 'pricing') {
      setCurrentPage('pricing');
    } else {
      setSearchQuery(banner.companyName);
      setCurrentPage('jobs');
    }
  };

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white mb-8 transition-all group/banner"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background with dynamic gradient */}
      <div className={`bg-gradient-to-r ${currentBanner.bgGradient} p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all duration-500`}>
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Copy & Company Info */}
          <div className="lg:col-span-8 space-y-4 text-left">
            
            {/* Top Bar: Badge & Company Tag */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1.5 ${currentBanner.badgeColor}`}>
                <Flame className="w-3.5 h-3.5" />
                <span>{currentBanner.badge}</span>
              </span>

              {/* Company Identity Pill with Logo */}
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 text-xs font-semibold text-slate-200">
                <img 
                  src={currentBanner.companyLogo} 
                  alt={currentBanner.companyName} 
                  className="w-4 h-4 rounded-full object-cover border border-slate-600"
                />
                <span className="font-bold text-white">{currentBanner.companyName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              {/* Payment Tier Tag */}
              <span className="hidden sm:inline-flex text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                ★ {currentBanner.paymentPlan}
              </span>
            </div>

            {/* Banner Main Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {currentBanner.title} <br className="hidden sm:inline" />
                <span className="text-emerald-400">{currentBanner.highlightText}</span>
              </h2>
              {currentBanner.companyTagline && (
                <p className="text-xs text-emerald-300/80 font-medium mt-1">
                  {currentBanner.companyTagline}
                </p>
              )}
            </div>

            {/* Banner Description */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-medium">
              {currentBanner.description}
            </p>

            {/* Hiring Roles Tags */}
            {currentBanner.hiringRoles && currentBanner.hiringRoles.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Openings:</span>
                </span>
                {currentBanner.hiringRoles.map((role, rIdx) => (
                  <span 
                    key={rIdx}
                    onClick={() => {
                      setSearchQuery(role);
                      setCurrentPage('jobs');
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-100 text-[11px] font-semibold rounded-lg border border-white/15 cursor-pointer transition-colors"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}

            {/* CTA & Verified Tags */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id={`banner-cta-btn-${currentBanner.id}`}
                onClick={() => handleAction(currentBanner)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <span>{currentBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Direct Requisition</span>
              </div>
            </div>
          </div>

          {/* Right Highlight Stats & Company Card */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-700/90 shadow-xl space-y-4 text-left">
              
              {/* Company Showcase Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <img 
                  src={currentBanner.companyLogo} 
                  alt={currentBanner.companyName} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{currentBanner.companyName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{currentBanner.location}</span>
                  </p>
                </div>
              </div>

              {/* Package & Key Metric */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Compensation</span>
                <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                  {currentBanner.salaryRange}
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">{currentBanner.statNumber}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-bold border border-emerald-800">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{currentBanner.statLabel}</p>
              </div>

              {/* Banner controls are visible only in an authenticated Admin session. */}
              {userRole === 'admin' && (
                <button
                  onClick={() => setIsBannerManagerModalOpen(true)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  title="Manage or update promotional banners from Admin Centre"
                >
                  <Settings className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin: Manage Banners</span>
                </button>
              )}

            </div>
          </div>

        </div>

        {/* Carousel Navigation Controls & Indicator Dots */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeBanners.map((banner, idx) => (
              <button
                key={banner.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline font-mono">
              {currentIndex + 1} of {activeBanners.length} Live Campaigns
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentIndex(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Previous Banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentIndex(prev => (prev + 1) % activeBanners.length)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Next Banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
