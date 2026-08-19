// Object Manager: CRM objects (standard + custom), their properties,
// associations and record layouts. In-memory store, no DB/auth wired yet -
// same stand-in pattern as the other controllers in this codebase.

const asTrimmedString = (value) =>
  typeof value === "string" ? value.trim() : "";

const slugify = (value) =>
  asTrimmedString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

const toSnakeCase = (value) =>
  asTrimmedString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_+|_+$)/g, "");

// Every layout gets these three tabs. They're fixed (not deletable) and not
// section-editable here - their content (activity feed, related records,
// change history) is built into the record view itself, not laid out by the
// user. A factory rather than a shared constant so each layout gets its own
// array/objects instead of aliasing one mutable structure across all of them.
const systemTabs = () => [
  { id: "activity", name: "Activity", isSystem: true, sections: [] },
  { id: "related", name: "Related", isSystem: true, sections: [] },
  { id: "history", name: "History", isSystem: true, sections: [] },
];

const defaultLayouts = (idPrefix) => [
  {
    id: `${idPrefix}-layout-default`,
    name: "Default",
    // Empty, not "All roles" - this layout's job is purely to be the
    // fallback when no other layout's assignedRoles match the viewer, so it
    // doesn't need a role of its own.
    assignedRoles: [],
    isDefault: true,
    status: "published",
    version: 1,
    tabs: systemTabs(),
    history: [],
  },
];

const defaultProperties = (idPrefix) => [
  {
    id: `${idPrefix}-id`,
    label: "Record ID",
    fieldKey: "id",
    color: "#CAC4CE",
    badge: "primary",
    fieldType: "Text",
  },
  {
    id: `${idPrefix}-name`,
    label: "Name",
    fieldKey: "name",
    color: "#CAC4CE",
    badge: "required",
    fieldType: "Text",
  },
  {
    id: `${idPrefix}-status`,
    label: "Status",
    fieldKey: "status",
    color: "#EDDFEF",
    fieldType: "Status",
  },
];

/**
 * A lookup from one object to another. Anything that walks relations - a
 * form's mapped field reaching through to the related record, for instance -
 * reads `relationConfig.targetObjectId` off a property of type "Relation".
 */
const relationProperty = (
  idPrefix,
  { label, fieldKey, target, targetLabel },
) => ({
  id: `${idPrefix}-${fieldKey}`,
  label,
  fieldKey,
  color: "#D6E4FF",
  fieldType: "Relation",
  relationConfig: {
    targetObjectId: target,
    targetObjectLabel: targetLabel,
    cardinality: "Many-To-One",
  },
});

