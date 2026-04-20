import { useState, useRef, useEffect, useCallback } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MOODS } from '../../constants/moods';
import { PREDEFINED_TAGS } from '../../constants/tags';
import { toggleTag, parseTagInput } from '../../utils/tagUtils';
import { TAG_COLORS } from '../../constants/tags';
import { parseMarkdown, countWords } from '../../utils/markdownParser';
import { cn } from '../../utils/cn';

/**
 * Full entry editor with auto-grow textarea, markdown preview, mood picker, and tag input.
 *
 * @param {Object} props
 * @param {Object} props.value - { title, content, mood, tags, isPrivate, codeSnippet }
 * @param {Function} props.onChange - Called with updated field values
 * @param {boolean} props.autoFocus
 */
export function EntryEditor({ value, onChange, autoFocus = true }) {
  const [preview, setPreview]       = useState(false);
  const [tagInput, setTagInput]     = useState('');
  const textareaRef                 = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-grow textarea
  const growTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    growTextarea();
  }, [value.content, growTextarea]);

  const handleField = useCallback((field) => (e) => {
    onChange({ [field]: e.target.value });
  }, [onChange]);

  const handleMood = useCallback((mood) => {
    onChange({ mood });
  }, [onChange]);

  const handleTagToggle = useCallback((tag) => {
    onChange({ tags: toggleTag(value.tags ?? [], tag) });
  }, [onChange, value.tags]);

  const handleTagInput = useCallback((e) => {
    const raw = e.target.value;
    setTagInput(raw);
    // Add on comma or Enter handled below
  }, []);

  const commitTagInput = useCallback(() => {
    const parsed = parseTagInput(tagInput);
    if (parsed.length) {
      const next = [...new Set([...(value.tags ?? []), ...parsed])];
      onChange({ tags: next });
    }
    setTagInput('');
  }, [tagInput, value.tags, onChange]);

  const handleTagKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitTagInput();
    }
    if (e.key === 'Backspace' && !tagInput && value.tags?.length) {
      onChange({ tags: value.tags.slice(0, -1) });
    }
  }, [commitTagInput, tagInput, value.tags, onChange]);

  const wordCount = countWords(value.content ?? '');

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <input
        id="entry-title"
        type="text"
        placeholder="Entry title (optional)"
        value={value.title ?? ''}
        onChange={handleField('title')}
        className={cn(
          'w-full bg-transparent border-none outline-none',
          'font-mono text-2xl text-text-primary',
          'placeholder:text-border caret-accent'
        )}
      />

      {/* Toolbar: preview toggle + private toggle */}
      <div className="flex items-center gap-4 border-b border-border pb-3">
        <button
          id="preview-toggle"
          onClick={() => setPreview((p) => !p)}
          className={cn(
            'text-xs font-mono px-2 py-1 rounded border transition-colors',
            preview
              ? 'border-accent text-accent bg-accent/10'
              : 'border-border text-text-secondary hover:text-text-primary'
          )}
        >
          {preview ? '‹ edit' : 'preview ›'}
        </button>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="entry-private"
            type="checkbox"
            checked={value.isPrivate ?? false}
            onChange={(e) => onChange({ isPrivate: e.target.checked })}
            className="accent-accent w-3 h-3"
          />
          <span className="text-xs text-text-secondary">Private</span>
        </label>
        <span className="ml-auto text-xs text-text-secondary font-mono">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>

      {/* Content area: editor or preview */}
      {preview ? (
        <div
          className="prose min-h-40 text-sm"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(value.content ?? '') }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          id="entry-content"
          placeholder="What happened today? Use **markdown** if you like."
          value={value.content ?? ''}
          onChange={(e) => {
            onChange({ content: e.target.value });
            growTextarea();
          }}
          rows={12}
          className={cn(
            'w-full bg-transparent border-none outline-none resize-none',
            'font-sans text-sm text-text-primary leading-relaxed',
            'placeholder:text-border caret-accent min-h-40'
          )}
        />
      )}

      {/* Mood selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-secondary uppercase tracking-wide font-medium">Mood</span>
        <div className="flex items-center gap-2">
          {MOODS.map(({ value: mv, emoji, label }) => (
            <button
              key={mv}
              id={`mood-${mv}`}
              onClick={() => handleMood(mv)}
              title={label}
              aria-label={`Set mood to ${label}`}
              className={cn(
                'w-9 h-9 rounded border text-lg transition-all duration-150',
                'flex items-center justify-center',
                value.mood === mv
                  ? 'border-accent bg-accent/10 scale-110'
                  : 'border-border hover:border-border hover:bg-elevated'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-secondary uppercase tracking-wide font-medium">Tags</span>
        {/* Predefined tags */}
        <div className="flex flex-wrap gap-1.5">
          {PREDEFINED_TAGS.map((tag) => {
            const active = (value.tags ?? []).includes(tag);
            return (
              <button
                key={tag}
                id={`tag-${tag}`}
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  'px-2 py-0.5 text-xs font-mono rounded border transition-colors duration-150',
                  active
                    ? 'bg-accent/10 border-accent/40 text-accent'
                    : 'border-border text-text-secondary hover:border-border hover:bg-elevated'
                )}
              >
                #{tag}
              </button>
            );
          })}
        </div>
        {/* Custom tag input */}
        <div className="flex items-center gap-2 mt-1">
          <input
            id="tag-custom-input"
            type="text"
            placeholder="Add custom tag, press Enter"
            value={tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
            onBlur={commitTagInput}
            className={cn(
              'flex-1 bg-elevated border border-border rounded px-3 py-1.5',
              'text-xs font-mono text-text-primary placeholder:text-border',
              'focus:outline-none focus:border-accent transition-colors'
            )}
          />
        </div>
        {/* Selected custom tags not in predefined */}
        {(value.tags ?? []).filter(t => !PREDEFINED_TAGS.includes(t)).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {value.tags.filter(t => !PREDEFINED_TAGS.includes(t)).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className="px-2 py-0.5 text-xs font-mono rounded border bg-accent/10 border-accent/40 text-accent"
              >
                #{tag} ×
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Code snippet */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-secondary uppercase tracking-wide font-medium">
          Code snippet <span className="normal-case text-border">(optional)</span>
        </span>
        <textarea
          id="entry-code-snippet"
          placeholder={`// paste a relevant snippet here`}
          value={value.codeSnippet ?? ''}
          onChange={handleField('codeSnippet')}
          rows={4}
          className={cn(
            'w-full bg-elevated border border-border rounded p-3',
            'font-mono text-sm text-code-green leading-relaxed',
            'placeholder:text-border focus:outline-none focus:border-accent',
            'transition-colors resize-none'
          )}
        />
      </div>
    </div>
  );
}
