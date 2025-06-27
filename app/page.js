'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from './components/SupabaseProvider';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';
import Header from './components/Header';

export default function Home() {
  const { user, loading, getUserEntries, saveEntry } = useSupabase();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      alert('Please sign in to track your days');
      return;
    }
    setSelectedDate(date);
    setIsModalOpen(true);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!user ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to kuntcalend.ar</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign in to start tracking your raw, honest daily reflections.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the "Sign In" button in the header to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {dataLoading && (
              <div className="text-center py-4 text-gray-500">
                Loading your data...
              </div>
            )}
            <Calendar 
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              entries={entries}
              onDateClick={handleDateClick}
            />
          </div>
        )}
      </main>

      {isModalOpen && selectedDate && (
        <DayModal
          date={selectedDate}
          entry={entries[selectedDate.toISOString().split('T')[0]]}
          onSave={handleSaveEntry}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
