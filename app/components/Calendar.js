'use client';

import { useState } from 'react';

export default function Calendar({ currentMonth, setCurrentMonth, entries, onDateClick }) {
  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    if (!entry) return 'bg-gray-100 dark:bg-gray-700';
    if (entry.success && entry.happy) return 'bg-green-500';
    if (entry.success && !entry.happy) return 'bg-yellow-500';
    if (!entry.success && entry.happy) return 'bg-blue-500';
    return 'bg-red-500';
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

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthName}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Today
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Win + Happy</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Win + Meh</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Loss + Happy</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Loss + Sad</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysInWeek.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const entry = getEntryStatus(day);
          const isToday = day && day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`
                aspect-square p-2 border border-gray-200 dark:border-gray-600
                ${day ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                ${isToday ? 'ring-2 ring-red-500' : ''}
                transition-all duration-200
              `}
              onClick={() => day && onDateClick(day)}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {day.getDate()}
                  </div>
                  {entry && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className={`
                        w-full h-full rounded-lg flex items-center justify-center text-2xl
                        ${getStatusColor(entry)}
                      `}>
                        {getStatusEmoji(entry)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 