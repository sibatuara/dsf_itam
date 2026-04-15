import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import 'dotenv/config';

// Membuat koneksi database MySQL menggunakan instance pool
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { mode: 'default', schema });
