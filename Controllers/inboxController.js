import { paginate } from "../Utils/pagination.js";

// Stand-in for the signed-in user until the routes read the bearer token.
// Mentions are matched against this handle.
const CURRENT_USER = { id: "u-01", name: "David Cole", handle: "@david" };

/**
 * Timestamps are stored as offsets rather than fixed dates, and resolved per
 * request. A mock with hardcoded ISO dates looks right on the day it is written
 * and reads as a stale inbox every day after, which makes the relative stamps
 * on the client ("9m ago") impossible to eyeball.
 *
 * `minutesAgo` for things that should always look recent; `daysAgo` + a wall
 * clock time for anything that needs to land in an earlier day group.
 */
function resolveCreatedAt(when, now) {
  if (when.minutesAgo != null) {
    return new Date(now.getTime() - when.minutesAgo * 60_000).toISOString();
  }
  const date = new Date(now);
  date.setDate(date.getDate() - (when.daysAgo ?? 0));
  date.setHours(when.hour ?? 9, when.minute ?? 0, 0, 0);
  return date.toISOString();
}

// `read` is mutated in place by the two mutations below, so it is the only
// field that survives between requests. Everything else is static seed data.
const inboxItems = [
  {
    id: "N1001",
    kind: "document",
    title: "Change Order #2 approved — Hernandez Home",
    description: "Automatically filed to Files · triggered \"Proceed to Installation\"",
    read: false,
    when: { minutesAgo: 9 },
    link: "/projects",
  },
  {
    id: "N1002",
    kind: "automation",
    title: "Synergy Demo advanced to Install Scheduled",
    description: "Automation \"Auto-advance on signature\" · the stage moved itself",
    read: false,
    when: { minutesAgo: 9 },
    link: "/projects",
  },
  {
    id: "N1003",
    kind: "alert",
    title: "Permit SLA breached — Stacey Property",
    description: "Automatically filed to Files · triggered \"Proceed to Installation\"",
    read: false,
    when: { minutesAgo: 9 },
    link: "/projects",
  },
  {
    id: "N1004",
    kind: "document",
    title: "Change Order #2 approved — Hernandez Home",
    description: "31 days in stage vs 14-day SLA",
    read: false,
    when: { minutesAgo: 9 },
    link: "/projects",
  },
  {
    id: "N1005",
    kind: "mention",
    title: "Jordan S. mentioned you — Kirchner Residence",
    description: "Automatically filed to Files · triggered \"Proceed to Installation\"",
    body: "@david can you confirm the inverter serial before Thursday? Permit packet goes out Friday morning.",
    mention: CURRENT_USER.handle,
    read: false,
    when: { daysAgo: 1, hour: 16, minute: 12 },
    link: "/projects",
  },
  {
    id: "N1006",
    kind: "comment",
    title: "Change Order #2 approved — Hernandez Home",
    description: "31 days in stage vs 14-day SLA",
    read: true,
    when: { daysAgo: 1, hour: 9, minute: 40 },
    link: "/projects",
  },
  {
    id: "N1007",
    kind: "automation",
    title: "Ortega Residence moved to Permitting",
    description: "Automation \"Advance on design approval\" · the stage moved itself",
    read: false,
    when: { daysAgo: 1, hour: 8, minute: 5 },
    link: "/projects",
  },
  {
    id: "N1008",
    kind: "document",
    title: "Signed proposal received — Whitfield Barn",
    description: "Automatically filed to Files · triggered \"Proceed to Design\"",
    read: true,
    when: { daysAgo: 2, hour: 18, minute: 26 },
    link: "/projects",
  },
  {
    id: "N1009",
    kind: "alert",
    title: "Interconnection application rejected — Alvarez Home",
    description: "Utility returned the packet · missing single-line diagram",
    read: false,
    when: { daysAgo: 2, hour: 15, minute: 3 },
    link: "/projects",
  },
  {
    id: "N1010",
    kind: "mention",
    title: "Nina V. mentioned you — Ortega Residence",
    description: "Comment on the design review thread",
    body: "@david the shade report came back worse than modelled — can we drop the west array to 8 panels?",
    mention: CURRENT_USER.handle,
    read: false,
    when: { daysAgo: 2, hour: 13, minute: 47 },
    link: "/projects",
  },
  {
    id: "N1011",
    kind: "comment",
    title: "Sara L. replied on Whitfield Barn",
    description: "Thread: structural letter",
    body: "Engineer says the purlins are fine as-is. No retrofit needed.",
    read: true,
    when: { daysAgo: 2, hour: 11, minute: 20 },
    link: "/projects",
  },
  {
    id: "N1012",
    kind: "document",
    title: "Utility bill parsed — Castellanos Property",
    description: "12 months of usage extracted · 14,220 kWh/yr",
    read: true,
    when: { daysAgo: 2, hour: 9, minute: 12 },
    link: "/projects",
  },
  {
    id: "N1013",
    kind: "automation",
    title: "Site survey scheduled — Delgado Home",
    description: "Automation \"Book survey on contract signed\" · 14 Aug, 10:00am",
    read: false,
    when: { daysAgo: 3, hour: 17, minute: 41 },
    link: "/calendar",
  },
  {
    id: "N1014",
    kind: "alert",
    title: "Design SLA at risk — Kirchner Residence",
    description: "11 days in stage vs 14-day SLA",
    read: true,
    when: { daysAgo: 3, hour: 14, minute: 8 },
    link: "/projects",
  },
  {
    id: "N1015",
    kind: "document",
    title: "Permit approved — Stacey Property",
    description: "Automatically filed to Files · triggered \"Proceed to Installation\"",
    read: true,
    when: { daysAgo: 3, hour: 12, minute: 55 },
    link: "/projects",
  },
  {
    id: "N1016",
    kind: "comment",
    title: "Mike C. replied on Alvarez Home",
    description: "Thread: interconnection packet",
    body: "Resubmitting Monday with the corrected SLD. Utility said 5–7 business days.",
    read: true,
    when: { daysAgo: 3, hour: 10, minute: 30 },
    link: "/projects",
  },
  {
    id: "N1017",
    kind: "mention",
    title: "Priya N. mentioned you — Delgado Home",
    description: "Comment on the finance thread",
    body: "@david lender wants proof of homeowners insurance before funding. Can you chase it?",
    mention: CURRENT_USER.handle,
    read: true,
    when: { daysAgo: 4, hour: 16, minute: 44 },
    link: "/projects",
  },
  {
    id: "N1018",
    kind: "automation",
    title: "Hernandez Home advanced to Inspection",
    description: "Automation \"Advance on install complete\" · the stage moved itself",
    read: true,
    when: { daysAgo: 4, hour: 15, minute: 9 },
    link: "/projects",
  },
  {
    id: "N1019",
    kind: "document",
    title: "Change Order #1 approved — Whitfield Barn",
    description: "Automatically filed to Files · +4 panels, +$3,180",
    read: true,
    when: { daysAgo: 4, hour: 11, minute: 2 },
    link: "/projects",
  },
  {
    id: "N1020",
    kind: "alert",
    title: "Inspection failed — Ruiz Residence",
    description: "AHJ flagged conduit spacing · reinspection required",
    read: true,
    when: { daysAgo: 4, hour: 9, minute: 25 },
    link: "/projects",
  },
  {
    id: "N1021",
    kind: "document",
    title: "PTO granted — Marsh Household",
    description: "Automatically filed to Files · system may be energised",
    read: true,
    when: { daysAgo: 5, hour: 16, minute: 30 },
    link: "/projects",
  },
  {
    id: "N1022",
    kind: "automation",
    title: "Welcome packet sent — Marsh Household",
    description: "Automation \"Send packet on PTO\" · email delivered",
    read: true,
    when: { daysAgo: 5, hour: 16, minute: 31 },
    link: "/projects",
  },
  {
    id: "N1023",
    kind: "comment",
    title: "Emma S. replied on Ruiz Residence",
    description: "Thread: reinspection",
    body: "Crew can be back out Thursday. AHJ slot booked for Friday 8am.",
    read: true,
    when: { daysAgo: 5, hour: 13, minute: 15 },
    link: "/projects",
  },
  {
    id: "N1024",
    kind: "alert",
    title: "Proposal expired — Nakamura Home",
    description: "No response in 30 days · lead moved to Dormant",
    read: true,
    when: { daysAgo: 6, hour: 18, minute: 0 },
    link: "/leads",
  },
  {
    id: "N1025",
    kind: "mention",
    title: "Alex R. mentioned you — Castellanos Property",
    description: "Comment on the site survey thread",
    body: "@david roof is 1970s shake, not comp. Survey photos are in Files — worth a re-quote.",
    mention: CURRENT_USER.handle,
    read: true,
    when: { daysAgo: 6, hour: 14, minute: 22 },
    link: "/projects",
  },
  {
    id: "N1026",
    kind: "document",
    title: "Structural letter uploaded — Whitfield Barn",
    description: "Automatically filed to Files · stamped PE letter",
    read: true,
    when: { daysAgo: 6, hour: 10, minute: 48 },
    link: "/projects",
  },
  {
    id: "N1027",
    kind: "automation",
    title: "Follow-up task created — Nakamura Home",
    description: "Automation \"Nudge dormant leads\" · assigned to you",
    read: true,
    when: { daysAgo: 7, hour: 15, minute: 36 },
    link: "/my-task",
  },
  {
    id: "N1028",
    kind: "alert",
    title: "Permit SLA breached — Delgado Home",
    description: "22 days in stage vs 14-day SLA",
    read: true,
    when: { daysAgo: 7, hour: 12, minute: 4 },
    link: "/projects",
  },
  {
    id: "N1029",
    kind: "comment",
    title: "Jordan S. replied on Kirchner Residence",
    description: "Thread: inverter selection",
    body: "Going with the IQ8+ after all — stock confirmed for the 22nd.",
    read: true,
    when: { daysAgo: 7, hour: 9, minute: 58 },
    link: "/projects",
  },
  {
    id: "N1030",
    kind: "document",
    title: "Contract countersigned — Delgado Home",
    description: "Automatically filed to Files · triggered \"Proceed to Design\"",
    read: true,
    when: { daysAgo: 9, hour: 17, minute: 13 },
    link: "/projects",
  },
  {
    id: "N1031",
    kind: "automation",
    title: "Ruiz Residence advanced to Install Scheduled",
    description: "Automation \"Advance on permit approval\" · the stage moved itself",
    read: true,
    when: { daysAgo: 9, hour: 11, minute: 27 },
    link: "/projects",
  },
  {
    id: "N1032",
    kind: "alert",
    title: "Card on file declined — Nakamura Home",
    description: "Deposit could not be captured · payment method needs updating",
    read: true,
    when: { daysAgo: 9, hour: 8, minute: 46 },
    link: "/projects",
  },
];

