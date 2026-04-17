import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const moods = [
  { id: "grinding", label: "Grinding", emoji: "⚡", desc: "Focused & driven" },
  { id: "lost", label: "Lost", emoji: "🌊", desc: "Searching & drifting" },
  { id: "healing", label: "Healing", emoji: "🌿", desc: "Soft & recovering" },
  { id: "hyped", label: "Hyped", emoji: "🔥", desc: "Energized & alive" },
  { id: "creative", label: "Creative", emoji: "✨", desc: "Inspired & flowing" },
  { id: "chill", label: "Chill", emoji: "🌙", desc: "Calm & present" },
];

const STEP_COUNT = 3;

interface OnboardingProps {
  onComplete: (data: { username: string; moods: string[] }) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<Set<string>>(new Set());
  const [exiting, setExiting] = useState(false);

  const goNext = () => {
    if (step < STEP_COUNT - 1) {
      setExiting(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setExiting(false);
      }, 280);
    }
  };

  const handleUsernameNext = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameError("Please enter a username.");
      return;
    }
    if (trimmed.length < 3) {
      setUsernameError("Must be at least 3 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError("Only letters, numbers, and underscores.");
      return;
    }
    setUsernameError("");
    goNext();
  };

  const handleSkipUsername = () => {
    setUsernameError("");
    setUsername("");
    goNext();
  };

  const toggleMood = (id: string) => {
    setSelectedMoods(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFinish = () => {
    onComplete({ username: username.trim(), moods: Array.from(selectedMoods) });
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background overflow-hidden"
      data-testid="onboarding-screen"
    >
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-blob" />
        <div className="aurora-blob-secondary" />
      </div>

      {/* Step content */}
      <div
        className="relative z-10 w-full max-w-sm px-6 flex flex-col"
        style={{
          transition: "opacity 0.28s ease, transform 0.28s ease",
          opacity: exiting ? 0 : 1,
          transform: exiting ? "translateY(-20px)" : "translateY(0)",
        }}
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10" data-testid="onboarding-progress">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <div
              key={i}
              data-testid={`onboarding-dot-${i}`}
              className="rounded-full transition-all duration-400"
              style={{
                width: i === step ? "24px" : "8px",
                height: "8px",
                background:
                  i === step
                    ? "linear-gradient(90deg, #6366F1, #3B82F6)"
                    : i < step
                    ? "rgba(99,102,241,0.5)"
                    : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>

        {/* ── STEP 0: Welcome ── */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center gap-6" style={{ animation: "fade-in-up 0.4s ease-out forwards" }}>
            <div
              className="w-20 h-20 rounded-3xl overflow-hidden btn-glow"
              style={{ animation: "fab-pulse 3s ease-in-out infinite" }}
            >
              <img
                src="/stardust-logo.png"
                alt="StarDust"
                className="w-full h-full object-cover"
                data-testid="img-onboarding-logo"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-onboarding-welcome-title">
                Welcome to StarDust
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A space to express yourself freely — no follower counts, no algorithms, just real moments and real moods.
              </p>
            </div>

            <div className="w-full space-y-3 mt-2">
              {[
                { emoji: "✦", text: "Anonymous by default" },
                { emoji: "🌌", text: "Mood-based content that matches how you feel" },
                { emoji: "🔒", text: "All data stays on your device. Zero tracking." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 glass-card px-4 py-3 rounded-2xl"
                  style={{ animation: `fade-in-up 0.4s ease-out ${(i + 1) * 80}ms forwards`, opacity: 0 }}
                >
                  <span className="text-base w-6 text-center shrink-0">{item.emoji}</span>
                  <p className="text-sm text-foreground/80 text-left">{item.text}</p>
                </div>
              ))}
            </div>

            <button
              data-testid="button-onboarding-get-started"
              onClick={goNext}
              className="w-full py-4 rounded-2xl gradient-primary btn-glow text-white font-bold text-base haptic-press flex items-center justify-center gap-2 mt-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 1: Username ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6" style={{ animation: "fade-in-up 0.35s ease-out forwards" }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4 text-2xl">
                👤
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Pick your username</h2>
              <p className="text-sm text-muted-foreground">
                This is how others will know you when you choose to reveal yourself.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-3 transition-all duration-300"
                style={{
                  background: "rgba(26,26,26,0.7)",
                  border: usernameError
                    ? "1px solid rgba(239,68,68,0.5)"
                    : username.length >= 3
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: username.length >= 3 && !usernameError
                    ? "0 0 16px rgba(99,102,241,0.1)"
                    : "none",
                }}
              >
                <span className="text-muted-foreground text-sm font-medium select-none">@</span>
                <input
                  data-testid="input-username"
                  autoFocus
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    setUsernameError("");
                  }}
                  onKeyDown={e => e.key === "Enter" && handleUsernameNext()}
                  placeholder="your_username"
                  maxLength={24}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-base font-medium"
                />
                {username.length >= 3 && !usernameError && (
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                )}
              </div>

              {usernameError && (
                <p
                  data-testid="text-username-error"
                  className="text-xs text-red-400 px-1"
                  style={{ animation: "fade-in-up 0.2s ease-out forwards" }}
                >
                  {usernameError}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground/50 px-1">
                3–24 characters · letters, numbers, and _ only
              </p>
            </div>

            <button
              data-testid="button-username-continue"
              onClick={handleUsernameNext}
              disabled={username.trim().length < 3}
              className="w-full py-4 rounded-2xl gradient-primary btn-glow text-white font-bold text-base haptic-press flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              data-testid="button-username-skip"
              onClick={handleSkipUsername}
              className="text-center text-xs text-muted-foreground/60 haptic-press hover:text-muted-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* ── STEP 2: Mood Preferences ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5" style={{ animation: "fade-in-up 0.35s ease-out forwards" }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4 text-2xl">
                🎭
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What vibes are you?</h2>
              <p className="text-sm text-muted-foreground">
                Pick the moods that feel like you. StarDust will match your content to them.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5" data-testid="mood-picker-grid">
              {moods.map((m, i) => {
                const isSelected = selectedMoods.has(m.id);
                return (
                  <button
                    key={m.id}
                    data-testid={`button-mood-${m.id}`}
                    onClick={() => toggleMood(m.id)}
                    aria-pressed={isSelected}
                    className="p-4 rounded-2xl text-left haptic-press transition-all duration-250"
                    style={{
                      animation: `fade-in-up 0.3s ease-out ${i * 50}ms forwards`,
                      opacity: 0,
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.1))"
                        : "rgba(26,26,26,0.5)",
                      border: isSelected
                        ? "1px solid rgba(99,102,241,0.35)"
                        : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: isSelected
                        ? "0 0 16px rgba(99,102,241,0.12)"
                        : "none",
                      transform: isSelected ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="text-xl">{m.emoji}</span>
                      {isSelected && (
                        <div
                          className="w-4 h-4 rounded-full gradient-primary flex items-center justify-center"
                          style={{ animation: "fade-in 0.2s ease-out forwards" }}
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
                  </button>
                );
              })}
            </div>

            <button
              data-testid="button-enter-stardust"
              onClick={handleFinish}
              disabled={selectedMoods.size === 0}
              className="w-full py-4 rounded-2xl gradient-primary btn-glow text-white font-bold text-base haptic-press flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Enter StarDust
              {selectedMoods.size > 0 && (
                <span className="ml-1 text-white/70 font-normal text-sm">
                  ({selectedMoods.size} selected)
                </span>
              )}
            </button>

            <button
              data-testid="button-skip-moods"
              onClick={handleFinish}
              className="text-center text-xs text-muted-foreground/60 haptic-press hover:text-muted-foreground transition-colors"
            >
              Skip — I'll set this later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
