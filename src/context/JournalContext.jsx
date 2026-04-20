import { createContext, useContext, useReducer, useCallback } from 'react';

/** @typedef {{ id: string, title: string, content: string, mood: string, tags: string[], date: string, wordCount: number, isPrivate: boolean, aiInsight: Object|null, codeSnippet: string, createdAt: string, updatedAt: string }} Entry */

const JournalContext = createContext(null);

// ── Reducer ────────────────────────────────────────────────────────────────────

const initialState = {
  entries:    [],
  loading:    true,
  error:      null,
  hasMore:    false,
  stats:      null,
};

function journalReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_ENTRIES':
      return { ...state, entries: action.payload, loading: false, error: null };

    case 'APPEND_ENTRIES':
      return {
        ...state,
        entries: [...state.entries, ...action.payload.entries],
        hasMore: action.payload.hasMore,
        loading: false,
      };

    case 'ADD_ENTRY':
      // Optimistic: prepend new entry
      return {
        ...state,
        entries: [action.payload, ...state.entries],
      };

    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };

    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      };

    case 'SET_INSIGHT':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? { ...e, aiInsight: action.payload.insight }
            : e
        ),
      };

    case 'SET_STATS':
      return { ...state, stats: action.payload };

    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };

    default:
      return state;
  }
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function JournalProvider({ children }) {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  const setLoading  = useCallback((v) => dispatch({ type: 'SET_LOADING',  payload: v }), []);
  const setError    = useCallback((v) => dispatch({ type: 'SET_ERROR',    payload: v }), []);
  const setEntries  = useCallback((v) => dispatch({ type: 'SET_ENTRIES',  payload: v }), []);
  const addEntry    = useCallback((v) => dispatch({ type: 'ADD_ENTRY',    payload: v }), []);
  const updateEntry = useCallback((v) => dispatch({ type: 'UPDATE_ENTRY', payload: v }), []);
  const deleteEntry = useCallback((v) => dispatch({ type: 'DELETE_ENTRY', payload: v }), []);
  const setInsight  = useCallback((id, insight) => dispatch({ type: 'SET_INSIGHT', payload: { id, insight } }), []);
  const setStats    = useCallback((v) => dispatch({ type: 'SET_STATS',   payload: v }), []);
  const appendEntries = useCallback((entries, hasMore) =>
    dispatch({ type: 'APPEND_ENTRIES', payload: { entries, hasMore } }), []);

  const value = {
    ...state,
    dispatch,
    setLoading,
    setError,
    setEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    setInsight,
    setStats,
    appendEntries,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used within JournalProvider');
  return ctx;
}
