import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Eye, EyeOff, Sparkles, Send, Bell, X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { label: "All", emoji: "✨", gradient: "from-primary to-secondary" },
  { label: "Grinding", emoji: "💪", gradient: "from-orange-500 to-red-500" },
  { label: "Lost", emoji: "🌧️", gradient: "from-blue-500 to-indigo-500" },
  { label: "Hyped", emoji: "🔥", gradient: "from-yellow-400 to-orange-500" },
  { label: "Healing", emoji: "🌿", gradient: "from-emerald-500 to-teal-500" },
  { label: "Creative", emoji: "🎨", gradient: "from-purple-500 to-pink-500" },
];

interface Reply {
  id: number;
  text: string;
  timeAgo: string;
}

interface Post {
  id: number;
  mood: string;
  content: string;
  timeAgo: string;
  revealed: boolean;
  author?: string;
  replies: Reply[];
}

const initialPosts: Post[] = [
  { id: 1, mood: "Grinding", content: "3 AM and still going. This project won't finish itself but I'm getting closer every hour.", timeAgo: "12m", revealed: false, author: "Alex", replies: [{ id: 1, text: "You got this! 🔥", timeAgo: "5m" }] },
  { id: 2, mood: "Lost", content: "Does anyone else feel like they're just pretending to have it together? Asking for myself.", timeAgo: "28m", revealed: false, author: "Sam", replies: [] },
  { id: 3, mood: "Hyped", content: "JUST GOT ACCEPTED!! I can't believe this is real 😭🎉", timeAgo: "1h", revealed: false, author: "Maya", replies: [{ id: 1, text: "CONGRATS!!", timeAgo: "45m" }, { id: 2, text: "So proud of you!", timeAgo: "30m" }] },
  { id: 4, mood: "Healing", content: "Went on a walk without my phone today. The sky was really beautiful. That's it. That's the post.", timeAgo: "2h", revealed: false, author: "Priya", replies: [] },
  { id: 5, mood: "Creative", content: "Started writing a song about how weird it is to exist. It's either going to be really good or really bad.", timeAgo: "3h", revealed: false, author: "Jordan", replies: [] },
  { id: 6, mood: "Grinding", content: "Failed the test. Gonna study harder. No other option.", timeAgo: "4h", revealed: false, author: "Nina", replies: [] },
];

const realTalkPosts = [
  { id: 101, content: "I don't think I'm good enough for the people around me.", timeAgo: "5m", replies: [{ id: 1, text: "You are. Trust me.", timeAgo: "2m" }] },
  { id: 102, content: "Sometimes I just want someone to ask me how I'm doing and actually mean it.", timeAgo: "18m", replies: [] },
  { id: 103, content: "I've been putting on a brave face for months. I'm exhausted.", timeAgo: "1h", replies: [] },
];

const notifications = [
  { id: 1, text: "Someone replied to your post", time: "2m ago", read: false },
  { id: 2, text: "Your Focus Mode streak: 3 days 🔥", time: "1h ago", read: false },
  { id: 3, text: "New Vibe Room: Late Night Thoughts", time: "3h ago", read: true },
  { id: 4, text: "You unlocked: Voice Notes! 🎙️", time: "Yesterday", read: true },
];

const moodColors: Record<string, string> = {
  Grinding: "from-orange-500 to-red-500",
  Lost: "from-blue-500 to-indigo-500",
  Hyped: "from-yellow-400 to-orange-500",
  Healing: "from-emerald-500 to-teal-500",
  Creative: "from-purple-500 to-pink-500",
};

