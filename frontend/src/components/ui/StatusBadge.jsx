// src/components/ui/StatusBadge.jsx
// Reusable component to display customer status as a colored pill.

// Status → CSS class mapping
const statusMap = {
  Active: "badge-active",
  "On Hold": "badge-hold",
  Matched: "badge-matched",
  Inactive: "badge-inactive",
};

const StatusBadge = ({ status }) => (
  <span className={statusMap[status] || "badge-inactive"}>{status}</span>
);

export default StatusBadge;
