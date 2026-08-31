import express from "express";
import {
  getProjectFilters,
  getProjectRecordById,
  getProjectRecords,
  getProjectStages,
  getProjectStats,
  updateProjectStage,
} from "../Controllers/projectPipelineController.js";

const router = express.Router();

router.get("/records", getProjectRecords);
router.get("/records/:id", getProjectRecordById);
router.patch("/records/:id/stage", updateProjectStage);

router.get("/stages", getProjectStages);
router.get("/filters", getProjectFilters);
router.get("/stats", getProjectStats);

export default router;