const Index = () => {
  const navigate = useNavigate();
  const [activeMood, setActiveMood] = useState("All");
  const [reacted, setReacted] = useState<Set<number>>(new Set());
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [showRealTalk, setShowRealTalk] = useState(false);
  const [realTalkReplyTexts, setRealTalkReplyTexts] = useState<Record<number, string>>({});
  const [realTalkExpanded, setRealTalkExpanded] = useState<number | null>(null);
  const [rtPosts, setRtPosts] = useState(realTalkPosts);
  const [notifOpen, setNotifOpen] = useState(false);
  const { toast } = useToast();

  const filtered = activeMood === "All" ? posts : posts.filter(p => p.mood === activeMood);

  const handleReact = (id: number) => {
    setReacted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleReveal = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, revealed: !p.revealed } : p));
  };

  const handleReply = (postId: number) => {
    const text = replyTexts[postId]?.trim();
    if (!text) return;
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, replies: [...p.replies, { id: p.replies.length + 1, text, timeAgo: "now" }] }
        : p
    ));
    setReplyTexts(prev => ({ ...prev, [postId]: "" }));
  };

  const handleRealTalkReply = (postId: number) => {
    const text = realTalkReplyTexts[postId]?.trim();
    if (!text) return;
    setRtPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, replies: [...p.replies, { id: p.replies.length + 1, text, timeAgo: "now" }] }
        : p
    ));
    setRealTalkReplyTexts(prev => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-foreground">StarDust</h1>
          <p className="text-xs text-muted-foreground">Express yourself freely</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-9 h-9 rounded-full btn-glass flex items-center justify-center relative"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-primary flex items-center justify-center text-[8px] font-bold text-foreground">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div
                  className="absolute right-0 top-11 w-72 z-50 glass-card-elevated overflow-hidden"
                  style={{ animation: 'fade-in-up 0.2s ease-out forwards' }}
                >
                  <div className="flex items-center justify-between p-3 border-b border-border/30">
                    <span className="text-xs font-semibold text-foreground">Notifications</span>
                    <button onClick={() => setNotifOpen(false)}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-3 py-2.5 border-b border-border/10 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <p className="text-xs text-foreground">{n.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setShowRealTalk(!showRealTalk)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              showRealTalk
                ? "gradient-primary text-foreground btn-glow"
                : "btn-glass text-muted-foreground"
            }`}
          >
            🤫 Real Talk
          </button>
        </div>
      </header>

      {/* Real Talk Section */}
      {showRealTalk && (
        <section className="mb-6" style={{ animation: 'fade-in-up 0.3s ease-out forwards' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anonymous Confessions</span>
          </div>
          <div className="space-y-3">
            {rtPosts.map((post, i) => (
              <div
                key={post.id}
                className="glass-card-elevated p-4 opacity-0"
                style={{ animation: `fade-in-up 0.3s ease-out ${i * 60}ms forwards` }}
              >
                <p className="text-sm text-foreground/90 leading-relaxed mb-2">{post.content}</p>
                <p className="text-[10px] text-muted-foreground mb-2">{post.timeAgo}</p>

                <button
                  onClick={() => setRealTalkExpanded(realTalkExpanded === post.id ? null : post.id)}
                  className="text-xs text-primary font-medium mb-2"
                >
                  {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                </button>

                {realTalkExpanded === post.id && (
                  <div className="mt-2 space-y-2" style={{ animation: 'fade-in-up 0.2s ease-out forwards' }}>
                    {post.replies.map(r => (
                      <div key={r.id} className="glass-card px-3 py-2 rounded-xl">
                        <p className="text-xs text-foreground/80">{r.text}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{r.timeAgo}</p>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        value={realTalkReplyTexts[post.id] || ""}
                        onChange={e => setRealTalkReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleRealTalkReply(post.id)}
                        placeholder="Reply anonymously..."
                        className="flex-1 bg-muted/30 rounded-full px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border/50 focus:border-primary/50"
                      />
                      <button
                        onClick={() => handleRealTalkReply(post.id)}
                        className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0"
                      >
                        <Send className="w-3 h-3 text-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Discover Features */}
      {!showRealTalk && (
        <section className="mb-5 opacity-0" style={{ animation: 'fade-in-up 0.4s ease-out forwards' }}>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">✨ Discover</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {[
              { label: "Mirror", emoji: "🪞", desc: "See how others see you", path: "/mirror", gradient: "from-indigo-500/20 to-purple-500/20" },
              { label: "Echo Chain", emoji: "🔗", desc: "Pass thoughts forward", path: "/echo", gradient: "from-emerald-500/20 to-teal-500/20" },
              { label: "Signal", emoji: "⚡", desc: "15 min live window", path: "/signal", gradient: "from-orange-500/20 to-red-500/20" },
              { label: "Pulse", emoji: "💫", desc: "Quiet emotional stream", path: "/pulse", gradient: "from-violet-500/20 to-fuchsia-500/20" },
            ].map((item, i) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="glass-card-elevated p-3 min-w-[130px] text-left shrink-0 haptic-press opacity-0"
                style={{ animation: `fade-in-up 0.3s ease-out ${i * 60}ms forwards` }}
              >
                <span className="text-xl block mb-1">{item.emoji}</span>
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[9px] text-muted-foreground">{item.desc}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Mood Filter */}
      {!showRealTalk && (
        <>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 -mx-1 px-1">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setActiveMood(m.label)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all duration-300 haptic-press ${
                  activeMood === m.label
                    ? `bg-gradient-to-r ${m.gradient} text-foreground shadow-lg scale-105`
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* Posts */}
          <section className="space-y-3">
            {filtered.map((post, i) => (
              <div
                key={post.id}
                className="glass-card-elevated p-4 opacity-0"
                style={{ animation: `fade-in-up 0.4s ease-out ${i * 80}ms forwards` }}
              >
                {/* Post header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${
                    post.revealed ? "bg-primary/20 text-primary" : "bg-muted/50 backdrop-blur-sm"
                  }`}>
                    {post.revealed ? post.author?.[0] : "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {post.revealed ? (
                        <span className="text-primary font-medium" style={{ animation: 'fade-in 0.3s ease-out' }}>{post.author}</span>
                      ) : (
                        "anonymous"
                      )} · {post.timeAgo}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${moodColors[post.mood]} text-foreground`}>
                    {post.mood}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-foreground/90 leading-relaxed mb-3">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleReact(post.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all duration-300 haptic-press ${
                      reacted.has(post.id)
                        ? "bg-pink-500/20 text-pink-400"
                        : "btn-glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${reacted.has(post.id) ? "fill-current" : ""}`} />
                    Feel this
                  </button>
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs btn-glass text-muted-foreground hover:text-foreground transition-all haptic-press"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply {post.replies.length > 0 && `(${post.replies.length})`}
                  </button>
                  <button
                    onClick={() => handleReveal(post.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ml-auto haptic-press ${
                      post.revealed
                        ? "bg-primary/20 text-primary"
                        : "btn-glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {post.revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {post.revealed ? "Hide" : "Reveal"}
                  </button>
                </div>

                {/* Reply Thread */}
                {expandedPost === post.id && (
                  <div className="mt-3 pt-3 border-t border-border/20 space-y-2" style={{ animation: 'fade-in-up 0.2s ease-out forwards' }}>
                    {post.replies.map(r => (
                      <div key={r.id} className="glass-card px-3 py-2 rounded-xl">
                        <p className="text-xs text-foreground/80">{r.text}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{r.timeAgo}</p>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        value={replyTexts[post.id] || ""}
                        onChange={e => setReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleReply(post.id)}
                        placeholder="Reply anonymously..."
                        className="flex-1 bg-muted/30 rounded-full px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border/50 focus:border-primary/50"
                      />
                      <button
                        onClick={() => handleReply(post.id)}
                        className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 haptic-press"
                      >
                        <Send className="w-3 h-3 text-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default Index;
