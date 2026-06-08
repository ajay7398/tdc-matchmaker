// src/components/dashboard/CustomerCard.jsx
// Displays a single customer as a clickable card in the dashboard.
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, ChevronRight, Heart } from "lucide-react";
import StatusBadge from "../ui/StatusBadge.jsx";

// Helper to get initials for avatar
const getInitials = (first, last) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

// Soft background colors for avatars (cycles based on index)
const avatarColors = [
  "bg-rose-100 text-rose-600",
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
];

const CustomerCard = ({ customer, index }) => {
  const navigate = useNavigate();
  const colorClass = avatarColors[index % avatarColors.length];

  return (
    <div
      onClick={() => navigate(`/customer/${customer.id}`)}
      className="bg-white rounded-2xl border border-rose-50 p-5 cursor-pointer card-hover group"
    >
      <div className="flex items-center gap-4">
        {/* Avatar with initials */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-sans shrink-0 ${colorClass}`}
        >
          {getInitials(customer.firstName, customer.lastName)}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 font-sans">
              {customer.firstName} {customer.lastName}
            </h3>
            <StatusBadge status={customer.status} />
          </div>

          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} />
              {customer.city}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Briefcase size={11} />
              {customer.designation}
            </span>
            <span className="text-xs text-gray-400">
              {customer.age} yrs • {customer.gender}
            </span>
          </div>
        </div>

        {/* Arrow icon on the right */}
        <ChevronRight
          size={18}
          className="text-gray-300 group-hover:text-rose-400 transition-colors shrink-0"
        />
      </div>

      {/* Notes preview */}
      {customer.notes && (
        <p className="mt-3 text-xs text-gray-400 line-clamp-1 pl-16">
          📝 {customer.notes}
        </p>
      )}
    </div>
  );
};

export default CustomerCard;
