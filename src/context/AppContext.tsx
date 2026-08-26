import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  PageView, 
  Job, 
  CandidateApplication, 
  CandidateProfile, 
  EmployerCandidate, 
  PlacementRecord,
  NotificationItem,
  MockEmail,
  PromotionalBanner,
  BannerTier,
  EmployerUsage
} from '../types';
import { 
  INITIAL_JOBS, 
  INITIAL_CANDIDATE_PROFILE, 
  INITIAL_CANDIDATE_APPLICATIONS, 
  INITIAL_EMPLOYER_CANDIDATES, 
  INITIAL_ADMIN_PLACEMENTS 
} from '../data/mockData';
import { INITIAL_BANNERS } from '../data/mockBanners';
import { 
  createMockInterviewEmail, 
  createMockRejectionEmail, 
  INITIAL_MOCK_EMAILS 
} from '../services/mockEmailService';
import {
  deletePromotionalBanner,
  loadDatabaseJobs,
  loadPromotionalBanners,
  recordResumeView,
  saveApplication,
  saveDatabaseJob,
  savePromotionalBanner,
} from '../services/databaseService';
import { getCurrentTalentUser } from '../services/authService';
import { supabase } from '../services/supabaseClient';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUserEmail: string;
  setCurrentUserEmail: (email: string) => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  
  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  locationFilter: string;
  setLocationFilter: (loc: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (type: string) => void;
  expFilter: string;
  setExpFilter: (exp: string) => void;
  minSalaryLPA: number;
  setMinSalaryLPA: (val: number) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;

  // Data
  jobs: Job[];
  addJob: (job: Partial<Job>) => Promise<boolean>;
  updateJob: (id: string, updates: Partial<Job>) => void;
  candidateProfile: CandidateProfile;
  updateCandidateProfile: (updates: Partial<CandidateProfile>) => void;
  candidateApplications: CandidateApplication[];
  applyToJob: (jobId: string, coverNote?: string) => Promise<boolean>;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;

  // Employer Data
  employerCandidates: EmployerCandidate[];
  employerUsage: EmployerUsage;
  openCandidateReview: (candidate: EmployerCandidate) => Promise<boolean>;
  moveCandidateStage: (
    candidateId: string, 
    newStage: EmployerCandidate['stage'],
    customDetails?: {
      round?: string;
      scheduledTime?: string;
      meetingLink?: string;
      feedbackReason?: string;
    }
  ) => void;
  activeCandidateForReview: EmployerCandidate | null;
  setActiveCandidateForReview: (cand: EmployerCandidate | null) => void;
  issueOffer: (candidateId: string, offerDetails: NonNullable<EmployerCandidate['offerDetails']>) => void;
  
  // Admin Data
  adminPlacements: PlacementRecord[];
  selectedPlacement: PlacementRecord | null;
  setSelectedPlacement: (plc: PlacementRecord | null) => void;
  generateInvoice: (placementId: string) => void;
  raiseDispute: (placementId: string, reason: string) => void;

  // Mock Email Notifications
  mockEmails: MockEmail[];
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: (open: boolean) => void;
  selectedEmail: MockEmail | null;
  setSelectedEmail: (email: MockEmail | null) => void;
  openEmailModal: (email?: MockEmail) => void;
  markEmailAsRead: (emailId: string) => void;
  deleteEmail: (emailId: string) => void;
  dispatchMockEmail: (email: MockEmail) => void;

  // Promotional Banners & Sponsorship Management
  promotionalBanners: PromotionalBanner[];
  addBanner: (banner: Partial<PromotionalBanner>) => void;
  updateBanner: (id: string, updates: Partial<PromotionalBanner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  purchaseBannerBoost: (bannerId: string, plan: BannerTier, amountINR: number) => void;
  isBannerManagerModalOpen: boolean;
  setIsBannerManagerModalOpen: (open: boolean) => void;
  selectedBannerForEdit: PromotionalBanner | null;
  setSelectedBannerForEdit: (banner: PromotionalBanner | null) => void;

  // Modals & Drawers
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalRole: 'candidate' | 'employer' | 'admin';
  setAuthModalRole: (role: 'candidate' | 'employer' | 'admin') => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;
  isProfileSetupModalOpen: boolean;
  setIsProfileSetupModalOpen: (open: boolean) => void;
  isEmployerRegisterModalOpen: boolean;
  setIsEmployerRegisterModalOpen: (open: boolean) => void;
  isCandidateReviewDrawerOpen: boolean;
  setIsCandidateReviewDrawerOpen: (open: boolean) => void;
  isOfferDrawerOpen: boolean;
  setIsOfferDrawerOpen: (open: boolean) => void;
  isPlacementDrawerOpen: boolean;
  setIsPlacementDrawerOpen: (open: boolean) => void;

  // Notifications / Toast
  notifications: NotificationItem[];
  showToast: (title: string, message: string, type?: NotificationItem['type']) => void;
  toastMessage: { title: string; message: string; type: NotificationItem['type'] } | null;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('sample-job-1');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [minSalaryLPA, setMinSalaryLPA] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Entities
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(INITIAL_CANDIDATE_PROFILE);
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplication[]>(INITIAL_CANDIDATE_APPLICATIONS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['sample-job-1']);
  const [employerCandidates, setEmployerCandidates] = useState<EmployerCandidate[]>(INITIAL_EMPLOYER_CANDIDATES);
  const [employerUsage, setEmployerUsage] = useState<EmployerUsage>({
    planName: 'Employer Free Trial',
    resumeViewsUsed: 1,
    resumeViewsMax: 12,
    jobPostsUsed: 2,
    jobPostsMax: 3,
    validUntil: new Date(Date.now() + 14 * 86400000).toISOString(),
    isPaid: false,
  });
  const [viewedCandidateIds, setViewedCandidateIds] = useState<string[]>([INITIAL_EMPLOYER_CANDIDATES[0]?.id].filter(Boolean) as string[]);
  const [adminPlacements, setAdminPlacements] = useState<PlacementRecord[]>(INITIAL_ADMIN_PLACEMENTS);
  const [activeCandidateForReview, setActiveCandidateForReview] = useState<EmployerCandidate | null>(INITIAL_EMPLOYER_CANDIDATES[0]);
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementRecord | null>(INITIAL_ADMIN_PLACEMENTS[0]);

  // Mock Emails
  const [mockEmails, setMockEmails] = useState<MockEmail[]>(INITIAL_MOCK_EMAILS);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<MockEmail | null>(null);

  // Promotional Banners
  const [promotionalBanners, setPromotionalBanners] = useState<PromotionalBanner[]>(INITIAL_BANNERS);
  const [isBannerManagerModalOpen, setBannerManagerModalOpen] = useState(false);
  const [selectedBannerForEdit, setSelectedBannerForEdit] = useState<PromotionalBanner | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'candidate' | 'employer' | 'admin'>('candidate');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isProfileSetupModalOpen, setIsProfileSetupModalOpen] = useState(false);
  const [isEmployerRegisterModalOpen, setIsEmployerRegisterModalOpen] = useState(false);
  const [isCandidateReviewDrawerOpen, setIsCandidateReviewDrawerOpen] = useState(false);
  const [isOfferDrawerOpen, setIsOfferDrawerOpen] = useState(false);
  const [isPlacementDrawerOpen, setIsPlacementDrawerOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; message: string; type: NotificationItem['type'] } | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Welcome to TalentVarya',
      message: 'Your dashboard contains only clearly labelled sample data until real employers publish jobs.',
      time: '10m ago',
      type: 'info',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Quota Reminder',
      message: 'You have 2 verified applications remaining today.',
      time: '1h ago',
      type: 'info',
      read: false
    }
  ]);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const account = await getCurrentTalentUser().catch(() => null);
      if (!active || !account) return;
      setCurrentUserEmail(account.email);
      setUserRole(account.role);
      if (account.role === 'candidate') {
        const nameParts = account.fullName.trim().split(/\s+/).filter(Boolean);
        setCandidateProfile(prev => ({
          ...prev,
          firstName: nameParts[0] || account.email.split('@')[0],
          lastName: nameParts.slice(1).join(' '),
          email: account.email,
        }));
      }
    };

    void restoreSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUserEmail('');
        setUserRole('guest');
        setCurrentPage('home');
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const showToast = (title: string, message: string, type: NotificationItem['type'] = 'success') => {
    setToastMessage({ title, message, type });
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title,
        message,
        time: 'Just now',
        type,
        read: false
      },
      ...prev
    ]);
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const setIsBannerManagerModalOpen = (open: boolean) => {
    if (open && userRole !== 'admin') {
      showToast('Admin Permission Required', 'Only an authorised TalentVarya administrator can create or edit homepage banners.', 'alert');
      return;
    }
    setBannerManagerModalOpen(open);
  };

  const openCandidateReview = async (candidate: EmployerCandidate): Promise<boolean> => {
    if (userRole !== 'employer') {
      showToast('Employer Access Required', 'Sign in with an employer account to view candidate resumes.', 'alert');
      return false;
    }

    const trialExpired = !employerUsage.isPaid && new Date(employerUsage.validUntil).getTime() < Date.now();
    const isNewResumeView = !viewedCandidateIds.includes(candidate.id);
    const limitReached = !employerUsage.isPaid && isNewResumeView && employerUsage.resumeViewsUsed >= employerUsage.resumeViewsMax;

    if (trialExpired || limitReached) {
      setCurrentPage('pricing');
      showToast(
        trialExpired ? '14-Day Free Access Ended' : '12 Resume Views Used',
        'A paid employer plan is required to continue viewing new candidate resumes.',
        'alert',
      );
      return false;
    }

    try {
      const result = await recordResumeView(currentUserEmail || 'temp.employer@talentvarya.test', candidate.id);
      if (isNewResumeView && result.resumeView.isNew) {
        setViewedCandidateIds(previous => [...previous, candidate.id]);
        setEmployerUsage(previous => ({ ...previous, resumeViewsUsed: result.resumeView.used }));
      }
      setActiveCandidateForReview(candidate);
      setIsCandidateReviewDrawerOpen(true);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Resume access could not be recorded.';
      setCurrentPage('pricing');
      showToast('Resume View Restricted', message, 'alert');
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;

    loadDatabaseJobs()
      .then(databaseJobs => {
        if (cancelled || databaseJobs.length === 0) return;
        setJobs(currentJobs => [
          ...databaseJobs,
          ...currentJobs.filter(job => !databaseJobs.some(databaseJob => databaseJob.id === job.id))
        ]);
      })
      .catch(error => {
        console.warn('TalentVarya local database is not available:', error);
      });

    loadPromotionalBanners()
      .then(databaseBanners => {
        if (!cancelled && databaseBanners.length > 0) setPromotionalBanners(databaseBanners);
      })
      .catch(error => console.warn('Saved promotional banners are not available:', error));

    return () => {
      cancelled = true;
    };
  }, []);

  const dispatchMockEmail = (email: MockEmail) => {
    setMockEmails(prev => [email, ...prev]);
  };

  const openEmailModal = (email?: MockEmail) => {
    if (email) {
      setSelectedEmail(email);
      markEmailAsRead(email.id);
    } else if (mockEmails.length > 0 && !selectedEmail) {
      setSelectedEmail(mockEmails[0]);
    }
    setIsEmailModalOpen(true);
  };

  const markEmailAsRead = (emailId: string) => {
    setMockEmails(prev => prev.map(em => em.id === emailId ? { ...em, read: true } : em));
  };

  const deleteEmail = (emailId: string) => {
    setMockEmails(prev => prev.filter(em => em.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const addJob = async (newJobData: Partial<Job>): Promise<boolean> => {
    const trialExpired = !employerUsage.isPaid && new Date(employerUsage.validUntil).getTime() < Date.now();
    if (!employerUsage.isPaid && (trialExpired || employerUsage.jobPostsUsed >= employerUsage.jobPostsMax)) {
      setCurrentPage('pricing');
      showToast(
        trialExpired ? '14-Day Free Access Ended' : '3 Free Job Posts Used',
        'A paid employer plan is required before another job can be posted.',
        'alert',
      );
      return false;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: newJobData.title || 'Software Engineer',
      company: newJobData.company || 'TalentVarya Partner',
      companyLogo: newJobData.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      companyAbout: newJobData.companyAbout || 'A leading tech organization expanding engineering capabilities.',
      location: newJobData.location || 'Bangalore, India',
      workMode: newJobData.workMode || 'Hybrid',
      experienceMin: newJobData.experienceMin ?? 2,
      experienceMax: newJobData.experienceMax ?? 5,
      salaryMinLPA: newJobData.salaryMinLPA ?? 12,
      salaryMaxLPA: newJobData.salaryMaxLPA ?? 18,
      jobType: newJobData.jobType || 'Full-Time',
      roleCategory: newJobData.roleCategory || 'Engineering',
      isVerified: true,
      isActivelyHiring: true,
      postedDaysAgo: 0,
      postedHoursAgo: 1,
      description: newJobData.description || 'Join our high-performing team to build scalable digital products.',
      responsibilities: newJobData.responsibilities?.length ? newJobData.responsibilities : ['Design and develop mission-critical components', 'Collaborate with cross-functional product teams'],
      skills: newJobData.skills?.length ? newJobData.skills : ['React', 'TypeScript', 'Node.js'],
      viewsCount: 1,
      validityDaysLeft: 14,
      totalValidityDays: 14,
      applicationsCount: 0,
      maxApplicationsTarget: newJobData.planType === 'assisted' ? 20 : 12,
      planType: newJobData.planType || 'self-service',
      status: 'active'
    };

    try {
      const savedJob = await saveDatabaseJob(newJob, currentUserEmail || 'temp.employer@talentvarya.test');
      setJobs(prev => [savedJob, ...prev.filter(job => job.id !== savedJob.id)]);
      setEmployerUsage(previous => ({ ...previous, jobPostsUsed: previous.jobPostsUsed + 1 }));
      showToast('Job Saved', `${savedJob.title} is active for 14 days. ${employerUsage.jobPostsUsed + 1}/${employerUsage.jobPostsMax} free posts used.`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save the job.';
      showToast('Job Could Not Be Saved', `${message} Make sure npm run dev is running.`, 'alert');
      return false;
    }
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
    showToast('Job Updated', 'The job listing was updated successfully.');
  };

  const updateCandidateProfile = (updates: Partial<CandidateProfile>) => {
    setCandidateProfile(prev => ({ ...prev, ...updates }));
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const applyToJob = async (jobId: string, coverNote?: string): Promise<boolean> => {
    if (candidateProfile.dailyApplicationsUsed >= candidateProfile.dailyApplicationsMax) {
      setCurrentPage('pricing');
      showToast('5 Free Applications Used', 'Your daily free limit is complete. A paid application plan is required for additional applications today.', 'alert');
      return false;
    }

    const job = jobs.find(j => j.id === jobId);
    if (!job) return false;

    // Check if already applied
    const alreadyApplied = candidateApplications.some(a => a.jobId === jobId);
    if (alreadyApplied) {
      showToast('Already Applied', `You have already applied for ${job.title} at ${job.company}.`, 'info');
      return false;
    }

    try {
      const savedApplication = await saveApplication(currentUserEmail || candidateProfile.email, jobId, coverNote);
      setCandidateProfile(prev => ({
        ...prev,
        dailyApplicationsUsed: savedApplication.application.usedToday
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Application could not be recorded.';
      if (message.toLowerCase().includes('payment') || message.includes('5 free')) setCurrentPage('pricing');
      showToast('Application Not Submitted', message, 'alert');
      return false;
    }

    const newApp: CandidateApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: `${job.location} (${job.workMode})`,
      workMode: job.workMode,
      appliedDate: 'Just now',
      stage: 'applied',
      stageNote: 'Application submitted successfully to verified recruiter queue.',
      nextStep: 'Under screening by recruitment team'
    };

    setCandidateApplications(prev => [newApp, ...prev]);
    // Update job application count
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicationsCount: j.applicationsCount + 1 } : j));

    // Also add to Employer candidate pool for live interaction
    const newEmpCandidate: EmployerCandidate = {
      id: `emp-c-${Date.now()}`,
      name: `${candidateProfile.firstName} ${candidateProfile.lastName}`,
      role: job.title,
      experienceYears: candidateProfile.experienceYears,
      skills: candidateProfile.skills,
      location: candidateProfile.location,
      avatarUrl: candidateProfile.avatarUrl,
      stage: 'new',
      jobId: job.id,
      jobTitle: job.title,
      appliedDate: 'Just now',
      matchScore: 92,
      expectedCTCLPA: candidateProfile.expectedCTCLPA,
      noticePeriodDays: candidateProfile.noticePeriodDays,
      source: 'Verified TalentVarya Apply'
    };
    setEmployerCandidates(prev => [newEmpCandidate, ...prev]);

    showToast('Application Submitted!', `Successfully applied to ${job.title} at ${job.company} (${candidateProfile.dailyApplicationsUsed + 1}/5 used today).`, 'success');
    return true;
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('Removed from Saved Jobs', 'Job removed from your saved list.', 'info');
        return prev.filter(id => id !== jobId);
      } else {
        showToast('Saved to My Jobs', 'Job added to your saved bookmarks.', 'success');
        return [...prev, jobId];
      }
    });
  };

  const moveCandidateStage = (
    candidateId: string, 
    newStage: EmployerCandidate['stage'],
    customDetails?: {
      round?: string;
      scheduledTime?: string;
      meetingLink?: string;
      feedbackReason?: string;
    }
  ) => {
    let candidateName = 'Candidate';
    let candidateRole = 'Software Engineer';
    let targetJob = jobs[0];
    const candidateObj = employerCandidates.find(c => c.id === candidateId);
    
    if (candidateObj) {
      candidateName = candidateObj.name;
      candidateRole = candidateObj.jobTitle || candidateObj.role;
      const foundJob = jobs.find(j => j.id === candidateObj.jobId);
      if (foundJob) targetJob = foundJob;
    }

    const recipientEmail = candidateName.toLowerCase().includes('priya') 
      ? candidateProfile.email 
      : `${candidateName.toLowerCase().replace(/\s+/g, '.')}@example.com`;

    // 1. Update candidate stage in state
    setEmployerCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return { 
          ...c, 
          stage: newStage,
          interviewDetails: newStage === 'interview' ? {
            round: customDetails?.round || c.interviewDetails?.round || 'Technical Round 2: System Architecture',
            scheduledFor: customDetails?.scheduledTime || c.interviewDetails?.scheduledFor || 'Tomorrow, 2:30 PM IST',
            overallScore: c.interviewDetails?.overallScore || 4.2,
            techScore: c.interviewDetails?.techScore || 4.5,
            cultureScore: c.interviewDetails?.cultureScore || 4.0,
            feedbackNotes: customDetails?.feedbackReason || c.interviewDetails?.feedbackNotes || 'Candidate advanced to interview pipeline.'
          } : c.interviewDetails
        };
      }
      return c;
    }));

    // 2. Also keep candidate applications updated
    if (newStage === 'interview') {
      setCandidateApplications(prev => prev.map(app => {
        if (app.jobId === candidateObj?.jobId || app.jobTitle === candidateRole) {
          return {
            ...app,
            stage: 'interview',
            stageNote: `Interview Scheduled: ${customDetails?.round || 'Technical Round 2'} at ${customDetails?.scheduledTime || 'Tomorrow, 2:30 PM IST'}`,
            interviewDate: customDetails?.scheduledTime || 'Tomorrow, 2:30 PM IST',
            interviewRound: customDetails?.round || 'Technical Round 2: System Architecture'
          };
        }
        return app;
      }));

      // 3. Trigger Mock Email Service for INTERVIEW
      const interviewEmail = createMockInterviewEmail({
        candidateName,
        candidateEmail: recipientEmail,
        jobTitle: candidateRole,
        company: targetJob.company,
        companyLogo: targetJob.companyLogo,
        round: customDetails?.round,
        scheduledTime: customDetails?.scheduledTime,
        meetingLink: customDetails?.meetingLink,
        instructions: 'Please be prepared to discuss architecture tradeoffs, past projects, and participate in live pair programming.'
      });

      dispatchMockEmail(interviewEmail);
      showToast('📧 Interview Email Dispatched', `Mock interview alert sent to ${recipientEmail}`, 'success');

    } else if (newStage === 'rejected') {
      setCandidateApplications(prev => prev.map(app => {
        if (app.jobId === candidateObj?.jobId || app.jobTitle === candidateRole) {
          return {
            ...app,
            stage: 'rejected',
            stageNote: 'Application evaluated - profile retained in Priority Talent Network.',
            nextStep: 'Browse other verified openings'
          };
        }
        return app;
      }));

      // 3. Trigger Mock Email Service for REJECTION
      const rejectionEmail = createMockRejectionEmail({
        candidateName,
        candidateEmail: recipientEmail,
        jobTitle: candidateRole,
        company: targetJob.company,
        companyLogo: targetJob.companyLogo,
        feedbackSummary: customDetails?.feedbackReason
      });

      dispatchMockEmail(rejectionEmail);
      showToast('📧 Status Email Dispatched', `Mock rejection notification sent to ${recipientEmail}`, 'info');
    } else {
      showToast('Candidate Stage Updated', `Candidate moved to ${newStage.toUpperCase()}`);
    }
  };

  const issueOffer = (candidateId: string, offerDetails: NonNullable<EmployerCandidate['offerDetails']>) => {
    setEmployerCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return {
          ...c,
          stage: 'offer',
          offerDetails: {
            ...offerDetails,
            status: 'issued'
          }
        };
      }
      return c;
    }));
    showToast('Offer Issued Successfully', `Formal job offer of ₹${offerDetails.offeredBaseSalaryLPA} LPA sent to candidate.`);
  };

  const generateInvoice = (placementId: string) => {
    const invNum = `INV-2024-${Math.floor(100 + Math.random() * 900)}`;
    setAdminPlacements(prev => prev.map(p => {
      if (p.id === placementId) {
        return {
          ...p,
          status: 'Invoiced',
          invoiceNumber: invNum
        };
      }
      return p;
    }));
    showToast('Invoice Generated', `Invoice ${invNum} dispatched to employer.`);
  };

  const raiseDispute = (placementId: string, reason: string) => {
    setAdminPlacements(prev => prev.map(p => {
      if (p.id === placementId) {
        return {
          ...p,
          status: 'Disputed',
          isDisputed: true,
          disputeReason: reason
        };
      }
      return p;
    }));
    showToast('Dispute Logged', 'Dispute reported to TalentVarya Trust & Safety Ops.', 'alert');
  };

  // Promotional Banner Handlers
  const addBanner = (newBannerData: Partial<PromotionalBanner>) => {
    if (userRole !== 'admin') {
      showToast('Admin Permission Required', 'Only an authorised administrator can create banners.', 'alert');
      return;
    }
    const newBanner: PromotionalBanner = {
      id: `banner-${Date.now()}`,
      companyName: newBannerData.companyName || 'Verified Employer',
      companyLogo: newBannerData.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      companyTagline: newBannerData.companyTagline || 'Verified Tech Hiring Partner',
      badge: newBannerData.badge || '🔥 FEATURED HIRING SPRINT',
      badgeColor: newBannerData.badgeColor || 'bg-amber-400 text-amber-950',
      title: newBannerData.title || 'Hiring Senior Tech Talent',
      highlightText: newBannerData.highlightText || 'Immediate Openings across India',
      description: newBannerData.description || 'Pre-screened engineering, product, and leadership requisitions with fast-track interviews.',
      hiringRoles: newBannerData.hiringRoles && newBannerData.hiringRoles.length > 0 ? newBannerData.hiringRoles : ['Hiring role to be confirmed'],
      salaryRange: newBannerData.salaryRange || '₹20 - ₹45 LPA',
      location: newBannerData.location || 'Bangalore & Remote',
      workMode: newBannerData.workMode || 'Hybrid',
      ctaText: newBannerData.ctaText || 'View Openings',
      ctaAction: newBannerData.ctaAction || 'jobs',
      ctaParam: newBannerData.ctaParam || '',
      statNumber: newBannerData.statNumber || '20+ Openings',
      statLabel: newBannerData.statLabel || 'Active Requisitions',
      bgGradient: newBannerData.bgGradient || 'from-emerald-950 via-slate-900 to-indigo-950',
      paymentPlan: newBannerData.paymentPlan || 'Gold Hero',
      paymentStatus: newBannerData.paymentStatus || 'Paid & Active',
      paidAmountINR: newBannerData.paidAmountINR ?? 5999,
      startDate: newBannerData.startDate || new Date().toISOString().split('T')[0],
      expiresAt: newBannerData.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isActive: true,
      impressions: 120,
      clicks: 8,
      contactEmail: newBannerData.contactEmail || 'hiring@employer.com'
    };

    setPromotionalBanners(prev => [newBanner, ...prev]);
    void savePromotionalBanner(newBanner).catch(error => {
      showToast('Banner Not Persisted', error instanceof Error ? error.message : 'Banner could not be saved.', 'alert');
    });
    showToast('Banner Published', `Promotional banner for "${newBanner.companyName}" is now live on front page!`);
  };

  const updateBanner = (id: string, updates: Partial<PromotionalBanner>) => {
    if (userRole !== 'admin') {
      showToast('Admin Permission Required', 'Only an authorised administrator can edit banners.', 'alert');
      return;
    }
    const existingBanner = promotionalBanners.find(banner => banner.id === id);
    if (!existingBanner) return;
    const updatedBanner = { ...existingBanner, ...updates };
    setPromotionalBanners(prev => prev.map(b => b.id === id ? updatedBanner : b));
    void savePromotionalBanner(updatedBanner).catch(error => {
      showToast('Banner Not Persisted', error instanceof Error ? error.message : 'Banner could not be saved.', 'alert');
    });
    showToast('Banner Updated', 'Promotional campaign settings updated successfully.');
  };

  const deleteBanner = (id: string) => {
    if (userRole !== 'admin') {
      showToast('Admin Permission Required', 'Only an authorised administrator can remove banners.', 'alert');
      return;
    }
    setPromotionalBanners(prev => prev.filter(b => b.id !== id));
    void deletePromotionalBanner(id).catch(error => {
      showToast('Banner Delete Not Persisted', error instanceof Error ? error.message : 'Banner could not be removed.', 'alert');
    });
    showToast('Banner Removed', 'Promotional banner has been removed from rotation.');
  };

  const toggleBannerActive = (id: string) => {
    if (userRole !== 'admin') {
      showToast('Admin Permission Required', 'Only an authorised administrator can change banner status.', 'alert');
      return;
    }
    const existingBanner = promotionalBanners.find(banner => banner.id === id);
    if (!existingBanner) return;
    const updatedBanner = { ...existingBanner, isActive: !existingBanner.isActive };
    setPromotionalBanners(prev => prev.map(b => b.id === id ? updatedBanner : b));
    void savePromotionalBanner(updatedBanner).catch(error => {
      showToast('Banner Status Not Persisted', error instanceof Error ? error.message : 'Banner status could not be saved.', 'alert');
    });
    showToast(updatedBanner.isActive ? 'Banner Activated' : 'Banner Paused', `Banner for ${updatedBanner.companyName} is now ${updatedBanner.isActive ? 'active on front page' : 'paused'}.`);
  };

  const purchaseBannerBoost = (bannerId: string, plan: BannerTier, amountINR: number) => {
    if (userRole !== 'admin') {
      showToast('Admin Permission Required', 'Only an authorised administrator can activate banner plans.', 'alert');
      return;
    }
    const expires = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const existingBanner = promotionalBanners.find(banner => banner.id === bannerId);
    if (!existingBanner) return;
    const updatedBanner: PromotionalBanner = {
      ...existingBanner,
      paymentPlan: plan,
      paymentStatus: 'Admin Approved',
      paidAmountINR: 0,
      expiresAt: expires,
      isActive: true
    };
    setPromotionalBanners(prev => prev.map(b => b.id === bannerId ? updatedBanner : b));
    void savePromotionalBanner(updatedBanner).catch(error => {
      showToast('Banner Plan Not Persisted', error instanceof Error ? error.message : 'Banner plan could not be saved.', 'alert');
    });
    showToast('Banner Activated by Admin', `${plan} was activated for 30 days. No online payment was collected; listed rate ₹${amountINR.toLocaleString('en-IN')}.`, 'info');
  };

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      currentUserEmail,
      setCurrentUserEmail,
      currentPage,
      setCurrentPage,
      selectedJobId,
      setSelectedJobId,

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

      jobs,
      addJob,
      updateJob,
      candidateProfile,
      updateCandidateProfile,
      candidateApplications,
      applyToJob,
      savedJobIds,
      toggleSaveJob,

      employerCandidates,
      employerUsage,
      openCandidateReview,
      moveCandidateStage,
      activeCandidateForReview,
      setActiveCandidateForReview,
      issueOffer,

      adminPlacements,
      selectedPlacement,
      setSelectedPlacement,
      generateInvoice,
      raiseDispute,

      // Mock Emails
      mockEmails,
      isEmailModalOpen,
      setIsEmailModalOpen,
      selectedEmail,
      setSelectedEmail,
      openEmailModal,
      markEmailAsRead,
      deleteEmail,
      dispatchMockEmail,

      // Promotional Banners
      promotionalBanners,
      addBanner,
      updateBanner,
      deleteBanner,
      toggleBannerActive,
      purchaseBannerBoost,
      isBannerManagerModalOpen,
      setIsBannerManagerModalOpen,
      selectedBannerForEdit,
      setSelectedBannerForEdit,

      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalRole,
      setAuthModalRole,
      isApplyModalOpen,
      setIsApplyModalOpen,
      isPostJobModalOpen,
      setIsPostJobModalOpen,
      isProfileSetupModalOpen,
      setIsProfileSetupModalOpen,
      isEmployerRegisterModalOpen,
      setIsEmployerRegisterModalOpen,
      isCandidateReviewDrawerOpen,
      setIsCandidateReviewDrawerOpen,
      isOfferDrawerOpen,
      setIsOfferDrawerOpen,
      isPlacementDrawerOpen,
      setIsPlacementDrawerOpen,

      notifications,
      showToast,
      toastMessage,
      clearToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
