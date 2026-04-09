import { Shield, MapPin, Brain, Sparkles, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";

const ToggleRow = ({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-colors relative ${on ? "bg-primary" : "bg-muted"}`}
      >
        <div className={`w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-transform ${on ? "translate-x-5.5 left-[1px]" : "left-[2px]"}`}
          style={{ transform: on ? "translateX(22px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
};

const Profile = () => (
  <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
    <header className="mb-6">
      <h1 className="text-xl font-bold text-foreground mb-1">Profile</h1>
      <p className="text-xs text-muted-foreground">Your settings and privacy</p>
    </header>

    {/* Personal Info */}
    <div className="glass-card p-4 mb-4 flex items-center gap-4 opacity-0 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
        Z
      </div>
      <div>
        <p className="text-base font-bold text-foreground">Zentro User</p>
        <p className="text-xs text-muted-foreground">zentro@example.com</p>
        <p className="text-xs text-primary font-medium mt-1">Edit profile →</p>
      </div>
    </div>

    {/* Privacy Controls */}
    <section className="glass-card p-4 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-accent" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Privacy Controls</span>
      </div>
      <div className="divide-y divide-border/30">
        <ToggleRow label="Share location" description="Let friends see when you're nearby" defaultOn />
        <ToggleRow label="Memory tracking" description="Build context from your conversations" defaultOn />
        <ToggleRow label="Activity insights" description="Track patterns like focus hours and movement" defaultOn />
      </div>
    </section>

    {/* AI Settings */}
    <section className="glass-card p-4 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-secondary" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Settings</span>
      </div>
      <div className="divide-y divide-border/30">
        <ToggleRow label="Smart suggestions" description="AI recommends actions based on context" defaultOn />
        <ToggleRow label="Ghost mode replies" description="AI drafts replies you can approve" />
        <ToggleRow label="Voice note summaries" description="Auto-generate text from voice messages" defaultOn />
      </div>
    </section>

    {/* Sign Out */}
    <button className="w-full glass-card p-4 flex items-center justify-between opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-3">
        <LogOut className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">Sign out</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>

    <p className="text-center text-[10px] text-muted-foreground mt-6">
      <Shield className="w-3 h-3 inline mr-1 -mt-0.5" />
      All data stays on your device. Zero tracking. Zero ads.
    </p>
  </div>
);

export default Profile;
