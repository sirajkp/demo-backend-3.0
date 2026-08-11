import { paginate } from "../Utils/pagination.js";

// Stand-in for the signed-in user until the routes read the bearer token.
// The "My contacts" tab resolves to this owner, so the tab shows real rows
// instead of an empty list while auth is still being wired up.
const CURRENT_USER = { id: "u-01", name: "Priya Nair" };
const CURRENT_USER_ID = CURRENT_USER.id;

// Lead -> Prospect -> Customer is the funnel order the "By lifecycle" tab
// sorts on. Anything unrecognised sorts last.
const LIFECYCLE_ORDER = ["Lead", "Prospect", "Customer"];

const contactListData = [
  {
    id: "C1001",
    firstName: "Lucas",
    lastName: "Bennett",
    email: "Lucas@gmail.com",
    phone: "+1 555-123-4567",
    lifecycleStage: "Prospect",
    ownerId: "u-01",
    ownerName: "Priya Nair",
    source: "Referral",
    createdAt: "2026-07-25T12:30:45.123Z",
  },
  {
    id: "C1002",
    firstName: "John",
    lastName: "Beck",
    email: "john.beck@example.com",
    phone: "+1 555-987-6543",
    lifecycleStage: "Customer",
    ownerId: "u-02",
    ownerName: "Sara Lee",
    source: "Organic",
    createdAt: "2026-07-24T09:12:00.000Z",
  },
  {
    id: "C1003",
    firstName: "Tina",
    lastName: "Walsh",
    email: "tina.w@example.com",
    phone: "+1 555-234-5678",
    lifecycleStage: "Lead",
    ownerId: "u-03",
    ownerName: "Mike Carter",
    source: "Referral",
    createdAt: "2026-07-23T15:44:10.000Z",
  },
  {
    id: "C1004",
    firstName: "Sam",
    lastName: "Mitchell",
    email: "sam.mitchell@example.com",
    phone: "+1 555-345-6789",
    lifecycleStage: "Customer",
    ownerId: "u-04",
    ownerName: "Nina Green",
    source: "Webinar",
    createdAt: "2026-07-22T11:05:30.000Z",
  },
  {
    id: "C1005",
    firstName: "Riya",
    lastName: "Kapoor",
    email: "riya.k@example.com",
    phone: "+1 555-456-7890",
    lifecycleStage: "Lead",
    ownerId: "u-05",
    ownerName: "Alex Roy",
    source: "Social Media",
    createdAt: "2026-07-21T08:20:00.000Z",
  },
  {
    id: "C1006",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    phone: "+1 555-567-8901",
    lifecycleStage: "Customer",
    ownerId: "u-06",
    ownerName: "Emma Stone",
    source: "Referral",
    createdAt: "2026-07-20T17:02:45.000Z",
  },
  {
    id: "C1007",
    firstName: "Amanda",
    lastName: "Lee",
    email: "amanda.lee@example.com",
    phone: "+1 555-678-9012",
    lifecycleStage: "Prospect",
    ownerId: "u-07",
    ownerName: "Tom Green",
    source: "Organic",
    createdAt: "2026-07-19T13:38:12.000Z",
  },
  {
    id: "C1008",
    firstName: "Harriet",
    lastName: "Khan",
    email: "harriet.k@example.com",
    phone: "+1 555-789-0123",
    lifecycleStage: "Lead",
    ownerId: "u-08",
    ownerName: "Dan White",
    source: "Referral",
    createdAt: "2026-07-18T10:15:00.000Z",
  },
  {
    id: "C1009",
    firstName: "James",
    lastName: "Smith",
    email: "james.smith@example.com",
    phone: "+1 555-890-1234",
    lifecycleStage: "Customer",
    ownerId: "u-09",
    ownerName: "Claire Lee",
    source: "Organic",
    createdAt: "2026-07-17T16:47:30.000Z",
  },
  {
    id: "C1010",
    firstName: "Charlie",
    lastName: "Reed",
    email: "charlie.r@example.com",
    phone: "+1 555-901-2345",
    lifecycleStage: "Prospect",
    ownerId: "u-10",
    ownerName: "Lisa Brown",
    source: "Organic",
    createdAt: "2026-07-16T07:55:20.000Z",
  },
  {
    id: "C1011",
    firstName: "Wendy",
    lastName: "Davis",
    email: "wendy.d@example.com",
    phone: "+1 555-012-3456",
    lifecycleStage: "Customer",
    ownerId: "u-11",
    ownerName: "Paul Green",
    source: "Referral",
    createdAt: "2026-07-15T12:00:00.000Z",
  },
  {
    id: "C1012",
    firstName: "Luke",
    lastName: "Parker",
    email: "luke.parker@example.com",
    phone: "+1 555-123-4568",
    lifecycleStage: "Customer",
    ownerId: "u-12",
    ownerName: "Nancy Adams",
    source: "Referral",
    createdAt: "2026-07-14T18:26:41.000Z",
  },
  {
    id: "C1013",
    firstName: "Maya",
    lastName: "Sharma",
    email: "maya.s@example.com",
    phone: "+1 555-234-5679",
    lifecycleStage: "Prospect",
    ownerId: "u-13",
    ownerName: "Oliver Brown",
    source: "Webinar",
    createdAt: "2026-07-13T09:09:09.000Z",
  },
  {
    id: "C1014",
    firstName: "Nathan",
    lastName: "Cole",
    email: "nathan.cole@example.com",
    phone: "+1 555-345-6780",
    lifecycleStage: "Lead",
    ownerId: "u-01",
    ownerName: "Priya Nair",
    source: "Cold Call",
    createdAt: "2026-07-12T14:31:00.000Z",
  },
  {
    id: "C1015",
    firstName: "Olivia",
    lastName: "Grant",
    email: "olivia.grant@example.com",
    phone: "+1 555-456-7891",
    lifecycleStage: "Prospect",
    ownerId: "u-01",
    ownerName: "Priya Nair",
    source: "Webinar",
    createdAt: "2026-07-11T11:11:11.000Z",
  },
  {
    id: "C1016",
    firstName: "Ethan",
    lastName: "Ward",
    email: "ethan.ward@example.com",
    phone: "+1 555-567-8902",
    lifecycleStage: "Customer",
    ownerId: "u-02",
    ownerName: "Sara Lee",
    source: "Event",
    createdAt: "2026-07-10T08:48:00.000Z",
  },
  {
    id: "C1017",
    firstName: "Sophie",
    lastName: "Turner",
    email: "sophie.turner@example.com",
    phone: "+1 555-678-9013",
    lifecycleStage: "Lead",
    ownerId: "u-03",
    ownerName: "Mike Carter",
    source: "Social Media",
    createdAt: "2026-07-09T19:22:35.000Z",
  },
  {
    id: "C1018",
    firstName: "Marcus",
    lastName: "Hill",
    email: "marcus.hill@example.com",
    phone: "+1 555-789-0124",
    lifecycleStage: "Prospect",
    ownerId: "u-04",
    ownerName: "Nina Green",
    source: "Organic",
    createdAt: "2026-07-08T13:14:15.000Z",
  },
  {
    id: "C1019",
    firstName: "Isabel",
    lastName: "Moreno",
    email: "isabel.moreno@example.com",
    phone: "+1 555-890-1235",
    lifecycleStage: "Customer",
    ownerId: "u-05",
    ownerName: "Alex Roy",
    source: "Referral",
    createdAt: "2026-07-07T10:02:00.000Z",
  },
  {
    id: "C1020",
    firstName: "Peter",
    lastName: "Novak",
    email: "peter.novak@example.com",
    phone: "+1 555-901-2346",
    lifecycleStage: "Lead",
    ownerId: "u-06",
    ownerName: "Emma Stone",
    source: "Cold Call",
    createdAt: "2026-07-06T16:40:00.000Z",
  },
  {
    id: "C1021",
    firstName: "Grace",
    lastName: "Oyelaran",
    email: "grace.o@example.com",
    phone: "+1 555-012-3457",
    lifecycleStage: "Prospect",
    ownerId: "u-01",
    ownerName: "Priya Nair",
    source: "Event",
    createdAt: "2026-07-05T09:30:00.000Z",
  },
  {
    id: "C1022",
    firstName: "Daniel",
    lastName: "Fischer",
    email: "daniel.fischer@example.com",
    phone: "+1 555-123-4569",
    lifecycleStage: "Customer",
    ownerId: "u-07",
    ownerName: "Tom Green",
    source: "Organic",
    createdAt: "2026-07-04T12:12:12.000Z",
  },
  {
    id: "C1023",
    firstName: "Aisha",
    lastName: "Rahman",
    email: "aisha.rahman@example.com",
    phone: "+1 555-234-5680",
    lifecycleStage: "Lead",
    ownerId: "u-08",
    ownerName: "Dan White",
    source: "Webinar",
    createdAt: "2026-07-03T15:00:00.000Z",
  },
  {
    id: "C1024",
    firstName: "Victor",
    lastName: "Ramos",
    email: "victor.ramos@example.com",
    phone: "+1 555-345-6781",
    lifecycleStage: "Prospect",
    ownerId: "u-09",
    ownerName: "Claire Lee",
    source: "Social Media",
    createdAt: "2026-07-02T11:45:00.000Z",
  },
  {
    id: "C1025",
    firstName: "Hannah",
    lastName: "Yates",
    email: "hannah.yates@example.com",
    phone: "+1 555-456-7892",
    lifecycleStage: "Customer",
    ownerId: "u-10",
    ownerName: "Lisa Brown",
    source: "Referral",
    createdAt: "2026-07-01T08:00:00.000Z",
  },
  {
    id: "C1026",
    firstName: "Owen",
    lastName: "Blake",
    email: "owen.blake@example.com",
    phone: "+1 555-567-8903",
    lifecycleStage: "Lead",
    ownerId: "u-01",
    ownerName: "Priya Nair",
    source: "Organic",
    createdAt: "2026-06-30T17:20:00.000Z",
  },
];

