export type UserRole = 'guest' | 'candidate' | 'employer' | 'admin';

export type PageView = 
  | 'home'
  | 'jobs'
  | 'job-details'
  | 'companies'
  | 'salary-insights'
  | 'pricing'
  | 'help-center'
  | 'candidate-dashboard'
  | 'candidate-applications'
  | 'candidate-saved'
  | 'candidate-profile'
  | 'employer-dashboard'
  | 'employer-jobs'
  | 'employer-candidates'
  | 'employer-interviews'
  | 'employer-settings'
  | 'admin-centre'
  | 'admin-hires'
  | 'admin-employers'
  | 'admin-moderation'
  | 'admin-invoices';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyAbout?: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  experienceMin: number;
  experienceMax: number;
  salaryMinLPA: number;
  salaryMaxLPA: number;
  jobType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  roleCategory: string;
  isVerified: boolean;
  isActivelyHiring: boolean;
  postedDaysAgo: number;
  postedHoursAgo?: number;
  description: string;
  responsibilities: string[];
  skills: string[];
  viewsCount: number;
  validityDaysLeft: number;
  totalValidityDays: number;
  applicationsCount: number;
  maxApplicationsTarget: number;
  planType: 'self-service' | 'assisted';
  status: 'active' | 'draft' | 'archived';
}

export type ApplicationStage = 'applied' | 'review' | 'interview' | 'offer' | 'hired' | 'rejected';

export interface CandidateApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  appliedDate: string;
  stage: ApplicationStage;
  stageNote?: string;
  nextStep?: string;
  interviewDate?: string;
  interviewRound?: string;
  ctcOffered?: string;
}

export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  currentCompany: string;
  experienceYears: number;
  skills: string[];
  avatarUrl: string;
  profileStrengthPercent: number;
  resumeUploaded: boolean;
  resumeFileName?: string;
  documentFileNames?: string[];
  portfolioUrl?: string;
  expectedCTCLPA: number;
  noticePeriodDays: number;
  dailyApplicationsUsed: number;
  dailyApplicationsMax: number;
}

export interface EmployerUsage {
  planName: string;
  resumeViewsUsed: number;
  resumeViewsMax: number;
  jobPostsUsed: number;
  jobPostsMax: number;
  validUntil: string;
  isPaid: boolean;
}

export interface UploadedDocumentRecord {
  id: number;
  userEmail: string;
  documentType: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: string;
}

export interface EmployerCandidate {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  yearsOfExperience?: number;
  skills: string[];
  location: string;
  avatarUrl: string;
  stage: 'new' | 'screening' | 'interview' | 'completed7days' | 'seven_day_completed' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  isFirstHire?: boolean;
  isFirstHirePromo?: boolean;
  interviewTime?: string;
  matchScore: number;
  expectedCTCLPA: number;
  noticePeriodDays: number;
  source: string;
  joiningDate?: string;
  onboardingProgress?: number;
  interviewDetails?: {
    round: string;
    scheduledFor: string;
    overallScore: number;
    techScore: number;
    cultureScore: number;
    feedbackNotes: string;
  };
  offerDetails?: {
    status: 'draft' | 'issued' | 'accepted' | 'declined';
    offeredBaseSalaryLPA: number;
    joiningBonusLPA?: number;
    proposedJoiningDate: string;
    offerLetterUrl?: string;
  };
}

export interface PlacementRecord {
  id: string;
  employerName: string;
  employerLogo?: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  jobService: string;
  joiningDate: string;
  sevenDayMarkDate: string;
  baseFeeINR: number;
  taxINR: number;
  totalFeeINR: number;
  status: 'Completed' | 'Pending 7-Day' | 'Disputed' | 'Invoiced' | 'Waived (Founding)';
  invoiceNumber?: string;
  isDisputed?: boolean;
  disputeReason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
}

export interface MockEmail {
  id: string;
  recipientEmail: string;
  recipientName: string;
  sender: string;
  senderName: string;
  subject: string;
  preview: string;
  sentAt: string;
  timestamp: number;
  statusType: 'interview' | 'rejected' | 'offer' | 'applied';
  jobTitle: string;
  company: string;
  companyLogo?: string;
  read: boolean;
  interviewDetails?: {
    round: string;
    scheduledTime: string;
    meetingLink: string;
    interviewerName?: string;
    interviewerRole?: string;
    instructions?: string;
  };
  rejectionDetails?: {
    feedbackSummary: string;
    retentionPolicy: string;
  };
  bodyHtml?: string;
}

export type BannerTier = 'Silver Ticker' | 'Gold Hero' | 'Platinum Spotlight' | 'Founding Free';

export interface PromotionalBanner {
  id: string;
  companyName: string;
  companyLogo: string;
  companyTagline?: string;
  badge: string;
  badgeColor: string;
  title: string;
  highlightText: string;
  description: string;
  hiringRoles: string[];
  salaryRange: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site' | 'Pan-India';
  ctaText: string;
  ctaAction: 'jobs' | 'pricing' | 'employer_reg' | 'search_tag' | 'apply';
  ctaParam?: string;
  statNumber: string;
  statLabel: string;
  bgGradient: string;
  accentBg?: string;
  
  // Payment & Management Details (From Employer / Admin Panel)
  paymentPlan: BannerTier;
  paymentStatus: 'Paid & Active' | 'Promo Granted' | 'Pending Payment' | 'Admin Approved' | 'Expired';
  paidAmountINR: number;
  startDate: string;
  expiresAt: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  contactEmail?: string;
}
