'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from './components/SupabaseProvider';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';
import UsersModal from './components/UsersModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import Header from './components/Header';

export default function Home() {
  const { user, loading, getUserEntries, saveEntry, deleteEntry } = useSupabase();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dateToDelete, setDateToDelete] = useState(null);
  const [entries, setEntries] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dataLoading, setDataLoading] = useState(false);

  // Load entries when user is authenticated
  useEffect(() => {
    if (user) {
      fetchEntries();
    } else {
      setEntries({});
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      setDataLoading(true);
      const data = await getUserEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDateClick = (date) => {
    if (!user) {
      // Show users modal for non-logged in users
      setSelectedDate(date);
      setIsUsersModalOpen(true);
      return;
    }
    
    // Show day modal for logged in users
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleUserClick = (entry) => {
    // This is now handled within the UsersModal component
    // No need to do anything here
  };

  const handleSaveEntry = async (date, entry) => {
    try {
      await saveEntry(date.toISOString().split('T')[0], entry);
      await fetchEntries(); // Refresh entries
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleDeleteEntry = async (date) => {
    try {
      await deleteEntry(date.toISOString().split('T')[0]);
      await fetchEntries(); // Refresh entries
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleDeleteRequest = (date) => {
    setDateToDelete(date);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (dateToDelete) {
      try {
        await deleteEntry(dateToDelete.toISOString().split('T')[0]);
        await fetchEntries(); // Refresh entries
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
    setIsDeleteModalOpen(false);
    setDateToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDateToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleCloseUsersModal = () => {
    setIsUsersModalOpen(false);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-lg font-medium text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {!user ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">
                Community Calendar
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how many people are tracking their raw reality each day. Click any day to explore the community's entries.
              </p>
            </div>
            
            <div className="card">
              <div className="p-6 sm:p-8">
                <Calendar 
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  entries={entries}
                  onDateClick={handleDateClick}
                  onDelete={handleDeleteRequest}
                  isLoggedIn={false}
                />
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="card p-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Ready to join the community?
                    </h2>
                    <p className="text-muted-foreground">
                      Sign in to start tracking your daily journey with brutal honesty.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => document.querySelector('[onclick*="setShowSignInOptions"]')?.click()}
                      className="w-full btn btn-primary"
                    >
                      Get Started
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      Free forever. No tracking. No ads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Your Calendar
              </h1>
              <p className="text-muted-foreground">
                Click any day to log your raw, unfiltered thoughts.
              </p>
            </div>
            
            <div className="card">
              <div className="p-6 sm:p-8">
                {dataLoading && (
                  <div className="flex items-center justify-center py-8 space-x-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="text-muted-foreground">Loading your data...</span>
                  </div>
                )}
                <Calendar 
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  entries={entries}
                  onDateClick={handleDateClick}
                  onDelete={handleDeleteRequest}
                  isLoggedIn={true}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Day Modal for logged in users */}
      {isModalOpen && selectedDate && (
        <DayModal
          date={selectedDate}
          entry={entries[selectedDate.toISOString().split('T')[0]]}
          onSave={handleSaveEntry}
          onDelete={handleDeleteRequest}
          onClose={handleCloseModal}
        />
      )}

      {/* Users Modal for non-logged in users */}
      {isUsersModalOpen && selectedDate && (
        <UsersModal
          isOpen={isUsersModalOpen}
          date={selectedDate}
          onClose={handleCloseUsersModal}
          onUserClick={handleUserClick}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && dateToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          date={dateToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
