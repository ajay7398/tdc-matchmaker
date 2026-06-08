// src/pages/MatchesPage.jsx
// Shows the AI-scored match pool for a specific customer.
// Matchmakers can generate AI intros and send matches from here.
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, SlidersHorizontal } from "lucide-react";
import PageLayout from "../components/layout/PageLayout.jsx";
import MatchCard from "../components/match/MatchCard.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { fetchCustomerById } from "../services/customer.service.js";
import { fetchMatches } from "../services/match.service.js";
import toast from "react-hot-toast";

const MatchesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLabel, setFilterLabel] = useState("All");

  // Load both customer info and their matches
  useEffect(() => {
    const load = async () => {
      try {
        // Fetch customer and matches in parallel for speed
        const [custRes, matchRes] = await Promise.all([
          fetchCustomerById(id),
          fetchMatches(id),
        ]);
        setCustomer(custRes.data.customer);
        setMatches(matchRes.data.matches);
      } catch {
        toast.error("Failed to load matches.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Filter matches by label (High Potential, Good Match, etc.)
  const filteredMatches = filterLabel === "All"
    ? matches
    : matches.filter((m) => m.matchLabel === filterLabel);

  // Count how many matches exist for each label
  const labelCounts = matches.reduce((acc, m) => {
    acc[m.matchLabel] = (acc[m.matchLabel] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <PageLayout><Spinner text="Finding best matches..." /></PageLayout>;

  return (
    <PageLayout>
      <div className="p-8 max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => navigate(`/customer/${id}`)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-rose-400" />
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              Suggested Matches
            </h1>
          </div>
          {customer && (
            <p className="text-gray-400 text-sm font-sans">
              Showing top matches for{" "}
              <span className="font-semibold text-gray-600">
                {customer.firstName} {customer.lastName}
              </span>{" "}
              · {customer.age} yrs · {customer.city}
            </p>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <SlidersHorizontal size={14} className="text-gray-300" />
          {["All", "High Potential", "Good Match", "Possible Match", "Low Compatibility"].map(
            (label) => (
              <button
                key={label}
                onClick={() => setFilterLabel(label)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                  filterLabel === label
                    ? "bg-rose-500 text-white border-rose-500"
                    : "border-gray-200 text-gray-500 hover:border-rose-300"
                }`}
              >
                {label}
                {label !== "All" && labelCounts[label] ? (
                  <span className="ml-1.5 opacity-70">({labelCounts[label]})</span>
                ) : label === "All" ? (
                  <span className="ml-1.5 opacity-70">({matches.length})</span>
                ) : null}
              </button>
            )
          )}
        </div>

        {/* Match Cards Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 text-gray-300">
            <p className="text-5xl mb-3">💔</p>
            <p className="text-sm font-sans">No matches in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMatches.map((match, i) => (
              <MatchCard
                key={match.id}
                match={match}
                customer={customer}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MatchesPage;
