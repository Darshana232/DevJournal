import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEntries } from '../hooks/useEntries';
import { useAI } from '../hooks/useAI';
import { InsightPanel } from '../components/ai/InsightPanel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { parseMarkdown } from '../utils/markdownParser';
import { formatEntryDate } from '../utils/dateHelpers';
import { getMoodEmoji, getMoodLabel } from '../utils/moodUtils';
import { TAG_COLORS } from '../constants/tags';

export default function EntryDetail() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const { getEntry, deleteEntry, saveInsight, entries } = useEntries();
  const { getInsight, loadingInsight } = useAI();

  const [entry, setEntry]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting]       = useState(false);

  // Load from cache or Firestore
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getEntry(id);
      if (!cancelled) {
        if (data) {
          setEntry(data);
        } else {
          toast.error('Entry not found');
          navigate('/dashboard');
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, getEntry, navigate]);

  // Sync entry updates from journal context (e.g. insight saved)
  useEffect(() => {
    const updated = entries.find((e) => e.id === id);
    if (updated) setEntry(updated);
  }, [entries, id]);

  const handleGenerateInsight = useCallback(async () => {
    if (!entry?.content) return;
    const insight = await getInsight(entry.content);
    if (insight) {
      const ok = await saveInsight(id, insight);
      if (ok) {
        setEntry((e) => ({ ...e, aiInsight: insight }));
        toast.success('Insight generated!');
      }
    }
  }, [entry, id, getInsight, saveInsight]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    const ok = await deleteEntry(id);
    setDeleting(false);
    if (ok) {
      toast.success('Entry deleted');
      navigate('/dashboard');
    }
    setDeleteModal(false);
  }, [id, deleteEntry, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="md" />
      </div>
    );
  }

  if (!entry) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-2xl mx-auto"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="back-btn"
          onClick={() => navigate('/dashboard')}
          className="text-xs text-text-secondary hover:text-text-primary font-mono transition-colors"
        >
          ← back
        </button>
        <div className="flex items-center gap-2">
          <Button
            id="edit-entry-btn"
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit
          </Button>
          <Button
            id="delete-entry-btn"
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Entry header */}
      <div className="mb-6">
        <h1 className="font-mono text-2xl text-text-primary mb-3">
          {entry.title || 'Untitled Entry'}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
          <span>{formatEntryDate(entry.date || entry.createdAt)}</span>
          <span className="text-border">·</span>
          <span>{getMoodEmoji(entry.mood)} {getMoodLabel(entry.mood)}</span>
          <span className="text-border">·</span>
          <span>{entry.wordCount ?? 0} words</span>
          {entry.isPrivate && (
            <>
              <span className="text-border">·</span>
              <Badge variant="warning">Private</Badge>
            </>
          )}
        </div>
        {/* Tags */}
        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map((tag) => (
              <Badge
                key={tag}
                style={{ borderColor: TAG_COLORS[tag] ? `${TAG_COLORS[tag]}40` : undefined, color: TAG_COLORS[tag] }}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="prose text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(entry.content ?? '') }}
      />

      {/* Code snippet */}
      {entry.codeSnippet && (
        <div className="mt-6">
          <p className="text-xs text-text-secondary mb-2 uppercase tracking-wide font-medium">Code</p>
          <pre className="bg-elevated border border-border rounded p-4 overflow-x-auto">
            <code className="font-mono text-sm text-code-green leading-relaxed whitespace-pre-wrap">
              {entry.codeSnippet}
            </code>
          </pre>
        </div>
      )}

      {/* AI Insight Panel */}
      <InsightPanel
        insight={entry.aiInsight}
        onGenerate={handleGenerateInsight}
        onRegenerate={handleGenerateInsight}
        loading={loadingInsight}
        entryId={id}
      />

      {/* Delete confirmation modal */}
      <Modal
        id="delete-modal"
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete entry?"
        size="sm"
      >
        <p className="text-sm text-text-secondary mb-5">
          This cannot be undone. The entry and its AI insight will be permanently deleted.
        </p>
        <div className="flex justify-end gap-2">
          <Button id="cancel-delete" variant="ghost" size="sm" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            id="confirm-delete"
            variant="danger"
            size="sm"
            loading={deleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
