# DevJournal - AI-Powered Developer Journal 📔

A sophisticated React journaling application built for developers who want to reflect, grow, and track their progress—powered by **Groq (Meta Llama 3) AI** and **Supabase**.

## 🎯 Overview

DevJournal transforms daily development experiences into long-term learning. Write entries, get AI-generated insights, visualize mood trends, and build consistent writing habits—all in a distraction-free, developer-native terminal-like interface.

**Target Users:** Developers (students to professionals) seeking reflective journaling and personal growth tracking.

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| **📝 Rich Entry Editor** | Markdown support with live preview, code snippets, auto-growing textarea |
| **🤖 AI-Powered Insights** | Groq-generated reflections, suggestions, and thought-provoking questions |
| **📊 Advanced Analytics** | 30-day mood trends, 12-week contribution heatmap (GitHub-style) |
| **🔥 Streak Tracking** | Daily writing streaks with milestone tracking |
| **🏷️ Smart Tagging** | Predefined + custom tags with multi-filter search |
| **💾 Auto-Save** | Debounced auto-save prevents data loss |
| **🌙 Dark/Light Mode** | Theme persistence with developer-optimized colors |
| **🔒 Private Entries** | Mark entries private to hide from list view |
| **📤 Export** | Download all entries as JSON |
| **📅 Weekly Digest** | AI-generated weekly summary of entries |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 with Vite |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS 3 (custom tokens) |
| **Animations** | Framer Motion |
| **AI/LLM** | Groq API (Llama 3.1 8B) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Charts** | Recharts |
| **Dates** | date-fns |
| **Notifications** | react-hot-toast |
| **Storage** | LocalStorage + Supabase |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Groq API key (get from [console.groq.com](https://console.groq.com))
- Supabase account (optional, for cloud storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DevJournal.git
   cd DevJournal
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Edit `.env.local` with your keys**
   ```
   # Groq API (Required for AI features)
   VITE_GROQ_API_KEY=gsk_your_key_here
   
   # Supabase (Optional, for cloud sync)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📖 How to Get API Keys

### Groq API
1. Go to https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into `.env.local`

### Supabase (Optional)
1. Go to https://supabase.com
2. Create a new project
3. Go to Project Settings → API
4. Copy Project URL and Anon Key
5. Add to `.env.local`

> **Note:** App works without Supabase (uses LocalStorage). AI features require Groq key.

---

## 🎨 UI Architecture

### Terminal-Like Design
- **Monospace fonts** (`font-mono`) for developer aesthetic
- **Dark-first color scheme** with high contrast
- **Minimal, clean interface** inspired by code editors
- **Keyboard-friendly** navigation

### Color System
```css
/* Light Mode */
--bg: #ffffff
--surface: #f8f9fa
--elevated: #ffffff
--border: #e0e0e0
--text-primary: #1a1a1a
--accent: #2563eb

/* Dark Mode (Primary) */
--bg: #0d1117
--surface: #161b22
--elevated: #21262d
--border: #30363d
--text-primary: #c9d1d9
--accent: #58a6ff
```

---

## 📊 Project Structure

```
src/
├── components/
│   ├── ai/              # InsightPanel, MoodChart, StreakWidget
│   ├── journal/         # EntryCard, EntryEditor, TagFilter
│   ├── layout/          # Sidebar, Navbar, PageHeader
│   └── ui/              # Reusable: Button, Input, Badge, Modal, Spinner
├── context/
│   ├── AuthContext      # User auth state
│   ├── JournalContext   # Entry CRUD operations
│   └── ThemeContext     # Dark/Light mode
├── hooks/
│   ├── useAuth          # Auth management
│   ├── useEntries       # Entry operations
│   ├── useAI            # Groq API integration
│   ├── useStreak        # Streak calculations
│   └── useDebounce      # Debounced functions
├── pages/
│   ├── Login            # Authentication
│   ├── Register         # User registration
│   ├── Dashboard        # Main entry list
│   ├── NewEntry         # Create entry
│   ├── EditEntry        # Modify entry
│   ├── EntryDetail      # Full entry view
│   ├── Insights         # Analytics & charts
│   └── Settings         # User preferences
├── services/
│   ├── aiService        # Groq API calls
│   ├── authService      # Supabase auth
│   ├── entryService     # CRUD operations
│   └── analyticsService # Stats calculations
├── utils/
│   ├── dateHelpers      # Date utilities
│   ├── moodUtils        # Mood calculations
│   ├── tagUtils         # Tag parsing
│   └── logger           # Logging utility
└── constants/
    ├── moods            # Mood definitions
    ├── tags             # Default tags
    └── prompts          # AI prompts
```

---

## 🔧 Configuration

### Tailwind Design Tokens
Custom Tailwind configuration in `tailwind.config.js`:
- Semantic color variables
- Dark mode support via class strategy
- Monospace font emphasis
- Custom spacing/sizing

### API Integration
All API calls abstracted in `/services`:
- `aiService.js` - Groq API wrapper
- `authService.js` - Supabase authentication
- `entryService.js` - Entry CRUD operations
- Error handling and retry logic included

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
- `VITE_GROQ_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Docker (Self-hosted)
```bash
docker build -t devjournal .
docker run -p 3000:80 devjournal
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages
```

---

## 🔐 Security

- **API Keys:** Never commit `.env.local` to Git
- **Auth:** Supabase handles user authentication
- **Data:** All entries stored in Supabase PostgreSQL
- **CORS:** Configured for production domain
- **Input:** Sanitized markdown parsing prevents XSS

---

## 📊 Performance

- **Bundle Size:** ~250 KB (gzipped)
- **Lazy Loading:** Insights page split for faster initial load
- **Debouncing:** Auto-save with 1s debounce to prevent excess API calls
- **Memoization:** `useMemo` and `useCallback` prevent unnecessary re-renders
- **Code Splitting:** React Router v7 handles automatic splitting

---

## 🧪 Testing

Current state: No tests present
To add tests:
```bash
npm install -D vitest @testing-library/react
```

Test files should cover:
- Entry creation/edit/delete
- AI API integration
- Analytics calculations
- Authentication flows
- Mood & streak tracking

---

## 🐛 Known Issues & Limitations

1. **Offline Mode:** Requires internet for Groq API calls
2. **Supabase Optional:** Cloud sync disabled if no Supabase key
3. **Rate Limiting:** Groq has rate limits (check your account)
4. **File Size:** Images not currently supported in entries

---

## 📝 Development Guidelines

### Code Style
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components < 200 lines
- Use TypeScript-ready patterns (no actual TS yet)

### Naming Conventions
```javascript
// Components: PascalCase
function EntryCard() {}

// Hooks: useXxx
function useEntries() {}

// Utils: camelCase
function calculateStreak() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
```

### Commit Messages
```
feat(entry): add markdown preview toggle
fix(ai): handle Groq rate limit errors
refactor(hooks): simplify useEntries logic
docs: add deployment instructions
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and commit with clear messages
3. Push and open a Pull Request
4. Ensure all checks pass

---

## 📞 Support & Documentation

- **Issues:** GitHub Issues tab
- **Discussions:** GitHub Discussions
- **Docs:** See `/docs` folder
- **Groq Docs:** https://console.groq.com/docs
- **Supabase Docs:** https://supabase.com/docs

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Collaborative journaling
- [ ] Export to PDF/Markdown
- [ ] Integration with GitHub commits
- [ ] Custom AI model fine-tuning
- [ ] Voice-to-text entries
- [ ] Social features (follow friends)
- [ ] Premium features (advanced analytics)

---

**Made with ❤️ for developers who love to grow**

*Last Updated: 2024*
*Maintained by: Darshana*
