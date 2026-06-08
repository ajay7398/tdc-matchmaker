// src/components/match/MatchCard.jsx
// Displays one suggested match profile with score, info, and action buttons.
import { useState } from "react";
import { MapPin, Briefcase, GraduationCap, Sparkles, Send } from "lucide-react";
import MatchScoreBadge from "../ui/MatchScoreBadge.jsx";
import { generateIntro, sendMatch } from "../../services/match.service.js";
import toast from "react-hot-toast";

// Format income in Indian format (e.g., ₹22L, ₹3.5Cr)
const formatIncome = (income) => {
  if (income >= 10000000) return `₹${(income / 10000000).toFixed(1)}Cr/yr`;
  if (income >= 100000) return `₹${(income / 100000).toFixed(1)}L/yr`;
  return `₹${income.toLocaleString("en-IN")}/yr`;
};

const avatarColors = [
  "bg-rose-100 text-rose-600",
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-teal-100 text-teal-600",
  "bg-orange-100 text-orange-600",
];

const MatchCard = ({ match, customer, index }) => {
  const [intro, setIntro] = useState("");
  const [loadingIntro, setLoadingIntro] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const colorClass = avatarColors[index % avatarColors.length];

  // Call AI to generate a personalized intro email
  const handleGenerateIntro = async () => {
    setLoadingIntro(true);
    setExpanded(true);
    try {
      const { data } = await generateIntro(customer, match);
      setIntro(data.intro);
    } catch {
      toast.error("AI intro generation failed.");
    } finally {
      setLoadingIntro(false);
    }
  };

  // Send the match (mock email)
  const handleSendMatch = async () => {
    setSending(true);
    try {
      await sendMatch(customer.id, match.id, intro);
      setSent(true);
      toast.success(`Match sent to ${customer.firstName}! 💌`);
    } catch {
      toast.error("Failed to send match.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border p-5 card-hover transition-all ${sent ? "border-emerald-200 bg-emerald-50/30" : "border-rose-50"}`}>
      {/* Header row */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-sans shrink-0 ${colorClass}`}>
          {match.firstName[0]}{match.lastName[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 font-sans">
              {match.firstName} {match.lastName}
            </h3>
            <MatchScoreBadge
              score={match.matchScore}
              label={match.matchLabel}
              color={match.matchColor}
            />
          </div>

          {/* Match reason */}
          <p className="text-xs text-gray-400 mt-0.5">
            🎯 {match.matchReason}
          </p>

          {/* Key info row */}
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={11} /> {match.city}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Briefcase size={11} /> {match.designation}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <GraduationCap size={11} /> {match.degree}
            </span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-gray-400 mb-0.5">Age</p>
          <p className="font-semibold text-gray-700">{match.age} yrs</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-gray-400 mb-0.5">Income</p>
          <p className="font-semibold text-gray-700">{formatIncome(match.income)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-gray-400 mb-0.5">Height</p>
          <p className="font-semibold text-gray-700">{match.height} cm</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-gray-400 mb-0.5">Religion</p>
          <p className="font-semibold text-gray-700">{match.religion}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-gray-400 mb-0.5">Diet</p>
          <p className="font-semibold text-gray-700">{match.diet}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-gray-400 mb-0.5">Kids</p>
          <p className="font-semibold text-gray-700">{match.wantKids}</p>
        </div>
      </div>

      {/* AI Intro section */}
      {expanded && (
        <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
          <p className="text-xs font-semibold text-rose-500 mb-2">✨ AI-Generated Intro Email</p>
          {loadingIntro ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
              Generating personalized intro...
            </div>
          ) : (
            <p className="text-xs text-gray-600 leading-relaxed font-sans">{intro}</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        {/* AI Intro button */}
        {!sent && (
          <button
            onClick={handleGenerateIntro}
            disabled={loadingIntro}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-rose-200 text-rose-500 hover:bg-rose-50 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <Sparkles size={13} />
            {intro ? "Regenerate Intro" : "AI Intro"}
          </button>
        )}

        {/* Send Match button */}
        <button
          onClick={handleSendMatch}
          disabled={sending || sent}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-colors ${
            sent
              ? "bg-emerald-100 text-emerald-600 cursor-default"
              : "bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
          }`}
        >
          <Send size={13} />
          {sent ? "✓ Match Sent!" : sending ? "Sending..." : "Send Match"}
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