// Seeded to mirror the objects the frontend already renders from
// src/features/settings/data/objectManagerData.tsx, so the API and the
// current mock UI agree while the frontend is wired over to real calls.
const objectListData = [
  {
    id: "contact",
    name: "Contact",
    recordCount: 3947,
    color: "#9B51E0",
    isCustom: false,
    iconId: "profile",
    iconColor: "#9B51E0",
    iconBg: "#F1E8FB",
    description: "Homeowners and decision-makers tied to leads and projects.",
    properties: defaultProperties("contact"),
    associations: [],
    layouts: defaultLayouts("contact"),
  },
  {
    id: "leads",
    name: "Leads",
    recordCount: 5103,
    color: "#EB5757",
    isCustom: false,
    iconId: "leads",
    iconColor: "#EB5757",
    iconBg: "#FDEAEA",
    description: "Inbound and sourced leads prior to project qualification.",
    properties: [
      ...defaultProperties("leads"),
      relationProperty("leads", {
        label: "Contact",
        fieldKey: "contact__c",
        target: "contact",
        targetLabel: "Contact",
      }),
    ],
    associations: [],
    layouts: defaultLayouts("leads"),
  },
  {
    id: "projects",
    name: "Projects",
    recordCount: 4589,
    color: "#8A8F1C",
    isCustom: false,
    iconId: "folder",
    iconColor: "#8A8F1C",
    iconBg: "#F3F4DC",
    description: "A qualified deal moving through install stages.",
    properties: [
      ...defaultProperties("projects"),
      relationProperty("projects", {
        label: "Lead",
        fieldKey: "lead__c",
        target: "leads",
        targetLabel: "Leads",
      }),
      relationProperty("projects", {
        label: "Primary contact",
        fieldKey: "contact__c",
        target: "contact",
        targetLabel: "Contact",
      }),
    ],
    associations: [],
    layouts: defaultLayouts("projects"),
  },
  {
    id: "financing-application",
    name: "Financing Application",
    recordCount: 3812,
    color: "#EB5757",
    isCustom: false,
    iconId: "task",
    iconColor: "#1C876C",
    iconBg: "#E3F5EA",
    description:
      "A lender application. One project can carry several - apply to multiple lenders, fund one.",
    properties: [
      {
        id: "task-id",
        label: "Task ID",
        fieldKey: "application_id",
        color: "#CAC4CE",
        badge: "primary",
        fieldType: "Text",
      },
      {
        id: "name",
        label: "Name",
        fieldKey: "user_id",
        color: "#72A276",
        badge: "required",
        fieldType: "Number",
      },
      {
        id: "timestamp",
        label: "Timestamp",
        fieldKey: "timestamp",
        color: "#B6BE9C",
        fieldType: "Select",
      },
      {
        id: "status",
        label: "Status",
        fieldKey: "status",
        color: "#EDDFEF",
        fieldType: "Status",
      },
      {
        id: "priority-level",
        label: "Priority Level",
        fieldKey: "priority_level",
        color: "#72A276",
        badge: "required",
        fieldType: "Number",
      },
    ],
    associations: [
      {
        id: "my-task-assoc-contact-1",
        targetObjectId: "contact",
        targetObjectLabel: "Contact",
        inverseLabel: "Inverse homeowner",
        cardinality: "Many-To-One",
      },
      {
        id: "my-task-assoc-financing-application",
        targetObjectId: "financing-application",
        targetObjectLabel: "Financing Application",
        inverseLabel: "Inverse project",
        cardinality: "Many-To-One",
      },
      {
        id: "my-task-assoc-contact-2",
        targetObjectId: "contact",
        targetObjectLabel: "Contact",
        inverseLabel: "Inverse homeowner",
        cardinality: "Many-To-One",
      },
    ],
    layouts: [
      {
        id: "financing-application-layout-admin",
        name: "Admin default",
        assignedRoles: ["Admin"],
        isDefault: true,
        status: "published",
        version: 3,
        history: [
          { version: 3, publishedAt: "2026-06-02T14:05:00.000Z" },
          { version: 2, publishedAt: "2026-04-11T09:30:00.000Z" },
          { version: 1, publishedAt: "2026-02-20T11:00:00.000Z" },
        ],
        tabs: [
          ...systemTabs(),
          {
            id: "financing-application-layout-admin-tab-details",
            name: "Details",
            isSystem: false,
            sections: [
              {
                id: "financing-application-layout-admin-section-1",
                title: "Application",
                visible: true,
                layout: { x: 0, y: 0, w: 6, h: 4 },
                fields: [
                  {
                    id: "financing-application-layout-admin-field-1",
                    propertyId: "task-id",
                    fieldKey: "application_id",
                    label: "Task ID",
                    layout: { x: 0, y: 0, w: 6, h: 2 },
                    visible: true,
                    locked: true,
                  },
                  {
                    id: "financing-application-layout-admin-field-2",
                    propertyId: "status",
                    fieldKey: "status",
                    label: "Status",
                    layout: { x: 6, y: 0, w: 6, h: 2 },
                    visible: true,
                    locked: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "financing-application-layout-sales-rep",
        name: "Sales rep view",
        assignedRoles: ["Sales Rep"],
        status: "published",
        version: 4,
        history: [],
        tabs: systemTabs(),
      },
      {
        id: "financing-application-layout-partner",
        name: "Partner view",
        assignedRoles: ["Partner"],
        status: "draft",
        version: 1,
        history: [],
        tabs: systemTabs(),
      },
      {
        id: "financing-application-layout-installer",
        name: "Installer view",
        assignedRoles: ["Installer"],
        status: "draft",
        version: 1,
        history: [],
        tabs: systemTabs(),
      },
    ],
  },
  {
    id: "document",
    name: "Document",
    recordCount: 32,
    color: "#26262B",
    isCustom: false,
    iconId: "signature",
    iconColor: "#C2185B",
    iconBg: "#FCE4EC",
    description: "Contracts, permits and e-sign packets tied to a record.",
    properties: defaultProperties("document"),
    associations: [],
    layouts: defaultLayouts("document"),
  },
  {
    id: "work-order",
    name: "Work Order",
    recordCount: 4,
    color: "#5B5675",
    isCustom: false,
    iconId: "wrench",
    iconColor: "#B76E00",
    iconBg: "#FDF1DC",
    description: "Crew scheduling and job assignment across active projects.",
    properties: [
      ...defaultProperties("work-order"),
      relationProperty("work-order", {
        label: "Project",
        fieldKey: "project__c",
        target: "projects",
        targetLabel: "Projects",
      }),
    ],
    associations: [],
    layouts: defaultLayouts("work-order"),
  },
  {
    id: "activity",
    name: "Activity",
    recordCount: 84,
    color: "#84919A",
    isCustom: false,
    iconId: "history",
    iconColor: "#616E7C",
    iconBg: "#EEF1F4",
    description: "Timeline of calls, emails and status changes on a record.",
    properties: defaultProperties("activity"),
    associations: [],
    layouts: defaultLayouts("activity"),
  },
  {
    id: "material-type",
    name: "Material Type",
    recordCount: 2,
    color: "#9B51E0",
    isCustom: false,
    iconId: "checklist",
    iconColor: "#1C876C",
    iconBg: "#E3F5EA",
    description: "Categories used to classify materials in the catalog.",
    properties: defaultProperties("material-type"),
    associations: [],
    layouts: defaultLayouts("material-type"),
  },
  {
    id: "material",
    name: "Material",
    recordCount: 4028,
    color: "#B76E7E",
    isCustom: false,
    iconId: "cube",
    iconColor: "#2F80ED",
    iconBg: "#E8F1FD",
    description: "Catalog items used to build out project work orders.",
    properties: defaultProperties("material"),
    associations: [],
    layouts: defaultLayouts("material"),
  },
  {
    id: "incentive-application",
    name: "Incentive Application",
    recordCount: 0,
    color: "#F2994A",
    isCustom: true,
    iconId: "pipeline",
    iconColor: "#B76E00",
    iconBg: "#FDF1DC",
    description: "Custom object for rebate and incentive program applications.",
    properties: defaultProperties("incentive-application"),
    associations: [],
    layouts: defaultLayouts("incentive-application"),
  },
];

const FIELD_TYPES = [
  "Text",
  "Long Text",
  "Number",
  "Currency",
  "Date",
  "Select",
  "Status",
  "Checkbox",
  "Relation",
  "Formula",
  "User",
  "File",
];

const CARDINALITIES = [
  "One-To-One",
  "One-To-Many",
  "Many-To-One",
  "Many-To-Many",
];

const matchesValue = (actual, expected) =>
  String(actual ?? "").toLowerCase() === String(expected).toLowerCase();

const findObject = (objectId) =>
  objectListData.find((item) => matchesValue(item.id, objectId));

/**
 * Whether an object exists, for other controllers that reference one by id - a
 * form attaches to objects, for instance. Exposed as a lookup rather than the
 * list itself so this file stays the only thing that can mutate it.
 */
export const objectExists = (objectId) => Boolean(findObject(objectId));

/** The ids currently on offer, for error messages that name them. */
export const listObjectIds = () => objectListData.map((item) => item.id);

/**
 * An object's display name, or null when it is unknown. Callers that store an
 * object id read the label back through this rather than keeping a copy, so a
 * rename here is a rename everywhere.
 */
export const objectLabelOf = (objectId) => findObject(objectId)?.name ?? null;

/**
 * One property of one object, by field key. Returns undefined when either is
 * unknown, so callers get a single check for "is this mappable".
 */
export const findObjectProperty = (objectId, fieldKey) => {
  const object = findObject(objectId);
  return object?.properties.find((property) =>
    matchesValue(property.fieldKey, fieldKey),
  );
};

/**
 * The object a relation property points at, or null when the property is not
 * a relation. Lets a caller walk one hop without knowing how a relation is
 * stored.
 */
export const relationTargetOf = (objectId, fieldKey) => {
  const property = findObjectProperty(objectId, fieldKey);
  return property?.fieldType === "Relation"
    ? (property.relationConfig?.targetObjectId ?? null)
    : null;
};
const findLayout = (object, layoutId) =>
  object.layouts.find((item) => matchesValue(item.id, layoutId));

const findTab = (layout, tabId) =>
  layout.tabs.find((item) => matchesValue(item.id, tabId));

const notFound = (res, message) =>
  res.status(404).json({ success: false, data: null, message });

const badRequest = (res, message, errors) =>
  res
    .status(400)
    .json({
      success: false,
      data: null,
      message,
      ...(errors ? { errors } : {}),
    });

// The list endpoint is fetched on every load of the object manager, so it
// drops properties/associations/layouts - those can grow per object and are
// only needed for the one object currently open in the detail panel, which
// fetches them itself via GET /object-manager/objects/:objectId.
const toSummary = ({ properties, associations, layouts, ...summary }) =>
  summary;

// Same idea, one level down: the layouts list (and the layouts embedded in an
// object's detail) only need the row shape - tabs/sections/history are fetched
// separately, per layout, only when that layout is opened in the editor.
const toLayoutSummary = ({ tabs, history, ...summary }) => summary;

// ---------------------------------------------------------------------------
// Objects
// ---------------------------------------------------------------------------

/**
 * GET /object-manager/objects
 *
 * Query params:
 *   type    "standard" | "custom"   - defaults to all objects
 *   search  free text match on name / description
 */
export const getObjects = (req, res) => {
  const { type, search } = req.query;
  const term = typeof search === "string" ? search.trim().toLowerCase() : "";

  let results = objectListData;

  if (type === "standard") {
    results = results.filter((object) => !object.isCustom);
  } else if (type === "custom") {
    results = results.filter((object) => object.isCustom);
  }

  if (term) {
    results = results.filter(
      (object) =>
        object.name.toLowerCase().includes(term) ||
        object.description.toLowerCase().includes(term),
    );
  }

  res.json({
    success: true,
    data: results.map(toSummary),
    total: results.length,
    message: "Objects fetched successfully",
  });
};

export const getObjectById = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  res.status(200).json({
    success: true,
    data: { ...object, layouts: object.layouts.map(toLayoutSummary) },
    message: "Object fetched successfully",
  });
};

export const createObject = (req, res) => {
  const name = asTrimmedString(req.body?.name);
  const iconId = asTrimmedString(req.body?.iconId);

  if (!name) {
    return badRequest(res, "Object name is required", {
      name: "Object name is required",
    });
  }

  const baseId = slugify(name) || `object-${Date.now()}`;
  let id = `custom-${baseId}`;
  let suffix = 2;
  while (findObject(id)) {
    id = `custom-${baseId}-${suffix++}`;
  }

  const now = new Date().toISOString();

  const newObject = {
    id,
    name,
    recordCount: 0,
    color: asTrimmedString(req.body?.color) || "#2F80ED",
    isCustom: true,
    iconId: iconId || "cube",
    iconColor: asTrimmedString(req.body?.iconColor) || "#2F80ED",
    iconBg: asTrimmedString(req.body?.iconBg) || "#E8F1FD",
    description:
      asTrimmedString(req.body?.description) ||
      "Newly created custom object - add properties to get started.",
    properties: [],
    associations: [],
    layouts: [],
    createdAt: now,
    updatedAt: now,
  };

  objectListData.push(newObject);

  res.status(201).json({
    success: true,
    data: toSummary(newObject),
    message: "Object created successfully",
  });
};

export const updateObject = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  // id, isCustom, properties/associations/layouts are server-owned here -
  // they have their own endpoints and shouldn't be overwritten wholesale
  // through a name/icon edit.
  const {
    id,
    isCustom,
    properties,
    associations,
    layouts,
    recordCount,
    createdAt,
    ...updates
  } = req.body ?? {};

  if (updates.name !== undefined) {
    const name = asTrimmedString(updates.name);
    if (!name) {
      return badRequest(res, "Object name cannot be empty", {
        name: "Object name cannot be empty",
      });
    }
    updates.name = name;
  }

  Object.assign(object, updates, { updatedAt: new Date().toISOString() });

  res.status(200).json({
    success: true,
    data: toSummary(object),
    message: "Object updated successfully",
  });
};

export const deleteObject = (req, res) => {
  const index = objectListData.findIndex((item) =>
    matchesValue(item.id, req.params.objectId),
  );

  if (index === -1) {
    return notFound(res, "Object not found");
  }

  if (!objectListData[index].isCustom) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "Standard objects cannot be deleted",
    });
  }

  // Dangling references would otherwise leave other objects pointing at an
  // object that no longer exists.
  const deletedId = objectListData[index].id;
  objectListData.forEach((object) => {
    object.associations = object.associations.filter(
      (association) => association.targetObjectId !== deletedId,
    );
  });

  objectListData.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Object deleted successfully",
  });
};

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

