import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const dataDirectory = path.resolve(process.cwd(), 'data');
mkdirSync(dataDirectory, { recursive: true });

export const databasePath = process.env.TV_DATABASE_PATH
  ? path.resolve(process.env.TV_DATABASE_PATH)
  : path.join(dataDirectory, 'talentvarya-test.db');

export const database = new Database(databasePath);

database.exec('PRAGMA journal_mode = WAL;');
database.exec('PRAGMA foreign_keys = ON;');


database.exec(`
  CREATE TABLE IF NOT EXISTS test_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    role TEXT NOT NULL CHECK (role IN ('candidate', 'employer')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS test_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    work_mode TEXT NOT NULL CHECK (work_mode IN ('On-site', 'Hybrid', 'Remote')),
    experience_min INTEGER NOT NULL DEFAULT 0,
    experience_max INTEGER NOT NULL DEFAULT 0,
    salary_min_lpa REAL NOT NULL DEFAULT 0,
    salary_max_lpa REAL NOT NULL DEFAULT 0,
    role_category TEXT NOT NULL DEFAULT 'General',
    description TEXT NOT NULL DEFAULT '',
    skills_json TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'active',
    is_verified INTEGER NOT NULL DEFAULT 0,
    created_by_email TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title, company)
  );

  CREATE TABLE IF NOT EXISTS test_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    stored_name TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS test_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_email TEXT NOT NULL COLLATE NOCASE,
    job_id TEXT NOT NULL,
    cover_note TEXT NOT NULL DEFAULT '',
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_email, job_id)
  );

  CREATE TABLE IF NOT EXISTS test_resume_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employer_email TEXT NOT NULL COLLATE NOCASE,
    candidate_id TEXT NOT NULL,
    viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employer_email, candidate_id)
  );

  CREATE TABLE IF NOT EXISTS test_email_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL COLLATE NOCASE,
    role TEXT NOT NULL CHECK (role IN ('candidate', 'employer')),
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS test_banners (
    id TEXT PRIMARY KEY,
    data_json TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const userColumns = database.prepare(`PRAGMA table_info(test_users)`).all() as Array<{ name: string }>;
if (!userColumns.some(column => column.name === 'email_verified')) {
  database.exec(`ALTER TABLE test_users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0`);
}

export interface TestUserInput {
  email: string;
  role: 'candidate' | 'employer';
}

export interface TestJobInput {
  title: string;
  company: string;
  location?: string;
  workMode?: 'On-site' | 'Hybrid' | 'Remote';
  experienceMin?: number;
  experienceMax?: number;
  salaryMinLPA?: number;
  salaryMaxLPA?: number;
  roleCategory?: string;
  description?: string;
  skills?: string[];
  createdByEmail?: string;
}

export interface TestDocumentInput {
  userEmail: string;
  documentType: string;
  fileName: string;
  storedName: string;
  mimeType: string;
  fileSizeBytes: number;
}

const findUser = (email: string, role: TestUserInput['role']) => database.prepare(`
  SELECT id, email, role, created_at AS createdAt
  FROM test_users
  WHERE email = ? AND role = ?
`).get(email.trim().toLowerCase(), role) as { id: number; email: string; role: string; createdAt: string } | undefined;

const isTrialExpired = (createdAt: string, trialDays = 14) => {
  const startedAt = new Date(`${createdAt.replace(' ', 'T')}Z`).getTime();
  return Number.isNaN(startedAt) || Date.now() > startedAt + trialDays * 86400000;
};

export const getEmployerPostingAllowance = (email: string) => {
  const user = findUser(email, 'employer');
  if (!user) return { allowed: false, reason: 'registration_required' as const, used: 0, max: 3 };

  const used = Number((database.prepare(`
    SELECT COUNT(*) AS count FROM test_jobs WHERE created_by_email = ?
  `).get(user.email) as { count: number }).count);
  if (isTrialExpired(user.createdAt)) return { allowed: false, reason: 'trial_expired' as const, used, max: 3 };
  return { allowed: used < 3, reason: used >= 3 ? 'limit_reached' as const : null, used, max: 3 };
};

export const createTestApplication = (candidateEmail: string, jobId: string, coverNote = '') => {
  const email = candidateEmail.trim().toLowerCase();
  const user = findUser(email, 'candidate');
  if (!user) return { allowed: false, reason: 'registration_required' as const, usedToday: 0, max: 5 };

  const existing = database.prepare(`
    SELECT id FROM test_applications WHERE candidate_email = ? AND job_id = ?
  `).get(email, jobId);
  if (existing) return { allowed: false, reason: 'already_applied' as const, usedToday: 0, max: 5 };

  const usedToday = Number((database.prepare(`
    SELECT COUNT(*) AS count
    FROM test_applications
    WHERE candidate_email = ? AND date(applied_at, 'localtime') = date('now', 'localtime')
  `).get(email) as { count: number }).count);
  if (usedToday >= 5) return { allowed: false, reason: 'limit_reached' as const, usedToday, max: 5 };

  const result = database.prepare(`
    INSERT INTO test_applications (candidate_email, job_id, cover_note)
    VALUES (?, ?, ?)
  `).run(email, jobId, coverNote.trim());
  return { allowed: true, id: Number(result.lastInsertRowid), usedToday: usedToday + 1, max: 5 };
};

export const recordTestResumeView = (employerEmail: string, candidateId: string) => {
  const email = employerEmail.trim().toLowerCase();
  const user = findUser(email, 'employer');
  if (!user) return { allowed: false, reason: 'registration_required' as const, used: 0, max: 12, isNew: false };

  const existing = database.prepare(`
    SELECT id FROM test_resume_views WHERE employer_email = ? AND candidate_id = ?
  `).get(email, candidateId);
  const used = Number((database.prepare(`
    SELECT COUNT(*) AS count FROM test_resume_views WHERE employer_email = ?
  `).get(email) as { count: number }).count);
  if (existing) return { allowed: true, used, max: 12, isNew: false };
  if (isTrialExpired(user.createdAt)) return { allowed: false, reason: 'trial_expired' as const, used, max: 12, isNew: false };
  if (used >= 12) return { allowed: false, reason: 'limit_reached' as const, used, max: 12, isNew: false };

  database.prepare(`
    INSERT INTO test_resume_views (employer_email, candidate_id) VALUES (?, ?)
  `).run(email, candidateId);
  return { allowed: true, used: used + 1, max: 12, isNew: true };
};

export const insertTestUser = ({ email, role }: TestUserInput) => {
  database.prepare(`
    INSERT INTO test_users (email, role)
    VALUES (?, ?)
    ON CONFLICT(email) DO UPDATE SET role = excluded.role
  `).run(email.trim().toLowerCase(), role);

  return database.prepare(`
    SELECT id, email, role, email_verified AS emailVerified, created_at AS createdAt
    FROM test_users
    WHERE email = ?
  `).get(email.trim().toLowerCase());
};

export const listTestUsers = () => database.prepare(`
  SELECT id, email, role, email_verified AS emailVerified, created_at AS createdAt
  FROM test_users
  ORDER BY id DESC
`).all();

export const createEmailVerification = (email: string, role: TestUserInput['role'], tokenHash: string, expiresAt: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  insertTestUser({ email: normalizedEmail, role });
  database.prepare(`
    INSERT INTO test_email_verifications (email, role, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(normalizedEmail, role, tokenHash, expiresAt);
};

export const consumeEmailVerification = (tokenHash: string) => database.transaction(() => {
  const verification = database.prepare(`
    SELECT id, email, role, expires_at AS expiresAt, used_at AS usedAt
    FROM test_email_verifications
    WHERE token_hash = ?
  `).get(tokenHash) as { id: number; email: string; role: TestUserInput['role']; expiresAt: string; usedAt: string | null } | undefined;

  if (!verification || verification.usedAt || new Date(verification.expiresAt).getTime() < Date.now()) return null;
  database.prepare(`UPDATE test_email_verifications SET used_at = CURRENT_TIMESTAMP WHERE id = ?`).run(verification.id);
  database.prepare(`UPDATE test_users SET email_verified = 1 WHERE email = ?`).run(verification.email);
  return database.prepare(`
    SELECT id, email, role, email_verified AS emailVerified, created_at AS createdAt
    FROM test_users WHERE email = ?
  `).get(verification.email);
})();

export const insertTestJob = (input: TestJobInput) => {
  const values = {
    title: input.title.trim(),
    company: input.company.trim(),
    location: input.location?.trim() || 'New Delhi, India',
    workMode: input.workMode || 'On-site',
    experienceMin: Number(input.experienceMin ?? 0),
    experienceMax: Number(input.experienceMax ?? input.experienceMin ?? 0),
    salaryMinLPA: Number(input.salaryMinLPA ?? 0),
    salaryMaxLPA: Number(input.salaryMaxLPA ?? input.salaryMinLPA ?? 0),
    roleCategory: input.roleCategory?.trim() || 'General',
    description: input.description?.trim() || 'Job description provided by the employer.',
    skillsJson: JSON.stringify(input.skills || []),
    createdByEmail: input.createdByEmail?.trim().toLowerCase() || null,
  };

  database.prepare(`
    INSERT INTO test_jobs (
      title, company, location, work_mode, experience_min, experience_max,
      salary_min_lpa, salary_max_lpa, role_category, description, skills_json,
      status, is_verified, created_by_email
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      'active', 0, ?
    )
    ON CONFLICT(title, company) DO UPDATE SET
      location = excluded.location,
      work_mode = excluded.work_mode,
      description = excluded.description,
      skills_json = excluded.skills_json,
      created_by_email = excluded.created_by_email
  `).run(
    values.title,
    values.company,
    values.location,
    values.workMode,
    values.experienceMin,
    values.experienceMax,
    values.salaryMinLPA,
    values.salaryMaxLPA,
    values.roleCategory,
    values.description,
    values.skillsJson,
    values.createdByEmail
  );

  return database.prepare(`
    SELECT * FROM test_jobs WHERE title = ? AND company = ?
  `).get(values.title, values.company);
};

export const listTestJobs = () => database.prepare(`
  SELECT * FROM test_jobs ORDER BY id DESC
`).all();

export const insertTestDocument = (input: TestDocumentInput) => {
  const result = database.prepare(`
    INSERT INTO test_documents (
      user_email, document_type, file_name, stored_name, mime_type, file_size_bytes
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    input.userEmail.trim().toLowerCase(),
    input.documentType,
    input.fileName,
    input.storedName,
    input.mimeType,
    input.fileSizeBytes,
  );

  return database.prepare(`
    SELECT
      id,
      user_email AS userEmail,
      document_type AS documentType,
      file_name AS fileName,
      mime_type AS mimeType,
      file_size_bytes AS fileSizeBytes,
      created_at AS createdAt
    FROM test_documents
    WHERE id = ?
  `).get(result.lastInsertRowid);
};

export const listTestDocuments = () => database.prepare(`
  SELECT
    id,
    user_email AS userEmail,
    document_type AS documentType,
    file_name AS fileName,
    mime_type AS mimeType,
    file_size_bytes AS fileSizeBytes,
    created_at AS createdAt
  FROM test_documents
  ORDER BY id DESC
`).all();

export const upsertTestBanner = (banner: { id: string; isActive?: boolean; [key: string]: unknown }) => {
  database.prepare(`
    INSERT INTO test_banners (id, data_json, is_active, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      data_json = excluded.data_json,
      is_active = excluded.is_active,
      updated_at = CURRENT_TIMESTAMP
  `).run(banner.id, JSON.stringify(banner), banner.isActive === false ? 0 : 1);
  return banner;
};

export const deleteTestBanner = (id: string) => database.prepare(`DELETE FROM test_banners WHERE id = ?`).run(id);

export const listTestBanners = (activeOnly = false) => {
  const rows = database.prepare(`
    SELECT data_json AS dataJson FROM test_banners
    ${activeOnly ? 'WHERE is_active = 1' : ''}
    ORDER BY updated_at DESC
  `).all() as Array<{ dataJson: string }>;
  return rows.map(row => JSON.parse(row.dataJson));
};

export const toFrontendJob = (row: any) => ({
  id: `db-job-${row.id}`,
  title: row.title,
  company: row.company,
  companyLogo: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=120&auto=format&fit=crop&q=80',
  companyAbout: `${row.company} registered employer profile.`,
  location: row.location,
  workMode: row.work_mode,
  experienceMin: row.experience_min,
  experienceMax: row.experience_max,
  salaryMinLPA: row.salary_min_lpa,
  salaryMaxLPA: row.salary_max_lpa,
  jobType: 'Full-Time',
  roleCategory: row.role_category,
  isVerified: Boolean(row.is_verified),
  isActivelyHiring: row.status === 'active',
  postedDaysAgo: 0,
  postedHoursAgo: 0,
  description: row.description,
  responsibilities: ['Responsibilities provided by the registered employer.'],
  skills: JSON.parse(row.skills_json || '[]'),
  viewsCount: 0,
  validityDaysLeft: 14,
  totalValidityDays: 14,
  applicationsCount: 0,
  maxApplicationsTarget: 12,
  planType: 'self-service',
  status: row.status,
});
