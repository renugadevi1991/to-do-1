'use client';

import React, { useState } from 'react';
import type { User } from '@/utils/api';

interface AdvancedFiltersProps {
  users: User[];
  selectedUsers: number[];
  dateFilter: 'all' | 'today' | 'week' | 'month';
  statusFilter: 'all' | 'active' | 'completed';
  onUsersChange: (userIds: number[]) => void;
  onDateFilterChange: (filter: 'all' | 'today' | 'week' | 'month') => void;
  onStatusFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onClearFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  users,
  selectedUsers,
  dateFilter,
  statusFilter,
  onUsersChange,
  onDateFilterChange,
  onStatusFilterChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUserToggle = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      onUsersChange(selectedUsers.filter(id => id !== userId));
    } else {
      onUsersChange([...selectedUsers, userId]);
    }
  };

  const activeFiltersCount = 
    (selectedUsers.length > 0 ? 1 : 0) +
    (dateFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            🔍 Advanced Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Tasks', icon: '📝' },
                { value: 'active', label: 'Active', icon: '🔄' },
                { value: 'completed', label: 'Completed', icon: '✅' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === option.value
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Created Date
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Time', icon: '🗓️' },
                { value: 'today', label: 'Today', icon: '📅' },
                { value: 'week', label: 'This Week', icon: '📊' },
                { value: 'month', label: 'This Month', icon: '📆' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onDateFilterChange(option.value as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    dateFilter === option.value
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Users Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Users ({selectedUsers.length} selected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserToggle(user.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    selectedUsers.includes(user.id)
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    selectedUsers.includes(user.id)
                      ? 'bg-purple-500'
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;