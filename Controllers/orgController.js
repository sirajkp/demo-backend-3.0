const organisationListData = [];

// Which organisation the user is currently working in. There is no auth/session
// yet, so this is a single server-wide value rather than one per user.
let currentOrganisationId = null;

const findOrganisation = (orgId) =>
  organisationListData.find(
    (item) => item.id.toLowerCase() === String(orgId).toLowerCase()
  );

// `isCurrent` is the switcher selection - deliberately separate from `status`,
// which is the organisation's own lifecycle state.
const withCurrentFlag = (organisation) => ({
  ...organisation,
  isCurrent: organisation.id === currentOrganisationId,
});

// Step 2 of the create wizard. "later" is the "I'll do it later" option, which
// leaves the organisation without a workflow until it is set from elsewhere.
const WORKFLOW_OPTIONS = [
  "design",
  "design_and_stamping",
  "testing",
  "later",
];

// Step 3. Only the free plan exists today.
const PLAN_OPTIONS = ["free"];

const TRADE_OPTIONS = [
  "electrical",
  "plumbing",
  "hvac",
  "solar",
  "roofing",
  "general",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asTrimmedString = (value) =>
  typeof value === "string" ? value.trim() : "";

// The address comes either from the autocomplete search (a string) or from the
// "Advanced Search" panel (line1/city/state/postalCode/country), so accept both
// and normalise to an object with a display `formatted` string.
const normaliseAddress = (value) => {
  if (typeof value === "string") {
    const formatted = value.trim();
    return formatted ? { formatted } : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const { line1, line2, city, state, postalCode, country } = value;

  const parts = [line1, line2, city, state, postalCode, country]
    .map(asTrimmedString)
    .filter(Boolean);

  if (!parts.length) {
    return null;
  }

  return {
    line1: asTrimmedString(line1) || undefined,
    line2: asTrimmedString(line2) || undefined,
    city: asTrimmedString(city) || undefined,
    state: asTrimmedString(state) || undefined,
    postalCode: asTrimmedString(postalCode) || undefined,
    country: asTrimmedString(country) || undefined,
    formatted: asTrimmedString(value.formatted) || parts.join(", "),
  };
};

const validateOrganisation = (body) => {
  const errors = {};

  const name = asTrimmedString(body.name);
  if (!name) {
    errors.name = "Organization name is required";
  }

  const primaryEmail = asTrimmedString(body.primaryEmail).toLowerCase();
  if (!primaryEmail) {
    errors.primaryEmail = "Primary email id is required";
  } else if (!EMAIL_PATTERN.test(primaryEmail)) {
    errors.primaryEmail = "Primary email id is not a valid email address";
  }

  const address = normaliseAddress(body.address);
  if (!address) {
    errors.address = "Address is required";
  }

  const trade = asTrimmedString(body.trade).toLowerCase();
  if (!trade) {
    errors.trade = "Trade is required";
  } else if (!TRADE_OPTIONS.includes(trade)) {
    errors.trade = `Trade must be one of: ${TRADE_OPTIONS.join(", ")}`;
  }

  const workflow = asTrimmedString(body.workflow).toLowerCase();
  if (!workflow) {
    errors.workflow = "Workflow is required";
  } else if (!WORKFLOW_OPTIONS.includes(workflow)) {
    errors.workflow = `Workflow must be one of: ${WORKFLOW_OPTIONS.join(", ")}`;
  }

  const plan = asTrimmedString(body.plan).toLowerCase();
  if (!plan) {
    errors.plan = "Plan is required";
  } else if (!PLAN_OPTIONS.includes(plan)) {
    errors.plan = `Plan must be one of: ${PLAN_OPTIONS.join(", ")}`;
  }

  return {
    errors,
    values: {
      name,
      primaryEmail,
      address,
      trade,
      workflow,
      plan,
      notes: asTrimmedString(body.notes),
      // No multipart handling here yet, so the logo is whatever reference the
      // client already has (uploaded file url or data uri).
      logo: asTrimmedString(body.logo),
    },
  };
};

export const getOrganizations = (req, res) => {
  res.json({
    success: true,
    data: organisationListData.map(withCurrentFlag),
    total: organisationListData.length,
    currentOrganisationId,
    message: "Organizations fetched successfully",
  });
};

export const createOrganization = (req, res) => {
  const { errors, values } = validateOrganisation(req.body ?? {});

  if (Object.keys(errors).length) {
    return res.status(400).json({
      success: false,
      data: null,
      errors,
      message: "Validation failed",
    });
  }

  // The primary email is not unique - one person can own several organisations
  // and use the same email id for each of them.
  const now = new Date().toISOString();

  const newOrganisation = {
    id: `ORG${Date.now()}`,
    name: values.name,
    primaryEmail: values.primaryEmail,
    address: values.address,
    trade: values.trade,
    notes: values.notes || null,
    logo: values.logo || null,
    // "I'll do it later" is stored as no workflow rather than as a workflow
    // named "later", so the app can prompt for one afterwards.
    workflow: values.workflow === "later" ? null : values.workflow,
    plan: values.plan,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  organisationListData.push(newOrganisation);

  // Creating an organisation switches you into it, so the app lands in the org
  // that was just set up.
  currentOrganisationId = newOrganisation.id;

  res.status(201).json({
    success: true,
    data: withCurrentFlag(newOrganisation),
    message: "Organization created successfully",
  });
};

export const getCurrentOrganization = (req, res) => {
  const organisation = currentOrganisationId
    ? findOrganisation(currentOrganisationId)
    : null;

  if (!organisation) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No organization selected",
    });
  }

  res.status(200).json({
    success: true,
    data: withCurrentFlag(organisation),
    message: "Current organization fetched successfully",
  });
};

export const switchOrganization = (req, res) => {
  const { id: orgId } = req.params;

  const organisation = findOrganisation(orgId);

  if (!organisation) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Organization not found",
    });
  }

  currentOrganisationId = organisation.id;

  res.status(200).json({
    success: true,
    data: withCurrentFlag(organisation),
    message: "Switched organization successfully",
  });
};

export const getOrganizationById = (req, res) => {
  const { id: orgId } = req.params;

  const organisation = findOrganisation(orgId);

  if (!organisation) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Organization not found",
    });
  }

  res.status(200).json({
    success: true,
    data: withCurrentFlag(organisation),
    message: "Organization fetched successfully",
  });
};
