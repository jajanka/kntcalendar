'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import UnlockButton from './UnlockButton';

export default function UsersModal({ isOpen, date, onClose, onUserClick }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const { address: currentUserAddress } = useAccount();

  useEffect(() => {
    if (isOpen && date) {
      fetchEntries();
      setViewMode('list');
      setSelectedEntry(null);
      setSearchTerm('');
    }
  }, [isOpen, date]);

  const fetchEntries = async () => {
    if (!date) return;
    
    try {
      setLoading(true);
      const dateString = date.toISOString().split('T')[0];
      const response = await fetch(`/api/entries/by-date?date=${dateString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    const userName = entry.users?.name || entry.users?.email || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUserClick = (entry) => {
    setSelectedEntry(entry);
    setViewMode('detail');
    if (onUserClick) {
      onUserClick(entry);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedEntry(null);
  };

  const handleClose = () => {
    setViewMode('list');
    setSelectedEntry(null);
    setSearchTerm('');
    onClose();
  };

  const getStatusEmoji = (entry) => {
    if (entry.success && entry.happy) return '😎';
    if (entry.success && !entry.happy) return '😐';
    if (!entry.success && entry.happy) return '🤷';
    return '💀';
  };

  const getStatusText = (entry) => {
    if (entry.success && entry.happy) return 'Win + Happy';
    if (entry.success && !entry.happy) return 'Win + Meh';
    if (!entry.success && entry.happy) return 'Loss + Happy';
    return 'Loss + Sad';
  };

  const getStatusColor = (entry) => {
    if (entry.success && entry.happy) return 'bg-gradient-to-br from-emerald-400 to-emerald-600';
    if (entry.success && !entry.happy) return 'bg-gradient-to-br from-amber-400 to-amber-600';
    if (!entry.success && entry.happy) return 'bg-gradient-to-br from-blue-400 to-blue-600';
    return 'bg-gradient-to-br from-red-400 to-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            {viewMode === 'detail' && (
              <button
                onClick={handleBackToList}
                className="btn btn-ghost p-2 hover:bg-accent"
                aria-label="Back to list"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              {viewMode === 'list' ? (
                <>
                  <h2 className="text-xl font-semibold text-foreground">
                    Entries for {date?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {entries.length} user{entries.length !== 1 ? 's' : ''} tracked this day
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-foreground">
                    {selectedEntry?.users?.name || 'Anonymous User'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEntry?.users?.email}
                  </p>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost p-2 hover:bg-accent"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search - only show in list mode */}
        {viewMode === 'list' && (
          <div className="p-6 border-b border-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'list' ? (
            // List view
            <>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="text-muted-foreground">Loading entries...</span>
                  </div>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchTerm ? 'No users found' : 'No entries yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Be the first to track this day!'
                    }
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-3">
                  {filteredEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="card p-4 hover:bg-accent/50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {entry.users?.image ? (
                            <img
                              src={entry.users.image}
                              alt={entry.users.name || entry.users.email}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {(entry.users?.name || entry.users?.email || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {entry.users?.name || 'Anonymous User'}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {entry.users?.email}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getStatusEmoji(entry)}</span>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {getStatusText(entry)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        {/* Unlock Button */}
                        <div className="flex-shrink-0">
                          <UnlockButton 
                            entry={entry} 
                            currentUserAddress={currentUserAddress}
                          />
                        </div>
                      </div>

                      {/* Notes Preview - only show if unlocked or own entry */}
                      {entry.notes && (currentUserAddress === entry.users?.id) && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {entry.notes}
                          </p>
                        </div>
                      )}

                      {/* Click to view details */}
                      <button
                        onClick={() => handleUserClick(entry)}
                        className="w-full mt-3 pt-3 border-t border-border text-left"
                      >
                        <p className="text-xs text-primary hover:text-primary/80 font-medium">
                          Click to view details →
                        </p>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Detail view
            <div className="p-6 space-y-6">
              {/* Date */}
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">
                  {new Date(selectedEntry.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEntry.created_at).toLocaleTimeString()}
                </p>
              </div>

              {/* Status */}
              <div className="text-center">
                <div className={`inline-flex items-center space-x-3 p-4 rounded-lg text-white ${getStatusColor(selectedEntry)}`}>
                  <span className="text-3xl">{getStatusEmoji(selectedEntry)}</span>
                  <div className="text-left">
                    <p className="font-semibold">{getStatusText(selectedEntry)}</p>
                    <p className="text-sm opacity-90">
                      {selectedEntry.success ? 'Achieved goals' : 'Fell short'} • {selectedEntry.happy ? 'Feeling good' : 'Not great'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes - only show if unlocked or own entry */}
              {selectedEntry.notes && (currentUserAddress === selectedEntry.users?.id) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Notes
                  </h3>
                  <div className="card p-4 bg-muted/30">
                    <p className="text-foreground whitespace-pre-wrap">
                      {selectedEntry.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Raw Data */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Raw Data
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="card p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Success</p>
                    <p className={`font-semibold ${selectedEntry.success ? 'text-emerald-600' : 'text-red-600'}`}>
                      {selectedEntry.success ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="card p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Happy</p>
                    <p className={`font-semibold ${selectedEntry.happy ? 'text-emerald-600' : 'text-red-600'}`}>
                      {selectedEntry.happy ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Unlock Button for detail view */}
              {currentUserAddress !== selectedEntry.users?.id && (
                <div className="flex justify-center">
                  <UnlockButton 
                    entry={selectedEntry} 
                    currentUserAddress={currentUserAddress}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {viewMode === 'list' ? 'Click on a user to view their full entry' : 'Viewing entry details'}
            </p>
            <button
              onClick={handleClose}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 