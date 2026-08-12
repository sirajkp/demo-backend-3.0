import express from "express";
import {
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
} from "../Controllers/userPreferencesController.js";

const router = express.Router();

router.get("/", getUserPreferences);

router.patch("/", updateUserPreferences);

router.post("/reset", resetUserPreferences);

export default router;
