import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Hand } from "lucide-react";
import { useNavigate } from "react-router-dom";

const moods = [
  { id: "grinding", label: "Grinding", emoji: "⚡", gradient: "from-orange-500/30 via-amber-500/20 to-yellow-500/10", aurora: "rgba(245,158,11,0.25)" },
  { id: "lost", label: "Lost", emoji: "🌊", gradient: "from-blue-500/30 via-indigo-500/20 to-slate-500/10", aurora: "rgba(99,102,241,0.25)" },
  { id: "healing", label: "Healing", emoji: "🌿", gradient: "from-emerald-500/30 via-teal-500/20 to-green-500/10", aurora: "rgba(20,184,166,0.25)" },
  { id: "hyped", label: "Hyped", emoji: "🔥", gradient: "from-rose-500/30 via-pink-500/20 to-red-500/10", aurora: "rgba(244,63,94,0.25)" },
  { id: "creative", label: "Creative", emoji: "✨", gradient: "from-violet-500/30 via-purple-500/20 to-fuchsia-500/10", aurora: "rgba(168,85,247,0.25)" },
];

type ContentItem = {
  type: "text" | "voice" | "drift" | "almost";
  text: string;
  mood: string;
};

const contentPool: ContentItem[] = [
  { type: "text", text: "Sometimes silence says\neverything you couldn't.", mood: "lost" },
  { type: "almost", text: "I almost told you how I really feel", mood: "healing" },
  { type: "drift", text: "breathe", mood: "healing" },
  { type: "voice", text: "Someone whispered into the void tonight…", mood: "lost" },
  { type: "text", text: "3 AM thoughts hit different\nwhen nobody's watching.", mood: "grinding" },
  { type: "drift", text: "momentum", mood: "grinding" },
  { type: "almost", text: "I wanted to say I'm proud of myself", mood: "hyped" },
  { type: "text", text: "Create something\nthat scares you.", mood: "creative" },
  { type: "voice", text: "A melody hummed at midnight…", mood: "creative" },
  { type: "drift", text: "flow", mood: "creative" },
  { type: "text", text: "You don't need permission\nto take up space.", mood: "hyped" },
  { type: "almost", text: "I almost gave up today but didn't", mood: "grinding" },
  { type: "drift", text: "waves", mood: "lost" },
  { type: "voice", text: "Somewhere, someone feels the same…", mood: "healing" },
  { type: "text", text: "Healing isn't linear.\nNeither is growth.", mood: "healing" },
  { type: "almost", text: "I wish I could go back to that moment", mood: "lost" },
  { type: "text", text: "The fire inside you\nis louder than the noise.", mood: "hyped" },
  { type: "drift", text: "spark", mood: "hyped" },
  { type: "voice", text: "An idea echoed through the quiet…", mood: "creative" },
  { type: "almost", text: "I almost let myself be happy", mood: "healing" },
];

const Pulse = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [contentIndex, setContentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const filteredContent = useRef<ContentItem[]>([]);

  useEffect(() => {
    if (selectedMood) {
      const pool = contentPool.filter(c => c.mood === selectedMood);
      // pad with general if not enough
      const extra = contentPool.filter(c => c.mood !== selectedMood).slice(0, 6);
      filteredContent.current = [...pool, ...extra];
    }
  }, [selectedMood]);

  const currentContent = filteredContent.current[contentIndex % filteredContent.current.length] || contentPool[0];
  const currentMood = moods.find(m => m.id === selectedMood) || moods[0];

  const advanceContent = useCallback(() => {
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setContentIndex(i => i + 1);
      setProgress(0);
      setRevealed(false);
      setVisible(true);
      setTransitioning(false);
    }, 400);
  }, []);

  const startHold = useCallback(() => {
    if (transitioning) return;
    setHolding(true);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / 3000) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        advanceContent();
        setHolding(false);
      }
    }, 30);
  }, [advanceContent, transitioning]);

  const endHold = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    if (progress > 5 && progress < 100) {
      advanceContent();
    }
  }, [progress, advanceContent]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Mood selection screen
  if (!entered) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6">
        <div className="aurora-bg"><div className="aurora-blob" /><div className="aurora-blob-secondary" /></div>
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
          <button onClick={() => navigate(-1)} className="absolute top-4 left-0 text-muted-foreground haptic-press">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center mt-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">Pulse</h1>
            <p className="text-muted-foreground text-sm">How are you feeling right now?</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {moods.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`px-5 py-3 rounded-2xl glass-card haptic-press transition-all duration-300 flex items-center gap-2 ${
                  selectedMood === m.id ? "ring-2 ring-primary/50 scale-105" : "opacity-70"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-sm font-medium text-foreground">{m.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <button
              onClick={() => setEntered(true)}
              className="w-full py-4 rounded-2xl gradient-glow text-primary-foreground font-semibold text-lg haptic-press animate-fade-in"
            >
              Enter Pulse
            </button>
          )}
        </div>
      </div>
    );
  }

  // Immersive Pulse screen
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none"
      style={{ background: `radial-gradient(ellipse at 50% 30%, ${currentMood.aurora}, transparent 70%), hsl(var(--background))` }}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 relative z-20">
        <button onClick={() => setEntered(false)} className="text-muted-foreground haptic-press">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
          <span className="text-sm">{currentMood.emoji}</span>
          <span className="text-xs text-muted-foreground font-medium">{currentMood.label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{contentIndex + 1}/{filteredContent.current.length}</span>
      </div>

      {/* Content area */}
      <div className={`flex-1 flex items-center justify-center p-8 transition-all duration-400 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        {currentContent.type === "text" && (
          <p className="text-2xl md:text-3xl font-semibold text-center text-foreground leading-relaxed whitespace-pre-line">
            {currentContent.text}
          </p>
        )}
        {currentContent.type === "voice" && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-primary/60"
                  style={{
                    height: `${20 + Math.sin(i * 0.5 + (holding ? Date.now() * 0.003 : 0)) * 30}%`,
                    animation: holding ? `glow-breathe ${0.8 + i * 0.05}s ease-in-out infinite` : undefined,
                  }}
                />
              ))}
            </div>
            <p className="text-lg text-muted-foreground text-center italic">{currentContent.text}</p>
          </div>
        )}
        {currentContent.type === "drift" && (
          <span
            className="text-5xl md:text-6xl font-light text-foreground/40 tracking-widest"
            style={{ animation: "aurora-drift 8s ease-in-out infinite alternate" }}
          >
            {currentContent.text}
          </span>
        )}
        {currentContent.type === "almost" && (
          <button onClick={() => setRevealed(true)} className="text-center haptic-press">
            <p className={`text-2xl font-medium text-foreground transition-all duration-500 ${revealed ? "" : "blur-md"}`}>
              {currentContent.text}
            </p>
            {!revealed && <p className="text-xs text-muted-foreground mt-4 animate-pulse">tap to reveal</p>}
          </button>
        )}
      </div>

      {/* Bottom: hold indicator + progress */}
      <div className="p-6 flex flex-col items-center gap-3 relative z-20">
        <div className="w-full max-w-xs h-1 rounded-full bg-muted/30 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))`,
            }}
          />
        </div>
        <div className={`flex items-center gap-2 transition-opacity duration-300 ${holding ? "opacity-40" : "opacity-70"}`}>
          <Hand className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">hold to continue</span>
        </div>
      </div>
    </div>
  );
};

export default Pulse;
