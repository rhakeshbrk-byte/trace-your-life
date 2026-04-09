import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { chatMessages, contactContexts, aiSuggestions, Message } from "@/data/messaging";
import ContextCard from "@/components/messaging/ContextCard";
import MessageBubble from "@/components/messaging/MessageBubble";
import Composer from "@/components/messaging/Composer";

const ChatThread = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSend = (text: string) => {
    const newMsg: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading bg-primary/20 text-primary`}
          >
            {context.initials}
          </div>

          <div className="flex-1">
            <p className="text-sm font-heading text-foreground">{context.name}</p>
            <p className="text-[10px] text-primary font-heading">
              {context.mutualAvailability}
            </p>
          </div>

          <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <Phone className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Context Card */}
        <div className="max-w-2xl mx-auto">
          <ContextCard context={context} />
        </div>

        {/* Messages */}
        <div className="max-w-2xl mx-auto px-4 py-2 space-y-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="max-w-2xl mx-auto w-full">
        <Composer suggestions={suggestions} onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatThread;
