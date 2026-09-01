import express from "express";
import {
  getPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  setDefaultPipeline,
  deletePipeline,
  createStage,
  updateStage,
  deleteStage,
  reorderStages,
  createStatus,
  updateStatus,
  deleteStatus,
  reorderStatuses,
} from "../Controllers/pipelinesController.js";

const router = express.Router();

router.get("/", getPipelines);

router.post("/", createPipeline);

router.get("/:pipelineId", getPipelineById);

router.patch("/:pipelineId", updatePipeline);

router.post("/:pipelineId/default", setDefaultPipeline);

router.delete("/:pipelineId", deletePipeline);

router.post("/:pipelineId/stages", createStage);

// Registered before "/:pipelineId/stages/:stageId" so "reorder" isn't taken
// for a stage id.
router.patch("/:pipelineId/stages/reorder", reorderStages);

router.patch("/:pipelineId/stages/:stageId", updateStage);

router.delete("/:pipelineId/stages/:stageId", deleteStage);

router.post("/:pipelineId/stages/:stageId/statuses", createStatus);

// Before "/statuses/:statusId" for the same reason the stage reorder is
// before "/stages/:stageId".
router.patch(
  "/:pipelineId/stages/:stageId/statuses/reorder",
  reorderStatuses,
);

router.patch(
  "/:pipelineId/stages/:stageId/statuses/:statusId",
  updateStatus,
);

router.delete("/:pipelineId/stages/:stageId/statuses/:statusId", deleteStatus);

export default router;