export const getProperties = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  res.json({
    success: true,
    data: object.properties,
    total: object.properties.length,
    message: "Properties fetched successfully",
  });
};

export const createProperty = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const label = asTrimmedString(req.body?.label);
  const fieldType = asTrimmedString(req.body?.fieldType);
  const fieldKey = asTrimmedString(req.body?.fieldKey) || toSnakeCase(label);

  const errors = {};
  if (!label) errors.label = "Label is required";
  if (!fieldKey) errors.fieldKey = "Field key is required";
  if (!fieldType) {
    errors.fieldType = "Field type is required";
  } else if (!FIELD_TYPES.includes(fieldType)) {
    errors.fieldType = `Field type must be one of: ${FIELD_TYPES.join(", ")}`;
  }
  if (
    fieldKey &&
    object.properties.some((property) =>
      matchesValue(property.fieldKey, fieldKey),
    )
  ) {
    errors.fieldKey = `A property with field key "${fieldKey}" already exists on this object`;
  }

  if (Object.keys(errors).length) {
    return badRequest(res, "Validation failed", errors);
  }

  const newProperty = {
    id: `property-${Date.now()}`,
    label,
    fieldKey,
    fieldType,
    color: asTrimmedString(req.body?.color) || "#CAC4CE",
    badge: req.body?.required ? "required" : undefined,
    description: asTrimmedString(req.body?.description) || undefined,
    unique: Boolean(req.body?.unique),
    showInTableViews: Boolean(req.body?.showInTableViews),
    numberConfig: req.body?.numberConfig,
    currencyConfig: req.body?.currencyConfig,
    textConfig: req.body?.textConfig,
    longTextConfig: req.body?.longTextConfig,
    dateConfig: req.body?.dateConfig,
    selectConfig: req.body?.selectConfig,
    statusConfig: req.body?.statusConfig,
    checkboxConfig: req.body?.checkboxConfig,
    relationConfig: req.body?.relationConfig,
    formulaConfig: req.body?.formulaConfig,
    userConfig: req.body?.userConfig,
    fileConfig: req.body?.fileConfig,
  };

  object.properties.push(newProperty);

  res.status(201).json({
    success: true,
    data: newProperty,
    message: "Property created successfully",
  });
};

