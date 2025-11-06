// components/FilterBar.tsx
'use client';

import React, { useState } from 'react';

export type FilterType = 'all' | 'active' | 'completed';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalTodos: number;
  activeTodos: number;
  completedTodos: number;
  onClearCompleted: () => void;
  // ✅ Add new filter props
  titleFilter: string;
  onTitleFilterChange: (title: string) => void;
  userFilter: number | null;
  onUserFilterChange: (userId: number | null) => void;
  users: User[];
}

export default function FilterBar({
  currentFilter,
  onFilterChange,
  totalTodos,
  activeTodos,
  completedTodos,
  onClearCompleted,
  titleFilter,
  onTitleFilterChange,
  userFilter,
  onUserFilterChange,
  users
}: FilterBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserFilterOpen, setIsUserFilterOpen] = useState(false);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active'},
    { key: 'completed', label: 'Done' }
  ];

  const handleClearTitleSearch = () => {
    onTitleFilterChange('');
  };

  const handleClearUserFilter = () => {
    onUserFilterChange(null);
  };

  const handleClearAllFilters = () => {
    onTitleFilterChange('');
    onUserFilterChange(null);
    onFilterChange('all');
  };

  const selectedUser = users.find(user => user.id === userFilter);
  const hasActiveFilters = titleFilter || userFilter || currentFilter !== 'all';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
      
      {/* Search and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
        {/* ✅ Title Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search by Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className={`h-5 w-5 transition-colors duration-200 ${
                  isSearchFocused || titleFilter 
                    ? 'text-blue-500' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              value={titleFilter}
              onChange={(e) => onTitleFilterChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search todos by title..."
              className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                isSearchFocused || titleFilter
                  ? 'border-blue-300 dark:border-blue-600 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            />
            {titleFilter && (
              <button
                onClick={handleClearTitleSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label="Clear title search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ✅ User Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by User
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className={`h-5 w-5 transition-colors duration-200 ${
                  userFilter 
                    ? 'text-blue-500' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <select
              value={userFilter || ''}
              onChange={(e) => onUserFilterChange(e.target.value ? Number(e.target.value) : null)}
              className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                userFilter
                  ? 'border-blue-300 dark:border-blue-600 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white`}
            >
              <option value="">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} (@{user.username})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center">
              {userFilter ? (
                <button
                  onClick={handleClearUserFilter}
                  className="pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label="Clear user filter"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Active Filters:
              </span>
              
              {titleFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Title: "{titleFilter}"
                  <button
                    onClick={handleClearTitleSearch}
                    className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedUser && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                  User: {selectedUser.name}
                  <button
                    onClick={handleClearUserFilter}
                    className="ml-1 hover:text-green-600 dark:hover:text-green-400"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {currentFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Status: {currentFilter}
                  <button
                    onClick={() => onFilterChange('all')}
                    className="ml-1 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            
            <button
              onClick={handleClearAllFilters}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium underline"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 inline-flex">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentFilter === filter.key
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm'
              }`}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{totalTodos}</span> Total
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{activeTodos}</span> Active
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{completedTodos}</span> Done
            </span>
          </div>
        </div>

        {/* Clear Completed Button */}
        {completedTodos > 0 && (
          <button
            onClick={onClearCompleted}
            className="px-4 py-2 text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 border border-red-200 dark:border-red-700 hover:border-red-500 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Done
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {totalTodos > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round((completedTodos / totalTodos) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}