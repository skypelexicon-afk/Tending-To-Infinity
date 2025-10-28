import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const BADGE_DEFINITIONS = [
  { badge_name: "Starter Spark", milestone_days: 1, badge_shape: "circle", animation_type: "glow", description: "Started your learning journey" },
  { badge_name: "Weekly Warrior", milestone_days: 7, badge_shape: "flame", animation_type: "flicker", description: "7 days of consistent learning" },
  { badge_name: "Focused Learner", milestone_days: 14, badge_shape: "star", animation_type: "burst", description: "Two weeks of dedication" },
  { badge_name: "Consistency Champ", milestone_days: 21, badge_shape: "crystal", animation_type: "shine", description: "Three weeks of learning momentum" },
  { badge_name: "Infinity Master", milestone_days: 30, badge_shape: "infinity", animation_type: "pulse", description: "A full month of learning" },
  { badge_name: "Dedication Diamond", milestone_days: 45, badge_shape: "diamond", animation_type: "sparkle", description: "45 days of unwavering commitment" },
  { badge_name: "Knowledge Keeper", milestone_days: 60, badge_shape: "shield", animation_type: "glow-wave", description: "Two months of consistent growth" },
  { badge_name: "Learning Legend", milestone_days: 90, badge_shape: "crown", animation_type: "radiant", description: "Three months of excellence" },
  { badge_name: "Mastery Monarch", milestone_days: 120, badge_shape: "hexagon", animation_type: "rotate-glow", description: "Four months of mastery" },
  { badge_name: "Eternal Scholar", milestone_days: 150, badge_shape: "pentagon", animation_type: "cosmic", description: "150 days of pure dedication" },
  { badge_name: "Supreme Sage", milestone_days: 200, badge_shape: "octagon", animation_type: "prismatic", description: "200 days of transformation" },
];

async function insertBadges() {
  const client = await pool.connect();
  try {
    console.log('Inserting badge definitions...');
    
    for (const badge of BADGE_DEFINITIONS) {
      await client.query(`
        INSERT INTO badges (badge_name, milestone_days, badge_shape, animation_type, description)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (badge_name) DO NOTHING
      `, [badge.badge_name, badge.milestone_days, badge.badge_shape, badge.animation_type, badge.description]);
      console.log(`✅ Inserted: ${badge.badge_name}`);
    }
    
    console.log('🎉 All badges inserted successfully!');
  } catch (error) {
    console.error('Error inserting badges:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

insertBadges();
