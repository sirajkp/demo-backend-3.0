// Notification centre preferences.
//
// These are *personal* preferences - they only govern notifications sent to the
// signed-in user - so the store is keyed by user rather than being a single
// org-wide row. There is no auth middleware in this app yet, so the caller is
// resolved from the bearer token when one is present and falls back to a demo
// key otherwise; swapping in a real `req.user.id` later is a one-line change.

import { currentUser } from "../Utils/currentUser.js";

const CHANNELS = [
  { id: "email", label: "Email" },
  { id: "in_app", label: "In-app" },
  { id: "push", label: "Push" },
];

const CHANNEL_IDS = CHANNELS.map((channel) => channel.id);

// The catalogue of events a user can be notified about, in display order, each
// with the defaults a brand-new user starts on. Adding an event here is all it
// takes for it to appear on the page - existing users pick up its defaults on
// their next read.
const EVENT_CATALOGUE = [
  {
    id: "record_assigned",
    label: "Record assigned to me",
    defaults: { email: true, in_app: true, push: true },
  },
  {
    id: "stage_changed",
    label: "Stage changed on my record",
    defaults: { email: true, in_app: true, push: false },
  },
  {
    id: "stage_gate_blocked",
    label: "Stage gate blocked",
    defaults: { email: true, in_app: true, push: true },
  },
  {
    id: "sla_breached",
    label: "SLA breached",
    defaults: { email: false, in_app: true, push: true },
  },
  {
    id: "mentioned_in_comment",
    label: "Mentioned in a comment",
    defaults: { email: true, in_app: false, push: true },
  },
  {
    id: "new_comment",
    label: "New comment",
    defaults: { email: true, in_app: true, push: true },
  },
  {
    id: "financing_status_change",
    label: "Financing status change",
    defaults: { email: true, in_app: true, push: true },
  },
  {
    id: "work_order_completed",
    label: "Work order completed",
    defaults: { email: true, in_app: true, push: true },
  },
];

const EVENTS_BY_ID = new Map(EVENT_CATALOGUE.map((event) => [event.id, event]));

/** Per-user overrides: userKey -> eventId -> { channel: boolean }. */
const preferencesByUser = new Map();

function overridesFor(userKey) {
  let overrides = preferencesByUser.get(userKey);
  if (!overrides) {
    overrides = {};
    preferencesByUser.set(userKey, overrides);
  }
  return overrides;
}

/**
 * Merges the catalogue defaults with whatever the user has changed. Defaults
 * are never copied into the store on read, so an event whose defaults are
 * retuned later still moves for users who never touched it.
 */
function resolveEvents(userKey) {
  const overrides = overridesFor(userKey);
  return EVENT_CATALOGUE.map((event) => ({
    id: event.id,
    label: event.label,
    channels: { ...event.defaults, ...(overrides[event.id] ?? {}) },
  }));
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
 * GET /notification-center/preferences
 *
 * Returns the channel columns alongside the rows so the table's columns are
 * driven by the API - the page renders whatever channels it is handed instead
 * of hardcoding three.
 */
export const getNotificationPreferences = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      channels: CHANNELS,
      events: resolveEvents(currentUser(req)),
    },
    message: "Notification preferences fetched successfully",
  });
};

/**
 * PATCH /notification-center/preferences/:eventId
 *
 * Body: { channel, enabled }. One toggle per request, which is exactly one
 * switch click - no read-modify-write of the whole table, so two toggles
 * flipped in quick succession can't clobber each other.
 */
export const updateNotificationPreference = (req, res) => {
  const { eventId } = req.params;
  const event = EVENTS_BY_ID.get(eventId);

  if (!event) {
    return notFound(res, "Notification event");
  }

  const { channel, enabled } = req.body ?? {};

  if (!CHANNEL_IDS.includes(channel)) {
    return badRequest(
      res,
      `channel must be one of: ${CHANNEL_IDS.join(", ")}`
    );
  }

  if (typeof enabled !== "boolean") {
    return badRequest(res, "enabled must be a boolean");
  }

  const overrides = overridesFor(currentUser(req));
  overrides[eventId] = { ...(overrides[eventId] ?? {}), [channel]: enabled };

  res.status(200).json({
    success: true,
    data: {
      id: event.id,
      label: event.label,
      channels: { ...event.defaults, ...overrides[eventId] },
    },
    message: "Notification preference updated successfully",
  });
};

/**
 * POST /notification-center/preferences/reset
 *
 * Drops the user's overrides so every row falls back to its catalogue default.
 * Returns the same shape as the GET so the page can swap its cache wholesale.
 */
export const resetNotificationPreferences = (req, res) => {
  const userKey = currentUser(req);
  preferencesByUser.set(userKey, {});

  res.status(200).json({
    success: true,
    data: {
      channels: CHANNELS,
      events: resolveEvents(userKey),
    },
    message: "Notification preferences reset successfully",
  });
};
