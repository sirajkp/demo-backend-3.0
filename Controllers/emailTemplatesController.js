// Email templates.
//
// A template is a subject and a body written against one object, with $Record
// wildcards standing in for that record's values. Composing an email from a
// record's Email action resolves the tokens against that record before it
// sends. Held in memory, so a restart returns the seed set below.

// Tokens are checked against the object manager's schema rather than a list
// kept here, so a property renamed there stops validating here on the next
// save instead of drifting quietly.
import {
  findObjectProperty,
  listObjectIds,
  objectExists,
  objectLabelOf,
  relationTargetOf,
} from "./objectManagerController.js";

const TOKEN_ROOT = "$Record";

// Every wildcard in a subject or body. The path is optional: "$Record" on its
// own stands for the record's name, which is what makes a bare relation hop -
// "$Record.contact__c" - meaningful too.
const TOKEN_PATTERN = /\$Record((?:\.[A-Za-z0-9_]+)*)/g;

let nextId = 1;
function makeId() {
  nextId += 1;
  return `email-template-${String(nextId).padStart(3, "0")}`;
}

const templates = [
  {
    id: makeId(),
    name: "Test Email",
    objectId: "projects",
    subject: "Checking in on $Record",
    body: "Hi $Record.contact__c,\n\nThis is a test message about $Record.\n\nThanks,\nThe team",
  },
  {
    id: makeId(),
    name: "User Registration",
    objectId: "contact",
    subject: "Welcome, $Record.name",
    body: "Hi $Record.name,\n\nYour account is ready.\n\nThanks,\nThe team",
  },
  {
    id: makeId(),
    name: "Password Reset",
    objectId: "contact",
    subject: "Reset your password",
    body: "Hi $Record.name,\n\nWe received a request to reset your password.\n\nThanks,\nThe team",
  },
  {
    id: makeId(),
    name: "Newsletter Signup",
    objectId: "leads",
    subject: "You're subscribed",
    body: "Hi $Record.name,\n\nThanks for subscribing.\n\nThe team",
  },
  {
    id: makeId(),
    name: "Account Deactivation",
    objectId: "contact",
    subject: "Your account has been deactivated",
    body: "Hi $Record.name,\n\nYour account is now closed.\n\nThe team",
  },
];

function ok(res, data, message) {
  return res.status(200).json({ success: true, data, message });
}

function badRequest(res, message) {
  return res.status(400).json({ success: false, data: null, message });
}

function notFound(res) {
  return res
    .status(404)
    .json({ success: false, data: null, message: "Email template not found" });
}

function findTemplate(id) {
  return templates.find((template) => template.id === id);
}

/**
 * The object's label is resolved on the way out rather than stored, so a rename
 * in the object manager shows up here without a migration.
 */
function toSummary(template) {
  return {
    id: template.id,
    name: template.name,
    objectId: template.objectId,
    objectLabel: objectLabelOf(template.objectId) ?? template.objectId,
  };
}

function toDetail(template) {
  return {
    ...toSummary(template),
    subject: template.subject,
    body: template.body,
  };
}

/**
 * Walks one token's path from `objectId`, hopping through relations. Every
 * segment but the last has to be a relation - that is the only kind of property
 * there is anything to read through. The last may be anything, including a
 * relation, which resolves to the related record's name.
 *
 * Returns an error message, or null when the path is sound.
 */
function validateTokenPath(objectId, segments, token) {
  let currentId = objectId;

  for (const [index, segment] of segments.entries()) {
    if (!findObjectProperty(currentId, segment)) {
      return `${token}: "${segment}" is not a property of ${currentId}`;
    }
    if (index === segments.length - 1) {
      break;
    }
    const target = relationTargetOf(currentId, segment);
    if (!target) {
      return `${token}: "${segment}" is not a relation, so nothing can be read through it`;
    }
    currentId = target;
  }

  return null;
}

/**
 * Every token in `text`, checked against the object the template is written
 * for. A token that no longer resolves would send as literal "$Record.foo" in
 * a real email, so it is refused at save time instead.
 */
function validateTokens(text, objectId, field) {
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const [token, trail] = match;
    if (!trail) {
      // Bare "$Record" - the record's own name, nothing to resolve.
      continue;
    }
    const problem = validateTokenPath(objectId, trail.slice(1).split("."), token);
    if (problem) {
      return `${field}: ${problem}`;
    }
  }
  return null;
}

function validateObjectId(objectId) {
  if (typeof objectId !== "string" || !objectId.trim()) {
    return "objectId is required";
  }
  if (!objectExists(objectId)) {
    return `Unknown object: ${objectId}. Known objects: ${listObjectIds().join(", ")}`;
  }
  return null;
}

/**
 * GET /email-templates
 *
 * The sidebar's rows - name and the object the template is written against. A
 * template's subject and body are fetched when one is opened.
 */
