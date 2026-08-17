import type { Job, PromotionalBanner, UploadedDocumentRecord } from '../types';

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || 'Local database request failed.');
  }
  return body as T;
}

export async function saveTemporaryUser(email: string, role: 'candidate' | 'employer') {
  const response = await fetch('/api/test/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });

  return readJson<{ user: { id: number; email: string; role: string; createdAt: string } }>(response);
}

export async function requestEmailActivation(email: string, role: 'candidate' | 'employer') {
  const response = await fetch('/api/test/email-verification/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });
  return readJson<{ message: string; expiresAt: string; devActivationToken?: string }>(response);
}

export async function confirmEmailActivation(token: string) {
  const response = await fetch('/api/test/email-verification/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return readJson<{ user: { id: number; email: string; role: 'candidate' | 'employer'; emailVerified: number; createdAt: string } }>(response);
}

export async function authenticateAdmin(email: string, accessCode: string) {
  const response = await fetch('/api/test/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, accessCode }),
  });

  const body = await readJson<{ admin: { email: string; role: 'admin' }; token: string; expiresInSeconds: number }>(response);
  sessionStorage.setItem('talentvarya_admin_token', body.token);
  return body;
}

export async function loadAdminOverview() {
  const token = sessionStorage.getItem('talentvarya_admin_token') || '';
  const response = await fetch('/api/test/admin/overview', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return readJson<{
    users: Array<{ id: number; email: string; role: 'candidate' | 'employer'; emailVerified: number; createdAt: string }>;
    jobs: Job[];
    documents: UploadedDocumentRecord[];
  }>(response);
}

export async function uploadDocument(
  file: File,
  userEmail: string,
  documentType: string,
): Promise<UploadedDocumentRecord> {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('userEmail', userEmail);
  formData.append('documentType', documentType);

  const response = await fetch('/api/test/documents', {
    method: 'POST',
    body: formData,
  });
  const body = await readJson<{ document: UploadedDocumentRecord }>(response);
  return body.document;
}

export async function loadDatabaseJobs(): Promise<Job[]> {
  const response = await fetch('/api/test/jobs');
  const body = await readJson<{ jobs: Job[] }>(response);
  return body.jobs;
}

export async function saveDatabaseJob(job: Partial<Job>, createdByEmail?: string): Promise<Job> {
  const response = await fetch('/api/test/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...job, createdByEmail }),
  });
  const body = await readJson<{ job: Job }>(response);
  return body.job;
}

export async function saveApplication(candidateEmail: string, jobId: string, coverNote = '') {
  const response = await fetch('/api/test/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateEmail, jobId, coverNote }),
  });
  return readJson<{ application: { id: number; usedToday: number; max: number } }>(response);
}

export async function recordResumeView(employerEmail: string, candidateId: string) {
  const response = await fetch('/api/test/resume-views', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employerEmail, candidateId }),
  });
  return readJson<{ resumeView: { used: number; max: number; isNew: boolean } }>(response);
}

export async function loadPromotionalBanners(): Promise<PromotionalBanner[]> {
  const response = await fetch('/api/test/banners');
  const body = await readJson<{ banners: PromotionalBanner[] }>(response);
  return body.banners;
}

export async function savePromotionalBanner(banner: PromotionalBanner) {
  const token = sessionStorage.getItem('talentvarya_admin_token') || '';
  const response = await fetch('/api/test/admin/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ banner }),
  });
  return readJson<{ banner: PromotionalBanner }>(response);
}

export async function deletePromotionalBanner(id: string) {
  const token = sessionStorage.getItem('talentvarya_admin_token') || '';
  const response = await fetch(`/api/test/admin/banners/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body?.error || 'Banner could not be removed.');
  }
}
