// Stand-in directory until there is an endpoint for it. Entry payloads carry
// an assigneeId only, so the display name is resolved here rather than being
// trusted from the client - the client could send any name it liked.
const DIRECTORY = {
  "u-01": "Gokul krishna",
  "u-02": "Priya Sharma",
  "u-03": "Kaushik Prakash",
  "u-04": "Sara Lee",
  "t-01": "Dispatch crew",
  "t-02": "Install crew",
  "t-03": "Design team",
  "q-01": "Unassigned queue",
  "q-02": "Escalations",
};

const OBJECT_LABELS = {
  lead: "Lead",
  contact: "Contact",
  project: "Project",
  work_order: "Dispatch",
};

const VALID_OPERATORS = [
  "equals",
  "not_equals",
  "contains",
  "starts_with",
  "is_empty",
  "is_not_empty",
];
const VALID_ASSIGNEE_TYPES = ["user", "team", "queue"];
const VALID_METHODS = ["direct", "indirect", "fallback", "round_robin"];

let ruleCounter = 0;
let entryCounter = 0;

function nextRuleId() {
  ruleCounter += 1;
  return `AR${String(1000 + ruleCounter)}`;
}

function nextEntryId() {
  entryCounter += 1;
  return `ARE${String(1000 + entryCounter)}`;
}

function makeEntry(input) {
  return {
    id: nextEntryId(),
    alwaysFallback: Boolean(input.alwaysFallback),
    criteria: (input.criteria ?? []).map((criterion) => ({
      id: nextEntryId(),
      property: criterion.property,
      operator: criterion.operator,
      value: criterion.value ?? "",
    })),
    assigneeType: input.assigneeType,
    assigneeId: input.assigneeId,
    assigneeName: DIRECTORY[input.assigneeId] ?? input.assigneeId,
    method: input.method,
    notifyAssignee: Boolean(input.notifyAssignee),
  };
}

// Order within `entries` is the evaluation order - first match wins - so it is
// preserved as given and never sorted.
const assignmentRules = [
  {
    id: nextRuleId(),
    name: "Lead assign",
    objectId: "work_order",
    objectLabel: "Dispatch",
    active: true,
    entries: [
      makeEntry({
        alwaysFallback: false,
        criteria: [
          { property: "email", operator: "equals", value: "Kaushik@gmail.com" },
        ],
        assigneeType: "user",
        assigneeId: "u-01",
        method: "direct",
        notifyAssignee: false,
      }),
    ],
  },
  {
    id: nextRuleId(),
    name: "Field WO Dispatch",
    objectId: "work_order",
    objectLabel: "Dispatch",
    active: true,
    entries: [
      makeEntry({
        alwaysFallback: false,
        criteria: [
          { property: "fullName", operator: "contains", value: "Arjun" },
        ],
        assigneeType: "user",
        assigneeId: "u-01",
        method: "fallback",
        notifyAssignee: true,
      }),
      makeEntry({
        alwaysFallback: false,
        criteria: [
          { property: "email", operator: "equals", value: "Priya@example.com" },
        ],
        assigneeType: "team",
        assigneeId: "u-02",
        method: "indirect",
        notifyAssignee: false,
      }),
    ],
  },
  {
    id: nextRuleId(),
    name: "Field WO Dispatch",
    objectId: "work_order",
    objectLabel: "Dispatch",
    active: true,
    entries: [],
  },
];

