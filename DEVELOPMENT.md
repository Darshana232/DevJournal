# DevJournal - Development Guide

Contributing guidelines and developer setup for DevJournal.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Testing](#testing)
5. [Debugging](#debugging)
6. [Contributing](#contributing)

---

## Project Setup

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm 9+ (check with `npm --version`)
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/DevJournal.git
cd DevJournal

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local

# Add API keys (see PRODUCTION_README.md)
nano .env.local
```

### Verify Setup

```bash
# Start dev server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/

# In another terminal, run lint
npm run lint
```

---

## Development Workflow

### Starting Development Server

```bash
npm run dev
```

Features:
- Hot Module Replacement (HMR) for instant updates
- Auto-reload on file changes
- Accessible at http://localhost:5173

### Building for Production

```bash
# Full build with minification and optimization
npm run build

# Preview production build locally
npm run preview
```

### Common Development Tasks

```bash
# Code formatting and linting
npm run lint

# Fix auto-fixable lint errors
npm run lint -- --fix

# View bundle size analysis
npm run build -- --analyze

# Clean build artifacts
rm -rf dist
```

---

## Code Style

### File Organization

```
src/
├── components/
│   └── feature/
│       ├── Feature.jsx          # Main component
│       └── Feature.module.css    # Optional: scoped styles (if needed)
├── hooks/
│   └── useFeature.js            # Custom hooks
├── services/
│   └── featureService.js        # API calls, business logic
├── utils/
│   └── featureUtils.js          # Utility functions
└── constants/
    └── features.js              # Constants, enums
```

### Naming Conventions

```javascript
// Components: PascalCase
export function EntryCard() {}
export const EntryCard = () => {};

// Hooks: useXxx
export function useEntries() {}
export const useAuth = () => {};

// Functions: camelCase
export function calculateStreak() {}
const formatDate = (date) => {};

// Constants: SCREAMING_SNAKE_CASE
export const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;

// React Props: camelCase
<Button onClick={handleClick} isLoading={true} />

// CSS Classes: kebab-case
<div className="entry-card entry-card--highlighted" />
```

### Code Style Rules

1. **Functional components only** - No class components
2. **Use hooks** - useState, useEffect, useContext, etc.
3. **Keep components < 200 lines** - Extract logic into custom hooks
4. **Props first, dependencies second** - In function parameters
5. **No console.log in production** - Use logger utility
6. **Error handling required** - Try-catch for async operations
7. **Comments for WHY, not WHAT** - Code should be self-documenting
8. **Type-aware patterns** - Prepare for TypeScript migration

### Example Component

```jsx
import { useState, useEffect } from 'react';
import { useEntries } from '../hooks/useEntries';
import { formatDate } from '../utils/dateHelpers';
import Button from '../components/ui/Button';

export function EntryCard({ entryId, onDelete }) {
  const { getEntry } = useEntries();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEntry = async () => {
      setLoading(true);
      try {
        const data = await getEntry(entryId);
        setEntry(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [entryId, getEntry]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!entry) return null;

  return (
    <div className="entry-card">
      <h3>{entry.title}</h3>
      <p className="text-secondary">{formatDate(entry.date)}</p>
      <p>{entry.content}</p>
      <Button onClick={() => onDelete(entryId)}>Delete</Button>
    </div>
  );
}
```

---

## Testing

### Test Setup

Currently no tests are configured. To add testing:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Test Files Location

Create `.test.js` or `.test.jsx` files next to components:

```
src/
├── components/
│   ├── EntryCard.jsx
│   └── EntryCard.test.jsx      ← Test file here
└── hooks/
    ├── useEntries.js
    └── useEntries.test.js       ← Test file here
```

### What to Test

Priority order:

1. **Critical Functions**
   - Entry CRUD operations (create, read, update, delete)
   - Authentication flows (login, logout)
   - Streak calculations
   - Mood aggregations

2. **Components**
   - Entry form submission
   - Tag filtering
   - Modal interactions
   - Theme toggling

3. **Integrations**
   - Groq API error handling
   - Supabase sync
   - Local storage persistence

### Example Test

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EntryCard from './EntryCard';

describe('EntryCard', () => {
  it('renders entry content', () => {
    const mockEntry = {
      id: '1',
      title: 'Test Entry',
      content: 'Test content'
    };

    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText('Test Entry')).toBeInTheDocument();
  });
});
```

---

## Debugging

### Browser DevTools

1. Open DevTools: `F12` or `Cmd+Option+I`
2. **Elements Tab**: Inspect DOM structure
3. **Console Tab**: View errors and logs
4. **Network Tab**: Check API requests
5. **Application Tab**: View localStorage, theme

### Debug Environment Variables

```javascript
// Check loaded env vars
console.log(import.meta.env);

// Log specific values (safe - only logged locally)
console.log('Groq Key exists:', !!import.meta.env.VITE_GROQ_API_KEY);
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Delete `node_modules`, run `npm install` |
| API key not working | Check `.env.local` formatting, restart dev server |
| Hot reload not working | Check file paths, try hard refresh (Cmd+Shift+R) |
| Build fails | Run `npm run lint`, fix errors, retry build |

### Useful Debug URLs

```javascript
// Log API response
console.log('API response:', response);

// Track state changes
useEffect(() => {
  console.log('Entry changed:', entry);
}, [entry]);

// Performance metrics
console.time('renderTime');
// ... code ...
console.timeEnd('renderTime');
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactor (no feature change)
- `perf`: Performance improvement
- `test`: Test addition/update
- `docs`: Documentation
- `style`: Code style (prettier, linter)
- `chore`: Build, deps, tooling

### Examples

```
feat(entry): add markdown preview toggle
fix(ai): handle Groq API rate limiting
refactor(hooks): simplify useEntries logic
docs(readme): add deployment instructions
test(entry): add CRUD operation tests
```

### Commit Best Practices

1. **Atomic commits** - One logical change per commit
2. **Meaningful messages** - Describe WHY, not WHAT
3. **Reference issues** - `fixes #123` in footer
4. **Keep focused** - Don't mix features and fixes

---

## Pull Request Process

### Before Creating PR

1. Update branch: `git pull origin main`
2. Run tests: `npm run test` (when available)
3. Run linter: `npm run lint`
4. Build locally: `npm run build`
5. Test in browser: `npm run dev`

### PR Title Format

```
feat(entry): add markdown preview toggle
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## How to Test
1. Step 1
2. Step 2
3. Verify result

## Screenshots (if UI change)
[Add screenshots here]

## Checklist
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors
- [ ] Tested locally
```

---

## Performance Guidelines

### Bundle Size

Target: < 250KB gzipped

```bash
# Check bundle
npm run build

# Analyze
npm run build -- --analyze
```

### Optimization Tips

1. **Lazy load heavy components**
   ```jsx
   const Insights = lazy(() => import('./pages/Insights'));
   ```

2. **Use useMemo for expensive calculations**
   ```jsx
   const filteredEntries = useMemo(
     () => entries.filter(...),
     [entries, filterCriteria]
   );
   ```

3. **Use useCallback for stable references**
   ```jsx
   const handleSave = useCallback((data) => {
     // Save logic
   }, [dependencies]);
   ```

4. **Debounce API calls**
   ```jsx
   const debouncedSearch = useDebounce(searchTerm, 300);
   ```

---

## Resources

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [Groq API Docs](https://console.groq.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## Getting Help

- **Questions?** Create a GitHub Discussion
- **Found a bug?** Open a GitHub Issue
- **Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Need support?** Check existing issues first

---

**Happy coding! 🚀**
