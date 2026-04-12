import { useState } from "react";
import { Bell, MapPin, Clock, TrendingUp, Users, Brain, ChevronDown, ChevronUp } from "lucide-react";

const insightCards = [
  {
    title: "You're most productive at 4–6 PM",
    context: "Based on 3 weeks of focus data",
    icon: TrendingUp,
    action: "View patterns",
    color: "primary",
  },
  {
    title: "2 friends are nearby",
    context: "Alex Kim is 5 min away • Maya at Sage Kitchen",
    icon: Users,
    action: "See who's around",
    color: "accent",
  },
  {
    title: "You skipped gym twice this week",
    context: "Your streak is at risk — 3 days left",
    icon: TrendingUp,
    action: "Schedule session",
    color: "secondary",
  },
  {
    title: "This café was rated ★★★★★ by friends",
    context: "2 people in your circle recommended it",
    icon: MapPin,
    action: "View details",
    color: "primary",
  },
];

const quickActions = [
  { label: "Meet", emoji: "🤝" },
  { label: "Plan", emoji: "📅" },
  { label: "Ask", emoji: "💬" },
  { label: "Note", emoji: "📝" },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const Index = () => {
  const [contextOpen, setContextOpen] = useState(false);

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-foreground btn-glow">
            Z
          </div>
          <div>
            <p className="text-base font-bold text-foreground">{getGreeting()}</p>
            <p className="text-xs text-muted-foreground">Here's what matters now</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
        </button>
      </header>

      {/* Insight Cards */}
      <section className="space-y-3 mb-6">
        {insightCards.map((card, i) => (
          <div
            key={i}
            className="glass-card p-4 opacity-0"
            style={{ animation: `fade-in-up 0.5s ease-out ${i * 100}ms forwards` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                card.color === "primary" ? "bg-primary/15" :
                card.color === "accent" ? "bg-accent/15" : "bg-secondary/15"
              }`}>
                <card.icon className={`w-5 h-5 ${
                  card.color === "primary" ? "text-primary" :
                  card.color === "accent" ? "text-accent" : "text-secondary"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground mb-0.5">{card.title}</h3>
                <p className="text-xs text-muted-foreground">{card.context}</p>
              </div>
            </div>
            <button className={`mt-3 text-xs font-semibold px-5 py-2 rounded-full transition-all ${
              card.color === "primary" ? "gradient-primary text-foreground btn-glow" :
              card.color === "accent" ? "gradient-accent text-foreground" :
              "bg-secondary/20 text-secondary hover:bg-secondary/30"
            }`}>
              {card.action}
            </button>
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-medium text-foreground hover:bg-primary/10 transition-all shrink-0"
            >
              <span>{a.emoji}</span>
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {/* Context Panel */}
      <section className="glass-card overflow-hidden">
        <button
          onClick={() => setContextOpen(!contextOpen)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-secondary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Context Panel</span>
          </div>
          {contextOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${contextOpen ? "max-h-60" : "max-h-0"}`}>
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
