// components/TodoForm.tsx - Enhanced with background styling
'use client';

import React, { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface TodoFormProps {
  onAddTodo: (text: string, userId: number) => void;
  users: User[];
  selectedUserId: number | null;
  onUserChange: (userId: number | null) => void;
}

export default function TodoForm({ 
  onAddTodo, 
  users = [],
  selectedUserId, 
  onUserChange 
}: TodoFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [localSelectedUserId, setLocalSelectedUserId] = useState<number | null>(selectedUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ ADD THESE VALIDATION STATES
  const [errors, setErrors] = useState<{
    title?: string;
    userId?: string;
    general?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { playAddSound } = useSound();

  useEffect(() => {
    if (selectedUserId) {
      setLocalSelectedUserId(selectedUserId);
    } else if (users.length > 0 && localSelectedUserId === null) {
      const firstUser = users[0];
      setLocalSelectedUserId(firstUser.id);
      onUserChange(firstUser.id);
    }
  }, [selectedUserId, users]);

  // ✅ ADD VALIDATION FUNCTION
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Title validation
    if (!inputValue.trim()) {
      newErrors.title = 'Todo title is required';
    } else if (inputValue.trim().length < 3) {
      newErrors.title = 'Todo title must be at least 3 characters long';
    } else if (inputValue.trim().length > 100) {
      newErrors.title = 'Todo title must be less than 100 characters';
    }

    // UserId validation
    if (!localSelectedUserId) {
      newErrors.userId = 'Please select a user';
    } else if (!users.find(user => user.id === localSelectedUserId)) {
      newErrors.userId = 'Selected user is invalid';
    }

    // General validation
    if (users.length === 0) {
      newErrors.general = 'No users available. Please refresh the page.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ CLEAR MESSAGES WHEN USER TYPES
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Clear title error when user starts typing
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleUserChange = (userId: number | null) => {
    setLocalSelectedUserId(userId);
    onUserChange(userId);
    // Clear userId error when user selects
    if (errors.userId) {
      setErrors(prev => ({ ...prev, userId: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ VALIDATE BEFORE SUBMISSION
    if (!validateForm()) {
      return;
    }

    const userIdToUse = selectedUserId || localSelectedUserId;
    const selectedUser = users.find(user => user.id === userIdToUse);

    if (!selectedUser) {
      setErrors({ userId: 'Please select a valid user' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('TodoForm - Adding todo:', {
        text: inputValue.trim(),
        userIdToUse,
        selectedUserId,
        localSelectedUserId,
        selectedUserName: selectedUser.name
      });
      
      // ✅ PLAY SUCCESS SOUND
      playAddSound();
      
      // ✅ ADD TODO
      await onAddTodo(inputValue.trim(), userIdToUse!);
      
      // ✅ CLEAR FORM AND SHOW SUCCESS
      setInputValue('');
      setSuccessMessage(`Todo "${inputValue.trim()}" added successfully for ${selectedUser.name}!`);
      
      // ✅ AUTO-CLEAR SUCCESS MESSAGE AFTER 3 SECONDS
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error adding todo:', error);
      setErrors({ 
        general: 'Failed to add todo. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedUser = users.find(user => user.id === (selectedUserId || localSelectedUserId));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
      
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Add New Todo</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create a new task and assign it to a team member</p>
        </div>
      </div>

      {/* ✅ SUCCESS MESSAGE */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-300 rounded-xl flex items-center shadow-sm">
          <div className="p-1 bg-green-200 dark:bg-green-800 rounded-full mr-3">
            <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* ✅ GENERAL ERROR MESSAGE */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 rounded-xl flex items-center shadow-sm">
          <div className="p-1 bg-red-200 dark:bg-red-800 rounded-full mr-3">
            <svg className="w-4 h-4 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Assign to User <span className="text-red-500">*</span>
          </label>
          <div className="relative">
          <select
  value={localSelectedUserId || ''}
  onChange={(e) => handleUserChange(e.target.value ? Number(e.target.value) : null)}
  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 appearance-none block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
    errors.userId 
      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
  } shadow-sm`}
  disabled={users.length === 0}
>
  <option value="" className="text-gray-500 dark:text-gray-400">Select a team member...</option>
  {users.map(user => (
    <option key={user.id} value={user.id} className="text-gray-900 dark:text-white">
      {user.name} (@{user.username})
    </option>
  ))}
</select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {/* ✅ USER ID ERROR */}
          {errors.userId && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.userId}
            </p>
          )}
        </div>

        {/* Todo Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Todo Title <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="What needs to be done?"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.title 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm`}
                disabled={isSubmitting}
                maxLength={100}
              />
              {/* ✅ TITLE ERROR */}
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.title}
                </p>
              )}
              
              {/* ✅ CHARACTER COUNT */}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {inputValue.length}/100 characters
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || users.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="font-medium">Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add Todo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected User Display */}
        {selectedUser && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  📝 Todo will be assigned to:
                </p>
                <p className="text-blue-900 dark:text-blue-200 font-semibold">
                  {selectedUser.name} ({selectedUser.email})
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}