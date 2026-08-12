// Personal preferences: language, appearance, timezone, units, the view the app
// opens on, and the personal notification opt-ins.
//
// These belong to the user rather than to the org - no admin rights are needed
// to change them - so the store is keyed by user, the same way the notification
// centre's are. Held in memory, so a restart returns everyone to the defaults.

import { currentUser } from "../Utils/currentUser.js";

// The vocabularies the API will accept. Anything outside them is a 400 rather
// than a silently stored value the frontend would have to defend against.
const LANGUAGES = ["en", "es"];
const THEMES = ["system", "light", "dark"];
const UNITS = ["imperial", "metric"];

// IANA zone ids, kept in step with the options the settings page offers.
const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Madrid",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];

// Routes a user is allowed to land on. Validated here as well as in the client
// so a stale or hand-crafted value can't strand an account on a redirect to a
// page that no longer exists.
const LANDING_PATHS = [
  "/dashboard",
  "/leads",
  "/projects",
  "/contacts",
  "/my-task",
  "/inbox",
];

const DEFAULT_PREFERENCES = {
  language: "en",
  theme: "system",
  timezone: "America/New_York",
  units: "imperial",
  landingPath: "/dashboard",
  emailNotifications: true,
  inAppNotifications: true,
  dailyDigestEmail: true,
};

// A field is only listed once here, so adding a preference means adding one
// entry rather than touching the validator, the merge and the response shape.
const FIELDS = {
  language: (value) => LANGUAGES.includes(value),
  theme: (value) => THEMES.includes(value),
  timezone: (value) => TIMEZONES.includes(value),
  units: (value) => UNITS.includes(value),
  landingPath: (value) => LANDING_PATHS.includes(value),
  emailNotifications: (value) => typeof value === "boolean",
  inAppNotifications: (value) => typeof value === "boolean",
  dailyDigestEmail: (value) => typeof value === "boolean",
};

const ALLOWED_VALUES = {
  language: LANGUAGES,
  theme: THEMES,
  timezone: TIMEZONES,
  units: UNITS,
  landingPath: LANDING_PATHS,
};

/** Per-user overrides: userKey -> partial preferences. */
const preferencesByUser = new Map();

/**
 * Merges the defaults with whatever the user has changed. Defaults are never
 * copied into the store on write, so a default retuned later still moves for
 * users who never touched that field.
 */
function resolvePreferences(userKey) {
  return { ...DEFAULT_PREFERENCES, ...(preferencesByUser.get(userKey) ?? {}) };
}

function badRequest(res, message) {
  return res.status(400).json({ success: false, data: null, message });
}

/**
 * GET /user-preferences
 *
 * Always a complete object - a user who has never opened the settings page
 * gets the defaults rather than an empty body or a 404.
 */
export const getUserPreferences = (req, res) => {
  res.status(200).json({
    success: true,
    data: resolvePreferences(currentUser(req)),
    message: "User preferences fetched successfully",
  });
};

/**
 * PATCH /user-preferences
 *
 * Body: any subset of the preference fields. The page saves one control at a
 * time, so a partial body is the normal case - the fields left out keep their
 * current value rather than falling back to the default.
 *
 * Returns the full row so the caller can replace its copy outright instead of
 * merging the response by hand.
 */
export const updateUserPreferences = (req, res) => {
  const body = req.body ?? {};
  const keys = Object.keys(body);

  if (keys.length === 0) {
    return badRequest(res, "Provide at least one preference to update");
  }

  const unknown = keys.filter((key) => !(key in FIELDS));
  if (unknown.length > 0) {
    return badRequest(res, `Unknown preference: ${unknown.join(", ")}`);
  }

  for (const key of keys) {
    if (!FIELDS[key](body[key])) {
      return badRequest(
        res,
        ALLOWED_VALUES[key]
          ? `${key} must be one of: ${ALLOWED_VALUES[key].join(", ")}`
          : `${key} must be a boolean`
      );
    }
  }

  const userKey = currentUser(req);
  // Validated keys only - `body` is not spread wholesale, so an extra field
  // slipped into the request can't reach the store.
  const stored = { ...(preferencesByUser.get(userKey) ?? {}) };
  for (const key of keys) {
    stored[key] = body[key];
  }
  preferencesByUser.set(userKey, stored);

  res.status(200).json({
    success: true,
    data: resolvePreferences(userKey),
    message: "User preferences updated successfully",
  });
};

/**
 * POST /user-preferences/reset
 *
 * Drops the user's overrides so every field falls back to its default. Returns
 * the same shape as the GET so the caller can swap its cache wholesale.
 */
export const resetUserPreferences = (req, res) => {
  const userKey = currentUser(req);
  preferencesByUser.delete(userKey);

  res.status(200).json({
    success: true,
    data: resolvePreferences(userKey),
    message: "User preferences reset successfully",
  });
};
