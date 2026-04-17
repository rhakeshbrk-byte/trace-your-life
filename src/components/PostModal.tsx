import { useState, useRef } from "react";
import { X, Image, Mic, MicOff, Send } from "lucide-react";
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
  const [hasImage, setHasImage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleClose = () => {
    setStep("mood");
    setSelectedMood(null);
    setText("");
    setHasImage(false);
    setIsRecording(false);
    setVoiceSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    onClose();
  };

  const handlePost = () => {
    const parts = [];
    if (text.trim()) parts.push("text");
    if (hasImage) parts.push("photo");
    if (voiceSeconds > 0) parts.push("voice note");
    toast({
      title: "Posted! 🎉",
      description: parts.length > 0
        ? `Your ${selectedMood} post with ${parts.join(", ")} is live`
        : `Your ${selectedMood} post is live`,
    });
    handleClose();
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsRecording(true);
      setVoiceSeconds(0);
      intervalRef.current = setInterval(() => setVoiceSeconds(p => p + 1), 1000);
    }
  };

  const mood = moods.find(m => m.label === selectedMood);

  if (!open) return null;

  return (
    <div
      data-testid="post-modal"
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ animation: "fade-in 0.2s ease-out" }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{
          animation: "slide-up 0.3s ease-out",
          background: "rgba(18, 18, 24, 0.95)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.06)",
          minHeight: "60vh",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            data-testid="button-close-post-modal"
            onClick={handleClose}
            className="p-2 rounded-full btn-glass haptic-press"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="text-sm font-bold text-foreground">
            {step === "mood" ? "How are you feeling?" : `${mood?.emoji} ${selectedMood}`}
          </h2>
          {step === "write" ? (
            <button
              data-testid="button-submit-post"
              onClick={handlePost}
              disabled={!text.trim() && !hasImage && voiceSeconds === 0}
              className="px-4 py-1.5 rounded-full text-xs font-semibold gradient-primary text-primary-foreground btn-glow disabled:opacity-40 haptic-press"
            >
              Post
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {step === "mood" ? (
          <div className="px-4 pb-8" data-testid="post-modal-mood-step">
            <p className="text-xs text-muted-foreground text-center mb-6">Select a mood to start</p>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((m, i) => (
                <button
                  key={m.label}
                  data-testid={`button-post-mood-${m.label.toLowerCase()}`}
                  onClick={() => { setSelectedMood(m.label); setStep("write"); }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${m.gradient} flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 haptic-press`}
                  style={{ animation: `fade-in-up 0.3s ease-out ${i * 60}ms forwards` }}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-sm font-bold text-foreground">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 pb-8 flex flex-col gap-4" data-testid="post-modal-write-step">
            <textarea
              data-testid="textarea-post-content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              autoFocus
              className="w-full min-h-[160px] bg-transparent text-foreground text-base placeholder:text-muted-foreground outline-none resize-none leading-relaxed"
            />

            {(hasImage || voiceSeconds > 0) && (
              <div className="flex gap-2 flex-wrap">
                {hasImage && (
                  <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-1">
                    📷 Photo attached
                    <button
                      data-testid="button-remove-photo"
                      onClick={() => setHasImage(false)}
                      className="ml-1"
                      aria-label="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {voiceSeconds > 0 && !isRecording && (
                  <div className="px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs text-secondary flex items-center gap-1">
                    🎙️ {voiceSeconds}s voice note
                    <button
                      data-testid="button-remove-voice"
                      onClick={() => setVoiceSeconds(0)}
                      className="ml-1"
                      aria-label="Remove voice note"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card" data-testid="recording-indicator">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive" style={{ animation: "glow-breathe 1s ease-in-out infinite" }} />
                <span className="text-xs text-foreground">Recording... {voiceSeconds}s</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                data-testid="button-add-photo"
                onClick={() => { setHasImage(true); toast({ title: "Photo added" }); }}
                className="p-2.5 rounded-full btn-glass haptic-press"
                aria-label="Add photo"
              >
                <Image className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                data-testid="button-toggle-recording"
                onClick={toggleRecording}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                aria-pressed={isRecording}
                className={`p-2.5 rounded-full haptic-press ${isRecording ? "gradient-primary btn-glow" : "btn-glass"}`}
              >
                {isRecording ? <MicOff className="w-5 h-5 text-foreground" /> : <Mic className="w-5 h-5 text-muted-foreground" />}
              </button>
              <div className="flex-1" />
              <button
                data-testid="button-change-mood"
                onClick={() => setStep("mood")}
                className="px-3 py-1.5 rounded-full text-xs btn-glass text-muted-foreground haptic-press"
              >
                Change mood
              </button>
              <button
                data-testid="button-post-send"
                onClick={handlePost}
                disabled={!text.trim() && !hasImage && voiceSeconds === 0}
                className="p-2.5 rounded-full gradient-primary btn-glow haptic-press disabled:opacity-30"
                aria-label="Post"
              >
                <Send className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;
