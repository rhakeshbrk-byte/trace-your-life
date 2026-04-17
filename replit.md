# Project Overview

A social/messaging app built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui components. Migrated from Lovable to Replit.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite (pure frontend, no backend server)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui components
- **State/Data fetching**: TanStack React Query
- **Fonts**: Rubik + Space Mono via @fontsource

## Pages

- `/` — Index (feed/home)
- `/rooms` — Rooms
- `/messages` — Messages list
- `/messages/:id` — Chat thread
- `/profile` — Profile
- `/mirror` — Mirror
- `/echo` — Echo Chain
- `/signal` — Signal
- `/pulse` — Pulse

## Development

```bash
npm run dev      # Start dev server on port 5000
npm run build    # Production build
npm run preview  # Preview production build
```

## Key Configuration

- Vite dev server runs on port 5000 (required for Replit webview)
- `host: "0.0.0.0"` and `allowedHosts: true` set for Replit proxy compatibility
- `lovable-tagger` removed from vite config (Lovable-specific plugin)
- Deployment: static site, output to `dist/`
