'use client';

import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';
import Header from './components/Header';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('kuntcalendar-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kuntcalendar-entries', JSON.stringify(entries));
  }, [entries]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (date, entry) => {
    const dateKey = date.toISOString().split('T')[0];
    setEntries(prev => ({
      ...prev,
      [dateKey]: entry
    }));
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <Calendar 
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            entries={entries}
            onDateClick={handleDateClick}
          />
        </div>
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
