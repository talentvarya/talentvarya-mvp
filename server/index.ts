import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import {
  consumeEmailVerification,
  createEmailVerification,
  deleteTestBanner,
  databasePath,
  createTestApplication,
  getEmployerPostingAllowance,
  insertTestDocument,
  insertTestJob,
  insertTestUser,
  listTestDocuments,
  listTestBanners,
  listTestJobs,
  listTestUsers,
  recordTestResumeView,
  toFrontendJob,
  upsertTestBanner,
} from './database';
import { mirrorToGoogleSheet } from './sheetSync';

const app = express();
const port = Number(process.env.TV_API_PORT || 3001);
const adminSessions = new Map<string, { email: string; expiresAt: number }>();
const uploadDirectory = path.resolve(process.cwd(), 'uploads');
mkdirSync(uploadDirectory, { recursive: true });

const allowedExtensions = new Set(['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, allowedExtensions.has(extension));
  },
});

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

const requireAdmin: express.RequestHandler = (request, response, next) => {
  const token = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const session = adminSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) adminSessions.delete(token);
    response.status(401).json({ error: 'A valid Admin session is required.' });
    return;
  }
  next();
};

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, mode: 'local-test', databasePath });
});

app.post('/api/test/email-verification/request', async (request, response) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  const role = request.body?.role === 'employer' ? 'employer' : 'candidate';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.status(400).json({ error: 'Enter a valid email address.' });
    return;
  }

  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  createEmailVerification(email, role, tokenHash, expiresAt);
  await mirrorToGoogleSheet('Email_Verification', {
    verification_id: randomUUID(),
    email,
    role,
    status: 'Pending',
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  });

  response.status(201).json({
    message: 'Activation link created. Connect an email provider before production.',
    expiresAt,
    devActivationToken: process.env.NODE_ENV === 'production' ? undefined : token,
  });
});

app.post('/api/test/email-verification/confirm', (request, response) => {
  const token = String(request.body?.token || '');
  if (!token) {
    response.status(400).json({ error: 'Activation token is required.' });
    return;
  }
  const user = consumeEmailVerification(createHash('sha256').update(token).digest('hex'));
  if (!user) {
    response.status(400).json({ error: 'Activation link is invalid, expired or already used.' });
    return;
  }
  response.json({ user });
});

app.get('/api/test/users', requireAdmin, (_request, response) => {
  response.json({ users: listTestUsers() });
});

app.post('/api/test/users', async (request, response) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  const role = request.body?.role === 'employer' ? 'employer' : 'candidate';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.status(400).json({ error: 'Enter a valid temporary email address.' });
    return;
  }

  const user = insertTestUser({ email, role }) as { id: number; email: string; role: string; createdAt: string };
  const sheetSync = await mirrorToGoogleSheet('Users', {
    user_id: `local-user-${user.id}`,
    email: user.email,
    role: user.role,
    status: 'Active',
    registration_date: user.createdAt,
    email_verified: 'No',
  });
  response.status(201).json({ user, sheetSync });
});

app.post('/api/test/admin/login', (request, response) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  const accessCode = String(request.body?.accessCode || '');
  const configuredAccessCode = process.env.TV_ADMIN_ACCESS_CODE;
  const allowedEmails = String(process.env.TV_ADMIN_EMAILS || '')
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);

  if (!configuredAccessCode || allowedEmails.length === 0) {
    response.status(503).json({ error: 'Admin login is not configured. Add TV_ADMIN_EMAILS and TV_ADMIN_ACCESS_CODE to .env.' });
    return;
  }

  if (!allowedEmails.includes(email) || accessCode !== configuredAccessCode) {
    response.status(401).json({ error: 'Admin email or access code is incorrect.' });
    return;
  }

  const token = randomUUID();
  adminSessions.set(token, { email, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
  response.json({ admin: { email, role: 'admin' }, token, expiresInSeconds: 28800 });
});

app.get('/api/test/admin/overview', requireAdmin, (_request, response) => {
  response.json({
    users: listTestUsers(),
    jobs: listTestJobs().map(toFrontendJob),
    documents: listTestDocuments(),
  });
});

app.get('/api/test/jobs', (_request, response) => {
  response.json({ jobs: listTestJobs().map(toFrontendJob) });
});

app.get('/api/test/banners', (_request, response) => {
  response.json({ banners: listTestBanners(true) });
});

app.post('/api/test/admin/banners', requireAdmin, async (request, response) => {
  const banner = request.body?.banner;
  if (!banner || typeof banner.id !== 'string' || !banner.id.trim()) {
    response.status(400).json({ error: 'A banner with a valid ID is required.' });
    return;
  }
  const savedBanner = upsertTestBanner(banner);
  const sheetSync = await mirrorToGoogleSheet('Banners', {
    banner_id: banner.id,
    company_name: banner.companyName,
    title: banner.title,
    description: banner.description,
    cta_text: banner.ctaText,
    status: banner.isActive === false ? 'Paused' : 'Active',
    start_date: banner.startDate,
    expires_at: banner.expiresAt,
    updated_at: new Date().toISOString(),
  });
  response.json({ banner: savedBanner, sheetSync });
});

app.delete('/api/test/admin/banners/:id', requireAdmin, (request, response) => {
  deleteTestBanner(request.params.id);
  response.status(204).end();
});

