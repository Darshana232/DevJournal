import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useEntries } from '../hooks/useEntries';

export default function Settings() {
  const { user, logout, register } = useAuth();

  const { entries } = useEntries();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSavingProfile(true);
    try {
      // Update the mock user state
      await register(user.email, 'password', displayName);
      toast.success('Profile updated locally');
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
      // Clear localStorage
      localStorage.clear();
      toast.success('Local data cleared');
      await logout();
      window.location.href = '/';
    } catch (err) {
      toast.error('Failed to delete data');
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
              Permanently delete all your local journal data.
            </p>
            <Button id="delete-account-trigger" variant="danger" size="sm" onClick={() => setDelModalOpen(true)}>
              Clear All Data
            </Button>
          </div>
        </div>
      </section>

      {/* Delete Modal */}
      <Modal
        id="account-delete-modal"
        isOpen={delModalOpen}
        onClose={() => setDelModalOpen(false)}
        title="Clear All Data"
        size="sm"
      >
        <p className="text-sm text-text-secondary mb-5">
          Are you sure you want to clear all your local journal data? This action is irreversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDelModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDeleteAccount}>
            Yes, clear everything
          </Button>
        </div>
      </Modal>

    </motion.div>
  );
}
