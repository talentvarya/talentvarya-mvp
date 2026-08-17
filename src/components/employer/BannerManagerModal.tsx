import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  CreditCard, 
  TrendingUp, 
  Flame, 
  Calendar, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Plus, 
  Edit3, 
  Trash2, 
  Power, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Zap,
  Globe,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromotionalBanner, BannerTier } from '../../types';

export const BannerManagerModal: React.FC = () => {
  const { 
    isBannerManagerModalOpen, 
    setIsBannerManagerModalOpen, 
    promotionalBanners, 
    addBanner, 
    updateBanner, 
    deleteBanner, 
    toggleBannerActive, 
    purchaseBannerBoost,
    selectedBannerForEdit,
    setSelectedBannerForEdit,
    userRole,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'pricing'>('campaigns');
  const [isEditing, setIsEditing] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Form State for Create / Edit
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyTagline, setCompanyTagline] = useState('');
  const [badge, setBadge] = useState('HIRING NOW');
  const [badgeColor, setBadgeColor] = useState('bg-amber-400 text-amber-950');
  const [title, setTitle] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [description, setDescription] = useState('');
  const [hiringRolesInput, setHiringRolesInput] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site' | 'Pan-India'>('Hybrid');
  const [statNumber, setStatNumber] = useState('');
  const [statLabel, setStatLabel] = useState('');
  const [ctaText, setCtaText] = useState('View Open Roles');
  const [selectedTier, setSelectedTier] = useState<BannerTier>('Gold Hero');
  const [bgGradient, setBgGradient] = useState('from-blue-950 via-slate-900 to-indigo-950');

  // Checkout modal / simulation
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [targetBoostBanner, setTargetBoostBanner] = useState<PromotionalBanner | null>(null);
  const [checkoutTier, setCheckoutTier] = useState<BannerTier>('Gold Hero');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card'>('razorpay');

  if (!isBannerManagerModalOpen || userRole !== 'admin') return null;

  const handleStartEdit = (banner: PromotionalBanner) => {
    setIsEditing(true);
    setEditingBannerId(banner.id);
    setCompanyName(banner.companyName);
    setCompanyLogo(banner.companyLogo);
    setCompanyTagline(banner.companyTagline || '');
    setBadge(banner.badge);
    setBadgeColor(banner.badgeColor);
    setTitle(banner.title);
    setHighlightText(banner.highlightText);
    setDescription(banner.description);
    setHiringRolesInput(banner.hiringRoles.join(', '));
    setSalaryRange(banner.salaryRange);
    setLocation(banner.location);
    setWorkMode(banner.workMode);
    setStatNumber(banner.statNumber);
    setStatLabel(banner.statLabel);
    setCtaText(banner.ctaText);
    setSelectedTier(banner.paymentPlan);
    setBgGradient(banner.bgGradient);
    setActiveTab('create');
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const roles = hiringRolesInput.split(',').map(r => r.trim()).filter(Boolean);

    const bannerData = {
      companyName,
      companyLogo,
      companyTagline,
      badge,
      badgeColor,
      title,
      highlightText,
      description,
      hiringRoles: roles.length > 0 ? roles : ['Hiring role to be confirmed'],
      salaryRange,
      location,
      workMode,
      statNumber,
      statLabel,
      ctaText,
      ctaAction: 'jobs' as const,
      paymentPlan: selectedTier,
      bgGradient
    };

    if (isEditing && editingBannerId) {
      updateBanner(editingBannerId, bannerData);
      setIsEditing(false);
      setEditingBannerId(null);
    } else {
      addBanner({
        ...bannerData,
        paymentStatus: selectedTier === 'Founding Free' ? 'Promo Granted' : 'Paid & Active',
        paidAmountINR: selectedTier === 'Silver Ticker' ? 2999 : selectedTier === 'Gold Hero' ? 5999 : selectedTier === 'Platinum Spotlight' ? 9999 : 0
      });
    }

    setActiveTab('campaigns');
  };

  const handleOpenBoostCheckout = (banner: PromotionalBanner, tier: BannerTier) => {
    setTargetBoostBanner(banner);
    setCheckoutTier(tier);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!targetBoostBanner) return;
    const tierPricing: Record<BannerTier, number> = {
      'Silver Ticker': 2999,
      'Gold Hero': 5999,
      'Platinum Spotlight': 9999,
      'Founding Free': 0
    };
    purchaseBannerBoost(targetBoostBanner.id, checkoutTier, tierPricing[checkoutTier]);
    setIsCheckoutOpen(false);
    setTargetBoostBanner(null);
  };

  const getTierPrice = (tier: BannerTier) => {
    switch (tier) {
      case 'Silver Ticker': return '₹2,999';
      case 'Gold Hero': return '₹5,999';
      case 'Platinum Spotlight': return '₹9,999';
      case 'Founding Free': return '₹0 (Free)';
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Promotions & Sponsored Banners Manager</h2>
                <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 text-[10px] font-black rounded-full uppercase">
                  Live System
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage front page ticker banners, hero rotation, and payment-tier boosts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBannerManagerModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('campaigns');
                setIsEditing(false);
              }}
              className={`py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'campaigns' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Campaigns ({promotionalBanners.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                if (!isEditing) {
                  setCompanyName('');
                  setTitle('');
                }
              }}
              className={`py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'create' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEditing ? '✏️ Edit Banner' : '+ Create / Launch New Banner'}
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'pricing' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              💎 Sponsorship Plans & Pricing
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            Real-time updates sync to front page instantly
          </span>
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          
          {/* TAB 1: ACTIVE CAMPAIGNS LIST */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live & Scheduled Promotional Banners</h3>
                  <p className="text-xs text-slate-500">
                    Banners active here rotate seamlessly in the front page top ticker and hero carousel.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setActiveTab('create');
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Sponsored Banner</span>
                </button>
              </div>

              {/* Banners Grid */}
              <div className="grid grid-cols-1 gap-4">
                {promotionalBanners.map(banner => (
                  <div 
                    key={banner.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                      banner.isActive ? 'border-slate-200' : 'border-slate-300 bg-slate-100/70 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left Company & Title */}
                      <div className="flex items-start gap-3.5">
                        <img 
                          src={banner.companyLogo} 
                          alt={banner.companyName} 
                          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shrink-0 shadow-sm"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                              <span>{banner.companyName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${banner.badgeColor}`}>
                              {banner.badge}
                            </span>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-[10px] font-bold">
                              ★ {banner.paymentPlan}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              banner.paymentStatus === 'Paid & Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              banner.paymentStatus === 'Promo Granted' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {banner.paymentStatus}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-slate-800">{banner.title} — <span className="text-emerald-700">{banner.highlightText}</span></p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                            <span>CTC: <strong className="text-slate-800">{banner.salaryRange}</strong></span>
                            <span>•</span>
                            <span>Loc: <strong className="text-slate-800">{banner.location} ({banner.workMode})</strong></span>
                            <span>•</span>
                            <span>Valid till: <strong className="text-slate-800">{banner.expiresAt}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right Metrics & Actions */}
                      <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                        {/* Impressions / Clicks */}
                        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Impressions</span>
                            <span className="font-bold text-slate-800 font-mono">{banner.impressions.toLocaleString()}</span>
                          </div>
                          <div className="w-px h-6 bg-slate-200" />
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Clicks</span>
                            <span className="font-bold text-emerald-700 font-mono">{banner.clicks.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Toggle Active Button */}
                        <button
                          onClick={() => toggleBannerActive(banner.id)}
                          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                            banner.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' 
                              : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                          }`}
                          title={banner.isActive ? 'Pause Banner on Front Page' : 'Activate Banner on Front Page'}
                        >
                          <Power className="w-4 h-4" />
                          <span className="hidden sm:inline">{banner.isActive ? 'Active' : 'Paused'}</span>
                        </button>

                        {/* Upgrade / Boost Tier Button */}
                        <button
                          onClick={() => handleOpenBoostCheckout(banner, 'Platinum Spotlight')}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Upgrade Tier / Boost Views"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Boost</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleStartEdit(banner)}
                          className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
                          title="Edit Banner Content"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          className="p-2 border border-rose-200 hover:bg-rose-50 rounded-xl text-rose-600 hover:text-rose-700 transition-colors"
                          title="Remove Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE / EDIT BANNER FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleSaveBanner} className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Company Identity & Logo</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Enter the registered company name"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Company Logo URL</label>
                    <input 
                      type="url" 
                      required
                      value={companyLogo}
                      onChange={e => setCompanyLogo(e.target.value)}
                      placeholder="https://... logo image link"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Company Tagline / Subheading</label>
                    <input 
                      type="text" 
                      value={companyTagline}
                      onChange={e => setCompanyTagline(e.target.value)}
                      placeholder="Enter a short company tagline"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Banner Message & Headlines */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Banner Copy & Requisition Highlights</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Event Badge Text</label>
                    <input 
                      type="text" 
                      value={badge}
                      onChange={e => setBadge(e.target.value)}
                      placeholder="e.g. HIRING NOW"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Main Heading</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter the approved campaign heading"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Highlight Catchphrase (Emerald)</label>
                    <input 
                      type="text" 
                      required
                      value={highlightText}
                      onChange={e => setHighlightText(e.target.value)}
                      placeholder="e.g. Hiring 50+ Backend & Cloud Architects"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hiring Roles (Comma separated)</label>
                    <input 
                      type="text" 
                      value={hiringRolesInput}
                      onChange={e => setHiringRolesInput(e.target.value)}
                      placeholder="e.g. Lead Golang Dev, React Architect, DevOps Lead"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target CTC Range</label>
                    <input 
                      type="text" 
                      value={salaryRange}
                      onChange={e => setSalaryRange(e.target.value)}
                      placeholder="e.g. ₹28 - ₹55 LPA + ESOPs"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location & Work Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. Bangalore / Remote"
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white text-xs"
                      />
                      <select 
                        value={workMode}
                        onChange={e => setWorkMode(e.target.value as any)}
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white text-xs"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Pan-India">Pan-India</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Description Paragraph</label>
                    <textarea 
                      rows={2}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Detailed overview for candidates..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Tier Selector */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Select Sponsorship Tier & Placement</span>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold">Includes 30-Day Rotation</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tier 1 */}
                  <div 
                    onClick={() => setSelectedTier('Silver Ticker')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-xs space-y-1.5 ${
                      selectedTier === 'Silver Ticker' 
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Silver Ticker</span>
                      <span className="font-bold text-emerald-700">₹2,999/mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Live 24/7 scrolling ticker placement with direct company logo & role tag.</p>
                  </div>

                  {/* Tier 2 */}
                  <div 
                    onClick={() => setSelectedTier('Gold Hero')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-xs space-y-1.5 ${
                      selectedTier === 'Gold Hero' 
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Gold Hero Carousel</span>
                      <span className="font-bold text-emerald-700">₹5,999/mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Front page hero rotating slide + Ticker inclusion + 5x candidate reach.</p>
                  </div>

                  {/* Tier 3 */}
                  <div 
                    onClick={() => setSelectedTier('Platinum Spotlight')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-xs space-y-1.5 ${
                      selectedTier === 'Platinum Spotlight' 
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Platinum Spotlight</span>
                      <span className="font-bold text-amber-700">₹9,999/mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Top sticky announcement bar + #1 Hero Carousel priority + Direct alerts.</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setActiveTab('campaigns');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : `Publish & Activate (${getTierPrice(selectedTier)})`}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PRICING & SPONSORSHIP TIERS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Promotional Banner Placement Tiers</h3>
                <p className="text-xs text-slate-600">
                  Boost your verified hiring campaign to over 100,000+ active pre-screened software engineers, product managers, and designers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Silver */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-md">
                        SILVER SPONSOR
                      </span>
                      <span className="text-xs font-mono text-slate-500">30 Days</span>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-slate-900">₹2,999</p>
                      <p className="text-xs text-slate-500">+ 18% GST (Tax Deductible)</p>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Live continuous scrolling ticker bar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Company logo + role pill highlight</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Instant click redirect to job postings</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTier('Silver Ticker');
                      setActiveTab('create');
                    }}
                    className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Select Silver Tier
                  </button>
                </div>

                {/* Gold Hero */}
                <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-lg space-y-4 flex flex-col justify-between relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Most Popular
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-200">
                        GOLD HERO CAROUSEL
                      </span>
                      <span className="text-xs font-mono text-slate-500">30 Days</span>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-slate-900">₹5,999</p>
                      <p className="text-xs text-slate-500">+ 18% GST (Tax Deductible)</p>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Front page Hero rotating slide</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Live scrolling ticker bar included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Custom company logo & gradient showcase</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>5x more candidate clicks & views</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTier('Gold Hero');
                      setActiveTab('create');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Select Gold Tier
                  </button>
                </div>

                {/* Platinum */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-md">
                        PLATINUM SPOTLIGHT
                      </span>
                      <span className="text-xs font-mono text-slate-400">30 Days</span>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-white">₹9,999</p>
                      <p className="text-xs text-slate-400">+ 18% GST</p>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Top sticky announcement alert bar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>#1 Hero Carousel placement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Direct simulated email/SMS candidate blast</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Priority 48-hr candidate interview matching</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTier('Platinum Spotlight');
                      setActiveTab('create');
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Select Platinum Tier
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* CHECKOUT SIMULATION MODAL */}
        {isCheckoutOpen && targetBoostBanner && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Upgrade & Boost Banner</h3>
                    <p className="text-[11px] text-slate-500">{targetBoostBanner.companyName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Selected Tier:</span>
                  <span className="text-emerald-700 font-bold">{checkoutTier}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Duration:</span>
                  <span>30 Days Active Rotation</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount (INR):</span>
                  <span className="font-mono text-emerald-700">{getTierPrice(checkoutTier)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-700">Choose Payment Method:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'razorpay' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Razorpay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Corp Card
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Payment gateway is not connected. This records an Admin approval and activates the banner.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Admin Approve & Activate</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
