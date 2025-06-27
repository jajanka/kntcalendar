'use client';

import { useState, useEffect } from 'react';

export default function DayModal({ date, entry, onSave, onDelete, onClose }) {
  const [success, setSuccess] = useState(entry?.success ?? null);
  const [happy, setHappy] = useState(entry?.happy ?? null);
  const [notes, setNotes] = useState(entry?.notes ?? '');

  useEffect(() => {
    if (entry) {
      setSuccess(entry.success);
      setHappy(entry.happy);
      setNotes(entry.notes || '');
    } else {
      setSuccess(null);
      setHappy(null);
      setNotes('');
    }
  }, [entry]);

  const handleSave = () => {
    if (success !== null && happy !== null) {
      onSave(date, {
        success,
        happy,
        notes: notes.trim()
      });
    }
  };

  const handleDelete = () => {
    if (entry) {
      onDelete(date);
    }
  };

  const handleClear = () => {
    setSuccess(null);
    setHappy(null);
    setNotes('');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSuccessText = (success) => {
    return success ? 'Fuck yeah, you crushed it!' : 'Well, shit happens...';
  };

  const getHappyText = (happy) => {
    return happy ? 'And you feel good about it!' : 'And you feel meh about it.';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in">
      <div className="card shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">
              {formatDate(date)}
            </h2>
            <button
              onClick={onClose}
              className="btn btn-ghost p-2 hover:bg-accent"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="card-content space-y-6">
          {/* Success/Failure Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              How'd it go today?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSuccess(true)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left group
                  ${success === true 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                    : 'border-border hover:border-emerald-300 hover:bg-accent/50'
                  }
                `}
              >
                <div className="text-2xl mb-2">😎</div>
                <div className="font-medium text-foreground">Success</div>
                <div className="text-sm text-muted-foreground">You nailed it</div>
              </button>
              
              <button
                onClick={() => setSuccess(false)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left group
                  ${success === false 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-border hover:border-red-300 hover:bg-accent/50'
                  }
                `}
              >
                <div className="text-2xl mb-2">💀</div>
                <div className="font-medium text-foreground">Failure</div>
                <div className="text-sm text-muted-foreground">It was rough</div>
              </button>
            </div>
          </div>

          {/* Happiness Section */}
          {success !== null && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                How do you feel about it?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHappy(true)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left group
                    ${happy === true 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-border hover:border-blue-300 hover:bg-accent/50'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">😊</div>
                  <div className="font-medium text-foreground">Happy</div>
                  <div className="text-sm text-muted-foreground">Feeling good</div>
                </button>
                
                <button
                  onClick={() => setHappy(false)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left group
                    ${happy === false 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                      : 'border-border hover:border-amber-300 hover:bg-accent/50'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">😐</div>
                  <div className="font-medium text-foreground">Meh</div>
                  <div className="text-sm text-muted-foreground">Could be better</div>
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          {success !== null && happy !== null && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-foreground font-medium">
                {getSuccessText(success)}
              </p>
              <p className="text-muted-foreground">
                {getHappyText(happy)}
              </p>
            </div>
          )}

          {/* Notes Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened? Why did it go this way? Get it off your chest..."
              className="input min-h-[100px] resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClear}
              className="btn btn-ghost text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
            {entry && (
              <button
                onClick={handleDelete}
                className="btn btn-ghost text-destructive hover:text-destructive/80"
              >
                Delete
              </button>
            )}
          </div>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={success === null || happy === null}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 