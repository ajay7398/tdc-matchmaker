// ============================================================
// src/routes/match.routes.js
// Routes for finding and sending matches.
// ============================================================

import express from "express";
import { getMatchesForCustomer, sendMatch } from "../controllers/match.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// GET /api/matches/:customerId  → get ranked match list for a customer
router.get("/:customerId", getMatchesForCustomer);

// POST /api/matches/send        → send a match to the customer (mock email)
router.post("/send", sendMatch);

export default router;
