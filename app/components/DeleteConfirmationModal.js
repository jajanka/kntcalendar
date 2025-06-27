'use client';

export default function DeleteConfirmationModal({ isOpen, onConfirm, onCancel, date }) {
  if (!isOpen) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in">
      <div className="card shadow-xl max-w-md w-full animate-in">
        {/* Header */}
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="card-title text-destructive">
                Delete Entry
              </h2>
              <p className="card-description">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card-content">
          <p className="text-foreground">
            Are you sure you want to delete your entry for{' '}
            <span className="font-semibold">{formatDate(date)}</span>?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This will permanently remove all your notes and reflections for this day.
          </p>
        </div>

        {/* Footer */}
        <div className="card-footer justify-end space-x-3">
          <button
            onClick={onCancel}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
} 