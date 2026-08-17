import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LiveHiringTicker: React.FC = () => {
  const { 
    promotionalBanners, 
    setSearchQuery, 
    setCurrentPage, 
    userRole,
    setIsBannerManagerModalOpen 
  } = useApp();

  const activeBanners = promotionalBanners.filter(b => b.isActive);

  if (activeBanners.length === 0) return null;

  const handleTickerClick = (companyName: string, roleQuery?: string) => {
    if (roleQuery) {
      setSearchQuery(roleQuery);
    } else {
      setSearchQuery(companyName);
    }
    setCurrentPage('jobs');
  };

  return (
    <div className="bg-slate-900 border-y border-slate-800 text-white overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-stretch">
        
        {/* Left Sticky Label */}
        <div className="bg-emerald-600 px-3 sm:px-4 py-2.5 flex items-center gap-2 z-20 shrink-0 font-bold text-xs shadow-md">
          <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
          <span className="tracking-wide uppercase text-[11px] sm:text-xs">Live Hiring Updates</span>
          <span className="hidden md:inline-block w-2 h-2 rounded-full bg-white animate-ping" />
        </div>

        {/* Scrolling Ticker Track */}
        <div className="flex-1 overflow-hidden relative py-2 flex items-center">
          {/* Subtle gradient fades on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

          {/* Marquee Container */}
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {/* Duplicated for seamless infinite loop */}
            {[...activeBanners, ...activeBanners].map((banner, index) => (
              <div
                key={`${banner.id}-${index}`}
                onClick={() => handleTickerClick(banner.companyName, banner.ctaParam || banner.hiringRoles[0])}
                className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 transition-all text-xs group shrink-0"
                title={`Click to view open positions at ${banner.companyName}`}
              >
                {/* Company Logo */}
                <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-800 border border-slate-600 shrink-0 flex items-center justify-center">
                  {banner.companyLogo ? (
                    <img 
                      src={banner.companyLogo} 
                      alt={banner.companyName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                {/* Company & Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {banner.companyName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>

                {/* Role & Package */}
                <span className="text-slate-400">•</span>
                <span className="text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50 text-[11px]">
                  {banner.hiringRoles[0] || 'Tech Roles'}
                </span>
                
                <span className="text-amber-300 font-mono text-[11px] font-bold">
                  {banner.salaryRange}
                </span>

                <span className="text-slate-500 text-[10px] hidden sm:inline">
                  ({banner.location})
                </span>

                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Editing controls are restricted to an authenticated Admin session. */}
        {userRole === 'admin' && (
          <div className="bg-slate-800/90 border-l border-slate-700 px-3 py-2 flex items-center shrink-0 z-20">
            <button
              id="admin-banner-ticker-btn"
              onClick={() => setIsBannerManagerModalOpen(true)}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 transition-colors"
              title="Manage live hiring banners"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage Banners</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