// Fields a free-text search should look at.
const SEARCHABLE_FIELDS = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phone",
  "lifecycleStage",
  "ownerName",
  "source",
];

function matchesSearch(contact, term) {
  return SEARCHABLE_FIELDS.some((field) =>
    String(contact[field] ?? "")
      .toLowerCase()
      .includes(term)
  );
}

// Case-insensitive so "?source=referral" and "?source=Referral" behave the same.
function matchesValue(actual, expected) {
  return String(actual ?? "").toLowerCase() === String(expected).toLowerCase();
}

function compareByLifecycle(a, b) {
  const rankA = LIFECYCLE_ORDER.indexOf(a.lifecycleStage);
  const rankB = LIFECYCLE_ORDER.indexOf(b.lifecycleStage);
  const safeA = rankA === -1 ? LIFECYCLE_ORDER.length : rankA;
  const safeB = rankB === -1 ? LIFECYCLE_ORDER.length : rankB;
  if (safeA !== safeB) return safeA - safeB;
  return a.firstName.localeCompare(b.firstName);
}

/**
 * GET /contacts
 *
 * Query params:
 *   scope         "all" (default) | "mine"      - "mine" narrows to the signed-in owner
 *   groupBy       "lifecycle"                   - orders Lead -> Prospect -> Customer
 *   search        free text across the fields above
 *   lifecycleStage / source / ownerId           - exact-match filters
 *   page          1-based, default 1
 *   pageSize      default 50, capped at 200 so one call can't pull the table
 */
