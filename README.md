# TalentVarya — Verified Jobs & ATS MVP

Responsive React/Vite job portal with an Express API, local SQLite development fallback, optional Google Sheets mirroring, protected Admin Centre, email activation test flow and document uploads.

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

Use an email included in `TV_ADMIN_EMAILS` and the value of `TV_ADMIN_ACCESS_CODE`. Admin sessions expire after eight hours. Never commit `.env`.

## Google Sheets

The included workbook schema contains Settings, Users, Admins, Jobs, Applications, Resume_Views, Documents, Email_Verification, Banners, Plans, Subscriptions, Payments and Audit_Log tabs. Follow `GOOGLE_SHEETS_SETUP.md` to deploy the server-side webhook and enable mirroring.

## Commands

- `npm run dev` — run API and Vite together
- `npm run lint` — TypeScript validation
- `npm run build` — production frontend build
- `npm run db:seed` — add temporary candidate/employer test accounts only (zero jobs)
- `npm run db:check` — inspect local test records

Payment collection and production email delivery are not enabled. The UI shows payment conditions without charging anyone until providers and final candidate add-on pricing are approved.
