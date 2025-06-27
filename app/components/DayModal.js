'use client';

import { useState, useEffect } from 'react';

export default function DayModal({ date, entry, onSave, onClose }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {formatDate(date)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success/Failure Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How'd it go today?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSuccess(true)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${success === true 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }
                `}
              >
                <div className="text-2xl mb-2">😎</div>
                <div className="font-medium text-gray-900 dark:text-white">Success</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">You nailed it</div>
              </button>
              
              <button
                onClick={() => setSuccess(false)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${success === false 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                  }
                `}
              >
                <div className="text-2xl mb-2">💀</div>
                <div className="font-medium text-gray-900 dark:text-white">Failure</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">It was rough</div>
              </button>
            </div>
          </div>

          {/* Happiness Section */}
          {success !== null && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                How do you feel about it?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHappy(true)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${happy === true 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">😊</div>
                  <div className="font-medium text-gray-900 dark:text-white">Happy</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Feeling good</div>
                </button>
                
                <button
                  onClick={() => setHappy(false)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${happy === false 
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-yellow-300'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">😐</div>
                  <div className="font-medium text-gray-900 dark:text-white">Meh</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Could be better</div>
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          {success !== null && happy !== null && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white font-medium">
                {getSuccessText(success)}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {getHappyText(happy)}
              </p>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened? Why did it go this way? Get it off your chest..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                         resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Clear
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={success === null || happy === null}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 