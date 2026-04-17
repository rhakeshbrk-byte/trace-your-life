import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Timer, Users, Mic, MicOff, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const rooms = [
  { id: 1, name: "Late Night Thoughts", emoji: "🌙", members: 24, timeLeft: "18h", gradient: "from-indigo-500 to-purple-600" },
  { id: 2, name: "Hype Zone", emoji: "🔥", members: 89, timeLeft: "6h", gradient: "from-orange-500 to-red-500" },
  { id: 3, name: "Study Together", emoji: "📚", members: 45, timeLeft: "12h", gradient: "from-blue-500 to-cyan-500" },
  { id: 4, name: "Vent Space", emoji: "💨", members: 31, timeLeft: "22h", gradient: "from-gray-500 to-slate-600" },
  { id: 5, name: "Creative Corner", emoji: "🎨", members: 17, timeLeft: "9h", gradient: "from-pink-500 to-purple-500" },
  { id: 6, name: "Music Share", emoji: "🎵", members: 63, timeLeft: "15h", gradient: "from-emerald-500 to-teal-500" },
];

const roomMessages = [
  { id: 1, text: "anyone else can't sleep?", timeAgo: "2m", isMe: false },
  { id: 2, text: "literally same. my brain won't shut up", timeAgo: "1m", isMe: false },
  { id: 3, text: "I'm just vibing with music rn", timeAgo: "30s", isMe: true },
  { id: 4, text: "what are you listening to?", timeAgo: "15s", isMe: false },
];

const Rooms = () => {
  const [activeRoom, setActiveRoom] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState(roomMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recordRef = useRef<NodeJS.Timeout | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const sendMsg = () => {
    if (!msg.trim()) return;
    setMsgs(prev => [...prev, { id: prev.length + 1, text: msg.trim(), timeAgo: "now", isMe: true }]);
    setMsg("");
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordTime(0);
    recordRef.current = setInterval(() => setRecordTime(p => p + 1), 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordRef.current) clearInterval(recordRef.current);
    setMsgs(prev => [...prev, { id: prev.length + 1, text: `🎙️ Voice note — ${recordTime}s`, timeAgo: "now", isMe: true }]);
    setRecordTime(0);
  };

  const sendImage = () => {
    setMsgs(prev => [...prev, { id: prev.length + 1, text: "📷 Photo", timeAgo: "now", isMe: true }]);
    toast({ title: "Photo sent" });
  };

  const room = rooms.find(r => r.id === activeRoom);

  if (activeRoom && room) {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)] max-w-lg mx-auto">
        <header className="flex items-center gap-3 px-4 py-3 glass-card-strong">
          <button onClick={() => setActiveRoom(null)} className="p-1.5 rounded-full btn-glass haptic-press">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-foreground">{room.emoji} {room.name}</h2>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{room.members}</span>
              <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{room.timeLeft} left</span>
              <span className="text-destructive">● auto-deletes</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-hide">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.isMe ? "justify-end" : "justify-start"} message-bubble-enter`}>
              <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${
                m.isMe
                  ? "gradient-primary text-foreground rounded-br-md"
                  : "glass-card text-foreground/90 rounded-bl-md"
              }`}>
                <p>{m.text}</p>
                <p className="text-[9px] text-foreground/40 mt-1">{m.timeAgo}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {isRecording && (
          <div className="px-4 py-2 glass-card-strong flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive" style={{ animation: 'glow-breathe 1s ease-in-out infinite' }} />
              <span className="text-xs text-foreground">Recording... {recordTime}s</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setIsRecording(false); if (recordRef.current) clearInterval(recordRef.current); }} className="w-8 h-8 rounded-full btn-glass flex items-center justify-center"><X className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={stopRecording} className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center"><Send className="w-3.5 h-3.5 text-foreground" /></button>
            </div>
          </div>
        )}

        <div className="px-4 py-3 glass-card-strong">
          <div className="flex items-center gap-2">
            <button onClick={sendImage} className="p-2 rounded-full btn-glass haptic-press">
              <Image className="w-4 h-4 text-muted-foreground" />
            </button>
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Say something..."
              className="flex-1 bg-muted/30 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/50 focus:border-primary/50 transition-colors"
            />
            <button onClick={isRecording ? stopRecording : startRecording} className={`p-2 rounded-full haptic-press ${isRecording ? "gradient-primary btn-glow" : "btn-glass"}`}>
              {isRecording ? <MicOff className="w-4 h-4 text-foreground" /> : <Mic className="w-4 h-4 text-muted-foreground" />}
            </button>
            <button
              onClick={sendMsg}
              disabled={!msg.trim()}
              className="p-2 rounded-full gradient-primary btn-glow disabled:opacity-30 haptic-press"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <header className="mb-5">
        <h1 className="text-lg font-bold text-foreground">Vibe Rooms</h1>
        <p className="text-xs text-muted-foreground">24h spaces. No history. Just vibes.</p>
      </header>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-6 py-2">
        {rooms.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setActiveRoom(r.id)}
            className="flex flex-col items-center gap-2 shrink-0 opacity-0 haptic-press"
            style={{ animation: `fade-in-up 0.4s ease-out ${i * 60}ms forwards` }}
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-2xl relative pill-interactive`}>
              {r.emoji}
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px] bg-background/80 backdrop-blur px-1.5 py-0.5 rounded-full text-muted-foreground border border-border/30">
                {r.timeLeft}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium w-16 text-center truncate">{r.name}</span>
          </button>
        ))}
      </div>

      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Rooms</h2>
      <section className="space-y-2">
        {rooms.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setActiveRoom(r.id)}
            className="w-full glass-card-elevated p-4 flex items-center gap-3 text-left opacity-0 haptic-press"
            style={{ animation: `fade-in-up 0.4s ease-out ${i * 60 + 200}ms forwards` }}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-lg shrink-0`}>
              {r.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground">{r.name}</h3>
              <p className="text-[10px] text-muted-foreground">{r.members} people · {r.timeLeft} left</p>
            </div>
            <Timer className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </section>
    </div>
  );
};

export default Rooms;
