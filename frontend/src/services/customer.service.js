// src/services/customer.service.js
// Functions that call backend customer API endpoints.
import api from "./api.js";

export const fetchMyCustomers = () => api.get("/customers");
export const fetchCustomerById = (id) => api.get(`/customers/${id}`);
export const updateCustomerNotes = (id, notes) =>
  api.patch(`/customers/${id}/notes`, { notes });
export const updateCustomerStatus = (id, status) =>
  api.patch(`/customers/${id}/status`, { status });
