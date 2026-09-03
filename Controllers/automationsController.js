// Automations: a trigger on a record event, then an ordered list of steps that
// run against the triggering record. Drafts are editable and never fire;
// activating one is what puts it live. Held in memory, so a restart returns
// the seed set below.
//
// The objects an automation can trigger on are the object manager's, so a new
// custom object is usable the moment it exists and this file keeps no list of
// its own to fall out of step.
import { objectExists, objectLabelOf } from "./objectManagerController.js";

const TRIGGER_EVENTS = ["created", "updated", "stageChanged", "deleted"];

const STEP_TYPES = [
  "condition",
  "sendNotification",
  "sendEmail",
  "createTask",
  "instantiateWorkflow",
  "createWorkOrder",
  "addFollower",
];

let automationCounter = 0;
let stepCounter = 0;
let runCounter = 0;

function nextAutomationId() {
  automationCounter += 1;
  return `AUTO${String(1000 + automationCounter)}`;
}

function nextStepId() {
  stepCounter += 1;
  return `AS${String(1000 + stepCounter)}`;
}

function nextRunId() {
  runCounter += 1;
  return `AR${String(1000 + runCounter)}`;
}

/** Strips a step down to its own type's fields - junk from another type in the
 *  same object would otherwise be stored and read back as though it were live. */
function makeStep(input) {
  const base = { id: input.id && String(input.id).startsWith("AS") ? input.id : nextStepId(), type: input.type };
  switch (input.type) {
    case "condition":
      return {
        ...base,
        field: String(input.field ?? "").trim(),
        operator: String(input.operator ?? "equals"),
        value: String(input.value ?? ""),
      };
    case "sendNotification":
      return {
        ...base,
        title: String(input.title ?? ""),
        notifyUserId: input.notifyUserId ? String(input.notifyUserId) : "",
      };
    case "sendEmail":
      return {
        ...base,
        templateId: input.templateId ? String(input.templateId) : "",
        to: String(input.to ?? ""),
        fallbackToRecordEmail: Boolean(input.fallbackToRecordEmail),
      };
    case "createTask":
      return {
        ...base,
        subject: String(input.subject ?? ""),
        dueInDays:
          input.dueInDays === undefined ||
          input.dueInDays === null ||
          input.dueInDays === ""
            ? null
            : Number(input.dueInDays),
        assigneeId: input.assigneeId ? String(input.assigneeId) : "",
      };
    case "instantiateWorkflow":
      return { ...base, workflowId: input.workflowId ? String(input.workflowId) : "" };
    case "createWorkOrder":
      return {
        ...base,
        templateId: input.templateId ? String(input.templateId) : "",
        titleOverride: String(input.titleOverride ?? ""),
      };
    case "addFollower":
      return { ...base, userId: input.userId ? String(input.userId) : "" };
    default:
      return base;
  }
}

/**
 * Puts every condition step ahead of the rest, preserving relative order
 * within each group. A condition gates what follows, so it always evaluates
 * first regardless of how steps were added, saved, or dragged.
 */
function sortConditionsFirst(steps) {
  const conditions = steps.filter((step) => step.type === "condition");
  const rest = steps.filter((step) => step.type !== "condition");
  return [...conditions, ...rest];
}

function makeAutomation({ name, trigger, steps, status }) {
  return {
    id: nextAutomationId(),
    name: String(name).trim(),
    status: status === "active" ? "active" : "draft",
    trigger: {
      objectId: trigger?.objectId ?? "",
      event: TRIGGER_EVENTS.includes(trigger?.event) ? trigger.event : "created",
      // Only meaningful for a stageChanged trigger; kept as sent otherwise so a
      // half-built draft round-trips unchanged.
      stage: trigger?.stage ? String(trigger.stage) : "",
    },
    steps: sortConditionsFirst((steps ?? []).map((step) => makeStep(step))),
    runHistory: [],
  };
}

const automations = [
  {
    ...makeAutomation({
      name: "Auto-follow project owner on stage change",
      status: "active",
      trigger: { objectId: "leads", event: "created" },
      steps: [
        { type: "sendNotification", title: "new $Record.name assigned" },
        { type: "sendEmail", fallbackToRecordEmail: true },
      ],
    }),
    runHistory: [
      {
        id: nextRunId(),
        ranAt: "2026-08-18T09:12:00.000Z",
        status: "success",
        recordId: "LEAD-1042",
        message: "2 steps ran",
      },
    ],
  },
  makeAutomation({
    name: "Auto-follow project owner on stage change",
    status: "draft",
    trigger: { objectId: "leads", event: "created" },
    steps: [
      // Left incomplete on purpose: a condition with no field set is exactly
      // what a freshly-added step looks like before someone fills it in, and
      // testRunAutomation treats that as a failing run - so Test run against
      // this automation demonstrates the error path without any setup.
      { type: "condition", field: "", operator: "equals", value: "" },
      { type: "sendNotification", title: "new $Record.name assigned" },
      { type: "sendEmail", fallbackToRecordEmail: true },
    ],
  }),
];

