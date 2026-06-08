// src/components/dashboard/StatsBar.jsx
// Shows summary stats at the top of the dashboard.
import { Users, CheckCircle, Clock, Heart } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-rose-50 p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 font-sans">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

const StatsBar = ({ customers }) => {
  // Count customers by status
  const active = customers.filter((c) => c.status === "Active").length;
  const matched = customers.filter((c) => c.status === "Matched").length;
  const onHold = customers.filter((c) => c.status === "On Hold").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={Users} label="Total Clients" value={customers.length} color="bg-rose-100 text-rose-500" />
      <StatCard icon={CheckCircle} label="Active" value={active} color="bg-emerald-100 text-emerald-500" />
      <StatCard icon={Heart} label="Matched" value={matched} color="bg-purple-100 text-purple-500" />
      <StatCard icon={Clock} label="On Hold" value={onHold} color="bg-amber-100 text-amber-500" />
    </div>
  );
};

export default StatsBar;