const SEARCHABLE_FIELDS = ["title", "description", "body"];

function matchesSearch(item, term) {
  return SEARCHABLE_FIELDS.some((field) =>
    String(item[field] ?? "")
      .toLowerCase()
      .includes(term)
  );
}

// Case-insensitive so "?kind=alert" and "?kind=Alert" behave the same.
function matchesValue(actual, expected) {
  return String(actual ?? "").toLowerCase() === String(expected).toLowerCase();
}

// Query strings carry no booleans, so "true"/"1" both have to count.
function isTrue(value) {
  return value === true || value === "true" || value === "1";
}

/** Strips the internal `when` offset and resolves it to a real timestamp. */
function toResponseItem(item, now) {
  const { when, ...rest } = item;
  return { ...rest, createdAt: resolveCreatedAt(when, now) };
}

function countUnread() {
  return inboxItems.filter((item) => !item.read).length;
}

/**
 * GET /inbox
 *
 * Query params:
 *   unreadOnly    "true" narrows to unread items
 *   kind          document | automation | alert | mention | comment
 *   search        free text across title, description and body
 *   page          1-based, default 1
 *   pageSize      default 50, capped at 200 so one call can't pull the table
 *
 * `unreadCount` is for the whole inbox, not the page - the client's header
 * counter and "Mark all read" both read it, and neither is page-scoped.
 */
