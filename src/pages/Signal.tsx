import { useState, useEffect, useRef } from "react";
import { Camera, Mic, Smile, X, Zap, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const floatingCards = [
  { id: 1, type: "image" as const, emoji: "📸", label: "Snap by Alex", x: 15, y: 20 },
  { id: 2, type: "voice" as const, emoji: "🎙️", label: "Voice from Sam", x: 60, y: 15 },
  { id: 3, type: "reaction" as const, emoji: "🔥", label: "React", x: 30, y: 55 },
  { id: 4, type: "image" as const, emoji: "🌅", label: "Snap by Maya", x: 70, y: 50 },
  { id: 5, type: "reaction" as const, emoji: "💜", label: "React", x: 45, y: 75 },
  { id: 6, type: "voice" as const, emoji: "🗣️", label: "Voice from Priya", x: 80, y: 35 },
];

const Signal = () => {
  const { toast } = useToast();
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min
  const [ended, setEnded] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reactionId = useRef(0);

  useEffect(() => {
    if (active && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setActive(false);
            setEnded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  const startSignal = () => {
    setTimeLeft(15 * 60);
    setActive(true);
    setEnded(false);
    setReactions([]);
  };

  const endSignal = () => {
    setActive(false);
    setEnded(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const addReaction = (emoji: string) => {
    const id = ++reactionId.current;
    const x = 20 + Math.random() * 60;
    const y = 30 + Math.random() * 40;
    setReactions(prev => [...prev.slice(-8), { id, emoji, x, y }]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / (15 * 60);

  // Ended state
  if (ended) {
    return (
      <div className="px-4 pt-4 pb-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center opacity-0" style={{ animation: "fade-in-up 0.6s ease-out forwards" }}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
            <Zap className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Signal Ended</h2>
          <p className="text-sm text-muted-foreground mb-6">The moment has passed. What was shared stays here.</p>
          <button onClick={() => { setEnded(false); setTimeLeft(15 * 60); }} className="px-6 py-3 rounded-full btn-glass text-sm font-medium text-muted-foreground haptic-press">
            Back to Signal
          </button>
        </div>
      </div>
    );
  }

  // Active state — full-screen signal
  if (active) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col" style={{
        background: "linear-gradient(135deg, rgba(11,11,15,0.95), rgba(99,102,241,0.15), rgba(59,130,246,0.1), rgba(139,92,246,0.12))",
      }}>
        {/* Intense aurora */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full top-[-20%] left-[-10%] opacity-25" style={{
            background: "radial-gradient(circle, #6366F1 0%, #8B5CF6 35%, transparent 70%)",
            filter: "blur(80px)", animation: "aurora-drift 15s ease-in-out infinite alternate",
          }} />
          <div className="absolute w-[500px] h-[500px] rounded-full bottom-[-20%] right-[-15%] opacity-20" style={{
            background: "radial-gradient(circle, #3B82F6 0%, #14B8A6 35%, transparent 70%)",
            filter: "blur(100px)", animation: "aurora-drift 18s ease-in-out infinite alternate-reverse",
          }} />
        </div>

        <div className="relative z-10 flex flex-col h-full p-4 max-w-lg mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">SIGNAL LIVE</span>
            </div>
            <button onClick={endSignal} className="w-8 h-8 rounded-full btn-glass flex items-center justify-center haptic-press">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <span className="text-3xl font-bold text-foreground tracking-wider" style={{ textShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
              {formatTime(timeLeft)}
            </span>
            <div className="h-1 bg-muted/20 rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
              <div className="h-full rounded-full transition-all duration-1000" style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, #6366F1, #3B82F6, #14B8A6)",
              }} />
            </div>
          </div>

          {/* Floating cards */}
          <div className="flex-1 relative">
            {floatingCards.map((card, i) => (
              <div
                key={card.id}
                className="absolute glass-card p-3 rounded-xl opacity-0"
                style={{
                  left: `${card.x}%`, top: `${card.y}%`,
                  transform: "translate(-50%, -50%)",
                  animation: `fade-in-up 0.5s ease-out ${i * 150}ms forwards, aurora-drift 20s ease-in-out infinite alternate`,
                  animationDelay: `${i * 150}ms, ${i * 2}s`,
                }}
              >
                <span className="text-xl block text-center mb-1">{card.emoji}</span>
                <p className="text-[9px] text-muted-foreground text-center whitespace-nowrap">{card.label}</p>
              </div>
            ))}

            {/* Live reactions */}
            {reactions.map(r => (
              <div
                key={r.id}
                className="absolute text-2xl pointer-events-none"
                style={{
                  left: `${r.x}%`, top: `${r.y}%`,
                  animation: "fade-in-up 0.3s ease-out forwards, fade-out-up 2s ease-out 0.5s forwards",
                }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 py-4">
            <button
              onClick={() => { addReaction("📸"); toast({ title: "Snap!", description: "Photo shared to signal" }); }}
              className="w-14 h-14 rounded-full btn-glass flex items-center justify-center haptic-press"
              style={{ boxShadow: "0 0 20px rgba(99,102,241,0.15)" }}
            >
              <Camera className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={() => { addReaction("🎙️"); toast({ title: "Recording...", description: "Voice note shared" }); }}
              className="w-16 h-16 rounded-full gradient-glow flex items-center justify-center haptic-press"
            >
              <Mic className="w-7 h-7 text-foreground" />
            </button>
            <button
              onClick={() => {
                const emojis = ["🔥", "💜", "✨", "😭", "💀", "❤️"];
                addReaction(emojis[Math.floor(Math.random() * emojis.length)]);
              }}
              className="w-14 h-14 rounded-full btn-glass flex items-center justify-center haptic-press"
              style={{ boxShadow: "0 0 20px rgba(99,102,241,0.15)" }}
            >
              <Smile className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Entry screen
  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">⚡ Daily Signal</h1>
        <p className="text-xs text-muted-foreground">15 minutes of raw, live connection</p>
      </header>

      <div className="glass-card-elevated p-6 text-center opacity-0" style={{ animation: "fade-in-up 0.5s ease-out forwards" }}>
        <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-glow flex items-center justify-center"
          style={{ animation: "fab-pulse 3s ease-in-out infinite" }}
        >
          <Zap className="w-8 h-8 text-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">Start Signal</h2>
        <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto leading-relaxed">
          A 15-minute live window. Share snaps, voice notes, and reactions in real time. When it ends, it's gone.
        </p>
        <button
          onClick={startSignal}
          className="px-8 py-3 rounded-full gradient-glow text-sm font-semibold text-foreground haptic-press"
          style={{ animation: "fab-pulse 3s ease-in-out infinite" }}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Go Live
        </button>
      </div>

      {/* What to expect */}
      <div className="mt-6 space-y-3 opacity-0" style={{ animation: "fade-in-up 0.5s ease-out 150ms forwards" }}>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">How it works</span>
        {[
          { icon: <Camera className="w-4 h-4" />, title: "Snap", desc: "Share a moment in real time" },
          { icon: <Volume2 className="w-4 h-4" />, title: "Voice", desc: "Drop a voice note into the signal" },
          { icon: <Smile className="w-4 h-4" />, title: "React", desc: "Send live emoji reactions" },
        ].map((item, i) => (
          <div key={i} className="glass-card p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full btn-glass flex items-center justify-center text-primary">{item.icon}</div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Signal;
