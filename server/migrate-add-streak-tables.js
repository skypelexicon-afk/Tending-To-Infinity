import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addStreakTables() {
  const client = await pool.connect();
  try {
    console.log('Adding streak and badge tables...');

    // Create user_streaks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_streaks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        current_streak INTEGER NOT NULL DEFAULT 0,
        longest_streak INTEGER NOT NULL DEFAULT 0,
        last_active_date TIMESTAMP,
        total_days_active INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ user_streaks table created');

    // Create badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        badge_name TEXT NOT NULL UNIQUE,
        milestone_days INTEGER NOT NULL,
        badge_shape TEXT NOT NULL,
        animation_type TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ badges table created');

    // Create user_badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_name TEXT NOT NULL,
        earned_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ user_badges table created');

    // Create streak_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS streak_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_date TIMESTAMP NOT NULL,
        was_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ streak_history table created');

    console.log('🎉 All streak tables added successfully!');
  } catch (error) {
    console.error('Error adding streak tables:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addStreakTables();
