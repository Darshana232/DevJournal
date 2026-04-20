import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { formatInsightTimestamp } from '../../utils/dateHelpers';
import { cn } from '../../utils/cn';

/**
 * Displays AI-generated insight for an entry.
 * @param {{ reflection: string, suggestion: string, question: string, generatedAt: string }|null} insight
 * @param {Function} onGenerate - async fn to trigger generation
 * @param {Function} onRegenerate - async fn to trigger regeneration
 * @param {boolean} loading
 * @param {string} entryId
 */
export function InsightPanel({ insight, onGenerate, onRegenerate, loading, entryId }) {
  const sections = [
    { key: 'reflection', label: 'Reflection', icon: '◉' },
    { key: 'suggestion', label: 'Suggestion',  icon: '◈' },
    { key: 'question',   label: 'Question',    icon: '◇' },
  ];

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-accent uppercase tracking-widest">AI Insight</span>
          {insight?.generatedAt && (
            <span className="text-2xs text-text-secondary">
              · Generated {formatInsightTimestamp(insight.generatedAt)}
            </span>
          )}
        </div>
        {insight && !loading && (
          <button
            id="regenerate-insight"
            onClick={onRegenerate}
            aria-label="Regenerate insight"
            title="Regenerate"
            className="text-text-secondary hover:text-accent transition-colors p-1 rounded"
          >
            {/* Refresh icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 py-6"
          >
            <Spinner size="sm" />
            <span className="text-sm text-text-secondary font-mono">Analyzing entry…</span>
          </motion.div>
        )}

        {!loading && !insight && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start gap-3"
          >
            <p className="text-sm text-text-secondary">
              Get a reflection, suggestion, and question from Claude based on this entry.
            </p>
            <Button
              id="generate-insight-btn"
              variant="outline"
              size="sm"
              onClick={onGenerate}
            >
              ✦ Get AI Insight
            </Button>
          </motion.div>
        )}

        {!loading && insight && (
          <motion.div
            key="insight"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l-2 border-accent pl-4 space-y-4"
          >
            {sections.map(({ key, label, icon }) => (
              insight[key] && (
                <div key={key}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-xs text-accent">{icon}</span>
                    <span className="text-xs text-text-secondary uppercase tracking-wide font-medium">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">{insight[key]}</p>
                </div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