export const updateProperty = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const property = object.properties.find((item) =>
    matchesValue(item.id, req.params.propertyId),
  );

  if (!property) {
    return notFound(res, "Property not found");
  }

  const { id, ...updates } = req.body ?? {};

  if (updates.fieldKey !== undefined) {
    const fieldKey = asTrimmedString(updates.fieldKey);
    if (!fieldKey) {
      return badRequest(res, "Field key cannot be empty", {
        fieldKey: "Field key cannot be empty",
      });
    }
    if (
      object.properties.some(
        (item) =>
          item.id !== property.id && matchesValue(item.fieldKey, fieldKey),
      )
    ) {
      return badRequest(res, "Validation failed", {
        fieldKey: `A property with field key "${fieldKey}" already exists on this object`,
      });
    }
    updates.fieldKey = fieldKey;
  }

  if (
    updates.fieldType !== undefined &&
    !FIELD_TYPES.includes(updates.fieldType)
  ) {
    return badRequest(res, "Validation failed", {
      fieldType: `Field type must be one of: ${FIELD_TYPES.join(", ")}`,
    });
  }

  Object.assign(property, updates);

  res.status(200).json({
    success: true,
    data: property,
    message: "Property updated successfully",
  });
};

export const deleteProperty = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const index = object.properties.findIndex((item) =>
    matchesValue(item.id, req.params.propertyId),
  );

  if (index === -1) {
    return notFound(res, "Property not found");
  }

  if (object.properties[index].badge === "primary") {
    return res.status(403).json({
      success: false,
      data: null,
      message: "The primary property cannot be deleted",
    });
  }

  object.properties.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Property deleted successfully",
  });
};

