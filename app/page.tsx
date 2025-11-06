// app/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import FilterBar from '@/components/FilterBar';
import UserSelector from '@/components/UserSelector';
import FloatingStats from '@/components/FloatingStats';
import { todoAPI, userAPI, type Todo, type User } from '@/utils/api';
import type { FilterType } from '@/components/FilterBar';

// Simple Theme Toggle Component
const SimpleThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [mounted]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Force a small delay to ensure class changes are applied
    setTimeout(() => {
      console.log('Theme toggled to:', newTheme ? 'dark' : 'light');
      console.log('HTML classes:', document.documentElement.className);
      console.log('Body classes:', document.body.className);
      console.log('Background color:', window.getComputedStyle(document.body).backgroundColor);
    }, 100);
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

// Optimized infinite scroll hook
const useInfiniteScroll = (callback: () => void, hasMore: boolean, isLoading: boolean) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 500 
        && hasMore 
        && !isLoading
      ) {
        callback();
      }
    };

    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [callback, hasMore, isLoading]);
};

// Scroll to Top Button Component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
      aria-label="Scroll to top"
    >
      <div className="flex flex-col items-center">
        <svg 
          className="w-5 h-5 mb-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
        <span className="text-xs font-medium">Top</span>
      </div>
    </button>
  );
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 20;

  // ✅ Move filter states to the correct location (main Home component)
  const [titleFilter, setTitleFilter] = useState('');
  const [userFilter, setUserFilter] = useState<number | null>(null);
  const [assignUserId, setAssignUserId] = useState<number | null>(null); // For TodoForm (assigning new todos)

  // ✅ Add filteredTodos computation with useMemo
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply user filter
    if (userFilter) {
      filtered = filtered.filter(todo => todo.userId === userFilter);
    }

    // Apply title filter
    if (titleFilter.trim()) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }

    // Apply status filter
    switch (filter) {
      case 'active':
        return filtered.filter(todo => !todo.completed);
      case 'completed':
        return filtered.filter(todo => todo.completed);
      default:
        return filtered;
    }
  }, [todos, userFilter, titleFilter, filter]);

  const calculateStats = useMemo(() => {
    let todosToCalculate = allTodos; // Use all todos, not just paginated ones

    // If user filter is active, filter by that user
    if (userFilter) {
      todosToCalculate = allTodos.filter(todo => todo.userId === userFilter);
    }

    const total = todosToCalculate.length;
    const active = todosToCalculate.filter(todo => !todo.completed).length;
    const completed = todosToCalculate.filter(todo => todo.completed).length;

    return { total, active, completed };
  }, [allTodos, userFilter]);

  const { total: displayedTotal, active: displayedActive, completed: displayedCompleted } = calculateStats;

  const overallStats = useMemo(() => {
    const total = allTodos.length;
    const active = allTodos.filter(todo => !todo.completed).length;
    const completed = allTodos.filter(todo => todo.completed).length;
    return { total, active, completed };
  }, [allTodos]);


  // ✅ Update stats calculations to respect filters
  const displayedTodos = userFilter 
    ? todos.filter(todo => todo.userId === userFilter)
    : todos;

  const displayedActiveTodos = displayedTodos.filter(todo => !todo.completed).length;
  const displayedCompletedTodos = displayedTodos.filter(todo => todo.completed).length;

  // Load users and todos on component mount
  useEffect(() => {
    loadUsers();
    loadInitialTodos();
  }, []);

  // Load todos when user selection changes
  useEffect(() => {
    loadInitialTodos();
  }, [selectedUserId]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const fetchedUsers = await userAPI.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      setError('Failed to load users. Please try again.');
      console.error('Error loading users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadInitialTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let fetchedTodos: Todo[];
      
      if (selectedUserId) {
        fetchedTodos = await todoAPI.getTodosByUser(selectedUserId);
      } else {
        fetchedTodos = await todoAPI.getAllTodos();
      }
      
      setAllTodos(fetchedTodos);
      setTodos(fetchedTodos.slice(0, todosPerPage * 2));
      setCurrentPage(2);
    } catch (error) {
      setError('Failed to load todos. Please try again.');
      console.error('Error loading todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreTodos = useCallback(async () => {
    if (isLoadingMore || isLoading) return;
    
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * todosPerPage;
    const endIndex = startIndex + todosPerPage;
    const moreTodos = allTodos.slice(startIndex, endIndex);
    
    if (moreTodos.length > 0) {
      setIsLoadingMore(true);
      setTodos(prev => [...prev, ...moreTodos]);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }
  }, [currentPage, allTodos, isLoadingMore, isLoading, todosPerPage]);

  const hasMoreTodos = todos.length < allTodos.length;
  useInfiniteScroll(loadMoreTodos, hasMoreTodos, isLoadingMore);

  const addTodo = async (text: string, userId: number) => {
    console.log('Main page - Adding todo:', { text, userId, selectedUserId });
    setError(null);
    try {
      const localTodo: Todo = {
        id: `local-${Date.now()}`,
        text,
        completed: false,
        createdAt: new Date(),
        userId
      };
      
      setTodos(prev => [localTodo, ...prev]);
      setAllTodos(prev => [localTodo, ...prev]);
      
      todoAPI.createTodo(text, userId)
        .then(newTodo => {
          console.log('Server sync successful:', newTodo);
          const updateWithServerId = (todoList: Todo[]) => 
            todoList.map(todo => 
              todo.id === localTodo.id ? { ...newTodo, id: newTodo.id || localTodo.id } : todo
            );
          setTodos(updateWithServerId);
          setAllTodos(updateWithServerId);
        })
        .catch(serverError => {
          console.error('Server sync failed:', serverError);
        });
      
    } catch (error) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', error);
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updateTodo = (todoList: Todo[]) => todoList.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updateTodo);
    setAllTodos(updateTodo);

    if (!id.startsWith('local-')) {
      todoAPI.updateTodo(id, { completed: !todo.completed })
        .catch(error => {
          const revertTodo = (todoList: Todo[]) => todoList.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          );
          setTodos(revertTodo);
          setAllTodos(revertTodo);
          setError('Failed to update todo. Please try again.');
          console.error('Error updating todo:', error);
        });
    }
  };

  const deleteTodo = async (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    setAllTodos(prev => prev.filter(todo => todo.id !== id));

    if (!id.startsWith('local-')) {
      todoAPI.deleteTodo(id)
        .catch(error => {
          loadInitialTodos();
          setError('Failed to delete todo. Please try again.');
          console.error('Error deleting todo:', error);
        });
    }
  };

  const editTodo = async (id: string, newText: string) => {
    const oldTodo = todos.find(t => t.id === id);
    if (!oldTodo) return;

    const updateTodo = (todoList: Todo[]) => todoList.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );

    setTodos(updateTodo);
    setAllTodos(updateTodo);

    if (!id.startsWith('local-')) {
      todoAPI.updateTodo(id, { text: newText })
        .catch(error => {
          const revertTodo = (todoList: Todo[]) => todoList.map(todo =>
            todo.id === id ? oldTodo : todo
          );
          setTodos(revertTodo);
          setAllTodos(revertTodo);
          setError('Failed to update todo. Please try again.');
          console.error('Error updating todo:', error);
        });
    }
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    
    setTodos(prev => prev.filter(todo => !todo.completed));
    setAllTodos(prev => prev.filter(todo => !todo.completed));

    completedTodos.forEach(async (todo) => {
      if (!todo.id.startsWith('local-')) {
        todoAPI.deleteTodo(todo.id)
          .catch(error => {
            console.error('Error deleting completed todo:', error);
          });
      }
    });
  };

  // Calculate stats from ALL todos (not filtered by user) for overall stats
  const totalTodos = allTodos.length;
  const activeTodos = allTodos.filter(todo => !todo.completed).length;
  const completedTodos = allTodos.filter(todo => todo.completed).length;
  const selectedUser = users.find(user => user.id === assignUserId) || null;
  const filteredUser = users.find(user => user.id === userFilter) || null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Manage Team Tasks
          </h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 rounded-lg">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                ×
              </button>
            </div>
          )}
          
          {/* <UserSelector
            users={users}
            selectedUserId={selectedUserId}
            onUserChange={setSelectedUserId}
            isLoading={isLoadingUsers}
          /> */}
          
          <TodoForm 
            onAddTodo={addTodo}
            users={users}
            selectedUserId={assignUserId}
            onUserChange={setAssignUserId}
          />
          
          <FilterBar 
            currentFilter={filter}
            onFilterChange={setFilter}
            totalTodos={displayedTotal}
            activeTodos={displayedActive}
            completedTodos={displayedCompleted}
            onClearCompleted={clearCompleted}
            titleFilter={titleFilter}
            onTitleFilterChange={setTitleFilter}
            userFilter={userFilter}
            onUserFilterChange={setUserFilter}
            users={users}
          />
          
          <TodoList
            todos={filteredTodos}
            filter={filter}
            isLoading={isLoading}
            onToggleComplete={toggleComplete}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
            users={users}
          />

          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Loading more todos...</span>
              </div>
            </div>
          )}

          {!hasMoreTodos && allTodos.length > 0 && !isLoading && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p>You have reached the end! All {allTodos.length} todos loaded.</p>
            </div>
          )}

          {hasMoreTodos && !isLoadingMore && todos.length >= todosPerPage && (
            <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">
              <p>Scroll down to load more todos ({todos.length} of {allTodos.length} loaded)</p>
            </div>
          )}

          {hasMoreTodos && allTodos.length > 0 && (
            <div className="text-center py-4">
              <button
                onClick={() => {
                  setTodos(allTodos);
                  setCurrentPage(Math.ceil(allTodos.length / todosPerPage));
                }}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                📥 Load All Remaining Todos ({allTodos.length - todos.length} more)
              </button>
            </div>
          )}
        </div>
      </div>

      <FloatingStats 
        totalTodos={totalTodos}
        activeTodos={activeTodos}
        completedTodos={completedTodos}
        selectedUser={selectedUser}
      />
      <ScrollToTopButton />
      <SimpleThemeToggle />
    </div>
  );
}