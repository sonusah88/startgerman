import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'file:sqlite.db';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: dbUrl.startsWith('libsql') ? 'turso' : 'sqlite',
  dbCredentials: {
    url: dbUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