// ---------------------------------------------------------------------------
// Associations
// ---------------------------------------------------------------------------

export const getAssociations = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  res.json({
    success: true,
    data: object.associations,
    total: object.associations.length,
    message: "Associations fetched successfully",
  });
};

export const createAssociation = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const targetObjectId = asTrimmedString(req.body?.targetObjectId);
  const cardinality = asTrimmedString(req.body?.cardinality);

  const errors = {};
  const targetObject = targetObjectId ? findObject(targetObjectId) : null;

  if (!targetObjectId) {
    errors.targetObjectId = "Target object is required";
  } else if (!targetObject) {
    errors.targetObjectId = "Target object not found";
  }

  if (!cardinality) {
    errors.cardinality = "Cardinality is required";
  } else if (!CARDINALITIES.includes(cardinality)) {
    errors.cardinality = `Cardinality must be one of: ${CARDINALITIES.join(", ")}`;
  }

  if (Object.keys(errors).length) {
    return badRequest(res, "Validation failed", errors);
  }

  const newAssociation = {
    id: `association-${Date.now()}`,
    targetObjectId: targetObject.id,
    targetObjectLabel: targetObject.name,
    inverseLabel:
      asTrimmedString(req.body?.inverseLabel) ||
      `Inverse ${object.name.toLowerCase()}`,
    cardinality,
  };

  object.associations.push(newAssociation);

  res.status(201).json({
    success: true,
    data: newAssociation,
    message: "Association created successfully",
  });
};

