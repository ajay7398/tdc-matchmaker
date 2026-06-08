

import { findCustomerById, getCustomersByIds } from "../models/customer.model.js";

// GET /api/customers
export const getMyCustomers = (req, res) => {

  const customerIds = req.user.assignedCustomers;

 
  const customers = getCustomersByIds(customerIds);

  res.status(200).json({
    success: true,
    count: customers.length,
    customers,
  });
};

// GET /api/customers/:id
export const getCustomerById = (req, res) => {
  const { id } = req.params;

  if (!req.user.assignedCustomers.includes(id)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to view this customer.",
    });
  }

  const customer = findCustomerById(id);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }

  res.status(200).json({
    success: true,
    customer,
  });
};

export const updateNotes = (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!req.user.assignedCustomers.includes(id)) {
    return res.status(403).json({
      success: false,
      message: "Permission denied.",
    });
  }

 
  res.status(200).json({
    success: true,
    message: "Notes updated successfully.",
    customerId: id,
    notes,
  });
};


// PATCH /api/customers/:id/status
export const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Valid status options
  const validStatuses = ["Active", "On Hold", "Matched", "Inactive"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  if (!req.user.assignedCustomers.includes(id)) {
    return res.status(403).json({
      success: false,
      message: "Permission denied.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Status updated successfully.",
    customerId: id,
    status,
  });
};
