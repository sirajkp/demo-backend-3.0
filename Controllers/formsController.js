// Operational forms.
//
// A form is a name, a schema of ordered elements, and the objects whose record
// pages it attaches to as a tab. Drafts are editable; publishing is what makes
// one live. Held in memory, so a restart returns the seed set below.

// The objects a form can attach to are the object manager's - standard ones and
// anything created there - so a new custom object is attachable the moment it
// exists, and this file keeps no list of its own to fall out of step.
import {
  findObjectProperty,
  listObjectIds,
  objectExists,
  relationTargetOf,
} from "./objectManagerController.js";

const FIELD_TYPES = [
  "text",
  "long_text",
  "number",
  "select",
  "checkbox",
  "date",
];

const STATUSES = ["draft", "published"];

let nextId = 1;
function makeId() {
  nextId += 1;
  return `form-${String(nextId).padStart(3, "0")}`;
}

const forms = [
  {
    id: makeId(),
    name: "Automation Form",
    description: "Fires the onboarding automation when a project is created.",
    status: "draft",
    schema: { elements: [] },
    attachObjectKeys: ["projects"],
  },
  {
    id: makeId(),
    name: "Contact Form",
    description: "Captures homeowner details from the public site.",
    status: "draft",
    schema: { elements: [] },
    attachObjectKeys: ["contact"],
  },
  {
    id: makeId(),
    name: "Stage gate blocked",
    description: "Filled in by the crew when a stage gate cannot be cleared.",
    status: "published",
    schema: {
      elements: [
        { kind: "heading", text: "Stage gate" },
        {
          kind: "field",
          key: "reason",
          label: "Reason",
          type: "long_text",
          required: true,
        },
      ],
    },
    attachObjectKeys: ["projects"],
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
    .json({ success: false, data: null, message: "Form not found" });
}

function findForm(id) {
  return forms.find((form) => form.id === id);
}

/** The list only carries what the rows show, not every element of every form. */
function toSummary(form) {
  return {
    id: form.id,
    name: form.name,
    description: form.description ?? "",
    status: form.status,
    elementCount: form.schema.elements.length,
    attachObjectKeys: form.attachObjectKeys,
  };
}

/**
 * Rejects anything the builder could not have produced, so a stored schema is
 * always safe to render. Returns an error message, or null when the schema is
 * sound.
 *
 * `attachKeys` is the set the form will end up attached to - a mapped element
 * is only meaningful against one of those, so the two are validated together
 * rather than each being checked in isolation.
 */
function validateSchema(schema, attachKeys) {
  if (!schema || typeof schema !== "object" || !Array.isArray(schema.elements)) {
    return "schema must be an object with an elements array";
  }

  const keys = new Set();

  for (const [index, element] of schema.elements.entries()) {
    const at = `elements[${index}]`;

    if (!element || typeof element !== "object") {
      return `${at} must be an object`;
    }

    switch (element.kind) {
      case "heading":
        if (typeof element.text !== "string") {
          return `${at}.text must be a string`;
        }
        break;

      case "divider":
        break;

      case "field": {
        if (typeof element.key !== "string" || !element.key.trim()) {
          return `${at}.key is required`;
        }
        // Keys become the payload's property names, so a duplicate would make
        // one answer overwrite another.
        if (keys.has(element.key)) {
          return `${at}.key "${element.key}" is used more than once`;
        }
        keys.add(element.key);

        if (typeof element.label !== "string" || !element.label.trim()) {
          return `${at}.label is required`;
        }
        if (!FIELD_TYPES.includes(element.type)) {
          return `${at}.type must be one of: ${FIELD_TYPES.join(", ")}`;
        }
        if (element.type === "select") {
          if (!Array.isArray(element.options) || element.options.length === 0) {
            return `${at}.options is required for a select`;
          }
          const bad = element.options.some(
            (option) =>
              !option ||
              typeof option.value !== "string" ||
              typeof option.label !== "string",
          );
          if (bad) {
            return `${at}.options must each have a string value and label`;
          }
        }
        if (
          element.required !== undefined &&
          typeof element.required !== "boolean"
        ) {
          return `${at}.required must be a boolean`;
        }
        break;
      }

      case "mapping": {
        if (typeof element.label !== "string" || !element.label.trim()) {
          return `${at}.label is required`;
        }
        // A mapped value is read off the record the form is sitting on, so it
        // can only reach an object the form is actually attached to.
        if (!attachKeys.includes(element.source)) {
          return attachKeys.length === 0
            ? `${at}.source: this form is not attached to any object, so it has nothing to map from`
            : `${at}.source must be one of the attached objects: ${attachKeys.join(", ")}`;
        }
        if (typeof element.property !== "string" || !element.property.trim()) {
          return `${at}.property is required`;
        }
        if (!findObjectProperty(element.source, element.property)) {
          return `${at}.property "${element.property}" does not exist on ${element.source}`;
        }

        // One hop through a relation: "the lead's email", where `property` is
        // the lookup and `relatedProperty` is a field on what it points at.
        if (element.relatedProperty !== undefined) {
          const target = relationTargetOf(element.source, element.property);
          if (!target) {
            return `${at}.relatedProperty is only valid when property is a relation`;
          }
          if (
            typeof element.relatedProperty !== "string" ||
            !element.relatedProperty.trim()
          ) {
            return `${at}.relatedProperty must be a non-empty string`;
          }
          if (!findObjectProperty(target, element.relatedProperty)) {
            return `${at}.relatedProperty "${element.relatedProperty}" does not exist on ${target}`;
          }
        }
        break;
      }

      default:
        return `${at}.kind must be one of: heading, divider, field, mapping`;
    }
  }

  return null;
}

function validateAttachKeys(keys) {
  if (!Array.isArray(keys)) {
    return "attachObjectKeys must be an array";
  }
  const unknown = keys.filter((key) => !objectExists(key));
  if (unknown.length > 0) {
    return `Unknown object: ${unknown.join(", ")}. Known objects: ${listObjectIds().join(", ")}`;
  }
  return null;
}

/**
 * GET /forms
 *
 * The list page's rows. Summaries only - a form's elements are fetched when one
 * is opened.
 */
export const getForms = (_req, res) => {
  ok(res, forms.map(toSummary), "Forms fetched successfully");
};

/** GET /forms/:formId - one form, with its full schema. */
export const getFormById = (req, res) => {
  const form = findForm(req.params.formId);
  if (!form) {
    return notFound(res);
  }
  ok(res, form, "Form fetched successfully");
};

/**
 * POST /forms
 *
 * Body: { name, description?, schema?, attachObjectKeys? }. The drawer asks
 * for a name and an optional description; the other two default to empty and
 * are filled in by the builder.
 */
export const createForm = (req, res) => {
  const { name, description, schema, attachObjectKeys } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return badRequest(res, "name is required");
  }

  // Optional, but it has to be text if it is sent at all.
  if (description !== undefined && typeof description !== "string") {
    return badRequest(res, "description must be a string");
  }

  // Attachments first: the schema is judged against them.
  const keys = attachObjectKeys ?? [];
  const keysError = validateAttachKeys(keys);
  if (keysError) {
    return badRequest(res, keysError);
  }

  const nextSchema = schema ?? { elements: [] };
  const schemaError = validateSchema(nextSchema, keys);
  if (schemaError) {
    return badRequest(res, schemaError);
  }

  const form = {
    id: makeId(),
    name: name.trim(),
    // Stored as "" rather than left off, so every form has the field and
    // readers never have to tell "absent" from "empty".
    description: (description ?? "").trim(),
    status: "draft",
    schema: nextSchema,
    attachObjectKeys: keys,
  };
  forms.push(form);

  res
    .status(201)
    .json({ success: true, data: form, message: "Form created successfully" });
};