export const deleteAssociation = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const index = object.associations.findIndex((item) =>
    matchesValue(item.id, req.params.associationId),
  );

  if (index === -1) {
    return notFound(res, "Association not found");
  }

  object.associations.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Association deleted successfully",
  });
};

// ---------------------------------------------------------------------------
// Record layouts
// ---------------------------------------------------------------------------

const ROLE_OPTIONS = [
  "Admin",
  "Sales Rep",
  "Dispatcher",
  "Installer",
  "Partner",
];

export const getLayouts = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  res.json({
    success: true,
    data: object.layouts.map(toLayoutSummary),
    total: object.layouts.length,
    message: "Layouts fetched successfully",
  });
};

const validateAssignedRoles = (value) => {
  if (!Array.isArray(value)) {
    return { error: "assignedRoles must be an array" };
  }
  const invalid = value.find((role) => !ROLE_OPTIONS.includes(role));
  if (invalid) {
    return {
      error: `assignedRoles must only contain: ${ROLE_OPTIONS.join(", ")}`,
    };
  }
  return { value };
};

export const createLayout = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const name = asTrimmedString(req.body?.name);
  const role = asTrimmedString(req.body?.role);

  const errors = {};
  if (!name) errors.name = "Layout name is required";
  if (!role) {
    errors.role = "Role is required";
  } else if (!ROLE_OPTIONS.includes(role)) {
    errors.role = `Role must be one of: ${ROLE_OPTIONS.join(", ")}`;
  }

  if (Object.keys(errors).length) {
    return badRequest(res, "Validation failed", errors);
  }

  const newLayout = {
    id: `${object.id}-layout-${Date.now()}`,
    name,
    assignedRoles: [role],
    status: "draft",
    version: 1,
    tabs: systemTabs(),
    history: [],
  };

  object.layouts.push(newLayout);

  res.status(201).json({
    success: true,
    data: toLayoutSummary(newLayout),
    message: "Layout created successfully",
  });
};

