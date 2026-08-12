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

const defaultLayouts = (idPrefix) => [
  {
    id: `${idPrefix}-layout-default`,
    name: "Default",
    role: "All roles",
    isDefault: true,
    status: "published",
    version: 1,
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
    properties: defaultProperties("leads"),
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
    properties: defaultProperties("projects"),
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
        role: "Admin",
        isDefault: true,
        status: "published",
        version: 3,
      },
      {
        id: "financing-application-layout-sales-rep",
        name: "Sales rep view",
        role: "Sales Rep",
        status: "published",
        version: 4,
      },
      {
        id: "financing-application-layout-partner",
        name: "Partner view",
        role: "Partner",
        status: "draft",
        version: 1,
      },
      {
        id: "financing-application-layout-installer",
        name: "Installer view",
        role: "Installer",
        status: "draft",
        version: 1,
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
    properties: defaultProperties("work-order"),
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

const CARDINALITIES = ["One-To-One", "One-To-Many", "Many-To-One", "Many-To-Many"];

const matchesValue = (actual, expected) =>
  String(actual ?? "").toLowerCase() === String(expected).toLowerCase();

const findObject = (objectId) =>
  objectListData.find((item) => matchesValue(item.id, objectId));

const notFound = (res, message) =>
  res.status(404).json({ success: false, data: null, message });

const badRequest = (res, message, errors) =>
  res.status(400).json({ success: false, data: null, message, ...(errors ? { errors } : {}) });

// The list endpoint is fetched on every load of the object manager, so it
// drops properties/associations/layouts - those can grow per object and are
// only needed for the one object currently open in the detail panel, which
// fetches them itself via GET /object-manager/objects/:objectId.
const toSummary = ({ properties, associations, layouts, ...summary }) => summary;

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
        object.description.toLowerCase().includes(term)
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
    data: object,
    message: "Object fetched successfully",
  });
};

export const createObject = (req, res) => {
  const name = asTrimmedString(req.body?.name);
  const iconId = asTrimmedString(req.body?.iconId);

  if (!name) {
    return badRequest(res, "Object name is required", { name: "Object name is required" });
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
      return badRequest(res, "Object name cannot be empty", { name: "Object name cannot be empty" });
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
    matchesValue(item.id, req.params.objectId)
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
      (association) => association.targetObjectId !== deletedId
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
    object.properties.some((property) => matchesValue(property.fieldKey, fieldKey))
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
    matchesValue(item.id, req.params.propertyId)
  );

  if (!property) {
    return notFound(res, "Property not found");
  }

  const { id, ...updates } = req.body ?? {};

  if (updates.fieldKey !== undefined) {
    const fieldKey = asTrimmedString(updates.fieldKey);
    if (!fieldKey) {
      return badRequest(res, "Field key cannot be empty", { fieldKey: "Field key cannot be empty" });
    }
    if (
      object.properties.some(
        (item) => item.id !== property.id && matchesValue(item.fieldKey, fieldKey)
      )
    ) {
      return badRequest(res, "Validation failed", {
        fieldKey: `A property with field key "${fieldKey}" already exists on this object`,
      });
    }
    updates.fieldKey = fieldKey;
  }

  if (updates.fieldType !== undefined && !FIELD_TYPES.includes(updates.fieldType)) {
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
    matchesValue(item.id, req.params.propertyId)
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
      asTrimmedString(req.body?.inverseLabel) || `Inverse ${object.name.toLowerCase()}`,
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
    matchesValue(item.id, req.params.associationId)
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
// Record layouts (read-only for now - creation/editing isn't in the UI yet)
// ---------------------------------------------------------------------------

export const getLayouts = (req, res) => {
  const object = findObject(req.params.objectId);

  if (!object) {
    return notFound(res, "Object not found");
  }

  res.json({
    success: true,
    data: object.layouts,
    total: object.layouts.length,
    message: "Layouts fetched successfully",
  });
};
