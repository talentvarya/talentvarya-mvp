import { databasePath, listTestJobs, listTestUsers } from '../server/database';

console.log(JSON.stringify({
  databasePath,
  users: listTestUsers(),
  jobs: listTestJobs(),
}, null, 2));
