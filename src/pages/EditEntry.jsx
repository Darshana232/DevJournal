import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEntries } from '../hooks/useEntries';
import { useDebounceCallback } from '../hooks/useDebounce';
import { EntryEditor } from '../components/journal/EntryEditor';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export default function EditEntry() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const { getEntry, updateEntry } = useEntries();

  const [value, setValue]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load entry
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entry = await getEntry(id);
      if (!cancelled) {
        if (entry) {
          setValue({
            title:       entry.title ?? '',
            content:     entry.content ?? '',
            mood:        entry.mood ?? 'good',
            tags:        entry.tags ?? [],
            isPrivate:   entry.isPrivate ?? false,
            codeSnippet: entry.codeSnippet ?? '',
          });
        } else {
          toast.error('Entry not found');
          navigate('/dashboard');
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, getEntry, navigate]);

  const handleChange = useCallback((patch) => {
    setValue((v) => ({ ...v, ...patch }));
    setLastSaved(null);
  }, []);

  // Auto-save with debounce
  const autoSave = useDebounceCallback(async (data) => {
    const ok = await updateEntry(id, data);
    if (ok) setLastSaved(new Date());
  }, 500);

  const handleBlur = useCallback(() => {
    if (value) autoSave(value);
  }, [value, autoSave]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const ok = await updateEntry(id, value);
    setSaving(false);
    if (ok) {
      toast.success('Entry updated!');
      navigate(`/entry/${id}`);
    }
  }, [id, value, updateEntry, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-2xl mx-auto"
    >
      <PageHeader
        title="Edit Entry"
        actions={
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-xs text-success font-mono">
                saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <Button id="cancel-edit" variant="ghost" size="sm" onClick={() => navigate(`/entry/${id}`)}>
              Cancel
            </Button>
            <Button id="save-edit-btn" variant="primary" size="sm" loading={saving} onClick={handleSave}>
              Save changes
            </Button>
          </div>
        }
      />

      <div onBlur={handleBlur}>
        <EntryEditor value={value} onChange={handleChange} autoFocus={false} />
      </div>
    </motion.div>
  );
}
