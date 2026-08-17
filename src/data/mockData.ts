import { Job, CandidateApplication, CandidateProfile, EmployerCandidate, PlacementRecord } from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'sample-job-1',
    title: 'Sample: Admin & MIS Executive',
    company: 'TalentVarya Sample Employer',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    companyAbout: 'Demonstration employer profile used only to preview the TalentVarya job-search experience.',
    location: 'New Delhi, India',
    workMode: 'On-site',
    experienceMin: 1,
    experienceMax: 4,
    salaryMinLPA: 3,
    salaryMaxLPA: 5,
    jobType: 'Full-Time',
    roleCategory: 'Administration',
    isVerified: false,
    isActivelyHiring: true,
    postedDaysAgo: 0,
    postedHoursAgo: 1,
    description: 'SAMPLE JOB — DO NOT APPLY. This listing demonstrates the job details, search filters and application interface.',
    responsibilities: [
      'Maintain office records and prepare regular MIS reports.',
      'Coordinate administrative tasks and vendor documentation.',
      'Support Excel-based reporting and data accuracy.'
    ],
    skills: ['MS Excel', 'MIS Reporting', 'Administration', 'Coordination'],
    viewsCount: 12,
    validityDaysLeft: 14,
    totalValidityDays: 14,
    applicationsCount: 0,
    maxApplicationsTarget: 12,
    planType: 'self-service',
    status: 'active'
  },
  {
    id: 'sample-job-2',
    title: 'Sample: HR Recruiter',
    company: 'TalentVarya Sample Employer',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    companyAbout: 'Demonstration employer profile used only to preview the TalentVarya employer and candidate workflows.',
    location: 'Gurugram, India',
    workMode: 'Hybrid',
    experienceMin: 1,
    experienceMax: 3,
    salaryMinLPA: 3.5,
    salaryMaxLPA: 6,
    jobType: 'Full-Time',
    roleCategory: 'Human Resources',
    isVerified: false,
    isActivelyHiring: true,
    postedDaysAgo: 0,
    postedHoursAgo: 2,
    description: 'SAMPLE JOB — DO NOT APPLY. This listing demonstrates resume matching and employer ATS screens.',
    responsibilities: [
      'Screen applications and coordinate interview schedules.',
      'Maintain candidate records and recruitment reports.',
      'Communicate status updates to candidates and hiring managers.'
    ],
    skills: ['Recruitment', 'Screening', 'Communication', 'MS Excel'],
    viewsCount: 9,
    validityDaysLeft: 14,
    totalValidityDays: 14,
    applicationsCount: 0,
    maxApplicationsTarget: 12,
    planType: 'self-service',
    status: 'active'
  }
];

export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'cand-1',
  firstName: 'Priya',
  lastName: 'Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, Karnataka, India',
  headline: 'Senior UI/UX & Product Designer | 5+ YOE in FinTech & SaaS',
  currentCompany: 'TechNova Solutions (Former)',
  experienceYears: 5,
  skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility (WCAG)', 'HTML/CSS'],
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
  profileStrengthPercent: 85,
  resumeUploaded: true,
  resumeFileName: 'Priya_Sharma_Product_Design_2025.pdf',
  portfolioUrl: 'https://priyasharma.design',
  expectedCTCLPA: 22,
  noticePeriodDays: 30,
  dailyApplicationsUsed: 0,
  dailyApplicationsMax: 5
};

export const INITIAL_CANDIDATE_APPLICATIONS: CandidateApplication[] = [
  {
    id: 'app-1',
    jobId: 'sample-job-1',
    jobTitle: 'Sample: Admin & MIS Executive',
    company: 'TalentVarya Sample Employer',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    location: 'New Delhi (On-site)',
    workMode: 'On-site',
    appliedDate: 'Yesterday',
    stage: 'interview',
    stageNote: 'Tech Round tomorrow at 2:00 PM IST with Design Director',
    nextStep: 'Prepare System Design Deck',
    interviewDate: 'Tomorrow, 2:00 PM IST',
    interviewRound: 'Technical Round 2: Design Systems & Workflow',
    ctcOffered: '₹22 - 25 LPA'
  },
  {
    id: 'app-2',
    jobId: 'sample-job-2',
    jobTitle: 'Sample: HR Recruiter',
    company: 'TalentVarya Sample Employer',
    companyLogo: 'https://images.unsplash.com/photo-1554774853-d50f9c681ae2?w=120&auto=format&fit=crop&q=80',
    location: 'Gurugram (Hybrid)',
    workMode: 'Hybrid',
    appliedDate: '3 days ago',
    stage: 'review',
    stageNote: 'Your profile has passed initial recruiter screening and is being evaluated by hiring managers.',
    nextStep: 'Awaiting interview schedule invite'
  }
];

