import { getMigrations } from 'better-auth/db/migration';
import { database } from '../src/lib/database.js';
try {
  const migrations = await getMigrations({ database, emailAndPassword: {enabled:true} });
  console.log('Creating auth tables:', migrations.toBeCreated.map(t=>t.table));
  await migrations.runMigrations();
  for (const table of ['user','session','account','verification']) {
    await database.query(`ALTER TABLE bazar_auth."${table}" ENABLE ROW LEVEL SECURITY`);
  }
  console.log('Auth schema ready.');
} finally { await database.end(); }
