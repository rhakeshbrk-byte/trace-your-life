import { Shield, Brain, ChevronRight, LogOut, ChevronDown, Timer, Lock, Unlock, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const ToggleRow = ({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  const { toast } = useToast();

  const handleToggle = () => {
    const next = !on;
    setOn(next);
    toast({ title: label, description: next ? "Enabled" : "Disabled" });
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={handleToggle}
        className="w-11 h-6 rounded-full transition-all duration-300 relative"
        style={{
          background: on ? 'linear-gradient(135deg, hsl(239 84% 67%), hsl(217 91% 60%))' : 'rgba(26, 26, 26, 0.8)',
          boxShadow: on ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
        }}
      >
        <div
          className="w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-all duration-300"
          style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
};

const AccordionSection = ({ icon: Icon, title, color, children, delay = "0ms" }: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
  delay?: string;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <section
      className="glass-card-elevated mb-4 opacity-0 overflow-hidden"
      style={{ animation: `fade-in-up 0.5s ease-out ${delay} forwards` }}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${color}`} />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`transition-all duration-400 ease-in-out overflow-hidden ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4">
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

// Mood history data
const moodHistory = [
  { day: "Mon", mood: "Grinding", emoji: "💪", intensity: 80 },
  { day: "Tue", mood: "Creative", emoji: "🎨", intensity: 60 },
  { day: "Wed", mood: "Lost", emoji: "🌧️", intensity: 40 },
  { day: "Thu", mood: "Hyped", emoji: "🔥", intensity: 90 },
  { day: "Fri", mood: "Healing", emoji: "🌿", intensity: 50 },
  { day: "Sat", mood: "Hyped", emoji: "🔥", intensity: 85 },
  { day: "Sun", mood: "Creative", emoji: "🎨", intensity: 70 },
];

const moodBarColors: Record<string, string> = {
  Grinding: "from-orange-500 to-red-500",
  Lost: "from-blue-500 to-indigo-500",
  Hyped: "from-yellow-400 to-orange-500",
  Healing: "from-emerald-500 to-teal-500",
  Creative: "from-purple-500 to-pink-500",
};

// Unlock system
const unlockFeatures = [
  { id: 1, name: "Voice Notes", icon: "🎙️", unlocked: true, requirement: "Send 10 messages" },
  { id: 2, name: "Custom Themes", icon: "🎨", unlocked: true, requirement: "7-day streak" },
  { id: 3, name: "Ghost Mode", icon: "👻", unlocked: false, requirement: "Post 20 mood updates" },
  { id: 4, name: "AI Insights", icon: "🧠", unlocked: false, requirement: "Use Focus Mode 5 times" },
  { id: 5, name: "Story Highlights", icon: "⭐", unlocked: false, requirement: "Get 50 reactions" },
];

const Profile = () => {
  const { toast } = useToast();
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60); // 25 min in seconds
  const [focusPreset, setFocusPreset] = useState(25);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (focusActive && focusTime > 0) {
      intervalRef.current = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            setFocusActive(false);
            toast({ title: "🎉 Focus Complete!", description: "Great job staying focused!" });
            return focusPreset * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [focusActive]);

  const startFocus = () => {
    setFocusTime(focusPreset * 60);
    setFocusActive(true);
  };

  const stopFocus = () => {
    setFocusActive(false);
    setFocusTime(focusPreset * 60);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Focus Mode Overlay
  if (focusActive) {
    const progress = 1 - focusTime / (focusPreset * 60);
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, rgba(11,11,15,0.98), rgba(99,102,241,0.08))',
      }}>
        <div className="aurora-bg"><div className="aurora-blob" /></div>
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Timer circle */}
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#timerGradient)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${progress * 283} 283`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground tracking-wider">{formatTime(focusTime)}</span>
              <span className="text-xs text-muted-foreground mt-1">Stay focused</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center max-w-xs">
            All notifications are paused. Take a breath and focus on what matters.
          </p>

          <button
            onClick={stopFocus}
            className="px-6 py-2.5 rounded-full btn-glass text-sm text-muted-foreground hover:text-foreground haptic-press"
          >
            <X className="w-4 h-4 inline mr-2" />
            End session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Profile</h1>
        <p className="text-xs text-muted-foreground">Your settings and privacy</p>
      </header>

      {/* Profile card */}
      <div className="glass-card-elevated p-4 mb-4 flex items-center gap-4 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out forwards' }}>
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-foreground btn-glow">
          ✦
        </div>
        <div>
          <p className="text-base font-bold text-foreground">StarDust User</p>
          <p className="text-xs text-muted-foreground">user@stardust.app</p>
          <button
            onClick={() => toast({ title: "Edit profile", description: "Profile editing coming soon" })}
            className="text-xs text-primary font-medium mt-1 transition-all hover:text-secondary"
          >
            Edit profile →
          </button>
        </div>
      </div>

      {/* Focus Mode */}
      <section className="glass-card-elevated mb-4 p-4 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out 50ms forwards' }}>
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Focus Mode</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Lock the app and focus on what matters</p>
        <div className="flex gap-2 mb-3">
          {[15, 25, 45, 60].map(min => (
            <button
              key={min}
              onClick={() => { setFocusPreset(min); setFocusTime(min * 60); }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all haptic-press ${
                focusPreset === min
                  ? "gradient-primary text-foreground btn-glow"
                  : "btn-glass text-muted-foreground"
              }`}
            >
              {min}m
            </button>
          ))}
        </div>
        <button onClick={startFocus} className="w-full py-2.5 rounded-xl gradient-primary text-sm font-semibold text-foreground btn-glow haptic-press">
          Start Focus Session
        </button>
      </section>

      {/* Mood History */}
      <section className="glass-card-elevated mb-4 p-4 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out 100ms forwards' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">📊 Mood History</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {moodHistory.map((entry, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-sm">{entry.emoji}</span>
              <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: `${entry.intensity}%` }}>
                <div className={`absolute inset-0 bg-gradient-to-t ${moodBarColors[entry.mood]} rounded-t-lg opacity-80`} />
              </div>
              <span className="text-[9px] text-muted-foreground">{entry.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Unlock System */}
      <section className="glass-card-elevated mb-4 p-4 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out 150ms forwards' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">🔓 Unlocks</span>
        </div>
        <div className="space-y-2">
          {unlockFeatures.map(feat => (
            <div
              key={feat.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                feat.unlocked ? "glass-card" : "glass-card opacity-60"
              }`}
              style={!feat.unlocked ? { filter: 'blur(0.5px)' } : undefined}
            >
              <span className="text-lg">{feat.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${feat.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{feat.name}</p>
                <p className="text-[10px] text-muted-foreground">{feat.requirement}</p>
              </div>
              {feat.unlocked ? (
                <Unlock className="w-4 h-4 text-accent" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </section>

      <AccordionSection icon={Shield} title="Privacy Controls" color="accent" delay="200ms">
        <ToggleRow label="Share location" description="Let friends see when you're nearby" defaultOn />
        <ToggleRow label="Memory tracking" description="Build context from your conversations" defaultOn />
        <ToggleRow label="Activity insights" description="Track patterns like focus hours and movement" defaultOn />
      </AccordionSection>

      <AccordionSection icon={Brain} title="AI Settings" color="secondary" delay="250ms">
        <ToggleRow label="Smart suggestions" description="AI recommends actions based on context" defaultOn />
        <ToggleRow label="Ghost mode replies" description="AI drafts replies you can approve" />
        <ToggleRow label="Voice note summaries" description="Auto-generate text from voice messages" defaultOn />
      </AccordionSection>

      <button
        onClick={() => toast({ title: "Signed out", description: "You have been logged out" })}
        className="w-full glass-card-elevated p-4 flex items-center justify-between opacity-0 group"
        style={{ animation: 'fade-in-up 0.5s ease-out 300ms forwards' }}
      >
        <div className="flex items-center gap-3">
          <LogOut className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">Sign out</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      <p className="text-center text-[10px] text-muted-foreground mt-6">
        <Shield className="w-3 h-3 inline mr-1 -mt-0.5" />
        All data stays on your device. Zero tracking. Zero ads.
      </p>
    </div>
  );
};

export default Profile;
