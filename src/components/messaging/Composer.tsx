import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { AISuggestion } from "@/data/messaging";

interface ComposerProps {
  suggestions: AISuggestion[];
  onSend: (text: string) => void;
}

const Composer = ({ suggestions, onSend }: ComposerProps) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl">
      {/* AI Suggestion Chips */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-hide">
        <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => setText(s.label)}
            className="shrink-0 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-heading text-secondary hover:bg-secondary/20 transition-colors"
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-30"
        >
          <Send className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Composer;