export const INITIAL_EMPLOYER_CANDIDATES: EmployerCandidate[] = [
  {
    id: 'emp-c-1',
    name: 'Rohan Sharma',
    role: 'Senior Frontend Engineer',
    experienceYears: 6,
    skills: ['React.js', 'TypeScript', 'Next.js', 'Redux', 'GraphQL', 'Tailwind'],
    location: 'Bangalore, India',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80',
    stage: 'offer',
    jobId: 'sample-job-2',
    jobTitle: 'Sample: HR Recruiter',
    appliedDate: 'Oct 10, 2024',
    isFirstHire: true,
    matchScore: 94,
    expectedCTCLPA: 25,
    noticePeriodDays: 60,
    source: 'Referral',
    interviewDetails: {
      round: 'Final Partner Round',
      scheduledFor: 'Completed',
      overallScore: 4.2,
      techScore: 4.5,
      cultureScore: 4.0,
      feedbackNotes: 'Exceptional deep understanding of React concurrent features, bundle size optimizations, and strong system design communication.'
    },
    offerDetails: {
      status: 'draft',
      offeredBaseSalaryLPA: 24,
      joiningBonusLPA: 2,
      proposedJoiningDate: '2025-04-01'
    }
  },
  {
    id: 'emp-c-2',
    name: 'Arjun Kapoor',
    role: 'Frontend Engineer',
    experienceYears: 5,
    skills: ['React.js', 'JavaScript', 'CSS3', 'REST APIs'],
    location: 'Delhi NCR, India',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80',
    stage: 'new',
    jobId: 'sample-job-2',
    jobTitle: 'Sample: HR Recruiter',
    appliedDate: 'Today, 10:30 AM',
    isFirstHire: true,
    matchScore: 88,
    expectedCTCLPA: 18,
    noticePeriodDays: 30,
    source: 'TalentVarya Match'
  },
  {
    id: 'emp-c-3',
    name: 'Priya Sharma',
    role: 'UI/UX Specialist',
    experienceYears: 5,
    skills: ['Figma', 'Design Systems', 'Micro-interactions'],
    location: 'Bangalore, India',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=140&auto=format&fit=crop&q=80',
    stage: 'new',
    jobId: 'sample-job-1',
    jobTitle: 'Sample: Admin & MIS Executive',
    appliedDate: 'Yesterday',
    matchScore: 96,
    expectedCTCLPA: 22,
    noticePeriodDays: 30,
    source: 'Verified Direct'
  },
  {
    id: 'emp-c-4',
    name: 'Rahul Menon',
    role: 'Senior Frontend Dev',
    experienceYears: 4,
    skills: ['React.js', 'Vue.js', 'Node.js', 'Webpack'],
    location: 'Pune, India',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80',
    stage: 'interview',
    jobId: 'sample-job-2',
    jobTitle: 'Sample: HR Recruiter',
    appliedDate: 'Oct 08, 2024',
    matchScore: 91,
    expectedCTCLPA: 20,
    noticePeriodDays: 45,
    source: 'TalentVarya Match',
    interviewDetails: {
      round: 'Tech Round 2',
      scheduledFor: 'Tomorrow, 10:00 AM IST',
      overallScore: 4.0,
      techScore: 4.2,
      cultureScore: 3.8,
      feedbackNotes: 'Strong frontend architectural fundamentals, solid Vue and React cross-framework versatility.'
    }
  },
  {
    id: 'emp-c-5',
    name: 'Vikram Singh',
    role: 'Full Stack Node/Vue Specialist',
    experienceYears: 6,
    skills: ['Node.js', 'Vue 3', 'PostgreSQL', 'Docker'],
    location: 'Bangalore, India',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=140&auto=format&fit=crop&q=80',
    stage: 'completed7days',
    jobId: 'sample-job-1',
    jobTitle: 'Sample: Admin & MIS Executive',
    appliedDate: 'Sep 25, 2024',
    joiningDate: 'Oct 12, 2024',
    onboardingProgress: 100,
    matchScore: 95,
    expectedCTCLPA: 18,
    noticePeriodDays: 0,
    source: 'Assisted Hire'
  }
];

