import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MoreVertical, Plus, Mic, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { chatMessages, contactContexts, aiSuggestions, Message } from "@/data/messaging";
import ContextCard from "@/components/messaging/ContextCard";
import MessageBubble from "@/components/messaging/MessageBubble";
import { useToast } from "@/hooks/use-toast";

const ChatThread = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const { toast } = useToast();

  const context = contactContexts[id || ""];
  const suggestions = aiSuggestions[id || ""] || [];
  const [messages, setMessages] = useState<Message[]>(chatMessages[id || ""] || []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!context) {
    navigate("/messages");
    return null;
  }

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  return (
    <div className="h-screen bg-background flex flex-col relative">
      <div className="aurora-bg">
        <div className="aurora-blob" />
      </div>

      <header className="relative z-10 px-4 py-3" style={{
        background: 'rgba(11, 11, 15, 0.85)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {context.initials}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{context.name}</p>
            <p className="text-[10px] text-muted-foreground">
              Met at gym • Likes startups
            </p>
          </div>
          <button
            onClick={() => toast({ title: "Calling...", description: `Calling ${context.name}` })}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
          >
            <Phone className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => toast({ title: "Options", description: "Mute, block, or view contact info" })}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-lg mx-auto">
          <ContextCard context={context} />
        </div>
        <div className="max-w-lg mx-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative z-10" style={{
        background: 'rgba(11, 11, 15, 0.85)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="max-w-lg mx-auto flex items-center gap-2 px-4 pt-2 pb-1 overflow-x-auto scrollbar-hide">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => setText(s.label)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-medium text-secondary hover:bg-secondary/20 transition-colors"
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
        <div className="max-w-lg mx-auto flex items-center gap-2 p-3">
          <button
            onClick={() => toast({ title: "Attach", description: "Photo, file, or location" })}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0"
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            style={{
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
          <button
            onClick={() => toast({ title: "🎤 Recording...", description: "Voice note started" })}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0"
          >
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0 disabled:opacity-30 transition-all btn-glow"
          >
            <Send className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
