import express from "express";
import {
  getAutomations,
  getAutomationById,
  createAutomation,
  updateAutomation,
  deleteAutomation,
  activateAutomation,
  deactivateAutomation,
  testRunAutomation,
  reorderAutomationSteps,
} from "../Controllers/automationsController.js";

const router = express.Router();

router.get("/", getAutomations);

router.post("/", createAutomation);

router.get("/:automationId", getAutomationById);

router.patch("/:automationId", updateAutomation);

router.patch("/:automationId/steps/reorder", reorderAutomationSteps);

router.delete("/:automationId", deleteAutomation);

router.post("/:automationId/activate", activateAutomation);

router.post("/:automationId/deactivate", deactivateAutomation);

router.post("/:automationId/test-run", testRunAutomation);

export default router;
