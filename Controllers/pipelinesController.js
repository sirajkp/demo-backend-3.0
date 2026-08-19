// Pipelines: the stages a record advances through, their statuses, and the
// order they run in. In-memory store, no DB/auth wired yet - same stand-in
// pattern as the other controllers in this codebase.

const VALID_CATEGORIES = ["open", "won", "lost"];
const VALID_GATE_TYPES = ["noGate", "requiredFields", "requiredDocument"];

// The palette the stage drawer offers. Not enforced as a whitelist - a colour
// is presentation, and pinning the API to one client's swatches would age
// badly - but the shape is, so junk can't reach the board.
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

let pipelineCounter = 0;
let stageCounter = 0;
let statusCounter = 0;

function nextPipelineId() {
  pipelineCounter += 1;
  return `PL${String(1000 + pipelineCounter)}`;
}

function nextStageId() {
  stageCounter += 1;
  return `PLS${String(1000 + stageCounter)}`;
}

function nextStatusId() {
  statusCounter += 1;
  return `PLST${String(1000 + statusCounter)}`;
}

function makeStage(input) {
  return {
    id: nextStageId(),
    name: String(input.name).trim(),
    category: input.category,
    color: input.color,
    // Omitted rather than zeroed when absent: a stage with no deadline is a
    // real stage, and 0 would read as "overdue immediately".
    ...(input.slaDays === undefined || input.slaDays === null || input.slaDays === ""
      ? {}
      : { slaDays: Number(input.slaDays) }),
    gateType: input.gateType,
    // Only the chosen gate keeps its answer. Storing the other one would leave
    // a requirement nothing ever checks, and it would come back on the next
    // read as though it were live.
    ...(input.gateType === "requiredFields"
      ? { requiredFields: [...input.requiredFields] }
      : {}),
    ...(input.gateType === "requiredDocument"
      ? { requiredDocumentType: String(input.requiredDocumentType).trim() }
      : {}),
    statuses: (input.statuses ?? []).map((status) => ({
      id: nextStatusId(),
      name: status.name,
    })),
  };
}

// Order within `stages` is the order records advance through them, so it is
// preserved as given and never sorted.
const pipelines = [
  {
    id: nextPipelineId(),
    name: "Solar workflow",
    stages: [
      makeStage({
        name: "Newly Launched",
        category: "open",
        color: "#CAC4CE",
        slaDays: 4,
        gateType: "noGate",
      }),
      makeStage({
        name: "Design Stage",
        category: "won",
        color: "#B6BE9C",
        slaDays: 32,
        gateType: "noGate",
      }),
      makeStage({
        name: "Development Stage",
        category: "lost",
        color: "#CAC4CE",
        slaDays: 32,
        // Field keys on the Projects object - see GATE_PROPERTY_OBJECT_ID.
        gateType: "requiredFields",
        requiredFields: ["name", "status"],
      }),
      makeStage({
        name: "Quality Check",
        category: "lost",
        color: "#2F80ED",
        slaDays: 32,
        gateType: "requiredDocument",
        requiredDocumentType: "Inspection report",
      }),
      makeStage({
        name: "Budget Planning",
        category: "won",
        color: "#B6BE9C",
        slaDays: 32,
        gateType: "noGate",
      }),
    ],
  },
  { id: nextPipelineId(), name: "User Registration", stages: [] },
  { id: nextPipelineId(), name: "Password Reset", stages: [] },
  { id: nextPipelineId(), name: "Newsletter Signup", stages: [] },
  { id: nextPipelineId(), name: "Account Deactivation", stages: [] },
];

function findPipeline(pipelineId) {
  return pipelines.find((pipeline) => pipeline.id === pipelineId);
}

function findStage(pipeline, stageId) {
  return pipeline.stages.find((stage) => stage.id === stageId);
}

/** The list shape - name only, no stages. */
function toSummary(pipeline) {
  return { id: pipeline.id, name: pipeline.name };
}

