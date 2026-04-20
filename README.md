# DevLog

A premium, developer-native journaling application built with React 18 and Anthropic's Claude AI. Designed with a "Terminal Minimal" aesthetic. (Local-first edition)

## Features

- **Terminal Minimal Design**: Beautiful dark/light mode with monospace accents.
- **Rich Editor**: Markdown preview, code snippets, auto-save (debounce).
- **AI Insights**: Integration with Claude AI for reflection, suggestions, and thought-provoking questions on your entries.
- **Analytics**: 30-day mood trend charts and GitHub-style 12-week activity heatmap.
- **Streak Tracking**: Motivational streak tracker and word counts.
- **Local Storage**: Data is persisted locally in your browser (Firebase removed).
- **Mock Auth**: Simplified authentication for a local-first experience.

## Tech Stack

- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **Storage**: Browser LocalStorage
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
   Rename `.env.example` to `.env.local` and populate:
   - Your Anthropic API Key (Ensure your account has billing enabled)

3. **Run Dev Server**
   ```bash
   npm run dev
   ```

## Design Notes

- Built exactly to specifications using no external component libraries.
- Features a highly customized Tailwind configuration (`tailwind.config.js`) defining specific tokens for the Terminal Minimal design aesthetic.
- Employs strict container/component separation and custom React hooks (`useAuth`, `useEntries`, `useAI`, `useStreak`) to encapsulate complex logic.