export const getEmailTemplates = (_req, res) => {
  ok(res, templates.map(toSummary), "Email templates fetched successfully");
};

/** GET /email-templates/:templateId - one template, with subject and body. */
export const getEmailTemplateById = (req, res) => {
  const template = findTemplate(req.params.templateId);
  if (!template) {
    return notFound(res);
  }
  ok(res, toDetail(template), "Email template fetched successfully");
};

/**
 * POST /email-templates
 *
 * Body: { name, objectId, subject?, body? }. The create drawer asks for the
 * object and the name only - the object has to be settled first, because it is
 * what the editor's $Record tokens are offered and validated against.
 */
export const createEmailTemplate = (req, res) => {
  const { name, objectId, subject, body } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return badRequest(res, "name is required");
  }

  const objectError = validateObjectId(objectId);
  if (objectError) {
    return badRequest(res, objectError);
  }

  const nextSubject = subject ?? "";
  const nextBody = body ?? "";
  if (typeof nextSubject !== "string" || typeof nextBody !== "string") {
    return badRequest(res, "subject and body must be strings");
  }

  const tokenError =
    validateTokens(nextSubject, objectId, "subject") ??
    validateTokens(nextBody, objectId, "body");
  if (tokenError) {
    return badRequest(res, tokenError);
  }

  const template = {
    id: makeId(),
    name: name.trim(),
    objectId,
    subject: nextSubject,
    body: nextBody,
  };
  templates.push(template);

  res.status(201).json({
    success: true,
    data: toDetail(template),
    message: "Email template created successfully",
  });
};

/**
 * PATCH /email-templates/:templateId
 *
 * Body: any of { name, subject, body, objectId }. Changing the object revalidates
 * the subject and body against it, since the tokens already in them were written
 * for the old one.
 */
export const updateEmailTemplate = (req, res) => {
  const template = findTemplate(req.params.templateId);
  if (!template) {
    return notFound(res);
  }

  const { name, subject, body, objectId } = req.body ?? {};

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return badRequest(res, "name must be a non-empty string");
  }
  if (subject !== undefined && typeof subject !== "string") {
    return badRequest(res, "subject must be a string");
  }
  if (body !== undefined && typeof body !== "string") {
    return badRequest(res, "body must be a string");
  }
  if (objectId !== undefined) {
    const objectError = validateObjectId(objectId);
    if (objectError) {
      return badRequest(res, objectError);
    }
  }

  // Tokens are judged against whatever the template will hold once this request
  // is applied, so switching the object and rewriting the body in one call is
  // checked as the pair it is.
  const nextObjectId = objectId ?? template.objectId;
  const nextSubject = subject ?? template.subject;
  const nextBody = body ?? template.body;

  const tokenError =
    validateTokens(nextSubject, nextObjectId, "subject") ??
    validateTokens(nextBody, nextObjectId, "body");
  if (tokenError) {
    return badRequest(res, tokenError);
  }

  // Validated as a set, so a rejected token can't leave a half-applied change.
  if (name !== undefined) {
    template.name = name.trim();
  }
  template.objectId = nextObjectId;
  template.subject = nextSubject;
  template.body = nextBody;

  ok(res, toDetail(template), "Email template updated successfully");
};

/** DELETE /email-templates/:templateId */
export const deleteEmailTemplate = (req, res) => {
  const index = templates.findIndex(
    (template) => template.id === req.params.templateId,
  );
  if (index === -1) {
    return notFound(res);
  }
  const [removed] = templates.splice(index, 1);
  ok(res, { id: removed.id }, "Email template deleted successfully");
};

/**
 * POST /email-templates/:templateId/preview
 *
 * Body: { record }. Resolves the template's tokens against one record and hands
 * back the subject and body that would send. The record is passed in rather than
 * looked up here because records live behind their own feature's controllers -
 * this only owns the substitution.
 *
 * A path that reaches nothing on the record resolves to an empty string: a
 * missing value is a blank in the email, not a failure to send.
 */
export const previewEmailTemplate = (req, res) => {
  const template = findTemplate(req.params.templateId);
  if (!template) {
    return notFound(res);
  }

  const { record } = req.body ?? {};
  if (!record || typeof record !== "object") {
    return badRequest(res, "record is required");
  }

  const resolve = (text) =>
    text.replace(TOKEN_PATTERN, (token, trail) => {
      const segments = trail ? trail.slice(1).split(".") : ["name"];
      let value = record;
      for (const segment of segments) {
        if (!value || typeof value !== "object") {
          return "";
        }
        value = value[segment];
      }
      // An unresolved relation lands on the related record itself; its name is
      // what "$Record.contact__c" is asking for.
      if (value && typeof value === "object") {
        value = value.name;
      }
      return value === undefined || value === null ? "" : String(value);
    });

  ok(
    res,
    {
      subject: resolve(template.subject),
      body: resolve(template.body),
    },
    "Email template preview generated successfully",
  );
};
