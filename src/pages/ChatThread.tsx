import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MoreVertical, Plus, Mic, Send, Image, Calendar, Users, HelpCircle, Share2, MicOff, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { chatMessages, contactContexts, aiSuggestions, Message } from "@/data/messaging";
import ContextCard from "@/components/messaging/ContextCard";
import MessageBubble from "@/components/messaging/MessageBubble";
import { useToast } from "@/hooks/use-toast";

const intentActions = [
  { icon: Calendar, label: "Plan", color: "text-primary", desc: "Schedule something" },
  { icon: Users, label: "Meet", color: "text-accent", desc: "Set up a meetup" },
  { icon: HelpCircle, label: "Ask", color: "text-secondary", desc: "Ask a question" },
  { icon: Share2, label: "Share", color: "text-pink-400", desc: "Share something" },
];

const ChatThread = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [showIntents, setShowIntents] = useState(false);
  const recordInterval = useRef<NodeJS.Timeout | null>(null);
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
    setShowIntents(false);
  };

  const handleIntent = (label: string) => {
    setText(`[${label}] `);
    setShowIntents(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordTime(0);
    recordInterval.current = setInterval(() => setRecordTime(p => p + 1), 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordInterval.current) clearInterval(recordInterval.current);
    const newMsg: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: `🎙️ Voice note — ${recordTime}s`,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, newMsg]);
    toast({ title: "Voice note sent", description: `${recordTime}s recording sent with AI summary` });
    setRecordTime(0);
  };

  const handleImageAttach = () => {
    const newMsg: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: "📷 Photo attached",
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, newMsg]);
    setShowAttach(false);
    toast({ title: "Photo sent" });
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
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center haptic-press"
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
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center haptic-press"
          >
            <Phone className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => toast({ title: "Options", description: "Mute, block, or view contact info" })}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center haptic-press"
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

      {/* Recording overlay */}
      {isRecording && (
        <div className="absolute inset-x-0 bottom-0 z-20 p-4" style={{
          background: 'rgba(11, 11, 15, 0.95)',
          backdropFilter: 'blur(24px)',
          animation: 'fade-in 0.2s ease-out',
        }}>
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-destructive" style={{ animation: 'glow-breathe 1s ease-in-out infinite' }} />
              <span className="text-sm text-foreground font-medium">Recording... {recordTime}s</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setIsRecording(false); if (recordInterval.current) clearInterval(recordInterval.current); setRecordTime(0); }} className="w-10 h-10 rounded-full btn-glass flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={stopRecording} className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center btn-glow">
                <Send className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10" style={{
        background: 'rgba(11, 11, 15, 0.85)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Intent Actions */}
        {showIntents && (
          <div className="max-w-lg mx-auto flex gap-2 px-4 pt-2" style={{ animation: 'fade-in-up 0.2s ease-out forwards' }}>
            {intentActions.map(a => (
              <button
                key={a.label}
                onClick={() => handleIntent(a.label)}
                className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl btn-glass haptic-press"
              >
                <a.icon className={`w-4 h-4 ${a.color}`} />
                <span className="text-[10px] text-muted-foreground font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* AI Suggestions */}
        <div className="max-w-lg mx-auto flex items-center gap-2 px-4 pt-2 pb-1 overflow-x-auto scrollbar-hide">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => setText(s.label)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-medium text-secondary hover:bg-secondary/20 transition-colors haptic-press"
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        {/* Attach menu */}
        {showAttach && (
          <div className="max-w-lg mx-auto flex gap-2 px-4 py-2" style={{ animation: 'fade-in-up 0.2s ease-out forwards' }}>
            <button onClick={handleImageAttach} className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-glass text-xs text-muted-foreground haptic-press">
              <Image className="w-4 h-4" /> Photo
            </button>
            <button onClick={() => { setShowAttach(false); toast({ title: "Location sharing coming soon" }); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-glass text-xs text-muted-foreground haptic-press">
              📍 Location
            </button>
            <button onClick={() => { setShowAttach(false); toast({ title: "File sharing coming soon" }); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-glass text-xs text-muted-foreground haptic-press">
              📄 File
            </button>
          </div>
        )}

        <div className="max-w-lg mx-auto flex items-center gap-2 p-3">
          <button
            onClick={() => { setShowAttach(!showAttach); setShowIntents(false); }}
            className={`w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0 haptic-press transition-transform duration-300 ${showAttach ? "rotate-45" : ""}`}
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => { setShowIntents(!showIntents); setShowAttach(false); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 haptic-press transition-all ${
              showIntents ? "gradient-primary btn-glow" : "glass-card"
            }`}
          >
            <span className="text-sm">⚡</span>
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
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 haptic-press ${
              isRecording ? "gradient-primary btn-glow" : "glass-card"
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5 text-foreground" /> : <Mic className="w-5 h-5 text-muted-foreground" />}
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0 disabled:opacity-30 transition-all btn-glow haptic-press"
          >
            <Send className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
