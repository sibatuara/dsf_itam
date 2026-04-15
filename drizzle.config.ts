import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql', // Modern Drizzle Kit uses dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
