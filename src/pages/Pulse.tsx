import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Heart, Bookmark, Share2, MoreHorizontal, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const moods = [
  { id: "grinding", label: "Grinding", emoji: "⚡", color: "#3B82F6", aurora: "rgba(59,130,246,0.28)", glow: "rgba(59,130,246,0.12)" },
  { id: "lost", label: "Lost", emoji: "🌊", color: "#6366F1", aurora: "rgba(99,102,241,0.28)", glow: "rgba(99,102,241,0.12)" },
  { id: "healing", label: "Healing", emoji: "🌿", color: "#14B8A6", aurora: "rgba(20,184,166,0.28)", glow: "rgba(20,184,166,0.12)" },
  { id: "hyped", label: "Hyped", emoji: "🔥", color: "#8B5CF6", aurora: "rgba(139,92,246,0.28)", glow: "rgba(139,92,246,0.12)" },
  { id: "creative", label: "Creative", emoji: "✨", color: "#EC4899", aurora: "rgba(236,72,153,0.22)", glow: "rgba(236,72,153,0.10)" },
  { id: "chill", label: "Chill", emoji: "🌙", color: "#06B6D4", aurora: "rgba(6,182,212,0.22)", glow: "rgba(6,182,212,0.10)" },
];

type ContentType = "text" | "voice" | "drift" | "almost";

interface ContentItem {
  type: ContentType;
  text: string;
  mood: string;
  caption?: string;
  tag?: string;
}

const contentPool: ContentItem[] = [
  { type: "text", text: "Sometimes silence says\neverything you couldn't.", mood: "lost", caption: "for the ones who couldn't speak today", tag: "#lost" },
  { type: "almost", text: "I almost told you how I really feel", mood: "healing", caption: "anonymous · shared with the void", tag: "#healing" },
  { type: "drift", text: "breathe", mood: "healing", caption: "take a moment. just breathe.", tag: "#healing" },
  { type: "voice", text: "Someone whispered into the void tonight…", mood: "lost", caption: "voice · 0:23", tag: "#lost" },
  { type: "text", text: "3 AM thoughts hit different\nwhen nobody's watching.", mood: "grinding", caption: "still at it. still going.", tag: "#grinding" },
  { type: "drift", text: "momentum", mood: "grinding", caption: "keep building, quietly.", tag: "#grinding" },
  { type: "almost", text: "I wanted to say I'm proud of myself", mood: "hyped", caption: "anonymous · buried feelings", tag: "#hyped" },
  { type: "text", text: "Create something\nthat scares you.", mood: "creative", caption: "make art anyway.", tag: "#creative" },
  { type: "voice", text: "A melody hummed at midnight…", mood: "creative", caption: "voice · 0:12", tag: "#creative" },
  { type: "drift", text: "flow", mood: "creative", caption: "let it move through you.", tag: "#creative" },
  { type: "text", text: "You don't need permission\nto take up space.", mood: "hyped", caption: "this one's for you.", tag: "#hyped" },
  { type: "almost", text: "I almost gave up today but didn't", mood: "grinding", caption: "anonymous · still here", tag: "#grinding" },
  { type: "drift", text: "waves", mood: "lost", caption: "ebb and flow.", tag: "#lost" },
  { type: "voice", text: "Somewhere, someone feels the same…", mood: "healing", caption: "voice · 0:31", tag: "#healing" },
  { type: "text", text: "Healing isn't linear.\nNeither is growth.", mood: "healing", caption: "give yourself grace.", tag: "#healing" },
  { type: "almost", text: "I wish I could go back to that moment", mood: "lost", caption: "anonymous · still processing", tag: "#lost" },
  { type: "text", text: "The fire inside you\nis louder than the noise.", mood: "hyped", caption: "turn it up.", tag: "#hyped" },
  { type: "drift", text: "spark", mood: "hyped", caption: "something is starting.", tag: "#hyped" },
  { type: "text", text: "Stars don't compete\nwith each other.", mood: "chill", caption: "just shine where you are.", tag: "#chill" },
  { type: "drift", text: "stillness", mood: "chill", caption: "in quiet, everything makes sense.", tag: "#chill" },
  { type: "almost", text: "I almost let myself be happy", mood: "healing", caption: "anonymous · learning", tag: "#healing" },
];

