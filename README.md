# TalentVarya — Verified Jobs & ATS MVP

Responsive React/Vite job portal connected directly to Supabase PostgreSQL, Supabase Auth and private Supabase Storage. The production frontend can be hosted on Vercel without the local Express server.

## Production Supabase setup

The TalentVarya Supabase project already contains secure RLS policies for users, jobs, applications, contact messages, promotional banners and documents. Add these variables to Vercel under Project → Settings → Environment Variables:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Apply them to Production, Preview and Development, then redeploy. Never add a secret key or service-role key to a `VITE_` variable.

## First administrator

1. In Supabase Dashboard, open Authentication → Users → Add user → Create new user.
2. Enter the administrator email and a temporary password of at least 8 characters.
3. Open Table Editor → users, find that email, and change `role` from `candidate` to `admin`.
4. Sign in from TalentVarya using the Admin tab.
5. Use “Forgot password” on the website whenever a password reset is needed.

## Implemented rules

- Candidate: 5 job applications per day; the sixth receives `402 Payment Required`.
- Employer: 14-day free trial, maximum 3 job posts and 12 unique resume views; the next action receives `402 Payment Required`.
- Employer plans displayed: ₹49 monthly, ₹399 for 6 months and ₹499 for 12 months.
- Resume and supporting-document uploads: PDF, DOC, DOCX, JPG and PNG, maximum 5 MB.
- Job search: keyword, location, job type, work mode, experience, minimum salary and verified-only filters.
- Homepage banner creation/editing: authenticated Admin only.
- Admin Centre: protected session, candidate/employer records, uploaded-document counts, jobs, placements and banner management.
- Candidate/employer email activation test flow; Google sign-in and SMS OTP are intentionally disabled until real providers are connected.
- Demo content is limited to two listings labelled `SAMPLE JOB — DO NOT APPLY`; no database job is inserted by the seed script.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and replace both example secrets.
4. Run `npm run dev`.
5. Open `http://127.0.0.1:3000`.

The API runs at `http://127.0.0.1:3001`. Uploaded files go to `uploads/`; the SQLite fallback is `data/talentvarya-test.db`.

## Admin login

Admin access now uses Supabase email/password authentication and the protected `users.role = 'admin'` authorization check. The previous local `TV_ADMIN_ACCESS_CODE` flow is no longer used by the production frontend.

## Google Sheets

The included workbook schema contains Settings, Users, Admins, Jobs, Applications, Resume_Views, Documents, Email_Verification, Banners, Plans, Subscriptions, Payments and Audit_Log tabs. Follow `GOOGLE_SHEETS_SETUP.md` to deploy the server-side webhook and enable mirroring.

## Commands

- `npm run dev` — run API and Vite together
- `npm run lint` — TypeScript validation
- `npm run build` — production frontend build
- `npm run db:seed` — add temporary candidate/employer test accounts only (zero jobs)
- `npm run db:check` — inspect local test records

Payment collection and production email delivery are not enabled. The UI shows payment conditions without charging anyone until providers and final candidate add-on pricing are approved.
