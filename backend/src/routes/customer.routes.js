// ============================================================
// src/routes/customer.routes.js
// All routes are protected — user must be logged in.
// ============================================================

import express from "express";
import {
  getMyCustomers,
  getCustomerById,
  updateNotes,
  updateStatus,
} from "../controllers/customer.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply protect middleware to ALL routes in this file
// This means every route below requires a valid JWT cookie
router.use(protect);

// GET /api/customers          → get all customers assigned to matchmaker
router.get("/", getMyCustomers);

// GET /api/customers/:id      → get one customer's full profile
router.get("/:id", getCustomerById);

// PATCH /api/customers/:id/notes   → update notes for a customer
router.patch("/:id/notes", updateNotes);

// PATCH /api/customers/:id/status  → update status for a customer
router.patch("/:id/status", updateStatus);

export default router;