/**
 * PATCH /forms/:formId
 *
 * Body: any of { name, description, schema, attachObjectKeys, status }. The builder saves
 * the whole schema at once - it is one document, and a partial element update
 * would need an addressing scheme the page has no use for.
 */
export const updateForm = (req, res) => {
  const form = findForm(req.params.formId);
  if (!form) {
    return notFound(res);
  }

  const { name, description, schema, attachObjectKeys, status } = req.body ?? {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return badRequest(res, "name must be a non-empty string");
    }
    form.name = name.trim();
  }

  // Unlike the name, this one may be cleared back to empty.
  if (description !== undefined) {
    if (typeof description !== "string") {
      return badRequest(res, "description must be a string");
    }
    form.description = description.trim();
  }

  // The builder sends both together, but either can arrive alone - so the
  // schema is judged against whichever attachments the form will have once
  // this request is applied, not against the ones it had before.
  if (attachObjectKeys !== undefined) {
    const keysError = validateAttachKeys(attachObjectKeys);
    if (keysError) {
      return badRequest(res, keysError);
    }
  }
  const nextKeys = attachObjectKeys ?? form.attachObjectKeys;

  if (schema !== undefined) {
    const schemaError = validateSchema(schema, nextKeys);
    if (schemaError) {
      return badRequest(res, schemaError);
    }
  }

  // Both validated - now they land together, so a rejected schema can't leave
  // the attachments changed behind it.
  if (attachObjectKeys !== undefined) {
    form.attachObjectKeys = attachObjectKeys;
  }
  if (schema !== undefined) {
    form.schema = schema;
  }

  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      return badRequest(res, `status must be one of: ${STATUSES.join(", ")}`);
    }
    form.status = status;
  }

  ok(res, form, "Form updated successfully");
};

/**
 * POST /forms/:formId/publish
 *
 * Separate from the PATCH above because going live is a decision, not an edit -
 * and it is the one change that refuses an empty form.
 */
export const publishForm = (req, res) => {
  const form = findForm(req.params.formId);
  if (!form) {
    return notFound(res);
  }
  if (form.schema.elements.length === 0) {
    return badRequest(res, "A form needs at least one element to be published");
  }
  form.status = "published";
  ok(res, form, "Form published successfully");
};

/**
 * POST /forms/:formId/unpublish
 *
 * The other half of publish: takes a live form back to draft so it drops off
 * the record pages it is attached to and stops collecting answers. Nothing
 * about the form itself changes, so it can go live again unedited.
 *
 * Idempotent, like publish - a form that is already a draft is the state the
 * caller asked for, not an error.
 */
export const unpublishForm = (req, res) => {
  const form = findForm(req.params.formId);
  if (!form) {
    return notFound(res);
  }
  form.status = "draft";
  ok(res, form, "Form unpublished successfully");
};

/** DELETE /forms/:formId */
export const deleteForm = (req, res) => {
  const index = forms.findIndex((form) => form.id === req.params.formId);
  if (index === -1) {
    return notFound(res);
  }
  const [removed] = forms.splice(index, 1);
  ok(res, { id: removed.id }, "Form deleted successfully");
};
