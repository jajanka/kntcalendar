'use client';

import { useState } from 'react';
import { useEntryUnlock } from '../hooks/useEntryUnlock';
import { formatEther } from 'viem';

export default function UnlockButton({ entry, currentUserAddress }) {
  const { unlockEntry, isUnlocking, unlockPrice, isConnected, checkEntryUnlocked } = useEntryUnlock();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [error, setError] = useState(null);

  // Check if this entry is unlocked by the current user
  const { isUnlocked, isLoading: checkLoading } = checkEntryUnlocked(
    entry.users?.id || '0x0000000000000000000000000000000000000000',
    entry.id
  );

  const handleUnlock = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError(null);
      await unlockEntry(
        entry.users?.id || '0x0000000000000000000000000000000000000000',
        entry.id
      );
      setShowUnlockModal(false);
    } catch (err) {
      setError(err.message || 'Failed to unlock entry');
    }
  };

  // Don't show unlock button if user is viewing their own entry
  if (currentUserAddress === entry.users?.id) {
    return null;
  }

  // If entry is already unlocked, show unlocked indicator
  if (isUnlocked) {
    return (
      <div className="flex items-center space-x-2 text-emerald-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium">Unlocked</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <button
          onClick={() => setShowUnlockModal(true)}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          disabled={checkLoading}
        >
          Unlock Entry
        </button>
      </div>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Unlock Entry
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pay to unlock this user's entry and view their full details
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Entry Owner:</span>
                  <span className="text-sm font-medium">
                    {entry.users?.name || 'Anonymous User'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Unlock Price:</span>
                  <span className="text-sm font-medium">
                    {unlockPrice ? `${formatEther(unlockPrice)} MONAD` : 'Loading...'}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="flex-1 btn btn-outline"
                  disabled={isUnlocking}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlock}
                  className="flex-1 btn btn-primary"
                  disabled={isUnlocking || !isConnected}
                >
                  {isUnlocking ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span>Unlocking...</span>
                    </div>
                  ) : (
                    'Unlock Entry'
                  )}
                </button>
              </div>

              {!isConnected && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Please connect your wallet to unlock entries
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 