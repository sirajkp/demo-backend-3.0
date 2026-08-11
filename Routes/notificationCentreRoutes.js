import express from "express";
import {
  getNotificationPreferences,
  updateNotificationPreference,
  resetNotificationPreferences,
} from "../Controllers/notificationCentreController.js";

const router = express.Router();

router.get("/preferences", getNotificationPreferences);

router.post("/preferences/reset", resetNotificationPreferences);

router.patch("/preferences/:eventId", updateNotificationPreference);

export default router;