function notFound(res, what) {
  return res.status(404).json({
    success: false,
    data: null,
    message: `${what} not found`,
  });
}

function badRequest(res, message) {
  return res.status(400).json({ success: false, data: null, message });
}

/**
 * A stage needs everything except its SLA: the category says what reaching it
 * means, the gate says what it takes to leave, and neither has a safe default.
 */
function validateStage(body) {
  if (!String(body?.name ?? "").trim()) {
    return "name is required";
  }
  if (!VALID_CATEGORIES.includes(body?.category)) {
    return `category must be one of: ${VALID_CATEGORIES.join(", ")}`;
  }
  if (!HEX_COLOR.test(String(body?.color ?? ""))) {
    return "color must be a hex value such as #1C876C";
  }
  if (!VALID_GATE_TYPES.includes(body?.gateType)) {
    return `gateType must be one of: ${VALID_GATE_TYPES.join(", ")}`;
  }
  // Optional, but if it is sent it has to be a whole number of days.
  if (body.slaDays !== undefined && body.slaDays !== null && body.slaDays !== "") {
    const days = Number(body.slaDays);
    if (!Number.isInteger(days) || days < 1) {
      return "slaDays must be a whole number of days, 1 or more";
    }
  }
  // Each gate carries its own requirement, and a gate with nothing to check
  // would let every record through - which is what noGate is for.
  if (body.gateType === "requiredFields") {
    if (!Array.isArray(body.requiredFields) || body.requiredFields.length === 0) {
      return "requiredFields must list at least one field for a requiredFields gate";
    }
    if (body.requiredFields.some((field) => !String(field ?? "").trim())) {
      return "requiredFields must contain field keys, not blanks";
    }
    if (new Set(body.requiredFields).size !== body.requiredFields.length) {
      return "requiredFields must not repeat a field";
    }
  }
  if (
    body.gateType === "requiredDocument" &&
    !String(body.requiredDocumentType ?? "").trim()
  ) {
    return "requiredDocumentType is required for a requiredDocument gate";
  }
  return null;
}

/** GET /pipelines */
export const getPipelines = (_req, res) => {
  res.json({
    success: true,
    data: pipelines.map(toSummary),
    message: "Pipelines fetched successfully",
  });
};

/** GET /pipelines/:pipelineId */
export const getPipelineById = (req, res) => {
  const pipeline = findPipeline(req.params.pipelineId);
  if (!pipeline) {
    return notFound(res, "Pipeline");
  }

  res.json({
    success: true,
    data: pipeline,
    message: "Pipeline fetched successfully",
  });
};

/** POST /pipelines */
export const createPipeline = (req, res) => {
  const { name } = req.body ?? {};

  if (!String(name ?? "").trim()) {
    return badRequest(res, "name is required");
  }

  const pipeline = {
    id: nextPipelineId(),
    name: String(name).trim(),
    stages: [],
  };

  pipelines.push(pipeline);

  // The summary, not the whole pipeline: this is what joins the list the
  // client already holds, and a new pipeline has no stages to send anyway.
  res.status(201).json({
    success: true,
    data: toSummary(pipeline),
    message: "Pipeline created successfully",
  });
};

/** PATCH /pipelines/:pipelineId */
export const updatePipeline = (req, res) => {
  const pipeline = findPipeline(req.params.pipelineId);
  if (!pipeline) {
    return notFound(res, "Pipeline");
  }

  const { name } = req.body ?? {};

  if (name !== undefined) {
    if (!String(name).trim()) {
      return badRequest(res, "name cannot be empty");
    }
    pipeline.name = String(name).trim();
  }

  res.status(200).json({
    success: true,
    data: toSummary(pipeline),
    message: "Pipeline updated successfully",
  });
};

/** DELETE /pipelines/:pipelineId */
export const deletePipeline = (req, res) => {
  const index = pipelines.findIndex(
    (pipeline) => pipeline.id === req.params.pipelineId
  );
  if (index === -1) {
    return notFound(res, "Pipeline");
  }

  pipelines.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Pipeline deleted successfully",
  });
};

