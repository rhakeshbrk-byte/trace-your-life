import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, Clock, TrendingUp, Users, Brain, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const insightCards = [
  {
    title: "You're most productive at 4–6 PM",
    context: "Based on 3 weeks of focus data",
    detail: "Your deep work sessions average 47 minutes during this window. Consider blocking this time for creative tasks.",
    icon: TrendingUp,
    action: "View patterns",
    color: "primary" as const,
    route: "/trace",
  },
  {
    title: "2 friends are nearby",
    context: "Alex Kim is 5 min away • Maya at Sage Kitchen",
    detail: "Alex just finished a workout. Maya has been at Sage Kitchen for 20 minutes. Both are free until 7 PM.",
    icon: Users,
    action: "See who's around",
    color: "accent" as const,
    route: "/people",
  },
  {
    title: "You skipped gym twice this week",
    context: "Your streak is at risk — 3 days left",
    detail: "Your usual gym time is 7–8 AM. Tomorrow has a clear morning slot. Want to schedule it?",
    icon: TrendingUp,
    action: "Schedule session",
    color: "secondary" as const,
    route: null,
  },
  {
    title: "This café was rated ★★★★★ by friends",
    context: "2 people in your circle recommended it",
    detail: "Maya and Jordan both visited Blue Bottle last week and rated it 5 stars. It's 3 minutes from your current location.",
    icon: MapPin,
    action: "View details",
    color: "primary" as const,
    route: null,
  },
];

const quickActions = [
  { label: "Meet", emoji: "🤝", route: "/people" },
  { label: "Plan", emoji: "📅", route: "/trace" },
  { label: "Ask", emoji: "💬", route: "/messages" },
  { label: "Note", emoji: "📝", route: null },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const Index = () => {
  const [contextOpen, setContextOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardAction = (card: typeof insightCards[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.route) {
      navigate(card.route);
    } else {
      toast({ title: card.action, description: "This feature is coming soon" });
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.route) {
      navigate(action.route);
    } else {
      toast({ title: `${action.emoji} ${action.label}`, description: "Quick note saved" });
    }
  };

  const toggleCard = (i: number) => {
    setExpandedCard(expandedCard === i ? null : i);
  };

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-foreground btn-glow"
          >
            Z
          </button>
          <div>
            <p className="text-base font-bold text-foreground">{getGreeting()}</p>
            <p className="text-xs text-muted-foreground">Here's what matters now</p>
          </div>
        </div>
        <button
          onClick={() => toast({ title: "No new notifications", description: "You're all caught up" })}
          className="w-10 h-10 rounded-full btn-glass flex items-center justify-center relative"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" style={{ animation: 'glow-breathe 2s ease-in-out infinite' }} />
        </button>
      </header>

      {/* Insight Cards — expandable */}
      <section className="space-y-3 mb-6">
        {insightCards.map((card, i) => (
          <div
            key={i}
            onClick={() => toggleCard(i)}
            className="glass-card-elevated p-4 cursor-pointer opacity-0 expand-card"
            style={{ animation: `fade-in-up 0.5s ease-out ${i * 100}ms forwards` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                card.color === "primary" ? "bg-primary/15" :
                card.color === "accent" ? "bg-accent/15" : "bg-secondary/15"
              } ${expandedCard === i ? "scale-110" : ""}`}>
                <card.icon className={`w-5 h-5 transition-all duration-300 ${
                  card.color === "primary" ? "text-primary" :
                  card.color === "accent" ? "text-accent" : "text-secondary"
                } ${expandedCard === i ? "drop-shadow-[0_0_6px_currentColor]" : ""}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground mb-0.5">{card.title}</h3>
                <p className="text-xs text-muted-foreground">{card.context}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${expandedCard === i ? "rotate-180" : ""}`} />
            </div>

            {/* Expanded content */}
            <div className={`transition-all duration-400 ease-in-out overflow-hidden ${expandedCard === i ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
              <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.detail}</p>
                </div>
                <button
                  onClick={(e) => handleCardAction(card, e)}
                  className={`text-xs font-semibold px-5 py-2 rounded-full transition-all ${
                    card.color === "primary" ? "gradient-primary text-foreground btn-glow" :
                    card.color === "accent" ? "gradient-accent text-foreground btn-glow" :
                    "bg-secondary/20 text-secondary hover:bg-secondary/30"
                  }`}
                >
                  {card.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => handleQuickAction(a)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-medium text-foreground pill-interactive shrink-0"
            >
              <span>{a.emoji}</span>
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {/* Context Panel */}
      <section className="glass-card-elevated overflow-hidden">
        <button
          onClick={() => setContextOpen(!contextOpen)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-secondary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Context Panel</span>
          </div>
          {contextOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" />
          )}
        </button>
        <div className={`transition-all duration-400 ease-in-out ${contextOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Downtown — Blue Bottle Coffee area</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Your next free window: 6–8 PM today</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Suggestion: Take a 10 min walk — you've been sitting 3h</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