const BREATHER_INTERVAL = 15;

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
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showBreather, setShowBreather] = useState(false);
  const [showMoodSwitch, setShowMoodSwitch] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"up" | "down" | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const filteredContent = useRef<ContentItem[]>([]);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const lastTap = useRef<number>(0);
  const isHoldTarget = useRef(false);

  useEffect(() => {
    if (selectedMood) {
      const pool = contentPool.filter(c => c.mood === selectedMood);
      const extra = contentPool.filter(c => c.mood !== selectedMood).slice(0, 6);
      filteredContent.current = [...pool, ...extra].sort(() => Math.random() - 0.5);
    }
  }, [selectedMood]);

  const currentContent = filteredContent.current[contentIndex % Math.max(filteredContent.current.length, 1)] || contentPool[0];
  const currentMood = moods.find(m => m.id === selectedMood) || moods[0];
  const totalItems = Math.max(filteredContent.current.length, 1);

  const advanceContent = useCallback((direction: "up" | "down" = "up") => {
    if (transitioning) return;

    const nextIndex = direction === "up"
      ? contentIndex + 1
      : Math.max(0, contentIndex - 1);

    if (direction === "up" && nextIndex > 0 && nextIndex % BREATHER_INTERVAL === 0) {
      setShowBreather(true);
      return;
    }

    setSwipeDir(direction);
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setContentIndex(nextIndex);
      setProgress(0);
      setRevealed(false);
      setLiked(false);
      setSaved(false);
      setVisible(true);
      setTransitioning(false);
      setSwipeDir(null);
    }, 350);
  }, [contentIndex, transitioning]);

  const startHold = useCallback(() => {
    if (transitioning || showBreather || showMoodSwitch) return;
    isHoldTarget.current = true;
    setHolding(true);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / 2500) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setHolding(false);
        isHoldTarget.current = false;
        advanceContent("up");
      }
    }, 20);
  }, [advanceContent, transitioning, showBreather, showMoodSwitch]);

  const endHold = useCallback(() => {
    if (!isHoldTarget.current) return;
    isHoldTarget.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(prev => {
      if (prev > 5 && prev < 100) {
        advanceContent("up");
      }
      return 0;
    });
  }, [advanceContent]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaX = Math.abs(touchStartX.current - e.changedTouches[0].clientX);

    if (Math.abs(deltaY) > 60 && deltaX < 80) {
      endHold();
      if (deltaY > 0) {
        advanceContent("up");
      } else {
        advanceContent("down");
      }
    } else {
      // Detect double tap for like
      const now = Date.now();
      if (now - lastTap.current < 350) {
        setLiked(true);
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 800);
      }
      lastTap.current = now;
      endHold();
    }
  }, [advanceContent, endHold]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // ──────────────── MOOD SELECTION ────────────────
  if (!entered) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6">
        <div className="aurora-bg"><div className="aurora-blob" /><div className="aurora-blob-secondary" /></div>
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
          <button
            onClick={() => navigate(-1)}
            className="absolute -top-2 left-0 text-muted-foreground haptic-press p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center mt-10">
            <div className="w-16 h-16 rounded-2xl gradient-primary btn-glow flex items-center justify-center mx-auto mb-4" style={{ animation: "fab-pulse 3s ease-in-out infinite" }}>
              <span className="text-2xl">✦</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Pulse</h1>
            <p className="text-sm text-muted-foreground">What's your mood right now?</p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {moods.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className="p-4 rounded-2xl glass-card haptic-press transition-all duration-300 flex flex-col items-center gap-2"
                style={
                  selectedMood === m.id
                    ? {
                        transform: "scale(1.05)",
                        boxShadow: `0 0 24px ${m.aurora}`,
                        border: `1px solid ${m.color}40`,
                        background: `${m.color}10`,
                      }
                    : { opacity: 0.7 }
                }
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-semibold text-foreground">{m.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <button
              onClick={() => setEntered(true)}
              className="w-full py-4 rounded-2xl text-white font-bold text-base haptic-press"
              style={{
                background: `linear-gradient(135deg, ${currentMood.color}dd, ${currentMood.color}88)`,
                boxShadow: `0 0 30px ${currentMood.aurora}`,
                animation: "fade-in-up 0.3s ease-out forwards",
              }}
            >
              Enter Pulse {currentMood.emoji}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ──────────────── BREATHER SCREEN ────────────────
  if (showBreather) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8"
        style={{ background: "rgba(11,11,15,0.97)" }}
      >
        <div className="aurora-bg"><div className="aurora-blob" /></div>
        <div className="relative z-10 text-center max-w-xs" style={{ animation: "fade-in-up 0.5s ease-out forwards" }}>
          <div className="text-5xl mb-6">🌿</div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Take a breather?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            You've been in Pulse for a while. It's okay to step away and reconnect with what's around you.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => { setShowBreather(false); advanceContent("up"); }}
              className="py-3.5 rounded-2xl btn-glass text-sm font-semibold text-foreground haptic-press"
            >
              Continue Watching
            </button>
            <button
              onClick={() => { setShowBreather(false); setEntered(false); setContentIndex(0); }}
              className="py-3.5 rounded-2xl text-sm font-medium text-muted-foreground haptic-press"
            >
              Exit Pulse
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────── IMMERSIVE PULSE SCREEN ────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 20%, ${currentMood.aurora}, transparent 65%), #0B0B0F`,
      }}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${currentMood.glow}, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* TOP BAR */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-3">
        <button
          onClick={() => setEntered(false)}
          onMouseDown={e => e.stopPropagation()}
          className="w-9 h-9 rounded-full btn-glass flex items-center justify-center haptic-press"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => setShowMoodSwitch(!showMoodSwitch)}
          onMouseDown={e => e.stopPropagation()}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-card haptic-press"
          style={{ border: `1px solid ${currentMood.color}30` }}
        >
          <span className="text-sm">{currentMood.emoji}</span>
          <span className="text-xs font-semibold text-foreground">{currentMood.label}</span>
          <span className="text-[10px] text-muted-foreground opacity-60">▾</span>
        </button>

        <button
          onClick={() => setMuted(!muted)}
          onMouseDown={e => e.stopPropagation()}
          className="w-9 h-9 rounded-full btn-glass flex items-center justify-center haptic-press"
        >
          {muted
            ? <VolumeX className="w-4 h-4 text-muted-foreground" />
            : <Volume2 className="w-4 h-4" style={{ color: currentMood.color }} />}
        </button>
      </div>

      {/* MOOD SWITCHER DROPDOWN */}
      {showMoodSwitch && (
        <>
          <div className="fixed inset-0 z-20" onMouseDown={e => { e.stopPropagation(); setShowMoodSwitch(false); }} />
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-72 glass-card-elevated rounded-2xl p-3"
            style={{ animation: "fade-in-up 0.2s ease-out forwards" }}
            onMouseDown={e => e.stopPropagation()}
          >
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Switch mood</p>
            <div className="grid grid-cols-3 gap-2">
              {moods.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMood(m.id); setShowMoodSwitch(false); setContentIndex(0); }}
                  className="py-2 px-1 rounded-xl text-center haptic-press transition-all btn-glass"
                  style={selectedMood === m.id ? { background: `${m.color}15`, border: `1px solid ${m.color}30` } : {}}
                >
                  <span className="text-lg block">{m.emoji}</span>
                  <span className="text-[10px] text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex relative">
        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{
            transition: "opacity 0.35s ease, transform 0.35s ease",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : `${swipeDir === "up" ? "translateY(-40px)" : "translateY(40px)"} scale(0.95)`,
          }}
        >
          {currentContent.type === "text" && (
            <p
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground leading-relaxed whitespace-pre-line"
              style={{ textShadow: `0 0 40px ${currentMood.color}25` }}
            >
              {currentContent.text}
            </p>
          )}

          {currentContent.type === "voice" && (
            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${currentMood.color}25, transparent)`,
                  border: `2px solid ${currentMood.color}40`,
                  boxShadow: `0 0 30px ${currentMood.aurora}`,
                }}
              >
                <Volume2 className="w-8 h-8" style={{ color: currentMood.color }} />
              </div>
              <div className="flex items-end gap-0.5 h-14 w-full justify-center">
                {Array.from({ length: 32 }).map((_, i) => {
                  const h = 20 + Math.abs(Math.sin(i * 0.7 + 0.3)) * 70;
                  return (
                    <div
                      key={i}
                      className="w-1 rounded-full flex-shrink-0"
                      style={{
                        height: `${h}%`,
                        background: currentMood.color,
                        opacity: 0.3 + Math.abs(Math.sin(i * 0.35)) * 0.7,
                        animation: holding ? `glow-breathe ${0.5 + (i % 5) * 0.1}s ease-in-out infinite` : undefined,
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-base text-muted-foreground text-center italic leading-relaxed">{currentContent.text}</p>
            </div>
          )}

          {currentContent.type === "drift" && (
            <div className="text-center">
              <span
                className="block font-thin tracking-[0.4em]"
                style={{
                  fontSize: "clamp(3rem, 10vw, 5rem)",
                  animation: "aurora-drift 8s ease-in-out infinite alternate",
                  color: `${currentMood.color}55`,
                  textShadow: `0 0 80px ${currentMood.color}30`,
                }}
              >
                {currentContent.text}
              </span>
            </div>
          )}

          {currentContent.type === "almost" && (
            <button
              className="text-center haptic-press max-w-xs w-full"
              onClick={() => setRevealed(true)}
              onMouseDown={e => e.stopPropagation()}
            >
              <div
                className="p-6 rounded-3xl mb-4"
                style={{
                  background: `${currentMood.color}08`,
                  border: `1px solid ${currentMood.color}20`,
                }}
              >
                <p
                  className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed transition-all duration-700"
                  style={{ filter: revealed ? "none" : "blur(10px)" }}
                >
                  {currentContent.text}
                </p>
              </div>
              {!revealed && (
                <p className="text-xs text-muted-foreground animate-pulse">tap to reveal</p>
              )}
            </button>
          )}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div
          className="absolute right-4 bottom-36 flex flex-col items-center gap-5 z-20"
          onMouseDown={e => e.stopPropagation()}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/20"
            style={{ background: `linear-gradient(135deg, ${currentMood.color}80, ${currentMood.color}30)` }}
          >
            ✦
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => {
                setLiked(l => !l);
                if (!liked) { setLikeAnim(true); setTimeout(() => setLikeAnim(false), 600); }
              }}
              className="w-11 h-11 rounded-full btn-glass flex items-center justify-center haptic-press transition-all duration-300"
              style={liked ? { background: "rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.3)" } : {}}
            >
              <Heart
                className="w-5 h-5 transition-all duration-300"
                style={{
                  fill: liked ? "#EC4899" : "none",
                  color: liked ? "#EC4899" : undefined,
                  transform: likeAnim ? "scale(1.4)" : "scale(1)",
                }}
              />
            </button>
            <span className="text-[9px] text-muted-foreground">Feel this</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setSaved(s => !s)}
              className="w-11 h-11 rounded-full btn-glass flex items-center justify-center haptic-press transition-all duration-300"
              style={saved ? { background: `${currentMood.color}20`, border: `1px solid ${currentMood.color}40` } : {}}
            >
              <Bookmark
                className="w-5 h-5 transition-all"
                style={{
                  fill: saved ? currentMood.color : "none",
                  color: saved ? currentMood.color : "var(--muted-foreground)",
                }}
              />
            </button>
            <span className="text-[9px] text-muted-foreground">Save</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="w-11 h-11 rounded-full btn-glass flex items-center justify-center haptic-press">
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="text-[9px] text-muted-foreground">Share</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="w-11 h-11 rounded-full btn-glass flex items-center justify-center haptic-press">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* DOUBLE-TAP LIKE ANIM */}
      {likeAnim && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          style={{ animation: "fade-out-up 0.8s ease-out forwards" }}
        >
          <Heart className="w-24 h-24 drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]" style={{ fill: "#EC4899", color: "#EC4899" }} />
        </div>
      )}

      {/* BOTTOM CAPTION + PROGRESS */}
      <div className="relative z-20 px-5 pb-6" onMouseDown={e => e.stopPropagation()}>
        <div className="mb-4 pr-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
          {currentContent.caption && (
            <p className="text-xs text-muted-foreground mb-1.5">{currentContent.caption}</p>
          )}
          {currentContent.tag && (
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full inline-block"
              style={{ background: `${currentMood.color}12`, color: currentMood.color }}
            >
              {currentContent.tag}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 rounded-full bg-white/10 overflow-hidden mb-3">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${currentMood.color}, ${currentMood.color}88)`,
              transition: "none",
            }}
          />
        </div>

        {/* Dot indicators + hint */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(totalItems, 8) }).map((_, i) => {
              const isActive = i === contentIndex % Math.min(totalItems, 8);
              return (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? "18px" : "5px",
                    height: "5px",
                    background: isActive ? currentMood.color : "rgba(255,255,255,0.2)",
                  }}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            {holding ? "releasing…" : "hold · swipe up/down"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pulse;
