// lib/db.ts
import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Singleton pattern — prevents too many connections on Vercel
export const pool =
  global.__pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3
  });

if (!global.__pgPool) global.__pgPool = pool;

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
