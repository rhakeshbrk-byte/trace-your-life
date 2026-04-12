import { MapPin, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
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

const Trace = () => {
  const [selectedDay, setSelectedDay] = useState(3);
  const { toast } = useToast();

  const handlePrev = () => {
    setSelectedDay((d) => (d > 0 ? d - 1 : 6));
  };

  const handleNext = () => {
    setSelectedDay((d) => (d < 6 ? d + 1 : 0));
  };

  const handleTimelineClick = (item: typeof timelineItems[0]) => {
    toast({ title: item.event, description: `${item.location} • ${item.duration}` });
  };

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-foreground mb-1">Trace</h1>
        <p className="text-xs text-muted-foreground">Your day, mapped intelligently</p>
      </header>

      <div className="flex items-center gap-2 mb-6">
        <button onClick={handlePrev} className="w-8 h-8 rounded-full glass-card flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex gap-1 justify-between">
          {days.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDay(i)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                i === selectedDay
                  ? "gradient-primary text-foreground btn-glow"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button onClick={handleNext} className="w-8 h-8 rounded-full glass-card flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="glass-card p-4 mb-6 opacity-0" style={{ animation: 'fade-in-up 0.5s ease-out forwards' }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-secondary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Summary</span>
        </div>
        <p className="text-sm text-foreground font-medium mb-3">Productive day with a good balance of focus and social time.</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-xl bg-primary/10">
            <p className="text-lg font-bold text-primary">5.5h</p>
            <p className="text-[10px] text-muted-foreground">Focus</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-accent/10">
            <p className="text-lg font-bold text-accent">1.5h</p>
            <p className="text-[10px] text-muted-foreground">Social</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-secondary/10">
            <p className="text-lg font-bold text-secondary">25m</p>
            <p className="text-[10px] text-muted-foreground">Movement</p>
          </div>
        </div>
      </div>

      <section className="space-y-0">
        {timelineItems.map((item, i) => (
          <button
            key={i}
            onClick={() => handleTimelineClick(item)}
            className="flex gap-3 opacity-0 w-full text-left"
            style={{ animation: `fade-in-up 0.5s ease-out ${(i + 1) * 80}ms forwards` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              {i < timelineItems.length - 1 && (
                <div className="w-px flex-1 my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              )}
            </div>
            <div className="pb-4 flex-1">
              <p className="text-[10px] text-muted-foreground font-medium">{item.time}</p>
              <p className="text-sm font-semibold text-foreground">{item.event}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">{item.location}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-primary font-medium">{item.duration}</span>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Trace;
