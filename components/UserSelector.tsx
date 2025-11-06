'use client';

import React, { useState } from 'react';
import type { User } from '@/utils/api';

interface UserSelectorProps {
  users: User[];
  selectedUserId: number | null;
  onUserChange: (userId: number | null) => void;
  isLoading?: boolean;
}

export default function UserSelector({
  users,
  selectedUserId,
  onUserChange,
  isLoading = false
}: UserSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedUser = users.find(user => user.id === selectedUserId);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
      {/* Header - Always Visible */}
      <div 
        onClick={toggleExpanded}
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Select User
            </h2>
            {selectedUser && (
              <div className="flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-purple-800">
                  {selectedUser.name}
                </span>
              </div>
            )}
            {!selectedUser && (
              <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                All Users
              </span>
            )}
          </div>
          
          {/* Expand/Collapse Button */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg 
                className="w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Quick Stats in Header */}
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
          <span>{users.length} users available</span>
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'max-h-[800px] opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6 space-y-4">
          {/* All Users Option */}
          <div 
            onClick={() => {
              onUserChange(null);
              setIsExpanded(false); // Auto-collapse after selection
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedUserId === null
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">All Users</h3>
                <p className="text-sm text-gray-500">View todos from all users</p>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4 rounded-xl border-2 border-gray-200 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onUserChange(user.id);
                    setIsExpanded(false); // Auto-collapse after selection
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedUserId === user.id
                      ? 'border-purple-500 bg-purple-50 shadow-md transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      selectedUserId === user.id ? 'bg-purple-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{user.name}</h3>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected User Details */}
          {selectedUser && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Selected User Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{selectedUser.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Company:</span>
                  <span className="ml-2 font-medium">{selectedUser.company.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}