const leadListData = [
  {
    id: "D600",
    firstName: "Lucas",
    lastName: "KA",
    email: "Lucas@gmail.com",
    address: "Valrico, FL",
    status: "Contacted",
    source: "Social media",
    createdAt: "2026-07-25T12:30:45.123Z"
  },
  {
    id: "A300",
    firstName: "Priya Nair",
    lastName: "TN",
    address: "San Francisco, CA",
    createdAt: "2026-07-27T12:30:45.123Z",
    source: "Email Marketing",
    email: "tina.brown@example.com",
    status: "Follow-up",
  },
  {
    id: "B700",
    firstName: "John",
    lastName: "JS",
    address: "Austin, TX",
    createdAt: "2026-07-21T12:30:45.123Z",
    source: "Web Development",
    email: "john.smith@example.com",
    status: "Pending",
  },
  {
    id: "C400",
    firstName: "Rita",
    lastName: "RA",
    address: "New York, NY",
    createdAt: "2026-07-23T12:30:45.123Z",
    source: "Email campaign",
    email: "rita.adams@example.com",
    status: "Contacted",
  },
  {
    id: "B200",
    firstName: "Michael",
    lastName: "MC",
    address: "Seattle, WA",
    createdAt: "2026-07-22T12:30:45.123Z",
    source: "Website inquiry",
    email: "michael.chen@example.com",
    status: "In Progress",
  },
  {
    id: "D100",
    firstName: "Peter",
    lastName: "PL",
    address: "Los Angeles, CA",
    createdAt: "2026-07-27T11:28:41.123Z",
    source: "Networking event",
    email: "peter.lee@example.com",
    status: "In Progress",
  },
  {
    id: "C600",
    firstName: "Nina",
    lastName: "NB",
    address: "Boston, MA",
    createdAt: "2026-07-17T11:28:41.123Z",
    source: "Referral",
    email: "nina.voss@example.com",
    status: "Contacted",
  },
  {
    id: "E500",
    firstName: "Rachel",
    lastName: "RB",
    address: "Denver, CO",
    createdAt: "2026-07-07T11:28:41.123Z",
    source: "Web Development",
    email: "rachel.brown@example.com",
    status: "Contacted",
  },
  {
    id: "A900",
    firstName: "Samuel",
    lastName: "SD",
    address: "Miami, FL",
    createdAt: "2026-05-27T11:28:41.123Z",
    source: "Referral",
    email: "samuel.davis@example.com",
    status: "Pending",
  },
  {
    id: "B800",
    firstName: "Jack",
    lastName: "JW",
    address: "Orlando, FL",
    createdAt: "2026-07-27T11:28:41.123Z",
    source: "Email campaign",
    email: "jack.wilson@example.com",
    status: "Pending",
  },
  {
    id: "C300",
    firstName: "Alice",
    lastName: "AS",
    address: "Chicago, IL",
    createdAt: "2025-07-27T11:28:41.123Z",
    source: "Networking event",
    email: "alice.smith@example.com",
    status: "In Progress",
  },
  {
    id: "D900",
    firstName: "David",
    lastName: "DE",
    address: "Philadelphia, PA",
    createdAt: "2026-07-27T11:28:41.123Z",
    source: "Website inquiry",
    email: "david.evans@example.com",
    status: "In Progress",
  },
  {
    id: "B500",
    firstName: "Laura",
    lastName: "LA",
    address: "Phoenix, AZ",
    createdAt: "2026-07-27T12:30:45.123Z",
    source: "Email campaign",
    email: "laura.taylor@example.com",
    status: "In Progress",
  },
];



// Fields a free-text search should look at.
const SEARCHABLE_FIELDS = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "source",
  "status",
];

export const getLeads = (req, res) => {
  const { search } = req.query;

  const term = typeof search === "string" ? search.trim().toLowerCase() : "";

  const results = term
    ? leadListData.filter((lead) =>
        SEARCHABLE_FIELDS.some((field) =>
          String(lead[field] ?? "").toLowerCase().includes(term)
        )
      )
    : leadListData;

  res.json({
    success: true,
    data: results,
    total: results.length,
    page: 1,
    pageSize: 10,
    message: "Leads fetched successfully",
  });
};

export const createLead = (req, res) => {
  const newLead = {
    id: `L${Date.now()}`,
    status: "New",
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  leadListData.push(newLead);

  res.status(201).json({
    success: true,
    message: "Lead created successfully",
  });
};

export const getLeadById = (req, res) => {
  const { id: leadId } = req.params;

  const lead = leadListData.find(
    (item) => item.id.toLowerCase() === leadId.toLowerCase()
  );

  if (!lead) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Lead not found",
    });
  }

  res.status(200).json({
    success: true,
    data: lead,
    message: "Lead fetched successfully",
  });
};

export const updateLead = (req, res) => {
  const { id: leadId } = req.params;

  const lead = leadListData.find(
    (item) => item.id.toLowerCase() === leadId.toLowerCase()
  );

  if (!lead) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Lead not found",
    });
  }

  // id and createdAt are server-owned, so ignore them if the client sends them.
  const { id, createdAt, ...updates } = req.body;

  Object.assign(lead, updates, { updatedAt: new Date().toISOString() });

  res.status(200).json({
    success: true,
    data: lead,
    message: "Lead updated successfully",
  });
};


