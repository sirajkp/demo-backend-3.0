import express from "express";
import {
  getAssignmentRules,
  createAssignmentRule,
  updateAssignmentRule,
  deleteAssignmentRule,
  createAssignmentEntry,
  deleteAssignmentEntry,
  reorderAssignmentEntries,
} from "../Controllers/assignmentRulesController.js";

const router = express.Router();

router.get("/", getAssignmentRules);

router.post("/", createAssignmentRule);

router.patch("/:id", updateAssignmentRule);

router.delete("/:id", deleteAssignmentRule);

router.post("/:ruleId/entries", createAssignmentEntry);

// Registered before "/:ruleId/entries/:entryId" so "reorder" isn't taken for
// an entry id.
router.patch("/:ruleId/entries/reorder", reorderAssignmentEntries);

router.delete("/:ruleId/entries/:entryId", deleteAssignmentEntry);

export default router;
