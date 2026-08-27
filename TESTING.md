# DevJournal - Testing Guide

Setting up and writing tests for DevJournal.

## Current Status

❌ **No tests currently exist.** This guide explains how to add them.

## Setup Testing Framework

### Install Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Configure Vite for Testing

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
```

### Create Setup File

Create `src/test/setup.js`:

```javascript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

### Update package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Writing Tests

### Test File Location

Place test files next to components:

```
src/
├── components/
│   ├── EntryCard.jsx
│   └── EntryCard.test.jsx          ← Test here
├── hooks/
│   ├── useEntries.js
│   └── useEntries.test.js          ← Test here
└── utils/
    ├── dateHelpers.js
    └── dateHelpers.test.js         ← Test here
```

### Example Test

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EntryCard from './EntryCard';

describe('EntryCard', () => {
  const mockEntry = {
    id: '1',
    title: 'Test Entry',
    content: 'Test content',
    date: new Date('2024-01-15'),
    mood: 'happy',
  };

  it('renders entry title', () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText('Test Entry')).toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText(/Jan 15/)).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<EntryCard entry={mockEntry} onEdit={onEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockEntry.id);
  });
});
```

## Test Priorities

### High Priority (Test First)
1. **Entry CRUD**
   - Create new entry
   - Read/display entry
   - Update entry
   - Delete entry

2. **Authentication**
   - Login with email/password
   - Logout
   - Session persistence
   - Protected routes

3. **Calculations**
   - Streak calculation
   - Mood averages
   - Analytics aggregations

### Medium Priority
1. **Components**
   - EntryCard rendering
   - EntryEditor form submission
   - TagFilter selections
   - Modal open/close

2. **Integrations**
   - Groq API calls
   - Supabase CRUD
   - Error handling

### Low Priority
1. **UI Elements**
   - Button clicks
   - Input typing
   - Focus states
   - Animations

## Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode (re-run on file change)
npm run test -- --watch

# Run specific test file
npm run test -- EntryCard.test.jsx

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Mocking

### Mock Groq API

```javascript
import { vi } from 'vitest';

const mockAIResponse = {
  reflection: 'Great entry!',
  suggestion: 'Consider expanding...',
  question: 'Why did you...',
};

vi.mock('../services/aiService', () => ({
  generateInsight: vi.fn(() => Promise.resolve(mockAIResponse)),
}));
```

### Mock Supabase

```javascript
vi.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
    })),
  },
}));
```

### Mock localStorage

```javascript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock;
```

## Debugging Tests

```javascript
import { screen, debug } from '@testing-library/react';

// Print DOM to console
debug();

// Print specific element
debug(screen.getByRole('button'));

// Check what's on screen
screen.logTestingPlaygroundURL();
```

## Best Practices

1. **Test behavior, not implementation**
   ```javascript
   // ✅ Good - tests what user sees
   expect(screen.getByText('Entry saved')).toBeInTheDocument();

   // ❌ Bad - tests internal state
   expect(component.state.isSaved).toBe(true);
   ```

2. **Use semantic queries**
   ```javascript
   // ✅ Best
   screen.getByRole('button', { name: /submit/i });

   // ✅ Good
   screen.getByLabelText(/password/i);

   // ❌ Avoid
   screen.getByTestId('btn-submit');
   ```

3. **Mock external APIs**
   ```javascript
   // Mock Groq and Supabase, test app logic in isolation
   vi.mock('../services/aiService');
   vi.mock('../services/supabaseClient');
   ```

4. **Test edge cases**
   ```javascript
   it('handles empty entry list', () => {
     render(<Dashboard entries={[]} />);
     expect(screen.getByText(/no entries/i)).toBeInTheDocument();
   });

   it('handles API errors gracefully', async () => {
     vi.mocked(getEntries).mockRejectedValueOnce(new Error('API failed'));
     // ... test error UI
   });
   ```

## CI/CD Integration

GitHub Actions workflow already configured in `.github/workflows/build.yml` to:
- Run tests on every push
- Block merge if tests fail
- Generate coverage reports

## Coverage Goals

Target coverage by component:

| Component | Target |
|-----------|--------|
| Utils | 90%+ |
| Hooks | 80%+ |
| Services | 85%+ |
| Components | 70%+ |
| Pages | 60%+ |

View coverage report:
```bash
npm run test:coverage
open coverage/index.html
```

## Resources

- [Vitest Docs](https://vitest.dev)
- [Testing Library Docs](https://testing-library.com)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Start writing tests today! 🧪**
