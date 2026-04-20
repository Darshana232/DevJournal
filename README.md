# DevLog

A premium, developer-native journaling application built with React 18, Firebase, and Anthropic's Claude AI. Designed with a "Terminal Minimal" aesthetic.

## Features

- **Terminal Minimal Design**: Beautiful dark/light mode with monospace accents.
- **Rich Editor**: Markdown preview, code snippets, auto-save (debounce).
- **AI Insights**: Integration with Claude AI for reflection, suggestions, and thought-provoking questions on your entries.
- **Analytics**: 30-day mood trend charts and GitHub-style 12-week activity heatmap.
- **Streak Tracking**: Motivational streak tracker and word counts.
- **Robust Infrastructure**: Firebase Auth, Firestore real-time DB, optimistic UI updates via context/reducers.

## Tech Stack

- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **Backend / DB**: Firebase
- **Styling**: Tailwind CSS (Utility-first, no component library)
- **AI Integration**: Anthropic Claude API (`@anthropic-ai/sdk`)
- **Animation**: Framer Motion
- **Date Handling**: `date-fns`
- **Charts**: Recharts

## Local Development Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env.local` and populate the keys:
   - Your Firebase project credentials (enable Email/Password and Google Auth providers in Firebase console)
   - Your Anthropic API Key (Ensure your account has billing enabled)

3. **Run Dev Server**
   ```bash
   npm run dev
   ```

## Design Notes

- Built exactly to specifications using no external component libraries.
- Features a highly customized Tailwind configuration (`tailwind.config.js`) defining specific tokens for the Terminal Minimal design aesthetic.
- Employs strict container/component separation and custom React hooks (`useAuth`, `useEntries`, `useAI`, `useStreak`) to encapsulate complex logic away from the UI layer.
