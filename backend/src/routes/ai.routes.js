// ============================================================
// src/routes/ai.routes.js
// Routes for OpenAI-powered features.
// ============================================================

import express from "express";
import { generateIntro, explainMatch } from "../controllers/ai.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// POST /api/ai/intro   → generate personalized intro email
router.post("/intro", generateIntro);

// POST /api/ai/explain → get AI explanation for a match score
router.post("/explain", explainMatch);

export default router;
