import { useNavigate } from "react-router-dom";
import { Search, Plus, X, MessageCircle, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { conversations } from "@/data/messaging";
import { useToast } from "@/hooks/use-toast";

const fabMenuItems = [
  { icon: MessageCircle, label: "New chat", action: "Start a new conversation" },
  { icon: Users, label: "New group", action: "Create a group chat" },
  { icon: Sparkles, label: "AI assist", action: "Get AI help composing a message" },
];

const Messages = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fabOpen, setFabOpen] = useState(false);
  const { toast } = useToast();

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto relative">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground glass-card focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((convo, i) => (
          <button
            key={convo.id}
            onClick={() => navigate(`/messages/${convo.id}`)}
            className="w-full glass-card-elevated p-4 flex items-center gap-3 text-left opacity-0 group"
            style={{ animation: `fade-in-up 0.5s ease-out ${i * 80}ms forwards` }}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 group-hover:scale-110 ${
                convo.avatarColor === "primary"
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary/20 text-secondary"
              }`}
            >
              {convo.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold text-foreground">{convo.name}</span>
                <span className="text-[10px] text-muted-foreground shrink-0">{convo.lastMessageTime}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {convo.contextTags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {convo.unread > 0 && (
              <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0" style={{ animation: 'glow-breathe 2s ease-in-out infinite' }}>
                <span className="text-[10px] font-bold text-foreground">{convo.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* FAB with expandable menu */}
      <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2">
        {/* Menu items */}
        {fabMenuItems.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 transition-all duration-300 ${
              fabOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
            style={{ transitionDelay: fabOpen ? `${i * 60}ms` : '0ms' }}
          >
            <span className="text-xs font-medium text-foreground glass-card-strong px-3 py-1.5 rounded-full">
              {item.label}
            </span>
            <button
              onClick={() => {
                toast({ title: item.label, description: item.action });
                setFabOpen(false);
              }}
              className="w-10 h-10 rounded-full glass-card-strong flex items-center justify-center btn-glass"
            >
              <item.icon className="w-4 h-4 text-primary" />
            </button>
          </div>
        ))}

        {/* FAB */}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-full gradient-primary flex items-center justify-center transition-all duration-300 ${fabOpen ? "" : "fab-pulse"}`}
          style={{ transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          {fabOpen ? <X className="w-6 h-6 text-foreground" /> : <Plus className="w-6 h-6 text-foreground" />}
        </button>
      </div>

      {/* Backdrop when FAB open */}
      {fabOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm"
          onClick={() => setFabOpen(false)}
          style={{ animation: 'fade-in 0.2s ease-out forwards' }}
        />
      )}
    </div>
  );
};

export default Messages;
