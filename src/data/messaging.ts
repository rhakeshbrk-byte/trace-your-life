export interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  contextTags: string[];
  avatarColor: "primary" | "secondary";
}

export interface Message {
  id: string;
  role: "user" | "contact";
  content: string;
  time: string;
}

export interface ContactContext {
  name: string;
  initials: string;
  lastMet: string;
  commonPlace: string;
  sharedInterests: string[];
  lastTopics: string[];
  mutualAvailability: string;
  memoryNote: string;
}

export interface AISuggestion {
  label: string;
  emoji: string;
}

export const conversations: Conversation[] = [
  {
    id: "alex",
    name: "Alex Kim",
    initials: "AK",
    lastMessage: "Let's catch up about the funding round",
    lastMessageTime: "2m ago",
    unread: 2,
    contextTags: ["📍 Nearby", "🏋️ Gym buddy"],
    avatarColor: "primary",
  },
  {
    id: "maya",
    name: "Maya Ross",
    initials: "MR",
    lastMessage: "That café was amazing!",
    lastMessageTime: "1h ago",
    unread: 0,
    contextTags: ["☕ Coffee enthusiast"],
    avatarColor: "secondary",
  },
  {
    id: "sam",
    name: "Sam Chen",
    initials: "SC",
    lastMessage: "Voice note — 0:42",
    lastMessageTime: "3h ago",
    unread: 1,
    contextTags: ["💼 Work", "🧠 AI talks"],
    avatarColor: "primary",
  },
  {
    id: "priya",
    name: "Priya Sharma",
    initials: "PS",
    lastMessage: "Let me know about the trip plan",
    lastMessageTime: "Yesterday",
    unread: 0,
    contextTags: ["✈️ Travel"],
    avatarColor: "secondary",
  },
];

export const contactContexts: Record<string, ContactContext> = {
  alex: {
    name: "Alex Kim",
    initials: "AK",
    lastMet: "3 days ago at Blue Bottle Coffee",
    commonPlace: "Blue Bottle Coffee, Downtown",
    sharedInterests: ["Startups", "Fitness", "AI"],
    lastTopics: ["Series A fundraising", "New gym routine"],
    mutualAvailability: "Both free today 6–8 PM",
    memoryNote: "Met at TechCrunch '25. Working on a health-tech startup. Prefers evening meetups.",
  },
  maya: {
    name: "Maya Ross",
    initials: "MR",
    lastMet: "1 week ago",
    commonPlace: "Sage Kitchen",
    sharedInterests: ["Coffee", "Design", "Photography"],
    lastTopics: ["New café openings", "Portfolio redesign"],
    mutualAvailability: "Both free tomorrow afternoon",
    memoryNote: "UX designer at Figma. Loves trying new cafés. Last recommended Sage Kitchen.",
  },
  sam: {
    name: "Sam Chen",
    initials: "SC",
    lastMet: "2 weeks ago",
    commonPlace: "Co-working space",
    sharedInterests: ["AI", "Podcasts", "Running"],
    lastTopics: ["GPT wrappers", "Marathon training"],
    mutualAvailability: "Weekday lunches work best",
    memoryNote: "ML engineer. Sends long voice notes. Training for a half-marathon.",
  },
  priya: {
    name: "Priya Sharma",
    initials: "PS",
    lastMet: "1 month ago",
    commonPlace: "Online call",
    sharedInterests: ["Travel", "Photography", "Food"],
    lastTopics: ["Ooty trip plan", "Camera gear"],
    mutualAvailability: "Weekends preferred",
    memoryNote: "College friend. Planning a group trip to Ooty. Prefers detailed itineraries.",
  },
};

export const chatMessages: Record<string, Message[]> = {
  alex: [
    { id: "1", role: "contact", content: "Hey! How's the pitch deck coming along?", time: "4:12 PM" },
    { id: "2", role: "user", content: "Almost done. Need to polish the financials section.", time: "4:15 PM" },
    { id: "3", role: "contact", content: "I can review it if you want. Also, gym tomorrow?", time: "4:18 PM" },
    { id: "4", role: "user", content: "That'd be great. And yeah, let's do morning session", time: "4:20 PM" },
    { id: "5", role: "contact", content: "Let's catch up about the funding round", time: "4:32 PM" },
    { id: "6", role: "contact", content: "I heard back from the investors", time: "4:33 PM" },
  ],
  maya: [
    { id: "1", role: "user", content: "Have you tried that new place on 5th?", time: "2:00 PM" },
    { id: "2", role: "contact", content: "Not yet! Is it good?", time: "2:05 PM" },
    { id: "3", role: "user", content: "Amazing matcha latte. You'd love it.", time: "2:08 PM" },
    { id: "4", role: "contact", content: "That café was amazing!", time: "2:45 PM" },
  ],
  sam: [
    { id: "1", role: "contact", content: "Check out this podcast episode on AI agents", time: "11:00 AM" },
    { id: "2", role: "user", content: "Will listen on my run today", time: "11:30 AM" },
    { id: "3", role: "contact", content: "Voice note — 0:42", time: "12:15 PM" },
  ],
  priya: [
    { id: "1", role: "user", content: "So are we doing Ooty in May?", time: "Yesterday" },
    { id: "2", role: "contact", content: "I'm in! Need to check with the others", time: "Yesterday" },
    { id: "3", role: "contact", content: "Let me know about the trip plan", time: "Yesterday" },
  ],
};

export const aiSuggestions: Record<string, AISuggestion[]> = {
  alex: [
    { label: "Share pitch deck", emoji: "📄" },
    { label: "Set gym time", emoji: "🏋️" },
    { label: "Suggest meeting spot", emoji: "📍" },
  ],
  maya: [
    { label: "Share café location", emoji: "☕" },
    { label: "Plan coffee date", emoji: "📅" },
  ],
  sam: [
    { label: "Reply to voice note", emoji: "🎙️" },
    { label: "Share running stats", emoji: "🏃" },
  ],
  priya: [
    { label: "Create trip itinerary", emoji: "✈️" },
    { label: "Set group poll", emoji: "📊" },
  ],
};
