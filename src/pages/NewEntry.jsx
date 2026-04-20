import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEntries } from '../hooks/useEntries';
import { useDebounceCallback } from '../hooks/useDebounce';
import { EntryEditor } from '../components/journal/EntryEditor';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { DEFAULT_MOOD } from '../constants/moods';
import { formatPageDate } from '../utils/dateHelpers';

const INITIAL_ENTRY = {
  title:       '',
  content:     '',
  mood:        DEFAULT_MOOD,
  tags:        [],
  isPrivate:   false,
  codeSnippet: '',
};

export default function NewEntry() {
  const navigate              = useNavigate();
  const { createEntry }       = useEntries();
  const [value, setValue]     = useState(INITIAL_ENTRY);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  const handleChange = useCallback((patch) => {
    setValue((v) => ({ ...v, ...patch }));
    setSaved(false);
  }, []);

  // Debounced auto-save on blur (500ms)
  const autoSave = useDebounceCallback(async (data) => {
    if (!data.content.trim()) return;
    const id = await createEntry(data);
    if (id) {
      setSaved(true);
      toast.success('Entry saved', { id: 'autosave' });
      navigate(`/entry/${id}`, { replace: true });
    }
  }, 500);

  const handleBlur = useCallback(() => {
    if (value.content.trim()) autoSave(value);
  }, [value, autoSave]);

  const handleSave = useCallback(async () => {
    if (!value.content.trim()) {
      toast.error('Write something before saving.');
      return;
    }
    setSaving(true);
    const id = await createEntry(value);
    setSaving(false);
    if (id) {
      toast.success('Entry saved!');
      navigate(`/entry/${id}`);
    }
  }, [value, createEntry, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-2xl mx-auto"
    >
      <PageHeader
        title="New Entry"
        subtitle={formatPageDate(new Date())}
        actions={
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-success font-mono">saved ✓</span>
            )}
            <Button id="cancel-new-entry" variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button id="save-entry-btn" variant="primary" size="sm" loading={saving} onClick={handleSave}>
              Save entry
            </Button>
          </div>
        }
      />

      <div onBlur={handleBlur}>
        <EntryEditor value={value} onChange={handleChange} autoFocus />
      </div>
    </motion.div>
  );
}
