import { PROJECT_RECORDS } from "./data/projectPipelineRecords.js";
import { PROJECT_STAGES } from "./data/projectPipelineStages.js";

// Stand-in for the signed-in user until the routes read the bearer token -
// same pattern as CURRENT_USER in contactsController. Id 1 shows up as an
// assignee on several seed records so "My Project" isn't an empty list.
const CURRENT_USER_ID = 1;

const FINISHED_STAGE_IDS = new Set(["closed", "cancelled", "archived"]);

// Order controls both the response order of GET /project-pipeline/filters and
// which chip a given record counts toward - each is independent (a record
// can match more than one), there's no priority to break ties on here.
const FILTER_DEFINITIONS = [
  { value: "all", label: "All" },
  { value: "my-project", label: "My Project" },
  { value: "due-soon", label: "Due Soon" },
  { value: "past-due", label: "Past Due" },
  { value: "closed", label: "Closed" },
  { value: "pending", label: "Pending" },
  { value: "archived", label: "Archived" },
  { value: "cancelled", label: "Cancelled" },
];

// How many days out counts as "due soon".
const DUE_SOON_WINDOW_DAYS = 14;

const parseDate = (isoDate) => new Date(`${isoDate}T00:00:00`);

const daysBetween = (from, to) => (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

const matchesFilter = (record, filterValue, now) => {
  switch (filterValue) {
    case "my-project":
      return record.assignees.some((assignee) => assignee.id === CURRENT_USER_ID);
    case "due-soon": {
      if (FINISHED_STAGE_IDS.has(record.stageId)) return false;
      const daysOut = daysBetween(now, parseDate(record.estCompleteDate));
      return daysOut >= 0 && daysOut <= DUE_SOON_WINDOW_DAYS;
    }
    case "past-due": {
      if (FINISHED_STAGE_IDS.has(record.stageId)) return false;
      return daysBetween(now, parseDate(record.estCompleteDate)) < 0;
    }
    case "closed":
      return record.stageId === "closed";
    case "pending":
      return record.status === "Pending";
    case "archived":
      return record.stageId === "archived";
    case "cancelled":
      return record.stageId === "cancelled";
    case "all":
    default:
      return true;
  }
};

const matchesSearch = (record, term) =>
  [record.code, record.customerName, record.city, record.state].some((field) =>
    String(field ?? "").toLowerCase().includes(term)
  );

const findRecord = (id) => PROJECT_RECORDS.find((record) => record.id === id);

/**
 * GET /project-pipeline/records
 *
 * Query params:
 *   filter   one of FILTER_DEFINITIONS' `value`s - defaults to "all"
 *   search   free text across code / customer name / city / state
 */
export const getProjectRecords = (req, res) => {
  const { filter = "all", search } = req.query;
  const term = typeof search === "string" ? search.trim().toLowerCase() : "";
  const now = new Date();

  const results = PROJECT_RECORDS.filter(
    (record) => matchesFilter(record, filter, now) && (!term || matchesSearch(record, term))
  );

  res.json({
    success: true,
    data: results,
    total: results.length,
    message: "Project records fetched successfully",
  });
};

/**
 * GET /project-pipeline/stages
 *
 * Pipeline stage config (id/title/color/avgDays) that the kanban columns
 * and list groups are built from, in display order.
 */
export const getProjectStages = (req, res) => {
  res.json({
    success: true,
    data: PROJECT_STAGES,
    total: PROJECT_STAGES.length,
    message: "Stages fetched successfully",
  });
};

/**
 * GET /project-pipeline/filters
 *
 * Returns each filter chip's label and how many records it currently
 * matches, computed over the full unfiltered dataset (independent of
 * whatever filter is currently selected on the client).
 */
export const getProjectFilters = (req, res) => {
  const now = new Date();

  const filters = FILTER_DEFINITIONS.map(({ value, label }) => ({
    value,
    label,
    count: PROJECT_RECORDS.filter((record) => matchesFilter(record, value, now)).length,
  }));

  res.json({
    success: true,
    data: filters,
    message: "Filters fetched successfully",
  });
};

/**
 * GET /project-pipeline/stats
 *
 * Headline stat cards. `value` is derived from live records where that's
 * meaningful; trend/delta/sparkline need history this in-memory store
 * doesn't keep, so they're illustrative placeholders until real analytics
 * are wired up.
 */
export const getProjectStats = (req, res) => {
  const activeRecords = PROJECT_RECORDS.filter((record) => !FINISHED_STAGE_IDS.has(record.stageId));
  const pipelineKw = activeRecords.reduce((sum, record) => sum + record.kw, 0);
  const onboardingCount = PROJECT_RECORDS.filter((record) => record.stageId === "onboarding").length;
  const closedCount = PROJECT_RECORDS.filter((record) => record.stageId === "closed").length;
  const conversionRate = PROJECT_RECORDS.length
    ? (closedCount / PROJECT_RECORDS.length) * 100
    : 0;

  const stats = [
    {
      label: "Pipeline value",
      value: `${pipelineKw} kW`,
      delta: "12.4% vs last month",
      trend: "up",
      sparkline: [4, 6, 5, 8, 7, 10, 9, 12],
    },
    {
      label: "Lead Conversion rate",
      value: `${conversionRate.toFixed(1)}%`,
      delta: "3.1% vs last month",
      trend: "up",
      sparkline: [3, 4, 3, 5, 6, 5, 7, 8],
    },
    {
      label: "Total System cost",
      value: "$1,200",
      delta: "$250 since last analysis",
      trend: "up",
      sparkline: [8, 7, 9, 8, 10, 11, 10, 12],
    },
    {
      label: "Onboarding",
      value: String(onboardingCount),
      delta: "20.5% vs last month",
      trend: "down",
      sparkline: [12, 11, 9, 10, 8, 7, 6, 5],
    },
  ];

  res.json({
    success: true,
    data: stats,
    message: "Stats fetched successfully",
  });
};

/**
 * GET /project-pipeline/records/:id
 *
 * A single project record - the detail page a kanban card or list row
 * routes to when clicked.
 */
export const getProjectRecordById = (req, res) => {
  const record = findRecord(req.params.id);

  if (!record) {
    return res.status(404).json({ success: false, data: null, message: "Project not found" });
  }

  res.json({
    success: true,
    data: record,
    message: "Project record fetched successfully",
  });
};

/**
 * PATCH /project-pipeline/records/:id/stage
 *
 * Persists a kanban drag-and-drop move to a different column.
 */
export const updateProjectStage = (req, res) => {
  const record = findRecord(req.params.id);

  if (!record) {
    return res.status(404).json({ success: false, data: null, message: "Project not found" });
  }

  const stageId = typeof req.body?.stageId === "string" ? req.body.stageId.trim() : "";

  if (!stageId) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "stageId is required",
      errors: { stageId: "stageId is required" },
    });
  }

  record.stageId = stageId;

  res.status(200).json({
    success: true,
    data: record,
    message: "Project stage updated successfully",
  });
};