export const INITIAL_ADMIN_PLACEMENTS: PlacementRecord[] = [
  {
    id: 'plc-1',
    employerName: 'TechNova India Pvt Ltd',
    candidateId: 'CAN-8892',
    candidateName: 'Rohan Verma',
    candidateRole: 'Sr. Backend Engineer',
    jobService: 'Premium Assisted Hiring',
    joiningDate: '12 Oct 2024',
    sevenDayMarkDate: '19 Oct 2024',
    baseFeeINR: 40000,
    taxINR: 7200,
    totalFeeINR: 47200,
    status: 'Completed',
    invoiceNumber: 'INV-2024-088'
  },
  {
    id: 'plc-2',
    employerName: 'CloudScale Technologies',
    candidateId: 'CAN-8910',
    candidateName: 'Ananya Deshmukh',
    candidateRole: 'Lead DevOps Specialist',
    jobService: 'Assisted Placement (8.33%)',
    joiningDate: '16 Oct 2024',
    sevenDayMarkDate: '23 Oct 2024',
    baseFeeINR: 52000,
    taxINR: 9360,
    totalFeeINR: 61360,
    status: 'Pending 7-Day',
    invoiceNumber: 'INV-2024-089'
  },
  {
    id: 'plc-3',
    employerName: 'PayStream Fintech India',
    candidateId: 'CAN-8742',
    candidateName: 'Karthik Raja',
    candidateRole: 'Full Stack Engineer',
    jobService: 'Founding Employer Hire #1',
    joiningDate: '01 Oct 2024',
    sevenDayMarkDate: '08 Oct 2024',
    baseFeeINR: 0,
    taxINR: 0,
    totalFeeINR: 0,
    status: 'Waived (Founding)',
    invoiceNumber: 'PROMO-ZERO-001'
  },
  {
    id: 'plc-4',
    employerName: 'FinHealth AI',
    candidateId: 'CAN-8619',
    candidateName: 'Meera Iyer',
    candidateRole: 'Data Scientist',
    jobService: 'Assisted Hire (₹2,499)',
    joiningDate: '28 Sep 2024',
    sevenDayMarkDate: '05 Oct 2024',
    baseFeeINR: 2499,
    taxINR: 450,
    totalFeeINR: 2949,
    status: 'Disputed',
    isDisputed: true,
    disputeReason: 'Candidate stepped down on Day 4 due to medical emergency; employer filed replacement request.'
  }
];

export const FAQS_DATA = [
  {
    category: 'Candidate FAQs',
    items: [
      {
        q: 'What is free for job seekers?',
        a: 'Creating a profile, uploading a resume, interviews and offer letters are free. Candidates receive 5 job applications per day; any optional paid add-on for extra same-day applications must be displayed by TalentVarya, never demanded by an employer.'
      },
      {
        q: 'How does the daily application limit work?',
        a: 'To guarantee meaningful recruiter attention and prevent spam bot applications, candidates can submit up to 5 verified job applications per day. The quota resets every midnight at 12:00 AM IST.'
      },
      {
        q: 'What is a Verified Employer?',
        a: 'Every employer with a green Verified badge on Talentvarya has had their legal entity, GSTIN/CIN, corporate email domain, and physical office verified by our compliance team.'
      }
    ]
  },
  {
    category: 'Employer FAQs',
    items: [
      {
        q: 'What is the Founding Employer Offer?',
        a: 'Employers receive 14 days of free access with up to 3 job posts and 12 unique resume views. A paid plan is required after the free limit or trial expiry.'
      },
      {
        q: 'What is the Pay-After-Joining fee model?',
        a: 'With our Assisted Hiring plan, you only pay the success fee after your candidate has successfully joined and completed their first 7 working days at your company.'
      },
      {
        q: 'How do I upgrade from Self-Service to Assisted Hiring?',
        a: 'When posting a job or anytime from your Manage Jobs dashboard, simply select the Assisted tier to have our senior recruiters pre-screen and source candidates for you.'
      }
    ]
  },
  {
    category: 'Safety & Security',
    items: [
      {
        q: 'How does Talentvarya detect fraudulent job postings?',
        a: 'Our AI moderation engine cross-checks employer credentials with MCA databases, scans job descriptions for scam keywords, and enforces mandatory PAN/GSTIN document audits.'
      },
      {
        q: 'How to report a suspicious job or payment demand?',
        a: 'Click the "Report Job" button on any job details page or navigate to Help Center > Report Fraud. Our security operations team investigates within 2 hours.'
      }
    ]
  }
];
