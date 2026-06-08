

import { findCustomerById } from "../models/customer.model.js";
import { getFemaleProfiles, getMaleProfiles } from "../models/matchPool.model.js";
import { scoreMatches } from "../services/matching.service.js";

// GET /api/matches/:customerId
export const getMatchesForCustomer = (req, res) => {
  const { customerId } = req.params;

  // 1. Security check: matchmaker must own this customer
  if (!req.user.assignedCustomers.includes(customerId)) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this customer.",
    });
  }

  // 2. Find the customer
  const customer = findCustomerById(customerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }


  const pool = customer.gender === "Male" ? getFemaleProfiles() : getMaleProfiles();

  // 4. Run matching algorithm
  const matches = scoreMatches(customer, pool);

  res.status(200).json({
    success: true,
    customer: {
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      gender: customer.gender,
    },
    totalMatches: matches.length,
    matches,
  });
};


export const sendMatch = (req, res) => {
  const { customerId, matchId, introText } = req.body;

  if (!customerId || !matchId) {
    return res.status(400).json({
      success: false,
      message: "customerId and matchId are required.",
    });
  }

  // Simulate email sending
  console.log(`📧 Match sent: Customer ${customerId} → Match ${matchId}`);
  console.log(`   Intro: ${introText}`);

  res.status(200).json({
    success: true,
    message: "Match details sent successfully! (Mock email triggered)",
    data: {
      customerId,
      matchId,
      sentAt: new Date().toISOString(),
      status: "email_queued",
    },
  });
};
