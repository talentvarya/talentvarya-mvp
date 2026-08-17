import { databasePath, insertTestUser } from '../server/database';

const candidateEmail = 'temp.candidate@talentvarya.test';
const employerEmail = 'temp.employer@talentvarya.test';

const candidate = insertTestUser({
  email: candidateEmail,
  role: 'candidate',
});

const employer = insertTestUser({
  email: employerEmail,
  role: 'employer',
});

console.log(JSON.stringify({ databasePath, candidate, employer, jobsSeeded: 0 }, null, 2));
