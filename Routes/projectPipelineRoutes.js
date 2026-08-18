import express from "express";
import {
  getProjectFilters,
  getProjectRecords,
  getProjectStages,
  getProjectStats,
  updateProjectStage,
} from "../Controllers/projectPipelineController.js";

const router = express.Router();

router.get("/records", getProjectRecords);
router.patch("/records/:id/stage", updateProjectStage);

router.get("/stages", getProjectStages);
router.get("/filters", getProjectFilters);
router.get("/stats", getProjectStats);

export default router;
