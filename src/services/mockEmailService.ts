import { MockEmail } from '../types';

export function createMockInterviewEmail(params: {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  round?: string;
  scheduledTime?: string;
  meetingLink?: string;
  interviewerName?: string;
  interviewerRole?: string;
  instructions?: string;
}): MockEmail {
  const round = params.round || 'Technical Round 2 (System Design & Code Review)';
  const scheduledTime = params.scheduledTime || 'Tomorrow, 2:30 PM - 3:30 PM IST';
  const meetingLink = params.meetingLink || 'https://meet.google.com/tv-interview-' + Math.random().toString(36).substring(2, 7);
  const interviewerName = params.interviewerName || 'Anand Varma';
  const interviewerRole = params.interviewerRole || 'Lead Engineering Manager';
  const instructions = params.instructions || 'Please ensure you have a stable high-speed internet connection, a quiet environment, and your preferred code editor open. We recommend joining 5 minutes prior.';

  return {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientEmail: params.candidateEmail,
    recipientName: params.candidateName,
    sender: `recruiting@${params.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    senderName: `${params.company} Recruitment Team via TalentVarya`,
    subject: `📅 Interview Invitation: ${params.jobTitle} at ${params.company}`,
    preview: `Congratulations! ${params.company} has reviewed your application and would like to invite you for ${round}.`,
    sentAt: 'Just now',
    timestamp: Date.now(),
    statusType: 'interview',
    jobTitle: params.jobTitle,
    company: params.company,
    companyLogo: params.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    read: false,
    interviewDetails: {
      round,
      scheduledTime,
      meetingLink,
      interviewerName,
      interviewerRole,
      instructions
    },
    bodyHtml: `
      <p>Dear <strong>${params.candidateName}</strong>,</p>
      <p>We are delighted to inform you that your application for the <strong>${params.jobTitle}</strong> position at <strong>${params.company}</strong> has been shortlisted for the next stage!</p>
      <p>Our hiring committee was impressed by your experience and portfolio. We would love to invite you for an interactive video interview.</p>
      <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 14px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0 0 6px 0;"><strong>Round:</strong> ${round}</p>
        <p style="margin: 0 0 6px 0;"><strong>Scheduled Time:</strong> ${scheduledTime}</p>
        <p style="margin: 0 0 6px 0;"><strong>Interviewer:</strong> ${interviewerName} (${interviewerRole})</p>
        <p style="margin: 0;"><strong>Google Meet Link:</strong> <a href="${meetingLink}" target="_blank" style="color: #059669; font-weight: bold;">${meetingLink}</a></p>
      </div>
      <p><strong>Preparation Guidelines:</strong></p>
      <p style="color: #475569;">${instructions}</p>
      <p>If you have any schedule conflicts or need to adjust your availability, please reply to this email or update your status directly in your TalentVarya Candidate Dashboard.</p>
      <p>Best regards,<br/><strong>${params.company} Talent Acquisition Team</strong><br/><span style="font-size: 11px; color: #94a3b8;">Dispatched via TalentVarya Verified Hiring Platform</span></p>
    `
  };
}

export function createMockRejectionEmail(params: {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  feedbackSummary?: string;
}): MockEmail {
  const feedback = params.feedbackSummary || 'While your profile has strong qualifications, we have decided to advance other candidates whose specific domain experience more closely aligns with our immediate technical stack.';
  
  return {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientEmail: params.candidateEmail,
    recipientName: params.candidateName,
    sender: `notifications@${params.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    senderName: `${params.company} Talent Team via TalentVarya`,
    subject: `Application Update: ${params.jobTitle} at ${params.company}`,
    preview: `Thank you for your interest in the ${params.jobTitle} position at ${params.company}. Here is an update regarding your application status.`,
    sentAt: 'Just now',
    timestamp: Date.now(),
    statusType: 'rejected',
    jobTitle: params.jobTitle,
    company: params.company,
    companyLogo: params.companyLogo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    read: false,
    rejectionDetails: {
      feedbackSummary: feedback,
      retentionPolicy: 'Your verified profile has been retained in our Priority Talent Network for upcoming roles.'
    },
    bodyHtml: `
      <p>Dear <strong>${params.candidateName}</strong>,</p>
      <p>Thank you very much for taking the time to apply for the <strong>${params.jobTitle}</strong> position at <strong>${params.company}</strong> and for sharing your background with us.</p>
      <p>We received an exceptional number of high-quality applications for this opening. After careful evaluation by our engineering and recruitment panel, we have decided not to move forward with your candidacy for this specific opening at this time.</p>
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0; color: #991b1b; font-size: 13px;"><strong>Recruiter Note:</strong> ${feedback}</p>
      </div>
      <p>Please note that this decision is specific to this individual requisition and is in no way a reflection of your overall capabilities. We were genuinely impressed with your profile, and with your permission, we will keep your verified resume active in our <strong>Priority Talent Network</strong> for future matching positions.</p>
      <p>You may continue to apply for other verified openings on TalentVarya using your daily verified application quota.</p>
      <p>We sincerely appreciate your interest in ${params.company} and wish you the very best in your professional journey.</p>
      <p>Warm regards,<br/><strong>${params.company} Talent Acquisition Team</strong><br/><span style="font-size: 11px; color: #94a3b8;">Sent via TalentVarya Verified Job Network</span></p>
    `
  };
}

// Start with an empty inbox. Real status emails are added only when an actual
// employer action generates them; fabricated interview/rejection emails are not shown.
export const INITIAL_MOCK_EMAILS: MockEmail[] = [];
