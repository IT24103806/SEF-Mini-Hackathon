import { neon } from '@neondatabase/serverless';
import { config } from './index.js';

const sql = config.databaseUrl ? neon(config.databaseUrl) : null;

/**
 * Execute parameterized SQL query over Neon serverless HTTP driver
 */
export const query = async (text, params = []) => {
  if (!sql) {
    throw new Error('Database connection string is missing.');
  }

  // Neon serverless conventional query with $1, $2 params
  if (params && params.length > 0) {
    const rows = await sql.query(text, params);
    return { rows };
  } else {
    const rows = await sql.query(text);
    return { rows };
  }
};