/** POST /pipelines/:pipelineId/stages */
export const createStage = (req, res) => {
  const pipeline = findPipeline(req.params.pipelineId);
  if (!pipeline) {
    return notFound(res, "Pipeline");
  }

  const problem = validateStage(req.body);
  if (problem) {
    return badRequest(res, problem);
  }

  // Appended, not prepended: a new stage goes at the end of the run until it
  // is dragged into place, which is the safer default for an ordered list.
  const stage = makeStage(req.body);
  pipeline.stages.push(stage);

  res.status(201).json({
    success: true,
    data: stage,
    message: "Stage created successfully",
  });
};

/** DELETE /pipelines/:pipelineId/stages/:stageId */
export const deleteStage = (req, res) => {
  const pipeline = findPipeline(req.params.pipelineId);
  if (!pipeline) {
    return notFound(res, "Pipeline");
  }

  const index = pipeline.stages.findIndex(
    (stage) => stage.id === req.params.stageId
  );
  if (index === -1) {
    return notFound(res, "Stage");
  }

  pipeline.stages.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Stage deleted successfully",
  });
};

/**
 * PATCH /pipelines/:pipelineId/stages/reorder
 *
 * Takes the complete list of stage ids in their new order. Requiring the whole
 * set - rather than a from/to pair - means a client working from a stale view
 * is rejected outright instead of silently dropping or duplicating a stage.
 */
export const reorderStages = (req, res) => {
  const pipeline = findPipeline(req.params.pipelineId);
  if (!pipeline) {
    return notFound(res, "Pipeline");
  }

  const { stageIds } = req.body ?? {};

  if (!Array.isArray(stageIds)) {
    return badRequest(res, "stageIds must be an array");
  }

  const current = pipeline.stages.map((stage) => stage.id);
  const sameLength = stageIds.length === current.length;
  const sameMembers =
    sameLength &&
    new Set(stageIds).size === stageIds.length &&
    stageIds.every((id) => current.includes(id));

  if (!sameMembers) {
    return badRequest(
      res,
      "stageIds must contain every stage of this pipeline exactly once"
    );
  }

  const byId = new Map(pipeline.stages.map((stage) => [stage.id, stage]));
  pipeline.stages = stageIds.map((id) => byId.get(id));

  res.status(200).json({
    success: true,
    data: pipeline,
    message: "Stages reordered successfully",
  });
};

/** POST /pipelines/:pipelineId/stages/:stageId/statuses */
export const createStatus = (req, res) => {
  const pipeline = findPipeline(req.params.pipelineId);
  if (!pipeline) {
    return notFound(res, "Pipeline");
  }

  const stage = findStage(pipeline, req.params.stageId);
  if (!stage) {
    return notFound(res, "Stage");
  }

  const { name } = req.body ?? {};
  if (!String(name ?? "").trim()) {
    return badRequest(res, "name is required");
  }

  stage.statuses.push({ id: nextStatusId(), name: String(name).trim() });

  // The whole stage, not just the status: statuses are only ever read through
  // their stage, so this is what the client has a place to put.
  res.status(201).json({
    success: true,
    data: stage,
    message: "Status created successfully",
  });
};

/** DELETE /pipelines/:pipelineId/stages/:stageId/statuses/:statusId */
export const deleteStatus = (req, res) => {
  const pipeline = findPipeline(req.params.pipelineId);
  if (!pipeline) {
    return notFound(res, "Pipeline");
  }

  const stage = findStage(pipeline, req.params.stageId);
  if (!stage) {
    return notFound(res, "Stage");
  }

  const index = stage.statuses.findIndex(
    (status) => status.id === req.params.statusId
  );
  if (index === -1) {
    return notFound(res, "Status");
  }

  stage.statuses.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Status deleted successfully",
  });
};
