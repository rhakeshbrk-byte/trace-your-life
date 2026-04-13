import { MapPin, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const timelineItems = [
  { time: "9:00 AM", event: "Arrived at workspace", location: "WeWork Downtown", duration: "3h 15m", icon: MapPin },
  { time: "10:30 AM", event: "Deep focus session", location: "Desk 12", duration: "2h 15m", icon: Brain },
  { time: "12:45 PM", event: "Lunch at Sage Kitchen", location: "Sage Kitchen", duration: "45m", icon: MapPin },
  { time: "2:00 PM", event: "Meeting with Alex", location: "Blue Bottle Coffee", duration: "1h", icon: MapPin },
  { time: "3:30 PM", event: "Took a walk", location: "Central Park trail", duration: "25m", icon: MapPin },
  { time: "4:30 PM", event: "Creative session", location: "Home office", duration: "1h 30m", icon: Brain },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AnimatedCounter = ({ value, label, color }: { value: string; label: string; color: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`text-center p-3 rounded-xl bg-${color}/10 transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <p className={`text-lg font-bold text-${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
};

const Trace = () => {
  const [selectedDay, setSelectedDay] = useState(3);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const { toast } = useToast();

  const handlePrev = () => setSelectedDay((d) => (d > 0 ? d - 1 : 6));
  const handleNext = () => setSelectedDay((d) => (d < 6 ? d + 1 : 0));

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-foreground mb-1">Trace</h1>
        <p className="text-xs text-muted-foreground">Your day, mapped intelligently</p>
      </header>

      {/* Day selector */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={handlePrev} className="w-8 h-8 rounded-full btn-glass flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex gap-1 justify-between">
          {days.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDay(i)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                i === selectedDay
                  ? "gradient-primary text-foreground btn-glow"
                  : "btn-glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button onClick={handleNext} className="w-8 h-8 rounded-full btn-glass flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* AI Summary */}
      <div
        className="glass-card-elevated p-4 mb-6 opacity-0 relative overflow-hidden"
        style={{ animation: 'fade-in-up 0.5s ease-out forwards' }}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 gradient-glow" style={{ animation: 'glow-breathe 3s ease-in-out infinite' }} />
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-secondary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Summary</span>
        </div>
        <p className="text-sm text-foreground font-medium mb-3">Productive day with a good balance of focus and social time.</p>
        <div className="grid grid-cols-3 gap-3">
          <AnimatedCounter value="5.5h" label="Focus" color="primary" />
          <AnimatedCounter value="1.5h" label="Social" color="accent" />
          <AnimatedCounter value="25m" label="Movement" color="secondary" />
        </div>
      </div>

      {/* Timeline */}
      <section className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-5 bottom-5 w-px timeline-line" />

        {timelineItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setExpandedItem(expandedItem === i ? null : i)}
            className="flex gap-3 opacity-0 w-full text-left relative"
            style={{ animation: `fade-in-up 0.5s ease-out ${(i + 1) * 80}ms forwards` }}
          >
            <div className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-2xl glass-card-elevated flex items-center justify-center shrink-0 timeline-node transition-all duration-300 ${
                expandedItem === i ? "scale-110" : ""
              }`}>
                <item.icon className={`w-4 h-4 transition-all duration-300 ${
                  expandedItem === i ? "text-primary drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" : "text-primary"
                }`} />
              </div>
              {i < timelineItems.length - 1 && <div className="w-px flex-1 my-1" />}
            </div>
            <div className="pb-4 flex-1">
              <p className="text-[10px] text-muted-foreground font-medium">{item.time}</p>
              <p className="text-sm font-semibold text-foreground">{item.event}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">{item.location}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-primary font-medium">{item.duration}</span>
              </div>
              {/* Expanded detail */}
              <div className={`transition-all duration-300 overflow-hidden ${expandedItem === i ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                <p className="text-xs text-muted-foreground glass-card p-2 rounded-lg">
                  Tap to add notes or photos to this moment
                </p>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Trace;
