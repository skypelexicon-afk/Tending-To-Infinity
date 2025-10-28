import { db } from "../db/client.js";
import { userStreaks, userBadges, badges, streakHistory } from "../schema/schema.js";
import { eq, and, sql } from "drizzle-orm";

// Badge definitions with extended milestones
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

// Initialize badge definitions in database (call this once on server startup)
export const initializeBadges = async () => {
  try {
    for (const badge of BADGE_DEFINITIONS) {
      // Check if badge already exists
      const [existing] = await db
        .select()
        .from(badges)
        .where(eq(badges.badge_name, badge.badge_name));
      
      if (!existing) {
        await db.insert(badges).values(badge);
      }
    }
    console.log("✅ Badges initialized successfully");
  } catch (error) {
    console.error("Error initializing badges:", error);
  }
};

// Update user streak on login
export const updateStreak = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's current streak data
    let [userStreak] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.user_id, userId));

    // If no streak record exists, create one
    if (!userStreak) {
      [userStreak] = await db
        .insert(userStreaks)
        .values({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_active_date: today,
          total_days_active: 1,
        })
        .returning();

      // Record today's activity
      await db.insert(streakHistory).values({
        user_id: userId,
        activity_date: today,
        was_active: true,
      });

      // Award first badge
      await checkAndAwardBadges(userId, 1);

      return res.json({
        success: true,
        streak: userStreak,
        message: "Streak started! 🔥",
      });
    }

    // Check if user already logged in today
    const lastActiveDate = new Date(userStreak.last_active_date);
    lastActiveDate.setHours(0, 0, 0, 0);

    if (lastActiveDate.getTime() === today.getTime()) {
      return res.json({
        success: true,
        streak: userStreak,
        message: "Already logged in today!",
      });
    }

    // Calculate day difference
    const dayDiff = Math.floor((today - lastActiveDate) / (1000 * 60 * 60 * 24));

    let newStreak;
    let totalDays = userStreak.total_days_active + 1;

    if (dayDiff === 1) {
      // Consecutive day - increment streak
      newStreak = userStreak.current_streak + 1;
    } else {
      // Missed days - reset streak to 1
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, userStreak.longest_streak);

    // Update streak record
    const [updatedStreak] = await db
      .update(userStreaks)
      .set({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_active_date: today,
        total_days_active: totalDays,
        updated_at: new Date(),
      })
      .where(eq(userStreaks.user_id, userId))
      .returning();

    // Record today's activity
    await db.insert(streakHistory).values({
      user_id: userId,
      activity_date: today,
      was_active: true,
    });

    // Check and award new badges
    const newBadges = await checkAndAwardBadges(userId, newStreak);

    return res.json({
      success: true,
      streak: updatedStreak,
      newBadges,
      message: dayDiff === 1 ? `${newStreak} day streak! 🔥` : "Welcome back! Starting fresh.",
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return res.status(500).json({ error: "Failed to update streak" });
  }
};

// Check and award badges based on streak milestone
const checkAndAwardBadges = async (userId, currentStreak) => {
  try {
    const earnedBadges = [];

    // Get user's existing badges
    const existingBadges = await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.user_id, userId));

    const existingBadgeNames = existingBadges.map((b) => b.badge_name);

    // Check each badge milestone
    for (const badge of BADGE_DEFINITIONS) {
      if (
        currentStreak >= badge.milestone_days &&
        !existingBadgeNames.includes(badge.badge_name)
      ) {
        // Award this badge
        await db.insert(userBadges).values({
          user_id: userId,
          badge_name: badge.badge_name,
          earned_at: new Date(),
        });

        earnedBadges.push(badge);
      }
    }

    return earnedBadges;
  } catch (error) {
    console.error("Error checking badges:", error);
    return [];
  }
};

// Get user's current streak
export const getMyStreak = async (req, res) => {
  try {
    const userId = req.userId;

    let [userStreak] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.user_id, userId));

    // If no streak exists, return default values
    if (!userStreak) {
      userStreak = {
        current_streak: 0,
        longest_streak: 0,
        total_days_active: 0,
        last_active_date: null,
      };
    }

    return res.json({ success: true, streak: userStreak });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return res.status(500).json({ error: "Failed to fetch streak" });
  }
};

// Get user's earned badges
export const getMyBadges = async (req, res) => {
  try {
    const userId = req.userId;

    const earnedBadges = await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.user_id, userId));

    // Get full badge details
    const badgeDetails = earnedBadges.map((ub) => {
      const badgeDef = BADGE_DEFINITIONS.find(
        (b) => b.badge_name === ub.badge_name
      );
      return {
        ...badgeDef,
        earned_at: ub.earned_at,
      };
    });

    // Also return all badge definitions for display
    return res.json({
      success: true,
      earnedBadges: badgeDetails,
      allBadges: BADGE_DEFINITIONS,
    });
  } catch (error) {
    console.error("Error fetching badges:", error);
    return res.status(500).json({ error: "Failed to fetch badges" });
  }
};

// Get streak history for calendar view
export const getStreakHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 90 } = req.query; // Default to last 90 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const history = await db
      .select()
      .from(streakHistory)
      .where(
        and(
          eq(streakHistory.user_id, userId),
          sql`${streakHistory.activity_date} >= ${startDate}`
        )
      )
      .orderBy(streakHistory.activity_date);

    return res.json({ success: true, history });
  } catch (error) {
    console.error("Error fetching streak history:", error);
    return res.status(500).json({ error: "Failed to fetch streak history" });
  }
};
