## Messaging UI for Trace

### Pages
1. **Chat List** (`/messages`) — conversation list with last message preview, context badges (location, time since last chat), unread indicators
2. **Chat Thread** (`/messages/:id`) — full conversation view with:
   - Context card at top (memory layer: last topics, shared interests, meeting history)
   - Message bubbles with smart suggestion chips
   - Composer with intent hints

### Components
- `src/components/messaging/ChatList.tsx` — conversation list items
- `src/components/messaging/ChatThread.tsx` — message thread with context header
- `src/components/messaging/ContextCard.tsx` — memory/context sidebar card
- `src/components/messaging/MessageBubble.tsx` — individual message
- `src/components/messaging/Composer.tsx` — input with AI suggestion chips

### Routes
- Add `/messages` and `/messages/:id` to App.tsx

### Data
- Mock data for conversations and messages (no backend yet)

### Design
- Glass Aurora theme, glass-card styling, consistent with dashboard
- Bottom nav or back-arrow navigation between views