function findRule(ruleId) {
  return assignmentRules.find((rule) => rule.id === ruleId);
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
 * A criterion is only meaningful with a known operator and a property, and the
 * two operators that compare against nothing must not carry a value.
 */
function validateCriteria(criteria) {
  if (!Array.isArray(criteria)) {
    return "criteria must be an array";
  }
  for (const criterion of criteria) {
    if (!criterion?.property) {
      return "Every criterion needs a property";
    }
    if (!VALID_OPERATORS.includes(criterion.operator)) {
      return `Unknown operator: ${criterion.operator}`;
    }
    const needsValue = !["is_empty", "is_not_empty"].includes(
      criterion.operator
    );
    if (needsValue && !String(criterion.value ?? "").trim()) {
      return `Operator "${criterion.operator}" needs a value`;
    }
  }
  return null;
}

function validateEntry(body) {
  if (!VALID_ASSIGNEE_TYPES.includes(body?.assigneeType)) {
    return "assigneeType must be user, team or queue";
  }
  if (!body?.assigneeId) {
    return "assigneeId is required";
  }
  if (!VALID_METHODS.includes(body?.method)) {
    return `method must be one of: ${VALID_METHODS.join(", ")}`;
  }
  // A fallback entry matches everything, so its criteria are never evaluated
  // and are not required to be valid - or present at all.
  if (body.alwaysFallback) {
    return null;
  }
  if (!Array.isArray(body.criteria) || body.criteria.length === 0) {
    return "A non-fallback entry needs at least one criterion";
  }
  return validateCriteria(body.criteria);
}

/** GET /assignment-rules */
export const getAssignmentRules = (_req, res) => {
  res.json({
    success: true,
    data: assignmentRules,
    message: "Assignment rules fetched successfully",
  });
};

/** POST /assignment-rules */
export const createAssignmentRule = (req, res) => {
  const { name, objectId } = req.body ?? {};

  if (!String(name ?? "").trim()) {
    return badRequest(res, "name is required");
  }
  if (!OBJECT_LABELS[objectId]) {
    return badRequest(res, `Unknown objectId: ${objectId}`);
  }

  const rule = {
    id: nextRuleId(),
    name: String(name).trim(),
    objectId,
    objectLabel: OBJECT_LABELS[objectId],
    active: true,
    entries: [],
  };

  assignmentRules.push(rule);

  res.status(201).json({
    success: true,
    data: rule,
    message: "Assignment rule created successfully",
  });
};

/** PATCH /assignment-rules/:id */
export const updateAssignmentRule = (req, res) => {
  const rule = findRule(req.params.id);
  if (!rule) {
    return notFound(res, "Assignment rule");
  }

  const { name, active } = req.body ?? {};

  if (name !== undefined) {
    if (!String(name).trim()) {
      return badRequest(res, "name cannot be empty");
    }
    rule.name = String(name).trim();
  }
  if (active !== undefined) {
    rule.active = Boolean(active);
  }

  res.status(200).json({
    success: true,
    data: rule,
    message: "Assignment rule updated successfully",
  });
};

/** DELETE /assignment-rules/:id */
export const deleteAssignmentRule = (req, res) => {
  const index = assignmentRules.findIndex((rule) => rule.id === req.params.id);
  if (index === -1) {
    return notFound(res, "Assignment rule");
  }

  assignmentRules.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Assignment rule deleted successfully",
  });
};

/** POST /assignment-rules/:ruleId/entries */
export const createAssignmentEntry = (req, res) => {
  const rule = findRule(req.params.ruleId);
  if (!rule) {
    return notFound(res, "Assignment rule");
  }

  const problem = validateEntry(req.body);
  if (problem) {
    return badRequest(res, problem);
  }

  // Appended, not prepended: a new entry is the lowest priority until it is
  // dragged up, which is the safer default for a first-match-wins list.
  rule.entries.push(
    makeEntry({
      ...req.body,
      criteria: req.body.alwaysFallback ? [] : req.body.criteria,
    })
  );

  res.status(201).json({
    success: true,
    data: rule,
    message: "Entry created successfully",
  });
};

/** DELETE /assignment-rules/:ruleId/entries/:entryId */
export const deleteAssignmentEntry = (req, res) => {
  const rule = findRule(req.params.ruleId);
  if (!rule) {
    return notFound(res, "Assignment rule");
  }

  const index = rule.entries.findIndex(
    (entry) => entry.id === req.params.entryId
  );
  if (index === -1) {
    return notFound(res, "Entry");
  }

  rule.entries.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Entry deleted successfully",
  });
};

/**
 * PATCH /assignment-rules/:ruleId/entries/reorder
 *
 * Takes the complete list of entry ids in their new order. Requiring the whole
 * set - rather than a from/to pair - means a client working from a stale view
 * is rejected outright instead of silently dropping or duplicating an entry.
 */
export const reorderAssignmentEntries = (req, res) => {
  const rule = findRule(req.params.ruleId);
  if (!rule) {
    return notFound(res, "Assignment rule");
  }

  const { entryIds } = req.body ?? {};

  if (!Array.isArray(entryIds)) {
    return badRequest(res, "entryIds must be an array");
  }

  const current = rule.entries.map((entry) => entry.id);
  const sameLength = entryIds.length === current.length;
  const sameMembers =
    sameLength &&
    new Set(entryIds).size === entryIds.length &&
    entryIds.every((id) => current.includes(id));

  if (!sameMembers) {
    return badRequest(
      res,
      "entryIds must contain every entry of this rule exactly once"
    );
  }

  const byId = new Map(rule.entries.map((entry) => [entry.id, entry]));
  rule.entries = entryIds.map((id) => byId.get(id));

  res.status(200).json({
    success: true,
    data: rule,
    message: "Entries reordered successfully",
  });
};
