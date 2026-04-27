# DevJournal — AI-Powered Developer Journal

> A production-level React journaling application built for developers who want to reflect, grow, and track their progress — powered by Google Gemini AI.

---

## 🧠 Problem Statement

Developers write code every day, but rarely reflect on **why** they made certain decisions, **what** they learned, or **how** their work is evolving over time. This leads to repeated mistakes, burnout, and a lack of visible personal growth.

**DevJournal** solves this by giving developers a dedicated, distraction-free space to:
- Log daily work, thoughts, and breakthroughs alongside code snippets
- Get **AI-generated reflections** (via Gemini) that surface patterns in thinking
- Track **mood trends** and **writing streaks** to build consistent habits
- Visualize **contribution heatmaps** and analytics — exactly like GitHub, but for your thoughts

**Who is the user?** Any developer — student or professional — who wants to turn daily work experiences into long-term learning.

**Why does it matter?** Research shows that reflective journaling improves problem-solving, reduces anxiety, and accelerates skill development. DevJournal brings this practice into the developer's natural workflow.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 Rich Editor | Markdown support with live preview, auto-grow textarea, and code snippet field |
| 🤖 AI Insights | Gemini-powered reflection, suggestion, and thought-provoking question per entry |
| 📊 Analytics | 30-day mood trend chart (Recharts) and 12-week GitHub-style contribution heatmap |
| 🔥 Streak Tracker | Daily writing streak with longest-streak milestone tracking |
| 🏷️ Tags & Moods | Predefined + custom tags, 5-mood picker, and multi-filter search |
| 🌙 Dark / Light Mode | Toggle persisted to localStorage via ThemeContext |
| 💾 Auto-Save | Debounced auto-save on blur — never lose a thought |
| 📤 Export | Download all entries as a JSON file |
| 🔒 Private Entries | Mark an entry as private to hide its content from the list view |
| 📅 Weekly AI Digest | Summarize your recent week's entries into a single paragraph with Gemini |

---

## ⚛️ React Concepts Demonstrated

### Core
- Functional Components everywhere
- Props & component composition (`EntryEditor`, `Button`, `Input`, `Badge`, etc.)
- `useState` — forms, loading states, filters, preview toggle
- `useEffect` — entry loading, theme sync, textarea auto-grow
- Conditional rendering — loading/empty/content branches
- Lists & Keys — entry cards, tag buttons, heatmap cells

### Intermediate
- **Lifting State Up** — `EntryEditor` lifts partial state to `NewEntry` / `EditEntry`
- **Controlled Components** — all inputs use `value` + `onChange`
- **React Router v7** — protected routes, public routes, nested layouts, dynamic params (`/entry/:id`)
- **Context API** — `AuthContext`, `JournalContext`, `ThemeContext`

### Advanced
- `useMemo` — filtered/sorted entry list, analytics stats computation
- `useCallback` — stable handler references in all CRUD operations
- `useRef` — textarea DOM reference for auto-grow, debounce timeout ref
- `React.lazy` + `Suspense` — Insights page (Recharts) is code-split
- `useReducer` — `JournalContext` manages complex entry state via a reducer

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ai/          # InsightPanel, MoodChart, StreakWidget
│   ├── journal/     # EntryCard, EntryEditor, TagFilter
│   ├── layout/      # Sidebar, Navbar, PageHeader
│   └── ui/          # Button, Input, Modal, Badge, Spinner, Tooltip, EmptyState
├── context/         # AuthContext, JournalContext, ThemeContext
├── hooks/           # useAuth, useEntries, useAI, useStreak, useDebounce
├── pages/           # Dashboard, NewEntry, EditEntry, EntryDetail, Insights, Settings, Login, Register
├── services/        # aiService (Gemini API), analyticsService (LocalStorage stats)
├── utils/           # dateHelpers, moodUtils, tagUtils, markdownParser, cn, logger
└── constants/       # moods, tags, prompts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite 8) |
| Routing | React Router v7 |
| Styling | Tailwind CSS v3 (fully custom design tokens) |
| Animation | Framer Motion |
| AI | Google Gemini (`gemini-2.5-flash`) |
| Charts | Recharts |
| Date Handling | date-fns |
| Notifications | react-hot-toast |
| Storage | Browser LocalStorage |

---

## 🚀 Local Development Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd DevJournal
npm install
```

### 2. Configure Environment Variables

Copy the example env file and fill in your key:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: The app works without a key — AI features will show a clear error. All journaling, analytics, and streak features work offline with no key.

### 3. Run Dev Server

```bash
npm run dev
```

App runs at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

---

## 📐 Design System

The UI is built on a custom Tailwind configuration (`tailwind.config.js`) defining:
- Semantic color tokens: `bg`, `surface`, `elevated`, `border`, `accent`, `text-primary`, `text-secondary`
- Full dark/light mode via CSS class toggling on `<html>`
- Monospace (`font-mono`) for developer-native aesthetic
- No external component library — 100% custom components

---

## 🔑 Key Architecture Decisions

- **`JournalContext` uses `useReducer`** instead of `useState` for predictable, action-based state transitions (optimistic UI updates)
- **Services layer** (`aiService`, `analyticsService`) is decoupled from React — pure async functions, easy to swap backends
- **Lazy loading** for the Insights page keeps the initial bundle small (Recharts is ~200 KB)
- **`useCallback` everywhere** in `useEntries` and `JournalContext` prevents unnecessary re-renders in child components

---

## 📄 License

MIT
