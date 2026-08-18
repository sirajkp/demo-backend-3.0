import express from "express";
import {
  getPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline,
  createStage,
  deleteStage,
  reorderStages,
  createStatus,
  deleteStatus,
} from "../Controllers/pipelinesController.js";

const router = express.Router();

router.get("/", getPipelines);

router.post("/", createPipeline);

router.get("/:pipelineId", getPipelineById);

router.patch("/:pipelineId", updatePipeline);

router.delete("/:pipelineId", deletePipeline);

router.post("/:pipelineId/stages", createStage);

// Registered before "/:pipelineId/stages/:stageId" so "reorder" isn't taken
// for a stage id.
router.patch("/:pipelineId/stages/reorder", reorderStages);

router.delete("/:pipelineId/stages/:stageId", deleteStage);

router.post("/:pipelineId/stages/:stageId/statuses", createStatus);

router.delete("/:pipelineId/stages/:stageId/statuses/:statusId", deleteStatus);

export default router;
