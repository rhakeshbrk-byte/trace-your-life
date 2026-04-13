import { Search, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const people = [
  { id: "alex", name: "Alex Kim", initials: "AK", tag: "📍 Nearby", detail: "5 min away", color: "primary" as const },
  { id: "maya", name: "Maya Ross", initials: "MR", tag: "☕ Same routine", detail: "Both at Blue Bottle often", color: "secondary" as const },
  { id: "sam", name: "Sam Chen", initials: "SC", tag: "🏃 Same routine", detail: "Runs same trail", color: "primary" as const },
  { id: "priya", name: "Priya Sharma", initials: "PS", tag: "✈️ Trip planned", detail: "Ooty trip in May", color: "secondary" as const },
  { id: "jordan", name: "Jordan Lee", initials: "JL", tag: "📍 Nearby", detail: "At same co-working", color: "primary" as const },
  { id: "nina", name: "Nina Patel", initials: "NP", tag: "🧠 Similar interests", detail: "AI & startups", color: "secondary" as const },
];

const People = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = people.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-foreground mb-1">People</h1>
        <p className="text-xs text-muted-foreground">Relevant people around you</p>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people..."
          className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground glass-card focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((person, i) => (
          <div
            key={person.id}
            className="glass-card-elevated p-4 flex items-center gap-3 opacity-0 group"
            style={{ animation: `fade-in-up 0.5s ease-out ${i * 80}ms forwards` }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 group-hover:scale-110 ${
              person.color === "primary" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
            }`}>
              {person.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{person.name}</p>
              <p className="text-xs text-muted-foreground">{person.detail}</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary/80 mt-1 inline-block">
                {person.tag}
              </span>
            </div>
            <button
              onClick={() => navigate(`/messages/${person.id}`)}
              className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0 btn-glow"
            >
              <MessageCircle className="w-4 h-4 text-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
