import { Shield, Brain, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        className="w-11 h-6 rounded-full transition-all relative"
        style={{
          background: on ? 'linear-gradient(135deg, #6366F1, #3B82F6)' : 'rgba(26, 26, 26, 0.8)',
          boxShadow: on ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
        }}
      >
        <div
          className="w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-transform"
          style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Profile</h1>
        <p className="text-xs text-muted-foreground">Your settings and privacy</p>
      </header>

      <div className="glass-card p-4 mb-4 flex items-center gap-4 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out forwards' }}>
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-foreground btn-glow">
          Z
        </div>
        <div>
          <p className="text-base font-bold text-foreground">Zentro User</p>
          <p className="text-xs text-muted-foreground">zentro@example.com</p>
          <button
            onClick={() => toast({ title: "Edit profile", description: "Profile editing coming soon" })}
            className="text-xs text-primary font-medium mt-1"
          >
            Edit profile →
          </button>
        </div>
      </div>

      <section className="glass-card p-4 mb-4 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out 100ms forwards' }}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Privacy Controls</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <ToggleRow label="Share location" description="Let friends see when you're nearby" defaultOn />
          <ToggleRow label="Memory tracking" description="Build context from your conversations" defaultOn />
          <ToggleRow label="Activity insights" description="Track patterns like focus hours and movement" defaultOn />
        </div>
      </section>

      <section className="glass-card p-4 mb-4 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out 200ms forwards' }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-secondary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Settings</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <ToggleRow label="Smart suggestions" description="AI recommends actions based on context" defaultOn />
          <ToggleRow label="Ghost mode replies" description="AI drafts replies you can approve" />
          <ToggleRow label="Voice note summaries" description="Auto-generate text from voice messages" defaultOn />
        </div>
      </section>

      <button
        onClick={() => toast({ title: "Signed out", description: "You have been logged out" })}
        className="w-full glass-card p-4 flex items-center justify-between opacity-0"
        style={{ animation: 'fade-in-up 0.5s ease-out 300ms forwards' }}
      >
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
};

export default Profile;