app.post('/api/test/jobs', async (request, response) => {
  const title = String(request.body?.title || '').trim();
  const company = String(request.body?.company || '').trim();
  const createdByEmail = String(request.body?.createdByEmail || '').trim().toLowerCase();

  if (!title || !company || !createdByEmail) {
    response.status(400).json({ error: 'Job title, company and registered employer email are required.' });
    return;
  }

  const allowance = getEmployerPostingAllowance(createdByEmail);
  if (!allowance.allowed) {
    const message = allowance.reason === 'trial_expired'
      ? 'The 14-day employer free trial has ended. Select a paid plan to post another job.'
      : allowance.reason === 'registration_required'
        ? 'Register the employer account before posting a job.'
        : 'The employer has used all 3 free job posts. Select a paid plan to continue.';
    response.status(allowance.reason === 'registration_required' ? 403 : 402).json({ error: message, allowance });
    return;
  }

  const row = insertTestJob({
    title,
    company,
    location: request.body?.location,
    workMode: request.body?.workMode,
    experienceMin: request.body?.experienceMin,
    experienceMax: request.body?.experienceMax,
    salaryMinLPA: request.body?.salaryMinLPA,
    salaryMaxLPA: request.body?.salaryMaxLPA,
    roleCategory: request.body?.roleCategory,
    description: request.body?.description,
    skills: Array.isArray(request.body?.skills) ? request.body.skills : [],
    createdByEmail,
  });

  const job = toFrontendJob(row);
  const sheetSync = await mirrorToGoogleSheet('Jobs', {
    job_id: job.id,
    employer_email: createdByEmail,
    company_name: job.company,
    job_title: job.title,
    location: job.location,
    work_mode: job.workMode,
    job_type: job.jobType,
    status: job.status,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
  });
  response.status(201).json({ job, sheetSync });
});

app.post('/api/test/applications', async (request, response) => {
  const candidateEmail = String(request.body?.candidateEmail || '').trim().toLowerCase();
  const jobId = String(request.body?.jobId || '').trim();
  const coverNote = String(request.body?.coverNote || '');
  if (!candidateEmail || !jobId) {
    response.status(400).json({ error: 'Candidate email and job ID are required.' });
    return;
  }

  const result = createTestApplication(candidateEmail, jobId, coverNote);
  if (!result.allowed) {
    const message = result.reason === 'already_applied'
      ? 'You have already applied for this job.'
      : result.reason === 'registration_required'
        ? 'Register and verify the candidate account before applying.'
        : 'Your 5 free applications for today are used. Payment is required for more applications today.';
    response.status(result.reason === 'registration_required' ? 403 : result.reason === 'already_applied' ? 409 : 402).json({ error: message, usage: result });
    return;
  }
  const sheetSync = await mirrorToGoogleSheet('Applications', {
    application_id: `local-application-${result.id}`,
    candidate_email: candidateEmail,
    job_id: jobId,
    cover_note: coverNote,
    status: 'Applied',
    applied_at: new Date().toISOString(),
  });
  response.status(201).json({ application: result, sheetSync });
});

app.post('/api/test/resume-views', async (request, response) => {
  const employerEmail = String(request.body?.employerEmail || '').trim().toLowerCase();
  const candidateId = String(request.body?.candidateId || '').trim();
  if (!employerEmail || !candidateId) {
    response.status(400).json({ error: 'Employer email and candidate ID are required.' });
    return;
  }

  const result = recordTestResumeView(employerEmail, candidateId);
  if (!result.allowed) {
    const message = result.reason === 'trial_expired'
      ? 'The 14-day employer free trial has ended. Select a paid plan to view more resumes.'
      : result.reason === 'registration_required'
        ? 'Register and verify the employer account before viewing resumes.'
        : 'All 12 free resume views are used. Select a paid plan to continue.';
    response.status(result.reason === 'registration_required' ? 403 : 402).json({ error: message, usage: result });
    return;
  }
  const sheetSync = result.isNew ? await mirrorToGoogleSheet('Resume_Views', {
    view_id: `${employerEmail}-${candidateId}`,
    employer_email: employerEmail,
    candidate_id: candidateId,
    viewed_at: new Date().toISOString(),
  }) : { synced: false, reason: 'existing_view' };
  response.status(201).json({ resumeView: result, sheetSync });
});

app.get('/api/test/documents', requireAdmin, (_request, response) => {
  response.json({ documents: listTestDocuments() });
});

app.post('/api/test/documents', upload.single('document'), async (request, response) => {
  const userEmail = String(request.body?.userEmail || '').trim().toLowerCase();
  const documentType = String(request.body?.documentType || 'other').trim().toLowerCase();

  if (!request.file || !userEmail) {
    response.status(400).json({ error: 'A valid document and user email are required.' });
    return;
  }

  const document = insertTestDocument({
    userEmail,
    documentType,
    fileName: request.file.originalname,
    storedName: request.file.filename,
    mimeType: request.file.mimetype || 'application/octet-stream',
    fileSizeBytes: request.file.size,
  });

  const sheetSync = await mirrorToGoogleSheet('Documents', {
    document_id: `local-document-${(document as { id: number }).id}`,
    user_email: userEmail,
    document_type: documentType,
    file_name: request.file.originalname,
    mime_type: request.file.mimetype || 'application/octet-stream',
    file_size_bytes: request.file.size,
    status: 'Uploaded',
    uploaded_at: new Date().toISOString(),
  });
  response.status(201).json({ document, sheetSync });
});

app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    response.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'Document must be 5 MB or smaller.' : error.message });
    return;
  }
  next(error);
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Local test API route not found.' });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`TalentVarya local test API: http://127.0.0.1:${port}`);
  console.log(`SQLite database: ${databasePath}`);
});