export const deleteLayout = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const index = object.layouts.findIndex((item) =>
    matchesValue(item.id, req.params.layoutId),
  );

  if (index === -1) {
    return notFound(res, "Layout not found");
  }

  object.layouts.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Layout deleted successfully",
  });
};

// PATCH .../layouts/:layoutId/default - a dedicated action rather than a
// generic layout PATCH, since setting a default is really "move the flag",
// not a free-form edit: every other layout on the object has to flip off in
// the same request so exactly one default ever exists.
export const setDefaultLayout = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const layout = findLayout(object, req.params.layoutId);

  if (!layout) {
    return notFound(res, "Layout not found");
  }

  object.layouts.forEach((item) => {
    item.isDefault = item.id === layout.id;
  });

  res.status(200).json({
    success: true,
    data: object.layouts.map(toLayoutSummary),
    message: "Default layout updated successfully",
  });
};

/**
 * GET /object-manager/objects/:objectId/layouts/:layoutId
 *
 * Full layout detail - tabs, sections and their fields, and publish history.
 * Fetched only when a specific layout is opened in the editor.
 */
export const getLayoutDetail = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const layout = findLayout(object, req.params.layoutId);

  if (!layout) {
    return notFound(res, "Layout not found");
  }

  res.status(200).json({
    success: true,
    data: layout,
    message: "Layout fetched successfully",
  });
};

export const updateLayout = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const layout = findLayout(object, req.params.layoutId);

  if (!layout) {
    return notFound(res, "Layout not found");
  }

  // id/status/version/isDefault/tabs/history are server-owned here - they
  // have their own endpoints (publish, set-default, tab/section save) and
  // shouldn't be overwritten wholesale through a name/roles edit.
  const { id, status, version, isDefault, tabs, history, ...updates } =
    req.body ?? {};

  if (updates.name !== undefined) {
    const name = asTrimmedString(updates.name);
    if (!name) {
      return badRequest(res, "Layout name cannot be empty", {
        name: "Layout name cannot be empty",
      });
    }
    updates.name = name;
  }

  if (updates.assignedRoles !== undefined) {
    const { error, value } = validateAssignedRoles(updates.assignedRoles);
    if (error) {
      return badRequest(res, "Validation failed", { assignedRoles: error });
    }
    updates.assignedRoles = value;
  }

  Object.assign(layout, updates);

  res.status(200).json({
    success: true,
    data: toLayoutSummary(layout),
    message: "Layout updated successfully",
  });
};

/**
 * POST /object-manager/objects/:objectId/layouts/:layoutId/publish
 *
 * Bumps the version, marks the layout published, and snapshots the new
 * version into its history.
 */
export const publishLayout = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const layout = findLayout(object, req.params.layoutId);

  if (!layout) {
    return notFound(res, "Layout not found");
  }

  layout.version += 1;
  layout.status = "published";
  layout.history.unshift({
    version: layout.version,
    publishedAt: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    data: layout,
    message: "Layout published successfully",
  });
};

