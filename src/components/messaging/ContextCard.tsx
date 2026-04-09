import { Brain, MapPin, Clock, Sparkles } from "lucide-react";
import { ContactContext } from "@/data/messaging";

interface ContextCardProps {
  context: ContactContext;
}

const ContextCard = ({ context }: ContextCardProps) => (
  <div className="glass-card p-4 mx-4 mt-2 mb-3 space-y-3">
    <div className="flex items-center gap-2">
      <Brain className="w-4 h-4 text-secondary" />
      <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">
        Memory Layer
      </span>
    </div>

    <p className="text-sm text-foreground font-body">{context.memoryNote}</p>

    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3 text-primary" />
        <span>{context.lastMet}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="w-3 h-3 text-primary" />
        <span>{context.mutualAvailability}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {context.lastTopics.map((topic) => (
        <span
          key={topic}
          className="px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs text-secondary font-heading"
        >
          {topic}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-1.5">
      <Sparkles className="w-3 h-3 text-primary" />
      <span className="text-xs text-muted-foreground">
        Shared: {context.sharedInterests.join(", ")}
      </span>
    </div>
  </div>
);

export default ContextCard;
