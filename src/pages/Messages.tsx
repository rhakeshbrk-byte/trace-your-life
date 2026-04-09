import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { conversations } from "@/data/messaging";

const Messages = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
        <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full bg-muted border border-border/50 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {/* Chat List */}
      <div className="space-y-2">
        {filtered.map((convo, i) => (
          <button
            key={convo.id}
            onClick={() => navigate(`/messages/${convo.id}`)}
            className="w-full glass-card p-4 flex items-center gap-3 hover:bg-card/80 transition-colors text-left opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                convo.avatarColor === "primary"
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary/20 text-secondary"
              }`}
            >
              {convo.initials}
            </div>

            {/* Content */}
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
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Unread */}
            {convo.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary-foreground">{convo.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Messages;
