import { useState } from "react";
import { X, Image, Mic, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { label: "Grinding", emoji: "💪", gradient: "from-orange-500 to-red-500" },
  { label: "Lost", emoji: "🌧️", gradient: "from-blue-500 to-indigo-500" },
  { label: "Hyped", emoji: "🔥", gradient: "from-yellow-400 to-orange-500" },
  { label: "Healing", emoji: "🌿", gradient: "from-emerald-500 to-teal-500" },
  { label: "Creative", emoji: "🎨", gradient: "from-purple-500 to-pink-500" },
];

interface PostModalProps {
  open: boolean;
  onClose: () => void;
}

const PostModal = ({ open, onClose }: PostModalProps) => {
  const [step, setStep] = useState<"mood" | "write">("mood");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleClose = () => {
    setStep("mood");
    setSelectedMood(null);
    setText("");
    onClose();
  };

  const handlePost = () => {
    toast({ title: "Posted! 🎉", description: `Your ${selectedMood} post is live` });
    handleClose();
  };

  const mood = moods.find(m => m.label === selectedMood);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" style={{ animation: 'fade-in 0.2s ease-out' }}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{
          animation: 'slide-up 0.3s ease-out',
          background: 'rgba(18, 18, 24, 0.95)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.06)',
          minHeight: '60vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={handleClose} className="p-2 rounded-full btn-glass">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="text-sm font-bold text-foreground">
            {step === "mood" ? "How are you feeling?" : `${mood?.emoji} ${selectedMood}`}
          </h2>
          {step === "write" ? (
            <button
              onClick={handlePost}
              disabled={!text.trim()}
              className="px-4 py-1.5 rounded-full text-xs font-semibold gradient-primary text-primary-foreground btn-glow disabled:opacity-40"
            >
              Post
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {step === "mood" ? (
          <div className="px-4 pb-8">
            <p className="text-xs text-muted-foreground text-center mb-6">Select a mood to start</p>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => { setSelectedMood(m.label); setStep("write"); }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${m.gradient} flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 opacity-0`}
                  style={{ animation: `fade-in-up 0.3s ease-out ${i * 60}ms forwards` }}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-sm font-bold text-foreground">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 pb-8 flex flex-col gap-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              autoFocus
              className="w-full min-h-[160px] bg-transparent text-foreground text-base placeholder:text-muted-foreground outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center gap-2">
              <button onClick={() => toast({ title: "Coming soon" })} className="p-2.5 rounded-full btn-glass">
                <Image className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={() => toast({ title: "Coming soon" })} className="p-2.5 rounded-full btn-glass">
                <Mic className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1" />
              <button onClick={() => setStep("mood")} className="px-3 py-1.5 rounded-full text-xs btn-glass text-muted-foreground">
                Change mood
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;
