import { useState } from "react";
import { Heart, MessageSquare, Eye, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { label: "All", emoji: "✨", gradient: "from-primary to-secondary" },
  { label: "Grinding", emoji: "💪", gradient: "from-orange-500 to-red-500" },
  { label: "Lost", emoji: "🌧️", gradient: "from-blue-500 to-indigo-500" },
  { label: "Hyped", emoji: "🔥", gradient: "from-yellow-400 to-orange-500" },
  { label: "Healing", emoji: "🌿", gradient: "from-emerald-500 to-teal-500" },
  { label: "Creative", emoji: "🎨", gradient: "from-purple-500 to-pink-500" },
];

const posts = [
  { id: 1, mood: "Grinding", content: "3 AM and still going. This project won't finish itself but I'm getting closer every hour.", timeAgo: "12m", reactions: false },
  { id: 2, mood: "Lost", content: "Does anyone else feel like they're just pretending to have it together? Asking for myself.", timeAgo: "28m", reactions: false },
  { id: 3, mood: "Hyped", content: "JUST GOT ACCEPTED!! I can't believe this is real 😭🎉", timeAgo: "1h", reactions: false },
  { id: 4, mood: "Healing", content: "Went on a walk without my phone today. The sky was really beautiful. That's it. That's the post.", timeAgo: "2h", reactions: false },
  { id: 5, mood: "Creative", content: "Started writing a song about how weird it is to exist. It's either going to be really good or really bad.", timeAgo: "3h", reactions: false },
  { id: 6, mood: "Grinding", content: "Failed the test. Gonna study harder. No other option.", timeAgo: "4h", reactions: false },
];

const moodColors: Record<string, string> = {
  Grinding: "from-orange-500 to-red-500",
  Lost: "from-blue-500 to-indigo-500",
  Hyped: "from-yellow-400 to-orange-500",
  Healing: "from-emerald-500 to-teal-500",
  Creative: "from-purple-500 to-pink-500",
};

const Index = () => {
  const [activeMood, setActiveMood] = useState("All");
  const [reacted, setReacted] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const filtered = activeMood === "All" ? posts : posts.filter(p => p.mood === activeMood);

  const handleReact = (id: number) => {
    setReacted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-foreground">Zentro</h1>
          <p className="text-xs text-muted-foreground">Express yourself freely</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast({ title: "Real Talk", description: "Anonymous space coming soon" })}
            className="px-3 py-1.5 rounded-full text-xs font-medium btn-glass text-muted-foreground"
          >
            🤫 Real Talk
          </button>
        </div>
      </header>

      {/* Mood Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 -mx-1 px-1">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => setActiveMood(m.label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all duration-300 ${
              activeMood === m.label
                ? `bg-gradient-to-r ${m.gradient} text-foreground shadow-lg scale-105`
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <section className="space-y-3">
        {filtered.map((post, i) => (
          <div
            key={post.id}
            className="glass-card-elevated p-4 opacity-0"
            style={{ animation: `fade-in-up 0.4s ease-out ${i * 80}ms forwards` }}
          >
            {/* Post header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-muted/50 backdrop-blur-sm flex items-center justify-center text-xs">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">anonymous · {post.timeAgo}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${moodColors[post.mood]} text-foreground`}>
                {post.mood}
              </span>
            </div>

            {/* Content */}
            <p className="text-sm text-foreground/90 leading-relaxed mb-3">{post.content}</p>

            {/* Actions — no counts */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleReact(post.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all duration-300 ${
                  reacted.has(post.id)
                    ? "bg-pink-500/20 text-pink-400"
                    : "btn-glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${reacted.has(post.id) ? "fill-current" : ""}`} />
                Feel this
              </button>
              <button
                onClick={() => toast({ title: "Reply", description: "Replies coming soon" })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs btn-glass text-muted-foreground hover:text-foreground transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Reply
              </button>
              <button
                onClick={() => toast({ title: "Reveal", description: "You chose to stay anonymous" })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs btn-glass text-muted-foreground hover:text-foreground transition-all ml-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                Reveal
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Index;
