import express from "express";
import {
  updateStreak,
  getMyStreak,
  getMyBadges,
  getStreakHistory,
} from "../controllers/streakController.js";
import auth from "../middlewares/auth.js";

const streakRouter = express.Router();

// All routes require authentication
streakRouter.post("/update", auth, updateStreak);
streakRouter.get("/my-streak", auth, getMyStreak);
streakRouter.get("/my-badges", auth, getMyBadges);
streakRouter.get("/history", auth, getStreakHistory);

export default streakRouter;