export const createLayoutTab = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const layout = findLayout(object, req.params.layoutId);

  if (!layout) {
    return notFound(res, "Layout not found");
  }

  const name = asTrimmedString(req.body?.name);

  if (!name) {
    return badRequest(res, "Tab name is required", {
      name: "Tab name is required",
    });
  }

  const newTab = {
    id: `${layout.id}-tab-${Date.now()}`,
    name,
    isSystem: false,
    sections: [],
  };

  layout.tabs.push(newTab);

  res.status(201).json({
    success: true,
    data: newTab,
    message: "Tab created successfully",
  });
};

export const deleteLayoutTab = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const layout = findLayout(object, req.params.layoutId);

  if (!layout) {
    return notFound(res, "Layout not found");
  }

  const tab = findTab(layout, req.params.tabId);

  if (!tab) {
    return notFound(res, "Tab not found");
  }

  if (tab.isSystem) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "System tabs cannot be deleted",
    });
  }

  layout.tabs = layout.tabs.filter((item) => item.id !== tab.id);

  res.status(200).json({
    success: true,
    data: null,
    message: "Tab deleted successfully",
  });
};

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Matches the canvas's grid: 12 columns total, and a section (or a field
// within it) can't be resized narrower than 3 - which is also what caps a
// row at 4 sections side by side (12 / 3). Checked here too so a direct API
// call can't bypass the resize constraint the UI enforces.
const GRID_COLS = 12;
const MIN_GRID_COLS = 3;

const validateSections = (sections) => {
  if (!Array.isArray(sections)) {
    return "sections must be an array";
  }
  for (const section of sections) {
    if (
      !isPlainObject(section) ||
      typeof section.id !== "string" ||
      !section.id
    ) {
      return "Each section needs an id";
    }
    if (!isPlainObject(section.layout)) {
      return `Section "${section.id}" is missing its grid layout`;
    }
    const { w } = section.layout;
    if (typeof w !== "number" || w < MIN_GRID_COLS || w > GRID_COLS) {
      return `Section "${section.id}" width must be between ${MIN_GRID_COLS} and ${GRID_COLS} columns`;
    }
    if (!Array.isArray(section.fields)) {
      return `Section "${section.id}" is missing its fields array`;
    }
    for (const field of section.fields) {
      if (
        !isPlainObject(field) ||
        typeof field.id !== "string" ||
        !field.id
      ) {
        return `Section "${section.id}" has a field missing its id`;
      }
      if (!isPlainObject(field.layout)) {
        return `Field "${field.id}" is missing its grid layout`;
      }
      const fieldW = field.layout.w;
      if (typeof fieldW !== "number" || fieldW < MIN_GRID_COLS || fieldW > GRID_COLS) {
        return `Field "${field.id}" width must be between ${MIN_GRID_COLS} and ${GRID_COLS} columns`;
      }
    }
  }
  return null;
};

/**
 * PATCH /object-manager/objects/:objectId/layouts/:layoutId/tabs/:tabId/sections
 *
 * Replaces the whole sections array for one tab in one shot. This is the one
 * endpoint behind every section/field edit - add/remove/reorder a section,
 * drag/resize it, rename it, toggle its visibility or column count, and
 * add/remove/reorder fields inside it, or toggle a field's width/visibility/
 * lock. The client always holds the full current sections array (that's how
 * react-grid-layout reports position changes too), so there's no gain from
 * splitting this into per-field/per-section CRUD - it would just be more
 * round trips for the same edit.
 */
export const saveLayoutTabSections = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  const layout = findLayout(object, req.params.layoutId);

  if (!layout) {
    return notFound(res, "Layout not found");
  }

  const tab = findTab(layout, req.params.tabId);

  if (!tab) {
    return notFound(res, "Tab not found");
  }

  if (tab.isSystem) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "System tabs don't have editable sections",
    });
  }

  const sectionsError = validateSections(req.body?.sections);

  if (sectionsError) {
    return badRequest(res, sectionsError);
  }

  tab.sections = req.body.sections;

  res.status(200).json({
    success: true,
    data: tab.sections,
    message: "Sections saved successfully",
  });
};
