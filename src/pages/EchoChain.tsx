import { useState, useEffect } from "react";
import { ArrowLeft, Clock, ChevronRight, Plus, Users, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChainContribution {
  id: number;
  author: string;
  initial: string;
  content: string;
  color: string;
  isCurrent?: boolean;
}

interface Chain {
  id: number;
  title: string;
  status: "active" | "completed" | "dead";
  timeLeft: number; // seconds
  participants: { initial: string; color: string }[];
  contributions: ChainContribution[];
  myTurn: boolean;
}

const initialChains: Chain[] = [
  {
    id: 1, title: "What does friendship mean?", status: "active", timeLeft: 3600, myTurn: true,
    participants: [
      { initial: "A", color: "from-indigo-500 to-blue-500" },
      { initial: "S", color: "from-purple-500 to-pink-500" },
      { initial: "M", color: "from-emerald-500 to-teal-500" },
    ],
    contributions: [
      { id: 1, author: "Alex", initial: "A", content: "Friendship is showing up when it's inconvenient.", color: "from-indigo-500 to-blue-500" },
      { id: 2, author: "Sam", initial: "S", content: "It's knowing someone's dark side and staying anyway.", color: "from-purple-500 to-pink-500" },
    ],
  },
  {
    id: 2, title: "A song that changed your life", status: "active", timeLeft: 7200, myTurn: false,
    participants: [
      { initial: "P", color: "from-orange-500 to-red-500" },
      { initial: "J", color: "from-yellow-400 to-orange-500" },
    ],
    contributions: [
      { id: 1, author: "Priya", initial: "P", content: "Breathe Me by Sia. Heard it at the lowest point. Made me feel less alone.", color: "from-orange-500 to-red-500" },
    ],
  },
  {
    id: 3, title: "Describe your perfect day", status: "completed", timeLeft: 0, myTurn: false,
    participants: [
      { initial: "A", color: "from-indigo-500 to-blue-500" },
      { initial: "M", color: "from-emerald-500 to-teal-500" },
      { initial: "J", color: "from-yellow-400 to-orange-500" },
    ],
    contributions: [
      { id: 1, author: "Alex", initial: "A", content: "Wake up with no alarm. Coffee on the roof.", color: "from-indigo-500 to-blue-500" },
      { id: 2, author: "Maya", initial: "M", content: "A long walk in the rain with good music.", color: "from-emerald-500 to-teal-500" },
      { id: 3, author: "Jordan", initial: "J", content: "Painting until 3 AM, feeling completely in the zone.", color: "from-yellow-400 to-orange-500" },
    ],
  },
  {
    id: 4, title: "Your biggest fear", status: "dead", timeLeft: 0, myTurn: false,
    participants: [{ initial: "S", color: "from-purple-500 to-pink-500" }],
    contributions: [
      { id: 1, author: "Sam", initial: "S", content: "Being forgotten by the people I love most.", color: "from-purple-500 to-pink-500" },
    ],
  },
];

const formatCountdown = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const EchoChain = () => {
  const { toast } = useToast();
  const [chains, setChains] = useState(initialChains);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [replyText, setReplyText] = useState("");

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setChains(prev => prev.map(c =>
        c.status === "active" && c.timeLeft > 0
          ? { ...c, timeLeft: c.timeLeft - 1 }
          : c.timeLeft <= 0 && c.status === "active"
            ? { ...c, status: "dead" as const }
            : c
      ));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (!replyText.trim() || !selectedChain) return;
    const updated = {
      ...selectedChain,
      contributions: [...selectedChain.contributions, {
        id: selectedChain.contributions.length + 1,
        author: "You", initial: "Y", content: replyText.trim(),
        color: "from-blue-500 to-indigo-500", isCurrent: true,
      }],
      myTurn: false,
    };
    setChains(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedChain(updated);
    setReplyText("");
    toast({ title: "Chain continued!", description: "Your contribution has been added" });
  };

  const statusStyle = (s: string) => {
    if (s === "active") return "text-accent";
    if (s === "completed") return "text-muted-foreground";
    return "text-muted-foreground/50";
  };

  // Chain detail
  if (selectedChain) {
    return (
      <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
        <button onClick={() => setSelectedChain(null)} className="flex items-center gap-1 text-xs text-muted-foreground mb-4 haptic-press">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-5 opacity-0" style={{ animation: "fade-in-up 0.4s ease-out forwards" }}>
          <h2 className="text-base font-bold text-foreground mb-1">{selectedChain.title}</h2>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {selectedChain.participants.map((p, i) => (
                <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-[8px] font-bold text-foreground border border-background`}>
                  {p.initial}
                </div>
              ))}
            </div>
            {selectedChain.status === "active" && (
              <span className="text-[10px] text-accent flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatCountdown(selectedChain.timeLeft)} left
              </span>
            )}
            {selectedChain.status === "completed" && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Check className="w-3 h-3" /> Completed</span>}
            {selectedChain.status === "dead" && <span className="text-[10px] text-muted-foreground/50">Expired</span>}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 mb-6">
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 timeline-line rounded-full" />
          {selectedChain.contributions.map((c, i) => (
            <div
              key={c.id}
              className="relative mb-4 opacity-0"
              style={{ animation: `fade-in-up 0.4s ease-out ${i * 100}ms forwards` }}
            >
              <div className={`absolute -left-[14px] top-1 w-5 h-5 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-[8px] font-bold text-foreground border-2 border-background ${c.isCurrent ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""}`}>
                {c.initial}
              </div>
              <div className={`glass-card${c.isCurrent ? "-elevated" : ""} p-3 rounded-xl ${c.isCurrent ? "border-primary/20" : ""}`}
                style={c.isCurrent ? { boxShadow: "0 0 20px rgba(99,102,241,0.15)" } : undefined}
              >
                <p className="text-xs text-muted-foreground mb-1">{c.author}</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue input */}
        {selectedChain.status === "active" && selectedChain.myTurn && (
          <div className="opacity-0" style={{ animation: "fade-in-up 0.4s ease-out 400ms forwards" }}>
            <p className="text-xs text-primary font-medium mb-2">✨ It's your turn</p>
            <div className="flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleContinue()}
                placeholder="Continue the chain..."
                className="flex-1 bg-muted/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/50 focus:border-primary/50"
              />
              <button onClick={handleContinue} className="px-4 rounded-xl gradient-primary text-foreground haptic-press btn-glow">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Chain list
  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-foreground mb-1">🔗 Echo Chain</h1>
          <p className="text-xs text-muted-foreground">Pass thoughts forward, build on each other</p>
        </div>
        <button
          onClick={() => toast({ title: "New Chain", description: "Start a new echo chain with your circle" })}
          className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center btn-glow haptic-press"
        >
          <Plus className="w-4 h-4 text-foreground" />
        </button>
      </header>

      <div className="space-y-3">
        {chains.map((chain, i) => (
          <button
            key={chain.id}
            onClick={() => setSelectedChain(chain)}
            className={`w-full text-left glass-card-elevated p-4 opacity-0 haptic-press ${chain.status === "dead" ? "opacity-50" : ""}`}
            style={{ animation: `fade-in-up 0.4s ease-out ${i * 80}ms forwards` }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground flex-1 mr-2">{chain.title}</h3>
              {chain.myTurn && chain.status === "active" && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full gradient-primary text-foreground">YOUR TURN</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {chain.participants.map((p, pi) => (
                    <div key={pi} className={`w-6 h-6 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-[8px] font-bold text-foreground border border-background`}>
                      {p.initial}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">{chain.contributions.length} contributions</span>
              </div>
              <div className="flex items-center gap-1.5">
                {chain.status === "active" && (
                  <span className="text-[10px] text-accent flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatCountdown(chain.timeLeft)}
                  </span>
                )}
                <span className={`text-[10px] capitalize ${statusStyle(chain.status)}`}>
                  {chain.status === "dead" ? "expired" : chain.status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EchoChain;