export const getContacts = (req, res) => {
  const { scope, groupBy, search, lifecycleStage, source, ownerId } = req.query;

  const term = typeof search === "string" ? search.trim().toLowerCase() : "";

  let results = contactListData.filter((contact) => {
    if (term && !matchesSearch(contact, term)) return false;
    if (scope === "mine" && contact.ownerId !== CURRENT_USER_ID) return false;
    if (ownerId && !matchesValue(contact.ownerId, ownerId)) return false;
    if (lifecycleStage && !matchesValue(contact.lifecycleStage, lifecycleStage)) {
      return false;
    }
    if (source && !matchesValue(contact.source, source)) return false;
    return true;
  });

  if (groupBy === "lifecycle") {
    results = [...results].sort(compareByLifecycle);
  }

  res.json({
    success: true,
    ...paginate(results, req.query),
    message: "Contacts fetched successfully",
  });
};

export const getContactById = (req, res) => {
  const { id: contactId } = req.params;

  const contact = contactListData.find((item) =>
    matchesValue(item.id, contactId)
  );

  if (!contact) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Contact not found",
    });
  }

  res.status(200).json({
    success: true,
    data: contact,
    message: "Contact fetched successfully",
  });
};

const REQUIRED_ON_CREATE = ["firstName", "lastName", "email"];

