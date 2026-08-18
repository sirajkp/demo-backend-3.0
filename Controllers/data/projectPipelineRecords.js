// Seed data for the project pipeline (kanban/list dashboard). Mirrors the
// frontend mock at src/features/projects/mockData/projects.json so the API
// and the previous static UI agree on the same 43 sample projects.
export const PROJECT_RECORDS = [
  {
    "id": "proj-1",
    "code": "A300",
    "customerName": "Lucas",
    "city": "Valrico",
    "state": "FL",
    "kw": 4,
    "stageId": "new",
    "status": "In Progress",
    "startDate": "2026-01-01",
    "estCompleteDate": "2026-01-26",
    "progress": 15,
    "assignees": [
      {
        "name": "Blake Sutton",
        "id": 1
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-2",
    "code": "B400",
    "customerName": "Noah",
    "city": "Lincoln",
    "state": "CA",
    "kw": 11,
    "stageId": "new",
    "status": "Pending",
    "startDate": "2026-02-05",
    "estCompleteDate": "2026-03-16",
    "progress": 43,
    "assignees": [
      {
        "name": "Owen Clarke",
        "id": 2,
        "photoUrl": "https://i.pravatar.cc/150?img=15"
      },
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 2
  },
  {
    "id": "proj-3",
    "code": "C500",
    "customerName": "Owen",
    "city": "Denver",
    "state": "CO",
    "kw": 9,
    "stageId": "new",
    "status": "Completed",
    "startDate": "2026-03-09",
    "estCompleteDate": "2026-05-01",
    "progress": 100,
    "assignees": [
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-4",
    "code": "D600",
    "customerName": "Benjamin",
    "city": "Boise",
    "state": "ID",
    "kw": 7,
    "stageId": "new",
    "status": "In Progress",
    "startDate": "2026-04-13",
    "estCompleteDate": "2026-06-19",
    "progress": 19,
    "assignees": [
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-5",
    "code": "E700",
    "customerName": "Caleb",
    "city": "Valrico",
    "state": "FL",
    "kw": 5,
    "stageId": "new",
    "status": "Pending",
    "startDate": "2026-05-17",
    "estCompleteDate": "2026-08-06",
    "progress": 47,
    "assignees": [
      {
        "name": "Owen Clarke",
        "id": 2,
        "photoUrl": "https://i.pravatar.cc/150?img=15"
      },
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 2
  },
  {
    "id": "proj-6",
    "code": "F800",
    "customerName": "Piper",
    "city": "Madison",
    "state": "WI",
    "kw": 6,
    "stageId": "proposal-req",
    "status": "Pending",
    "startDate": "2026-06-16",
    "estCompleteDate": "2026-08-05",
    "progress": 70,
    "assignees": [
      {
        "name": "Riya Shah",
        "id": 6,
        "photoUrl": "https://i.pravatar.cc/150?img=44"
      },
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 4
  },
  {
    "id": "proj-7",
    "code": "G900",
    "customerName": "Rosie",
    "city": "Hartford",
    "state": "CT",
    "kw": 4,
    "stageId": "proposal-req",
    "status": "Pending",
    "startDate": "2026-07-20",
    "estCompleteDate": "2026-09-22",
    "progress": 18,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-8",
    "code": "H1000",
    "customerName": "Ava",
    "city": "Austin",
    "state": "TX",
    "kw": 11,
    "stageId": "proposal-req",
    "status": "Pending",
    "startDate": "2026-08-24",
    "estCompleteDate": "2026-11-10",
    "progress": 46,
    "assignees": [
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 2
  },
  {
    "id": "proj-9",
    "code": "I1100",
    "customerName": "Chloe",
    "city": "Raleigh",
    "state": "NC",
    "kw": 9,
    "stageId": "proposal-req",
    "status": "Pending",
    "startDate": "2026-09-01",
    "estCompleteDate": "2026-09-28",
    "progress": 74,
    "assignees": [
      {
        "name": "Riya Shah",
        "id": 6,
        "photoUrl": "https://i.pravatar.cc/150?img=44"
      },
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 4
  },
  {
    "id": "proj-10",
    "code": "J1200",
    "customerName": "Hazel",
    "city": "Madison",
    "state": "WI",
    "kw": 7,
    "stageId": "proposal-req",
    "status": "Pending",
    "startDate": "2026-10-05",
    "estCompleteDate": "2026-11-15",
    "progress": 22,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-11",
    "code": "K1300",
    "customerName": "Henry",
    "city": "Albany",
    "state": "NY",
    "kw": 8,
    "stageId": "design",
    "status": "In Progress",
    "startDate": "2026-11-04",
    "estCompleteDate": "2027-01-18",
    "progress": 45,
    "assignees": [
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 2
  },
  {
    "id": "proj-12",
    "code": "L1400",
    "customerName": "Isaac",
    "city": "Trumbull",
    "state": "CT",
    "kw": 6,
    "stageId": "design",
    "status": "In Progress",
    "startDate": "2026-12-08",
    "estCompleteDate": "2027-03-07",
    "progress": 73,
    "assignees": [
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 4
  },
  {
    "id": "proj-13",
    "code": "M1500",
    "customerName": "August",
    "city": "Tampa",
    "state": "FL",
    "kw": 4,
    "stageId": "design",
    "status": "In Progress",
    "startDate": "2026-01-12",
    "estCompleteDate": "2026-02-19",
    "progress": 21,
    "assignees": [
      {
        "name": "Owen Clarke",
        "id": 2,
        "photoUrl": "https://i.pravatar.cc/150?img=15"
      },
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-14",
    "code": "N1600",
    "customerName": "Olivia",
    "city": "Austin",
    "state": "TX",
    "kw": 11,
    "stageId": "design-hold",
    "status": "In Progress",
    "startDate": "2026-02-13",
    "estCompleteDate": "2026-03-10",
    "progress": 78,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 4
  },
  {
    "id": "proj-15",
    "code": "O1700",
    "customerName": "Ella",
    "city": "Raleigh",
    "state": "NC",
    "kw": 9,
    "stageId": "design-hold",
    "status": "In Progress",
    "startDate": "2026-03-17",
    "estCompleteDate": "2026-04-25",
    "progress": 26,
    "assignees": [
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-16",
    "code": "P1800",
    "customerName": "Zoe",
    "city": "Reno",
    "state": "NV",
    "kw": 10,
    "stageId": "permitting",
    "status": "In Progress",
    "startDate": "2026-04-19",
    "estCompleteDate": "2026-05-24",
    "progress": 20,
    "assignees": [
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-17",
    "code": "Q1900",
    "customerName": "Ruby",
    "city": "Washington",
    "state": "DC",
    "kw": 8,
    "stageId": "permitting",
    "status": "In Review",
    "startDate": "2026-05-23",
    "estCompleteDate": "2026-07-11",
    "progress": 48,
    "assignees": [
      {
        "name": "Riya Shah",
        "id": 6,
        "photoUrl": "https://i.pravatar.cc/150?img=44"
      },
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 2
  },
  {
    "id": "proj-18",
    "code": "R2000",
    "customerName": "Freya",
    "city": "Miami",
    "state": "FL",
    "kw": 6,
    "stageId": "permitting",
    "status": "Completed",
    "startDate": "2026-06-27",
    "estCompleteDate": "2026-08-29",
    "progress": 100,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-19",
    "code": "S2100",
    "customerName": "June",
    "city": "Phoenix",
    "state": "AZ",
    "kw": 4,
    "stageId": "permitting",
    "status": "In Progress",
    "startDate": "2026-07-04",
    "estCompleteDate": "2026-09-19",
    "progress": 24,
    "assignees": [
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 1
  },
  {
    "id": "proj-20",
    "code": "T2200",
    "customerName": "Maya",
    "city": "Phoenix",
    "state": "AZ",
    "kw": 8,
    "stageId": "install-scheduled",
    "status": "Pending",
    "startDate": "2026-08-04",
    "estCompleteDate": "2026-09-28",
    "progress": 64,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 3
  },
  {
    "id": "proj-21",
    "code": "U2300",
    "customerName": "Mia",
    "city": "Reno",
    "state": "NV",
    "kw": 6,
    "stageId": "install-scheduled",
    "status": "Pending",
    "startDate": "2026-09-08",
    "estCompleteDate": "2026-11-16",
    "progress": 92,
    "assignees": [
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-22",
    "code": "V2400",
    "customerName": "Zoe",
    "city": "Washington",
    "state": "DC",
    "kw": 4,
    "stageId": "install-scheduled",
    "status": "Pending",
    "startDate": "2026-10-12",
    "estCompleteDate": "2027-01-03",
    "progress": 40,
    "assignees": [
      {
        "name": "Riya Shah",
        "id": 6,
        "photoUrl": "https://i.pravatar.cc/150?img=44"
      },
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 2
  },
  {
    "id": "proj-23",
    "code": "W2500",
    "customerName": "Ruby",
    "city": "Miami",
    "state": "FL",
    "kw": 11,
    "stageId": "install-scheduled",
    "status": "Pending",
    "startDate": "2026-11-16",
    "estCompleteDate": "2026-12-18",
    "progress": 68,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 3
  },
  {
    "id": "proj-24",
    "code": "X2600",
    "customerName": "Aria",
    "city": "Miami",
    "state": "FL",
    "kw": 6,
    "stageId": "site-survey",
    "status": "Completed",
    "startDate": "2026-12-16",
    "estCompleteDate": "2027-03-01",
    "progress": 100,
    "assignees": [
      {
        "name": "Riya Shah",
        "id": 6,
        "photoUrl": "https://i.pravatar.cc/150?img=44"
      },
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-25",
    "code": "Y2700",
    "customerName": "Wren",
    "city": "Phoenix",
    "state": "AZ",
    "kw": 4,
    "stageId": "site-survey",
    "status": "Completed",
    "startDate": "2026-01-20",
    "estCompleteDate": "2026-04-19",
    "progress": 100,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-26",
    "code": "Z2800",
    "customerName": "Maya",
    "city": "Reno",
    "state": "NV",
    "kw": 11,
    "stageId": "site-survey",
    "status": "Completed",
    "startDate": "2026-02-24",
    "estCompleteDate": "2026-04-03",
    "progress": 100,
    "assignees": [
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-27",
    "code": "A2900",
    "customerName": "Liam",
    "city": "Albany",
    "state": "NY",
    "kw": 9,
    "stageId": "ntp",
    "status": "In Progress",
    "startDate": "2026-03-25",
    "estCompleteDate": "2026-04-19",
    "progress": 61,
    "assignees": [
      {
        "name": "Owen Clarke",
        "id": 2,
        "photoUrl": "https://i.pravatar.cc/150?img=15"
      },
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 3
  },
  {
    "id": "proj-28",
    "code": "B3000",
    "customerName": "Logan",
    "city": "Trumbull",
    "state": "CT",
    "kw": 7,
    "stageId": "ntp",
    "status": "In Progress",
    "startDate": "2026-04-02",
    "estCompleteDate": "2026-05-11",
    "progress": 89,
    "assignees": [
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 4
  },
  {
    "id": "proj-29",
    "code": "C3100",
    "customerName": "Elijah",
    "city": "Lincoln",
    "state": "CA",
    "kw": 8,
    "stageId": "financing",
    "status": "In Progress",
    "startDate": "2026-05-04",
    "estCompleteDate": "2026-06-08",
    "progress": 83,
    "assignees": [
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 4
  },
  {
    "id": "proj-30",
    "code": "D3200",
    "customerName": "Theo",
    "city": "Denver",
    "state": "CO",
    "kw": 6,
    "stageId": "financing",
    "status": "In Progress",
    "startDate": "2026-06-08",
    "estCompleteDate": "2026-07-27",
    "progress": 31,
    "assignees": [
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 2
  },
  {
    "id": "proj-31",
    "code": "E3300",
    "customerName": "Julian",
    "city": "Boise",
    "state": "ID",
    "kw": 4,
    "stageId": "financing",
    "status": "In Progress",
    "startDate": "2026-07-12",
    "estCompleteDate": "2026-09-13",
    "progress": 59,
    "assignees": [
      {
        "name": "Owen Clarke",
        "id": 2,
        "photoUrl": "https://i.pravatar.cc/150?img=15"
      },
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 3
  },
  {
    "id": "proj-32",
    "code": "F3400",
    "customerName": "June",
    "city": "Reno",
    "state": "NV",
    "kw": 11,
    "stageId": "onboarding",
    "status": "Completed",
    "startDate": "2026-08-13",
    "estCompleteDate": "2026-10-02",
    "progress": 100,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-33",
    "code": "G3500",
    "customerName": "Sophia",
    "city": "Washington",
    "state": "DC",
    "kw": 9,
    "stageId": "onboarding",
    "status": "Completed",
    "startDate": "2026-09-17",
    "estCompleteDate": "2026-11-20",
    "progress": 100,
    "assignees": [
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-34",
    "code": "H3600",
    "customerName": "Grace",
    "city": "Miami",
    "state": "FL",
    "kw": 7,
    "stageId": "onboarding",
    "status": "Completed",
    "startDate": "2026-10-21",
    "estCompleteDate": "2027-01-07",
    "progress": 100,
    "assignees": [
      {
        "name": "Riya Shah",
        "id": 6,
        "photoUrl": "https://i.pravatar.cc/150?img=44"
      },
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-35",
    "code": "I3700",
    "customerName": "Wyatt",
    "city": "Tampa",
    "state": "FL",
    "kw": 5,
    "stageId": "closed",
    "status": "Completed",
    "startDate": "2026-11-22",
    "estCompleteDate": "2027-01-26",
    "progress": 100,
    "assignees": [
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-36",
    "code": "J3800",
    "customerName": "Henry",
    "city": "Portland",
    "state": "OR",
    "kw": 12,
    "stageId": "closed",
    "status": "Completed",
    "startDate": "2026-12-26",
    "estCompleteDate": "2027-03-15",
    "progress": 100,
    "assignees": [
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-37",
    "code": "K3900",
    "customerName": "Isaac",
    "city": "Albany",
    "state": "NY",
    "kw": 10,
    "stageId": "closed",
    "status": "Completed",
    "startDate": "2026-01-03",
    "estCompleteDate": "2026-01-31",
    "progress": 100,
    "assignees": [
      {
        "name": "Owen Clarke",
        "id": 2,
        "photoUrl": "https://i.pravatar.cc/150?img=15"
      },
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-38",
    "code": "L4000",
    "customerName": "August",
    "city": "Trumbull",
    "state": "CT",
    "kw": 8,
    "stageId": "closed",
    "status": "Completed",
    "startDate": "2026-02-07",
    "estCompleteDate": "2026-03-21",
    "progress": 100,
    "assignees": [
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-39",
    "code": "M4100",
    "customerName": "Jasper",
    "city": "Trumbull",
    "state": "CT",
    "kw": 12,
    "stageId": "cancelled",
    "status": "Cancelled",
    "startDate": "2026-03-07",
    "estCompleteDate": "2026-05-31",
    "progress": 0,
    "assignees": [
      {
        "name": "Owen Clarke",
        "id": 2,
        "photoUrl": "https://i.pravatar.cc/150?img=15"
      },
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 0
  },
  {
    "id": "proj-40",
    "code": "N4200",
    "customerName": "Ethan",
    "city": "Tampa",
    "state": "FL",
    "kw": 10,
    "stageId": "cancelled",
    "status": "Cancelled",
    "startDate": "2026-04-11",
    "estCompleteDate": "2026-05-15",
    "progress": 0,
    "assignees": [
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 0
  },
  {
    "id": "proj-41",
    "code": "O4300",
    "customerName": "Wyatt",
    "city": "Portland",
    "state": "OR",
    "kw": 8,
    "stageId": "cancelled",
    "status": "Cancelled",
    "startDate": "2026-05-15",
    "estCompleteDate": "2026-07-02",
    "progress": 0,
    "assignees": [
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 0
  },
  {
    "id": "proj-42",
    "code": "P4400",
    "customerName": "Hazel",
    "city": "Raleigh",
    "state": "NC",
    "kw": 6,
    "stageId": "archived",
    "status": "Completed",
    "startDate": "2026-06-16",
    "estCompleteDate": "2026-07-21",
    "progress": 100,
    "assignees": [
      {
        "name": "Riya Shah",
        "id": 6,
        "photoUrl": "https://i.pravatar.cc/150?img=44"
      },
      {
        "name": "Aria Chen",
        "id": 4,
        "photoUrl": "https://i.pravatar.cc/150?img=45"
      },
      {
        "name": "Carter Ibrahim",
        "id": 5,
        "photoUrl": "https://i.pravatar.cc/150?img=13"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  },
  {
    "id": "proj-43",
    "code": "Q4500",
    "customerName": "Willow",
    "city": "Madison",
    "state": "WI",
    "kw": 4,
    "stageId": "archived",
    "status": "Completed",
    "startDate": "2026-07-20",
    "estCompleteDate": "2026-09-07",
    "progress": 100,
    "assignees": [
      {
        "name": "Diana Torres",
        "id": 3,
        "photoUrl": "https://i.pravatar.cc/150?img=47"
      },
      {
        "name": "Blake Sutton",
        "id": 1,
        "photoUrl": "https://i.pravatar.cc/150?img=32"
      }
    ],
    "substagesTotal": 5,
    "substagesCompleted": 5
  }
];
