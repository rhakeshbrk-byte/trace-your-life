import { useNavigate } from "react-router-dom";
import { MessageCircle, Brain } from "lucide-react";
import { conversations } from "@/data/messaging";

const ChatList = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center glow-green">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-heading text-gradient">Messages</h1>
              <p className="text-[10px] text-muted-foreground font-body">Context-aware conversations</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <Brain className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Conversation List */}
      <div className="max-w-2xl mx-auto p-4 space-y-2">
        {conversations.map((convo, i) => (
          <button
            key={convo.id}
            onClick={() => navigate(`/messages/${convo.id}`)}
            className="w-full glass-card p-4 flex items-center gap-3 hover:bg-card/80 transition-colors text-left opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Avatar */}
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-heading shrink-0 ${
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
                <span className="text-sm font-heading text-foreground">{convo.name}</span>
                <span className="text-[10px] text-muted-foreground font-heading shrink-0">
                  {convo.lastMessageTime}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-body truncate">{convo.lastMessage}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {convo.contextTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-heading"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Unread badge */}
            {convo.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-[10px] font-heading text-primary-foreground">{convo.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
