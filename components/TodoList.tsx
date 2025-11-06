// components/TodoList.tsx
'use client';

import React from 'react';
import TodoItem from './TodoItem';
import LoadingSpinner from './LoadingSpinner';

export { type Todo } from '@/utils/api';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
  users: User[]; // Add users prop
  isLoading?: boolean;
}

export default function TodoList({
  todos,
  filter,
  onToggleComplete,
  onDeleteTodo,
  onEditTodo,
  users, // Add users prop
  isLoading = false
}: TodoListProps) {
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text="Loading todos..." />
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {todos.length === 0 
          ? "No todos yet. Add one above!" 
          : `No ${filter} todos.`
        }
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDeleteTodo={onDeleteTodo}
          onEditTodo={onEditTodo}
          users={users} // Pass users prop
        />
      ))}
    </div>
  );
}