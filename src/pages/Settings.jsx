import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db, auth } from '../services/firebase';
import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useEntries } from '../hooks/useEntries';
import { cn } from '../utils/cn';

export default function Settings() {
  const { user, logout }       = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { entries }            = useEntries();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSavingProfile(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', user.uid), { displayName });
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleExport = useCallback(() => {
    if (!entries.length) {
      toast.error('No entries to export');
      return;
    }
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `devlog-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Export started');
  }, [entries]);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // In a real app we'd need a Cloud Function or batch to delete all subcollections
      // For this demo, we'll try to delete the user doc and auth record
      await deleteDoc(doc(db, 'users', user.uid));
      await auth.currentUser.delete();
      toast.success('Account deleted');
      // Auth listener will handle redirect
    } catch (err) {
      // Deleting a user requires recent login
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign back in to delete your account');
      } else {
        toast.error('Failed to delete account');
      }
      setDelModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <PageHeader title="Settings" />

      {/* Profile */}
      <section className="bg-surface border border-border rounded-md p-5 sm:p-6">
        <h2 className="font-mono text-md text-text-primary mb-4 border-b border-border pb-2">Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-sm">
          <Input
            id="settings-email"
            label="Email"
            value={user?.email || ''}
            disabled
            hint="Email cannot be changed"
          />
          <Input
            id="settings-name"
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button id="save-profile" type="submit" size="sm" loading={savingProfile}>
            Save changes
          </Button>
        </form>
      </section>

      {/* Preferences */}
      <section className="bg-surface border border-border rounded-md p-5 sm:p-6">
        <h2 className="font-mono text-md text-text-primary mb-4 border-b border-border pb-2">Preferences</h2>
        
        <div className="flex items-center justify-between max-w-sm">
          <div>
            <p className="text-sm text-text-primary font-medium">Appearance</p>
            <p className="text-xs text-text-secondary">Toggle light/dark mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 border border-border rounded bg-elevated text-xs font-mono hover:border-accent transition-colors"
          >
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </section>

      {/* Data */}
      <section className="bg-surface border border-border rounded-md p-5 sm:p-6">
        <h2 className="font-mono text-md text-text-primary mb-4 border-b border-border pb-2">Data</h2>
        
        <div className="space-y-6 max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary font-medium">Export Journal</p>
              <p className="text-xs text-text-secondary">Download all entries as JSON</p>
            </div>
            <Button id="export-json" variant="outline" size="sm" onClick={handleExport}>
              Export
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-danger font-medium mb-1">Danger Zone</p>
            <p className="text-xs text-text-secondary mb-3">
              Permanently delete your account and all journal data.
            </p>
            <Button id="delete-account-trigger" variant="danger" size="sm" onClick={() => setDelModalOpen(true)}>
              Delete Account
            </Button>
          </div>
        </div>
      </section>

      {/* Delete Modal */}
      <Modal
        id="account-delete-modal"
        isOpen={delModalOpen}
        onClose={() => setDelModalOpen(false)}
        title="Delete Account"
        size="sm"
      >
        <p className="text-sm text-text-secondary mb-5">
          Are you completely sure? This action is irreversible. All your entries, streaks, and insights will be lost forever.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDelModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDeleteAccount}>
            Yes, delete my account
          </Button>
        </div>
      </Modal>

    </motion.div>
  );
}
