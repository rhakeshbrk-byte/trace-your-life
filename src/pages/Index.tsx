import { Brain, MapPin, Camera, MessageCircle, Clock, Zap, Users, Shield, TrendingUp, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const insightMessages = [
  "You focus best at Blue Bottle Coffee between 4–6 PM",
  "Last time you met Sarah, you discussed AI startups",
  "You skipped gym 3 times this week — streak at risk",
  "This place you're near has 2 friends who rated it ★★★★★",
  "Your sleep improved 12% since switching to evening walks",
  "You tend to eat healthier on days you work from home",
];

const timelineEvents = [
  { time: "9:15 AM", label: "Arrived at workspace", icon: MapPin, type: "location" },
  { time: "10:30 AM", label: "Deep focus session — 2h 15m", icon: Brain, type: "pattern" },
  { time: "12:45 PM", label: "Lunch at Sage Kitchen", icon: TrendingUp, type: "habit" },
  { time: "2:00 PM", label: "Met with Alex — discussed funding", icon: MessageCircle, type: "social" },
  { time: "4:30 PM", label: "Creative peak detected", icon: Sparkles, type: "insight" },
];

const InsightCard = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentInsight((prev) => (prev + 1) % insightMessages.length);
        setIsVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card glow-green p-6 col-span-1 md:col-span-2 row-span-1 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">Live Insight</span>
      </div>
      <p
        className={`text-lg font-body text-foreground transition-all duration-400 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        "{insightMessages[currentInsight]}"
      </p>
    </div>
  );
};

const TimelineCard = () => (
  <div className="glass-card p-6 col-span-1 row-span-1 md:row-span-2 overflow-hidden">
    <div className="flex items-center gap-2 mb-5">
      <Clock className="w-4 h-4 text-primary" />
      <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">Today's Timeline</span>
    </div>
    <div className="space-y-4">
      {timelineEvents.map((event, i) => (
        <div key={i} className="flex items-start gap-3 group">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <event.icon className="w-4 h-4 text-primary" />
            </div>
            {i < timelineEvents.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
          </div>
          <div className="pt-1">
            <p className="text-xs text-muted-foreground font-heading">{event.time}</p>
            <p className="text-sm text-foreground font-body">{event.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DecisionCard = () => (
  <div className="glass-card glow-purple p-6 col-span-1 row-span-1">
    <div className="flex items-center gap-2 mb-4">
      <Zap className="w-4 h-4 text-secondary" />
      <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">Decision Engine</span>
    </div>
    <p className="text-sm text-muted-foreground font-body mb-3">Based on your patterns right now:</p>
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
        <span className="text-sm font-body text-foreground">🍜 Ramen spot — 4 min walk</span>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
        <span className="text-sm font-body text-foreground">☕ Focus café — you peak here at 4 PM</span>
      </div>
    </div>
  </div>
);

const SocialCard = () => (
  <div className="glass-card p-6 col-span-1 row-span-1">
    <div className="flex items-center gap-2 mb-4">
      <Users className="w-4 h-4 text-primary" />
      <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">Nearby</span>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-heading text-primary">
          AK
        </div>
        <div>
          <p className="text-sm font-body text-foreground">Alex Kim</p>
          <p className="text-xs text-muted-foreground">Shares your gym routine</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-heading text-secondary">
          MR
        </div>
        <div>
          <p className="text-sm font-body text-foreground">Maya Ross</p>
          <p className="text-xs text-muted-foreground">~5 min away</p>
        </div>
      </div>
    </div>
  </div>
);

const MemoryCard = () => (
  <div className="glass-card p-6 col-span-1 row-span-1">
    <div className="flex items-center gap-2 mb-4">
      <Brain className="w-4 h-4 text-secondary" />
      <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">Memory Assist</span>
    </div>
    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
      <p className="text-xs text-muted-foreground font-heading mb-1">About Alex Kim</p>
      <p className="text-sm text-foreground font-body">Met at TechCrunch '25. Into startups & fitness. Last chat: Series A fundraising tips.</p>
    </div>
  </div>
);

const StatsRow = () => (
  <div className="glass-card p-6 col-span-1 md:col-span-2 row-span-1">
    <div className="flex items-center gap-2 mb-4">
      <TrendingUp className="w-4 h-4 text-primary" />
      <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">Weekly Patterns</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Focus hours", value: "18.5h", change: "+2.3h" },
        { label: "Places visited", value: "12", change: "+3" },
        { label: "People met", value: "8", change: "−1" },
        { label: "Decisions helped", value: "23", change: "+7" },
      ].map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl font-heading text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
          <p className="text-xs text-primary font-heading mt-1">{stat.change}</p>
        </div>
      ))}
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-green">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading text-gradient">Trace</h1>
            <p className="text-xs text-muted-foreground font-body">Your brain, upgraded</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-heading text-primary">Tracing</span>
          </div>
          <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <Shield className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
        {[
          <InsightCard key="insight" />,
          <TimelineCard key="timeline" />,
          <DecisionCard key="decision" />,
          <SocialCard key="social" />,
          <MemoryCard key="memory" />,
          <StatsRow key="stats" />,
        ].map((card, i) => (
          <div
            key={i}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {card}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 text-center">
        <p className="text-xs text-muted-foreground font-body">
          <Shield className="w-3 h-3 inline mr-1 -mt-0.5" />
          All data stays on your device. Zero tracking. Zero ads.
        </p>
      </footer>
    </div>
  );
};

export default Index;
