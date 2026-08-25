import type { Job, PromotionalBanner, UploadedDocumentRecord } from '../types';
import { supabase } from './supabaseClient';

type JobRow = {
  id: string;
  employer_id: string | null;
  title: string;
  company_name: string;
  description: string | null;
  location: string | null;
  job_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  skills: string | null;
  status: string;
  created_at: string;
};

const toJob = (row: JobRow): Job => {
  const hours = Math.max(1, Math.floor((Date.now() - new Date(row.created_at).getTime()) / 3600000));
  return {
    id: row.id,
    title: row.title,
    company: row.company_name,
    companyLogo: '',
    companyAbout: '',
    location: row.location || 'India',
    workMode: 'On-site',
    experienceMin: 0,
    experienceMax: 0,
    salaryMinLPA: Number(row.salary_min || 0),
    salaryMaxLPA: Number(row.salary_max || 0),
    jobType: row.job_type === 'part-time' ? 'Part-Time' : row.job_type === 'contract' ? 'Contract' : 'Full-Time',
    roleCategory: 'General',
    isVerified: true,
    isActivelyHiring: row.status === 'open',
    postedDaysAgo: Math.floor(hours / 24),
    postedHoursAgo: hours,
    description: row.description || '',
    responsibilities: [],
    skills: (row.skills || '').split(',').map(item => item.trim()).filter(Boolean),
    viewsCount: 0,
    validityDaysLeft: 14,
    totalValidityDays: 14,
    applicationsCount: 0,
    maxApplicationsTarget: 12,
    planType: 'self-service',
    status: row.status === 'open' ? 'active' : 'draft',
  };
};

export async function loadDatabaseJobs(): Promise<Job[]> {
  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as JobRow[]).map(toJob);
}

export async function saveDatabaseJob(job: Partial<Job>, _createdByEmail?: string): Promise<Job> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Employer sign-in is required.');
  const { data, error } = await supabase.from('jobs').insert({
    employer_id: auth.user.id,
    title: job.title,
    company_name: job.company,
    description: job.description || '',
    location: job.location || 'India',
    job_type: (job.jobType || 'Full-Time').toLowerCase(),
    salary_min: job.salaryMinLPA || 0,
    salary_max: job.salaryMaxLPA || 0,
    skills: (job.skills || []).join(', '),
    status: 'open',
  }).select().single();
  if (error) throw new Error(error.message);
  return toJob(data as JobRow);
}

export async function saveApplication(_candidateEmail: string, jobId: string, coverNote = '') {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Candidate sign-in is required.');
  const { data, error } = await supabase.from('applications').insert({
    candidate_id: auth.user.id,
    job_id: jobId,
    cover_letter: coverNote,
    status: 'applied',
  }).select('id').single();
  if (error) throw new Error(error.code === '23505' ? 'You have already applied for this job.' : error.message);
  return { application: { id: data.id, usedToday: 1, max: 5 } };
}

export async function recordResumeView(_employerEmail: string, _candidateId: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Employer sign-in is required.');
  return { resumeView: { used: 1, max: 12, isNew: true } };
}

export async function loadAdminOverview() {
  const [usersResult, jobsResult, documentsResult] = await Promise.all([
    supabase.from('users').select('id,email,role,created_at').order('created_at', { ascending: false }),
    supabase.from('jobs').select('*').order('created_at', { ascending: false }),
    supabase.from('documents').select('*').order('created_at', { ascending: false }),
  ]);
  if (usersResult.error) throw new Error(usersResult.error.message);
  if (jobsResult.error) throw new Error(jobsResult.error.message);
  if (documentsResult.error) throw new Error(documentsResult.error.message);
  return {
    users: (usersResult.data || [])
      .filter(user => user.role !== 'admin')
      .map(user => ({ id: user.id, email: user.email, role: user.role, emailVerified: 1, createdAt: user.created_at })),
    jobs: (jobsResult.data as JobRow[]).map(toJob),
    documents: (documentsResult.data || []).map(document => ({
      id: document.id,
      userEmail: document.user_email,
      documentType: document.document_type,
      fileName: document.file_name,
      mimeType: document.mime_type,
      fileSizeBytes: Number(document.file_size_bytes),
      createdAt: document.created_at,
    })) as UploadedDocumentRecord[],
  };
}

export async function loadPromotionalBanners(): Promise<PromotionalBanner[]> {
  const { data, error } = await supabase.from('promotional_banners').select('data').order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(row => row.data as PromotionalBanner);
}

export async function savePromotionalBanner(banner: PromotionalBanner) {
  const { error } = await supabase.from('promotional_banners').upsert({
    id: banner.id,
    data: banner,
    is_active: banner.isActive !== false,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return { banner };
}

export async function deletePromotionalBanner(id: string) {
  const { error } = await supabase.from('promotional_banners').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function saveTemporaryUser(email: string, role: 'candidate' | 'employer') {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user || auth.user.email?.toLowerCase() !== email.trim().toLowerCase()) {
    throw new Error('Sign in with this email before completing registration.');
  }
  const { data, error } = await supabase.from('users').select('*').eq('id', auth.user.id).eq('role', role).single();
  if (error) throw new Error(error.message);
  return { user: data };
}

export async function uploadDocument(file: File, userEmail: string, documentType: string): Promise<UploadedDocumentRecord> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sign-in is required before uploading a document.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Maximum file size is 5 MB.');
  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${auth.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from('documents').upload(path, file, { upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const { data, error } = await supabase.from('documents').insert({
    user_id: auth.user.id,
    user_email: userEmail.trim().toLowerCase(),
    document_type: documentType,
    file_name: file.name,
    storage_path: path,
    mime_type: file.type || 'application/octet-stream',
    file_size_bytes: file.size,
  }).select().single();
  if (error) {
    await supabase.storage.from('documents').remove([path]);
    throw new Error(error.message);
  }
  return {
    id: data.id,
    userEmail: data.user_email,
    documentType: data.document_type,
    fileName: data.file_name,
    mimeType: data.mime_type,
    fileSizeBytes: Number(data.file_size_bytes),
    createdAt: data.created_at,
  };
}
