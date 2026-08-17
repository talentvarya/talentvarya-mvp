# TalentVarya local database test

This build uses SQLite as a local development fallback. When `GOOGLE_APPS_SCRIPT_URL` and `GOOGLE_APPS_SCRIPT_SECRET` are configured, new records are also mirrored to the native TalentVarya Google Sheet.

## Run

```bash
npm install
npm run db:seed
npm run dev
```

Open `http://localhost:3000/`. The API runs on `http://127.0.0.1:3001/` and Vite proxies browser requests from `/api` to it.

## Optional test accounts

- Candidate: `temp.candidate@talentvarya.test`
- Employer: `temp.employer@talentvarya.test`
- No database job is inserted by the seed script.
- The frontend contains only two clearly labelled sample listings for layout testing.

Use the email activation form to create and verify a temporary user. From the Employer dashboard, use **Post a New Job** to save a real employer-entered job. Refresh the page and search for the job to confirm that it is loaded again from SQLite.

The API enforces 5 candidate applications per day, 12 unique employer resume views, 3 employer job posts and a 14-day employer trial. Protected Admin routes require the short-lived token returned after a valid Admin login.

## Inspect the database

```bash
npm run db:check
```

The database file is `data/talentvarya-test.db`.

## Important

SQLite should not be treated as the sole production database because cloud server instances may restart and local files may be lost. Follow `GOOGLE_SHEETS_SETUP.md` for the temporary Sheet workflow; migrate to PostgreSQL/Firestore when traffic or sensitive-data volume grows.