const STEP_LABELS = {
  condition: "Condition",
  sendNotification: "Send notification",
  sendEmail: "Send email",
  createTask: "Create task",
  instantiateWorkflow: "Instantiate workflow",
  createWorkOrder: "Create work order",
  addFollower: "Add follower",
};

const EVENT_LABELS = {
  created: "created",
  updated: "updated",
  stageChanged: "stage changes",
  deleted: "deleted",
};

/** The list row - what the cards show, without every step's config. */
function toSummary(automation) {
  const objectLabel =
    objectLabelOf(automation.trigger.objectId) ??
    automation.trigger.objectId ??
    "record";
  const lastRun = automation.runHistory[automation.runHistory.length - 1] ?? null;
  const errorRuns = automation.runHistory.filter(
    (run) => run.status === "error",
  ).length;
  return {
    id: automation.id,
    name: automation.name,
    status: automation.status,
    trigger: automation.trigger,
    triggerObjectLabel: objectLabel,
    triggerSummary: `When ${objectLabel.toLowerCase()} is ${
      EVENT_LABELS[automation.trigger.event] ?? automation.trigger.event
    }`,
    stepSummary: automation.steps.map(
      (step) => STEP_LABELS[step.type] ?? step.type,
    ),
    lastRunAt: lastRun?.ranAt ?? null,
    lastRunStatus: lastRun?.status ?? null,
    errorRate: automation.runHistory.length
      ? Math.round((errorRuns / automation.runHistory.length) * 100)
      : 0,
  };
}

function findAutomation(id) {
  return automations.find((automation) => automation.id === id);
}

function notFound(res) {
  return res
    .status(404)
    .json({ success: false, data: null, message: "Automation not found" });
}

function badRequest(res, message) {
  return res.status(400).json({ success: false, data: null, message });
}

function validateTrigger(trigger) {
  if (!trigger || typeof trigger !== "object") {
    return "trigger is required";
  }
  if (trigger.objectId && !objectExists(trigger.objectId)) {
    return `Unknown trigger object: ${trigger.objectId}`;
  }
  if (trigger.event !== undefined && !TRIGGER_EVENTS.includes(trigger.event)) {
    return `event must be one of: ${TRIGGER_EVENTS.join(", ")}`;
  }
  return null;
}

function validateSteps(steps) {
  if (!Array.isArray(steps)) {
    return "steps must be an array";
  }
  for (const step of steps) {
    if (!STEP_TYPES.includes(step?.type)) {
      return `Unknown step type: ${step?.type}`;
    }
  }
  return null;
}

/** GET /automations */
export const getAutomations = (_req, res) => {
  res.json({
    success: true,
    data: automations.map(toSummary),
    message: "Automations fetched successfully",
  });
};

/** GET /automations/:automationId */
export const getAutomationById = (req, res) => {
  const automation = findAutomation(req.params.automationId);
  if (!automation) {
    return notFound(res);
  }
  res.json({
    success: true,
    data: automation,
    message: "Automation fetched successfully",
  });
};

/** POST /automations */
export const createAutomation = (req, res) => {
  const { name, triggerObjectId } = req.body ?? {};

  if (!String(name ?? "").trim()) {
    return badRequest(res, "name is required");
  }
  if (!triggerObjectId || !objectExists(triggerObjectId)) {
    return badRequest(res, `Unknown triggerObjectId: ${triggerObjectId}`);
  }

  const automation = makeAutomation({
    name,
    status: "draft",
    trigger: { objectId: triggerObjectId, event: "created" },
    steps: [],
  });
  automations.push(automation);

  res.status(201).json({
    success: true,
    data: automation,
    message: "Automation created successfully",
  });
};

