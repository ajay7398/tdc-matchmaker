// ============================================================
// src/models/user.model.js
// This is not a DB model (no database used here).
// It defines the shape/structure of a matchmaker user account.
// In a real app, this would be a MongoDB/Prisma schema.
// ============================================================

// Hardcoded matchmaker accounts (simulating a database)
// Passwords are stored as plain text here for demo only.
// In production, always hash passwords with bcrypt.
const matchmakers = [
  {
    id: "mm-001",
    name: "Priya Sharma",
    email: "priya@thedatecrew.com",
    password: "matchmaker123", // plain text for demo
    role: "Senior Matchmaker",
    avatar: "PS",
    assignedCustomers: [
      "c001", "c002", "c003", "c004", "c005",
      "c006", "c007", "c008", "c009", "c010",
    ],
  },
  {
    id: "mm-002",
    name: "Arjun Mehta",
    email: "arjun@thedatecrew.com",
    password: "matchmaker123",
    role: "Matchmaker",
    avatar: "AM",
    assignedCustomers: [
      "c011", "c012", "c013", "c014", "c015",
    ],
  },
];

// Helper function to find a matchmaker by their email
export const findMatchmakerByEmail = (email) => {
  return matchmakers.find((m) => m.email === email);
};

// Helper function to find a matchmaker by their ID
export const findMatchmakerById = (id) => {
  return matchmakers.find((m) => m.id === id);
};