export const getInbox = (req, res) => {
  const { unreadOnly, kind, search } = req.query;

  const term = typeof search === "string" ? search.trim().toLowerCase() : "";
  const now = new Date();

  const results = inboxItems
    .filter((item) => {
      if (term && !matchesSearch(item, term)) return false;
      if (isTrue(unreadOnly) && item.read) return false;
      if (kind && !matchesValue(item.kind, kind)) return false;
      return true;
    })
    .map((item) => toResponseItem(item, now))
    // Newest first: the client groups by day and expects each group already
    // ordered, rather than sorting a second time.
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  res.json({
    success: true,
    ...paginate(results, req.query),
    unreadCount: countUnread(),
    message: "Inbox fetched successfully",
  });
};

/**
 * PATCH /inbox/:id/read
 *
 * Idempotent - marking an already-read item is a success, not a conflict, so a
 * double click or a retry can't produce an error the user has to think about.
 */
export const markInboxItemRead = (req, res) => {
  const { id: itemId } = req.params;

  const item = inboxItems.find((entry) => matchesValue(entry.id, itemId));

  if (!item) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Inbox item not found",
    });
  }

  item.read = true;

  res.status(200).json({
    success: true,
    data: null,
    unreadCount: countUnread(),
    message: "Inbox item marked as read",
  });
};

/** POST /inbox/read-all */
export const markAllInboxRead = (_req, res) => {
  inboxItems.forEach((item) => {
    item.read = true;
  });

  res.status(200).json({
    success: true,
    data: null,
    unreadCount: 0,
    message: "All inbox items marked as read",
  });
};