/** PATCH /automations/:automationId */
export const updateAutomation = (req, res) => {
  const automation = findAutomation(req.params.automationId);
  if (!automation) {
    return notFound(res);
  }

  const { name, trigger, steps } = req.body ?? {};

  if (name !== undefined) {
    if (!String(name).trim()) {
      return badRequest(res, "name cannot be empty");
    }
    automation.name = String(name).trim();
  }

  if (trigger !== undefined) {
    const problem = validateTrigger(trigger);
    if (problem) {
      return badRequest(res, problem);
    }
    automation.trigger = {
      objectId: trigger.objectId ?? "",
      event: TRIGGER_EVENTS.includes(trigger.event) ? trigger.event : "created",
      stage: trigger.stage ? String(trigger.stage) : "",
    };
  }

  if (steps !== undefined) {
    const problem = validateSteps(steps);
    if (problem) {
      return badRequest(res, problem);
    }
    automation.steps = sortConditionsFirst(steps.map((step) => makeStep(step)));
  }

  res.status(200).json({
    success: true,
    data: automation,
    message: "Automation updated successfully",
  });
};

/** DELETE /automations/:automationId */
export const deleteAutomation = (req, res) => {
  const index = automations.findIndex(
    (automation) => automation.id === req.params.automationId,
  );
  if (index === -1) {
    return notFound(res);
  }
  automations.splice(index, 1);
  res.status(200).json({
    success: true,
    data: null,
    message: "Automation deleted successfully",
  });
};

/** POST /automations/:automationId/activate */
export const activateAutomation = (req, res) => {
  const automation = findAutomation(req.params.automationId);
  if (!automation) {
    return notFound(res);
  }
  if (!automation.trigger.objectId) {
    return badRequest(res, "An automation needs a trigger object before it can go live");
  }
  automation.status = "active";
  res.status(200).json({
    success: true,
    data: automation,
    message: "Automation activated",
  });
};

/** POST /automations/:automationId/deactivate */
export const deactivateAutomation = (req, res) => {
  const automation = findAutomation(req.params.automationId);
  if (!automation) {
    return notFound(res);
  }
  automation.status = "draft";
  res.status(200).json({
    success: true,
    data: automation,
    message: "Automation deactivated",
  });
};

/**
 * POST /automations/:automationId/test-run
 *
 * Runs the automation synchronously against one record and records the outcome
 * in its history. No real side effects - this stand-in just reports how many
 * steps would have run.
 */
export const testRunAutomation = (req, res) => {
  const automation = findAutomation(req.params.automationId);
  if (!automation) {
    return notFound(res);
  }

  const recordId = String(req.body?.recordId ?? "").trim();
  if (!recordId) {
    return badRequest(res, "recordId is required");
  }

  const hasEmptyStep = automation.steps.some((step) => {
    if (step.type === "condition") return !step.field;
    if (step.type === "sendEmail") return !step.templateId && !step.fallbackToRecordEmail;
    if (step.type === "instantiateWorkflow") return !step.workflowId;
    if (step.type === "createWorkOrder") return !step.templateId;
    return false;
  });

  const run = {
    id: nextRunId(),
    ranAt: new Date().toISOString(),
    status: hasEmptyStep ? "error" : "success",
    recordId,
    message: hasEmptyStep
      ? "A step is missing a required field"
      : `${automation.steps.length} step${
          automation.steps.length === 1 ? "" : "s"
        } ran`,
  };
  automation.runHistory.push(run);

  res.status(200).json({
    success: true,
    data: { run, automation },
    message: "Test run complete",
  });
};

/**
 * PATCH /automations/:automationId/steps/reorder
 *
 * Takes the complete list of step ids in their new order, the same way
 * reorderStages does for pipelines - a stale client is rejected outright
 * rather than silently dropping or duplicating a step. Conditions are then
 * normalised back to the front regardless of what was sent, since a
 * condition always gates the steps that follow it.
 */
export const reorderAutomationSteps = (req, res) => {
  const automation = findAutomation(req.params.automationId);
  if (!automation) {
    return notFound(res);
  }

  const { stepIds } = req.body ?? {};

  if (!Array.isArray(stepIds)) {
    return badRequest(res, "stepIds must be an array");
  }

  const current = automation.steps.map((step) => step.id);
  const sameLength = stepIds.length === current.length;
  const sameMembers =
    sameLength &&
    new Set(stepIds).size === stepIds.length &&
    stepIds.every((id) => current.includes(id));

  if (!sameMembers) {
    return badRequest(
      res,
      "stepIds must contain every step of this automation exactly once"
    );
  }

  const byId = new Map(automation.steps.map((step) => [step.id, step]));
  automation.steps = sortConditionsFirst(stepIds.map((id) => byId.get(id)));

  res.status(200).json({
    success: true,
    data: automation,
    message: "Steps reordered successfully",
  });
};