export const createContact = (req, res) => {
  const missing = REQUIRED_ON_CREATE.filter(
    (field) => !String(req.body?.[field] ?? "").trim()
  );

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Missing required field(s): ${missing.join(", ")}`,
    });
  }

  const newContact = {
    id: `C${Date.now()}`,
    lifecycleStage: "Lead",
    ...req.body,
    // Ownership is server-owned - a client can't create a contact for someone
    // else, and ownerName has to stay in step with ownerId or the list column
    // renders blank.
    ownerId: CURRENT_USER.id,
    ownerName: CURRENT_USER.name,
    createdAt: new Date().toISOString(),
  };

  contactListData.unshift(newContact);

  res.status(201).json({
    success: true,
    data: newContact,
    message: "Contact created successfully",
  });
};

// Bounded so one request can't be used to push the in-memory store over.
const MAX_IMPORT_ROWS = 500;

/**
 * POST /contacts/import - creates many contacts in one call.
 *
 * Partial success is the normal outcome: valid rows are created and invalid
 * ones are reported back with their row number, rather than failing the whole
 * file because of one bad line.
 */
export const importContacts = (req, res) => {
  const incoming = req.body?.contacts;

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Expected a non-empty 'contacts' array",
    });
  }

  if (incoming.length > MAX_IMPORT_ROWS) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Too many rows - the limit is ${MAX_IMPORT_ROWS} per import`,
    });
  }

  const created = [];
  const errors = [];

  // Seeded with what is already stored so a file can't re-add an existing
  // contact, then grown as rows are accepted so it also catches duplicates
  // within the file itself.
  const seenEmails = new Set(
    contactListData.map((contact) => String(contact.email).toLowerCase())
  );

  incoming.forEach((row, index) => {
    // 1-based, and past the header line the client stripped.
    const rowNumber = index + 2;

    const missing = REQUIRED_ON_CREATE.filter(
      (field) => !String(row?.[field] ?? "").trim()
    );

    if (missing.length > 0) {
      errors.push({
        row: rowNumber,
        message: `Missing ${missing.join(", ")}`,
      });
      return;
    }

    const email = String(row.email).trim();

    if (seenEmails.has(email.toLowerCase())) {
      errors.push({ row: rowNumber, message: `Duplicate email ${email}` });
      return;
    }

    seenEmails.add(email.toLowerCase());

    created.push({
      id: `C${Date.now()}${index}`,
      firstName: String(row.firstName).trim(),
      lastName: String(row.lastName).trim(),
      email,
      phone: String(row.phone ?? "").trim(),
      lifecycleStage: String(row.lifecycleStage ?? "").trim() || "Lead",
      source: String(row.source ?? "").trim() || "Others",
      ownerId: CURRENT_USER.id,
      ownerName: CURRENT_USER.name,
      createdAt: new Date().toISOString(),
    });
  });

  contactListData.unshift(...created);

  res.status(created.length > 0 ? 201 : 400).json({
    success: created.length > 0,
    created: created.length,
    skipped: errors.length,
    errors,
    data: created,
    message: `${created.length} contact(s) imported, ${errors.length} skipped`,
  });
};

export const updateContact = (req, res) => {
  const { id: contactId } = req.params;

  const contact = contactListData.find((item) =>
    matchesValue(item.id, contactId)
  );

  if (!contact) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Contact not found",
    });
  }

  // id and createdAt are server-owned, so ignore them if the client sends them.
  const { id, createdAt, ...updates } = req.body;

  Object.assign(contact, updates, { updatedAt: new Date().toISOString() });

  res.status(200).json({
    success: true,
    data: contact,
    message: "Contact updated successfully",
  });
};

export const deleteContact = (req, res) => {
  const { id: contactId } = req.params;

  const index = contactListData.findIndex((item) =>
    matchesValue(item.id, contactId)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Contact not found",
    });
  }

  contactListData.splice(index, 1);

  res.status(200).json({
    success: true,
    data: null,
    message: "Contact deleted successfully",
  });
};
