// src/components/ui/MatchScoreBadge.jsx
// Displays the match score (0-100) with a colored label.

const colorMap = {
  green: "score-green",
  blue: "score-blue",
  yellow: "score-yellow",
  red: "score-red",
};

const MatchScoreBadge = ({ score, label, color }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color] || "score-blue"}`}>
    <span className="text-base leading-none">
      {color === "green" ? "⭐" : color === "blue" ? "✨" : color === "yellow" ? "💛" : "📊"}
    </span>
    <span>{label}</span>
    <span className="font-bold">{score}%</span>
  </div>
);

export default MatchScoreBadge;
