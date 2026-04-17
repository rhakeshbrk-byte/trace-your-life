import { useState } from "react";
import { Users, Plus, Eye, EyeOff, Send, Sparkles, ArrowLeft, X, Check, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const circleMembers = [
  { id: 1, name: "Alex", initial: "A", color: "from-indigo-500 to-blue-500" },
  { id: 2, name: "Sam", initial: "S", color: "from-purple-500 to-pink-500" },
  { id: 3, name: "Maya", initial: "M", color: "from-emerald-500 to-teal-500" },
  { id: 4, name: "Priya", initial: "P", color: "from-orange-500 to-red-500" },
  { id: 5, name: "Jordan", initial: "J", color: "from-yellow-400 to-orange-500" },
];

interface Trait {
  id: number;
  label: string;
  icon: string;
  score: number;
  responses: string[];
}

const sampleTraits: Trait[] = [
  { id: 1, label: "Loyal", icon: "🛡️", score: 92, responses: ["Always has my back", "Never breaks a promise", "The most reliable person I know"] },
  { id: 2, label: "Creative", icon: "🎨", score: 85, responses: ["Thinks outside the box", "Amazing ideas constantly", "Super artistic energy"] },
  { id: 3, label: "Empathetic", icon: "💛", score: 88, responses: ["Really listens when I talk", "Understands without judging", "Makes me feel seen"] },
  { id: 4, label: "Honest", icon: "💎", score: 78, responses: ["Tells it like it is", "Gives real advice", "Straightforward but kind"] },
  { id: 5, label: "Funny", icon: "😂", score: 95, responses: ["Can't stop laughing around them", "Best sense of humor ever"] },
  { id: 6, label: "Calm", icon: "🌊", score: 70, responses: ["Never overreacts", "Stays chill under pressure"] },
];

const prompts = [
  { id: 1, question: "What's their best quality?", type: "choice" as const, options: ["Loyalty", "Creativity", "Empathy", "Humor", "Honesty"] },
  { id: 2, question: "One word that describes them?", type: "text" as const },
  { id: 3, question: "How do they make you feel?", type: "choice" as const, options: ["Safe", "Inspired", "Understood", "Energized", "Calm"] },
  { id: 4, question: "What would you tell them if they could never know it was you?", type: "text" as const },
];

type Screen = "home" | "circle" | "prompts" | "report" | "trait";

const Mirror = () => {
  const { toast } = useToast();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedPeople, setSelectedPeople] = useState<Set<number>>(new Set());
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);
  const [promptAnswers, setPromptAnswers] = useState<Record<number, string>>({});
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [reportUnlocked, setReportUnlocked] = useState(false);
  const [responseVisibility, setResponseVisibility] = useState<Record<string, boolean>>({});

  const togglePerson = (id: number) => {
    setSelectedPeople(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else if (next.size < 5) next.add(id);
      return next;
    });
  };

  const toggleVisibility = (key: string) => {
    setResponseVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // HOME
  if (screen === "home") {
    return (
      <div className="px-4 pt-4 pb-4 max-w-2xl mx-auto" data-testid="mirror-home">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-foreground mb-1">🪞 Mirror</h1>
          <p className="text-xs text-muted-foreground">See yourself through others' eyes</p>
        </header>

        <div
          className="glass-card-elevated p-6 text-center mb-6 opacity-0"
          style={{ animation: "fade-in-up 0.5s ease-out forwards" }}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-glow flex items-center justify-center">
            <span className="text-3xl">🪞</span>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">See how people see you</h2>
          <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto leading-relaxed">
            Select 5 people you trust. They answer honest prompts about you. Unlock your personal trait report.
          </p>
          <button
            data-testid="button-start-mirror"
            onClick={() => setScreen("circle")}
            className="px-6 py-3 rounded-full gradient-primary text-sm font-semibold text-foreground btn-glow haptic-press"
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Start My Mirror
          </button>
        </div>

        {reportUnlocked && (
          <div className="opacity-0" style={{ animation: "fade-in-up 0.5s ease-out 100ms forwards" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Traits</span>
              <button
                data-testid="link-full-report"
                onClick={() => setScreen("report")}
                className="text-xs text-primary font-medium"
              >
                Full Report →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sampleTraits.slice(0, 3).map((t, i) => (
                <button
                  key={t.id}
                  data-testid={`button-trait-preview-${t.id}`}
                  onClick={() => { setSelectedTrait(t); setScreen("trait"); }}
                  className="glass-card-elevated p-3 text-center opacity-0 haptic-press"
                  style={{ animation: `fade-in-up 0.4s ease-out ${i * 80}ms forwards` }}
                >
                  <span className="text-2xl block mb-1">{t.icon}</span>
                  <p className="text-xs font-semibold text-foreground">{t.label}</p>
                  <p className="text-[10px] text-primary">{t.score}%</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 opacity-0" style={{ animation: "fade-in-up 0.5s ease-out 150ms forwards" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Circle</span>
            <button
              data-testid="link-manage-circle"
              onClick={() => setScreen("circle")}
              className="text-xs text-primary font-medium"
            >
              Manage →
            </button>
          </div>
          <div className="glass-card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {circleMembers.slice(0, 4).map(m => (
                  <div key={m.id} className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-[10px] font-bold text-foreground border-2 border-background`}>
                    {m.initial}
                  </div>
                ))}
                {circleMembers.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-[10px] font-medium text-muted-foreground border-2 border-background">
                    +{circleMembers.length - 4}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex-1">{circleMembers.length} trusted people</p>
              <button
                data-testid="button-add-circle-member"
                onClick={() => toast({ title: "Add People", description: "Invite friends to your Mirror circle" })}
                className="w-8 h-8 rounded-full btn-glass flex items-center justify-center haptic-press"
                aria-label="Add people to circle"
              >
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CIRCLE
  if (screen === "circle") {
    return (
      <div className="px-4 pt-4 pb-4 max-w-2xl mx-auto" data-testid="mirror-circle">
        <button
          data-testid="button-back-to-mirror-home"
          onClick={() => setScreen("home")}
          className="flex items-center gap-1 text-xs text-muted-foreground mb-4 haptic-press"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-lg font-bold text-foreground mb-1">Choose Your Circle</h2>
        <p className="text-xs text-muted-foreground mb-5">Select up to 5 people you trust for honest feedback</p>

        <div className="space-y-2 mb-6" data-testid="circle-member-list">
          {circleMembers.map((m, i) => (
            <button
              key={m.id}
              data-testid={`button-circle-member-${m.id}`}
              onClick={() => togglePerson(m.id)}
              aria-pressed={selectedPeople.has(m.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all haptic-press opacity-0 ${
                selectedPeople.has(m.id) ? "glass-card-elevated border-primary/30" : "glass-card"
              }`}
              style={{ animation: `fade-in-up 0.3s ease-out ${i * 50}ms forwards` }}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-sm font-bold text-foreground`}>
                {m.initial}
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">{m.name}</span>
              {selectedPeople.has(m.id) && (
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          data-testid="button-add-more-people"
          onClick={() => toast({ title: "Invite sent!", description: "Friends will be added to your circle" })}
          className="w-full py-3 rounded-xl btn-glass text-sm font-medium text-muted-foreground mb-3 haptic-press"
        >
          <Plus className="w-4 h-4 inline mr-2" /> Add More People
        </button>

        {selectedPeople.size >= 1 && (
          <button
            data-testid="button-send-prompts"
            onClick={() => { setCurrentPrompt(0); setScreen("prompts"); }}
            className="w-full py-3 rounded-xl gradient-primary text-sm font-semibold text-foreground btn-glow haptic-press"
            style={{ animation: "fade-in-up 0.3s ease-out forwards" }}
          >
            Send Prompts to {selectedPeople.size} {selectedPeople.size === 1 ? "person" : "people"}
          </button>
        )}
      </div>
    );
  }

  // PROMPTS
  if (screen === "prompts") {
    const prompt = prompts[currentPrompt];
    const progress = ((currentPrompt + 1) / prompts.length) * 100;

    return (
      <div className="px-4 pt-4 pb-4 max-w-2xl mx-auto" data-testid="mirror-prompts">
        <button
          data-testid="button-back-to-circle"
          onClick={() => setScreen("circle")}
          className="flex items-center gap-1 text-xs text-muted-foreground mb-4 haptic-press"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-6">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>Prompt {currentPrompt + 1} of {prompts.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
            <div
              data-testid="prompt-progress-bar"
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          key={prompt.id}
          className="glass-card-elevated p-6 mb-6 opacity-0"
          style={{ animation: "fade-in-up 0.4s ease-out forwards" }}
        >
          <p className="text-base font-semibold text-foreground mb-5">{prompt.question}</p>

          {prompt.type === "choice" && prompt.options && (
            <div className="space-y-2" data-testid="prompt-choice-options">
              {prompt.options.map(opt => (
                <button
                  key={opt}
                  data-testid={`button-prompt-option-${opt.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => setPromptAnswers(prev => ({ ...prev, [prompt.id]: opt }))}
                  aria-pressed={promptAnswers[prompt.id] === opt}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all haptic-press ${
                    promptAnswers[prompt.id] === opt
                      ? "gradient-primary text-foreground btn-glow"
                      : "btn-glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {prompt.type === "text" && (
            <input
              data-testid="input-prompt-text"
              value={promptAnswers[prompt.id] || ""}
              onChange={e => setPromptAnswers(prev => ({ ...prev, [prompt.id]: e.target.value }))}
              placeholder="Type your answer..."
              className="w-full bg-muted/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/50 focus:border-primary/50"
            />
          )}
        </div>

        <div className="flex gap-3">
          {currentPrompt > 0 && (
            <button
              data-testid="button-prompt-previous"
              onClick={() => setCurrentPrompt(prev => prev - 1)}
              className="flex-1 py-3 rounded-xl btn-glass text-sm font-medium text-muted-foreground haptic-press"
            >
              Previous
            </button>
          )}
          <button
            data-testid="button-prompt-next"
            onClick={() => {
              if (currentPrompt < prompts.length - 1) {
                setCurrentPrompt(prev => prev + 1);
              } else {
                setReportUnlocked(true);
                setScreen("report");
                toast({ title: "🪞 Mirror Unlocked!", description: "Your trait report is ready" });
              }
            }}
            disabled={!promptAnswers[prompt.id]}
            className="flex-1 py-3 rounded-xl gradient-primary text-sm font-semibold text-foreground btn-glow haptic-press disabled:opacity-40"
          >
            {currentPrompt < prompts.length - 1 ? "Next" : "Unlock Report"}
          </button>
        </div>
      </div>
    );
  }

  // REPORT
  if (screen === "report") {
    return (
      <div className="px-4 pt-4 pb-4 max-w-2xl mx-auto" data-testid="mirror-report">
        <button
          data-testid="button-back-to-mirror-from-report"
          onClick={() => setScreen("home")}
          className="flex items-center gap-1 text-xs text-muted-foreground mb-4 haptic-press"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6 opacity-0" style={{ animation: "fade-in-up 0.5s ease-out forwards" }}>
          <div className="w-16 h-16 mx-auto mb-3 rounded-full gradient-glow flex items-center justify-center">
            <span className="text-2xl">🪞</span>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">Your Mirror Report</h2>
          <p className="text-xs text-muted-foreground">Based on {selectedPeople.size} responses from your circle</p>
        </div>

        <div className="glass-card-elevated p-4 mb-4 opacity-0" style={{ animation: "fade-in-up 0.4s ease-out 100ms forwards" }}>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personality Mood</span>
          <div className="flex gap-2 mt-3">
            {["😊 Warm", "🧠 Thoughtful", "⚡ Energetic"].map((mood, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full btn-glass text-xs text-foreground">{mood}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4" data-testid="traits-grid">
          {sampleTraits.map((t, i) => (
            <button
              key={t.id}
              data-testid={`button-trait-${t.id}`}
              onClick={() => { setSelectedTrait(t); setScreen("trait"); }}
              className="glass-card-elevated p-4 text-left opacity-0 haptic-press"
              style={{ animation: `fade-in-up 0.4s ease-out ${(i + 2) * 60}ms forwards` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.icon}</span>
                <span className="text-sm font-semibold text-foreground">{t.label}</span>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full gradient-primary rounded-full"
                  style={{ width: `${t.score}%` }}
                />
              </div>
              <p data-testid={`text-trait-score-${t.id}`} className="text-[10px] text-primary font-medium">{t.score}% match</p>
            </button>
          ))}
        </div>

        <div className="glass-card-elevated p-4 opacity-0" style={{ animation: "fade-in-up 0.4s ease-out 500ms forwards" }}>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">💬 Highlighted Responses</span>
          <div className="space-y-2">
            {["Always has my back", "Best sense of humor ever", "Makes me feel seen"].map((r, i) => (
              <div key={i} className="glass-card px-3 py-2.5 rounded-xl flex items-center justify-between">
                <p className="text-xs text-foreground/90 italic">"{r}"</p>
                <div className="flex gap-1 ml-2 shrink-0">
                  <button
                    data-testid={`button-toggle-visibility-highlight-${i}`}
                    onClick={() => toggleVisibility(`highlight-${i}`)}
                    className="p-1 rounded-full btn-glass haptic-press"
                    aria-label={responseVisibility[`highlight-${i}`] ? "Hide response" : "Show response"}
                  >
                    {responseVisibility[`highlight-${i}`] ? <EyeOff className="w-3 h-3 text-muted-foreground" /> : <Eye className="w-3 h-3 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TRAIT DETAIL
  if (screen === "trait" && selectedTrait) {
    return (
      <div className="px-4 pt-4 pb-4 max-w-2xl mx-auto" data-testid="mirror-trait-detail">
        <button
          data-testid="button-back-to-report"
          onClick={() => setScreen("report")}
          className="flex items-center gap-1 text-xs text-muted-foreground mb-4 haptic-press"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6 opacity-0" style={{ animation: "fade-in-up 0.4s ease-out forwards" }}>
          <span className="text-4xl block mb-2">{selectedTrait.icon}</span>
          <h2 className="text-xl font-bold text-foreground mb-1">{selectedTrait.label}</h2>
          <p className="text-sm text-primary font-semibold">{selectedTrait.score}% of your circle sees this</p>
        </div>

        <div className="space-y-2" data-testid="trait-responses-list">
          {selectedTrait.responses.map((r, i) => (
            <div
              key={i}
              data-testid={`trait-response-${i}`}
              className="glass-card-elevated p-4 flex items-center justify-between opacity-0"
              style={{ animation: `fade-in-up 0.4s ease-out ${i * 80}ms forwards` }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                <p className="text-sm text-foreground/90 italic">"{r}"</p>
              </div>
              <div className="flex gap-1 ml-2 shrink-0">
                <button
                  data-testid={`button-visibility-trait-${i}`}
                  onClick={() => toggleVisibility(`trait-${selectedTrait.id}-${i}`)}
                  className="p-1.5 rounded-full btn-glass haptic-press"
                  aria-label={responseVisibility[`trait-${selectedTrait.id}-${i}`] ? "Show response" : "Hide response"}
                >
                  {responseVisibility[`trait-${selectedTrait.id}-${i}`]
                    ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                    : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button
                  data-testid={`button-request-edit-${i}`}
                  onClick={() => toast({ title: "Edit requested", description: "The person will be asked to update this response" })}
                  className="p-1.5 rounded-full btn-glass haptic-press"
                  aria-label="Request edit"
                >
                  <Send className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Mirror;
