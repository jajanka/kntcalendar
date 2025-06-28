'use client';

import { useState, useEffect } from 'react';

export default function Calendar({ currentMonth, setCurrentMonth, entries, onDateClick, onDelete, isLoggedIn = true }) {
  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [monthlyEntries, setMonthlyEntries] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch monthly entries when user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      fetchMonthlyEntries();
    }
  }, [currentMonth, isLoggedIn]);

  const fetchMonthlyEntries = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
      
      const response = await fetch(`/api/entries/monthly?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly entries');
      }
      
      const data = await response.json();
      setMonthlyEntries(data.entries || {});
    } catch (error) {
      console.error('Error fetching monthly entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEntryStatus = (date) => {
    if (!date) return null;
    const dateKey = date.toISOString().split('T')[0];
    return entries[dateKey];
  };

  const getStatusColor = (entry) => {
    if (!entry) return 'bg-muted hover:bg-muted/80';
    if (entry.success && entry.happy) return 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white';
    if (entry.success && !entry.happy) return 'bg-gradient-to-br from-amber-400 to-amber-600 text-white';
    if (!entry.success && entry.happy) return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white';
    return 'bg-gradient-to-br from-red-400 to-red-600 text-white';
  };

  const getStatusEmoji = (entry) => {
    if (!entry) return '';
    if (entry.success && entry.happy) return '😎';
    if (entry.success && !entry.happy) return '😐';
    if (!entry.success && entry.happy) return '🤷';
    return '💀';
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const handleDelete = (e, date) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(date);
    }
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="btn btn-ghost p-2 hover:bg-accent"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-foreground">
            {monthName}
          </h2>
          <button
            onClick={goToNextMonth}
            className="btn btn-ghost p-2 hover:bg-accent"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          onClick={goToToday}
          className="btn btn-outline text-sm font-medium"
        >
          Today
        </button>
      </div>

      {/* Legend */}
      {isLoggedIn ? (
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded"></div>
            <span className="text-muted-foreground">Win + Happy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded"></div>
            <span className="text-muted-foreground">Win + Meh</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded"></div>
            <span className="text-muted-foreground">Loss + Happy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded"></div>
            <span className="text-muted-foreground">Loss + Sad</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span className="text-muted-foreground">Number of users who tracked this day</span>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysInWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const entry = getEntryStatus(day);
          const isToday = day && day.toDateString() === new Date().toDateString();
          const dateKey = day ? day.toISOString().split('T')[0] : null;
          const dayEntries = monthlyEntries[dateKey];
          
          return (
            <div
              key={index}
              className={`
                aspect-square p-2 border border-border rounded-lg relative group
                ${day ? 'cursor-pointer hover:bg-accent/50 transition-all duration-200' : ''}
                ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
              onClick={() => day && onDateClick(day)}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <div className="text-sm font-medium text-foreground mb-1">
                    {day.getDate()}
                  </div>
                  
                  {isLoggedIn ? (
                    // Logged in user view - show their entry status
                    entry && (
                      <div className="flex-1 flex items-center justify-center relative">
                        <div className={`
                          w-full h-full rounded-lg flex items-center justify-center text-2xl shadow-sm
                          ${getStatusColor(entry)}
                        `}>
                          {getStatusEmoji(entry)}
                        </div>
                        {/* Delete button - only show on hover */}
                        <button
                          onClick={(e) => handleDelete(e, day)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-destructive/80"
                          title="Delete entry"
                        >
                          ×
                        </button>
                      </div>
                    )
                  ) : (
                    // Not logged in view - show user count
                    dayEntries && dayEntries.count > 0 && (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold shadow-sm">
                          {dayEntries.count}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading indicator for non-logged in users */}
      {!isLoggedIn && loading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Loading community data...</span>
          </div>
        </div>
      )}
    </div>
  );
} 