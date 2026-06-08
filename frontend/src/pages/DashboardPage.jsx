// src/pages/DashboardPage.jsx
// Main dashboard that shows all customers assigned to the matchmaker.
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import PageLayout from "../components/layout/PageLayout.jsx";
import CustomerCard from "../components/dashboard/CustomerCard.jsx";
import StatsBar from "../components/dashboard/StatsBar.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { fetchMyCustomers } from "../services/customer.service.js";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardPage = () => {
  const { user } = useAuth();

  // State for customer data
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterGender, setFilterGender] = useState("All");

  // Fetch customers when the page loads
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchMyCustomers();
        setCustomers(data.customers);
      } catch {
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter logic: apply search text + status + gender filters
  const filtered = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.designation.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchGender = filterGender === "All" || c.gender === filterGender;

    return matchSearch && matchStatus && matchGender;
  });

  return (
    <PageLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-sans">
            Here are your assigned clients. Click any card to view full details.
          </p>
        </div>

        {/* Stats Summary */}
        {!loading && <StatsBar customers={customers} />}

        {/* Search + Filters Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Search by name, city, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl text-sm px-3 py-2.5 font-sans bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            {["All", "Active", "On Hold", "Matched", "Inactive"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Gender filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="border border-gray-200 rounded-xl text-sm px-3 py-2.5 font-sans bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            {["All", "Male", "Female"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-gray-400 mb-4 font-sans">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {customers.length} clients
          </p>
        )}

        {/* Customer list */}
        {loading ? (
          <Spinner text="Loading your clients..." />
        ) : error ? (
          <div className="text-center py-12 text-red-400 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-300">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-sm font-sans">No clients match your search.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((customer, i) => (
              <CustomerCard key={customer.id} customer={customer} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
