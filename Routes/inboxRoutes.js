import express from "express";
import {
  getInbox,
  markInboxItemRead,
  markAllInboxRead,
} from "../Controllers/inboxController.js";

const router = express.Router();

router.get("/", getInbox);

// Registered before "/:id/read" so "read-all" isn't taken for an item id.
router.post("/read-all", markAllInboxRead);

router.patch("/:id/read", markInboxItemRead);

export default router;
