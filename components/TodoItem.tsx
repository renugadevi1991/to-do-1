// components/TodoItem.tsx
'use client';

import React from 'react';
import { useSound } from '@/hooks/useSound';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  userId: number;
}

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
  users?: User[];
}

export default function TodoItem({ 
  todo, 
  onToggleComplete, 
  onDeleteTodo, 
  onEditTodo,
  users = []
}: TodoItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);
  const { playDeleteSound, playSuccessSound } = useSound();

  const user = users.find(u => u.id === todo.userId);

  const handleDelete = () => {
    playDeleteSound();
    onDeleteTodo(todo.id);
  };

  const handleToggle = () => {
    if (!todo.completed) {
      playSuccessSound();
    }
    onToggleComplete(todo.id);
  };

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEditTodo(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
      
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
      />
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Todo Text */}
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={handleKeyPress}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            autoFocus
          />
        ) : (
          <span
            className={`block cursor-pointer text-lg ${
              todo.completed 
                ? 'lblock text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 line-through' // ✅ Keep same gray for completed in both modes
                : 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' // ✅ This is correct - dark text on light bg, white text on dark bg
            }`}
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}
        
        {/* Todo Metadata - ✅ FIXED: Better contrast for metadata */}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
          {/* Todo ID */}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            ID: {todo.id}
          </span>
          
          {/* User Information */}
          {user && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {user.name} (@{user.username})
            </span>
          )}
          
          {/* Creation Date */}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons - ✅ FIXED: Better button colors */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors duration-200"
          aria-label={isEditing ? 'Cancel editing' : 'Edit todo'}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors duration-200 flex items-center gap-1"
          aria-label="Delete todo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}