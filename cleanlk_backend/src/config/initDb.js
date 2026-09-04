import { query } from './db.js';
import { initialReports } from '../data/seedReports.js';
import { initialSchedules } from '../data/seedSchedules.js';
import { initialCommunityRequests } from '../data/seedCommunityRequests.js';

export const initDb = async () => {
  try {
    console.log('🔄 Checking & initializing Neon PostgreSQL database tables...');

    // 1. Create Reports Table
    await query(`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        area VARCHAR(100) NOT NULL,
        issue_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        severity VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Reported',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ
      );
    `);

    // 2. Create Schedules Table
    await query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id VARCHAR(50) PRIMARY KEY,
        area VARCHAR(100) NOT NULL,
        waste_type VARCHAR(100) NOT NULL,
        day VARCHAR(50) NOT NULL,
        time VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        frequency VARCHAR(100) NOT NULL,
        next_collection VARCHAR(100) NOT NULL
      );
    `);

    // 3. Create Community Requests Table
    await query(`
      CREATE TABLE IF NOT EXISTS community_requests (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        area VARCHAR(100) NOT NULL,
        request_type VARCHAR(100) NOT NULL,
        priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ
      );
    `);

    // 4. Seed Reports if empty
    const reportCountRes = await query('SELECT COUNT(*) FROM reports;');
    const reportCount = parseInt(reportCountRes.rows[0].count, 10);

    if (reportCount === 0) {
      console.log('🌱 Seeding initial waste reports into Neon DB...');
      for (const r of initialReports) {
        await query(
          `INSERT INTO reports (id, full_name, area, issue_type, description, severity, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING;`,
          [r.id, r.fullName, r.area, r.issueType, r.description, r.severity, r.status, r.createdAt]
        );
      }
    }

    // 5. Seed Schedules if empty
    const scheduleCountRes = await query('SELECT COUNT(*) FROM schedules;');
    const scheduleCount = parseInt(scheduleCountRes.rows[0].count, 10);

    if (scheduleCount === 0) {
      console.log('🌱 Seeding initial collection schedules into Neon DB...');
      for (const s of initialSchedules) {
        await query(
          `INSERT INTO schedules (id, area, waste_type, day, time, location, frequency, next_collection)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING;`,
          [s.id, s.area, s.wasteType, s.day, s.time, s.location, s.frequency, s.nextCollection]
        );
      }
    }

    // 6. Seed Community Requests if empty
    const crCountRes = await query('SELECT COUNT(*) FROM community_requests;');
    const crCount = parseInt(crCountRes.rows[0].count, 10);

    if (crCount === 0) {
      console.log('🌱 Seeding initial community requests into Neon DB...');
      for (const cr of initialCommunityRequests) {
        await query(
          `INSERT INTO community_requests (id, name, area, request_type, priority, status, description, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING;`,
          [cr.id, cr.name, cr.area, cr.requestType, cr.priority, cr.status, cr.description, cr.createdAt]
        );
      }
    }

    console.log('✅ Neon PostgreSQL database schema & seed check complete!');
  } catch (err) {
    console.error('❌ Error initializing Neon database:', err.message);
  }
};
