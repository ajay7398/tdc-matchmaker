// src/services/match.service.js
// Functions for match and AI API endpoints.
import api from "./api.js";

export const fetchMatches = (customerId) =>
  api.get(`/matches/${customerId}`);

export const sendMatch = (customerId, matchId, introText) =>
  api.post("/matches/send", { customerId, matchId, introText });

export const generateIntro = (customer, match) =>
  api.post("/ai/intro", { customer, match });

export const explainMatch = (customer, match, score) =>
  api.post("/ai/explain", { customer, match, score });
